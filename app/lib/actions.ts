'use server';

import { z } from 'zod';
import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { coreApi } from './midtrans';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const ProdukSchema = z.object({
  name: z.string().min(1, { message: 'Nama wajib diisi' }),
  price: z.coerce.number().min(1, { message: 'Harga minimal 1' }),
  stock: z.coerce.number().min(0, { message: 'Stok tidak boleh minus' }),
});

const UpdateProduk = z.object({
  name: z.string().min(1, { message: 'Nama produk wajib diisi' }),
  price: z.coerce.number().positive({ message: 'Harga harus lebih dari 0' }),
  stock: z.coerce.number().int().nonnegative({ message: 'Stok tidak boleh negatif' }),
  status: z.coerce.number().int().min(1).max(3), // 1 = Aktif, 2 = Nonaktif, 3 = Discontinued
});

const TransaksiSchema = z.object({
  customer: z.string().min(1, 'Nama customer tidak boleh kosong'),
  pay: z.number(),
  produkEntries: z.array(z.object({
    produkId: z.string().min(1, 'Produk harus dipilih'),
    quantity: z.number().min(1, 'Jumlah minimal 1'),
  })).min(1, 'Minimal ada satu produk dalam transaksi'),
});

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Kredensial tidak cocok.';
        default:
          return 'Terjadi kesalahan.';
      }
    }
    throw error;
  }
}
export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

export type StateProduk = {
  message: string | null;
  errors?: {
    name?: string[];
    price?: string[];
    stock?: string[];
    status?: string[];
  };
};

export type StateTransaksi = {
  message: string | null;
  success?: boolean;
  transaksiId?: string;
  errors?: {
    customer?: string[];
    product_Id?: string[];
    quantity?: string[];
    pay?: string[];
    back?: string[];
    status?: string[];
  };

};

// Tambah produk baru
export async function createProduk(prevState: StateProduk, formData: FormData): Promise<StateProduk> {
  const validatedFields = ProdukSchema.safeParse({
    name: formData.get('name'),
    price: formData.get('price'),
    stock: formData.get('stock'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Validation error',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, price, stock } = validatedFields.data;

  try {
    await sql`
      INSERT INTO produk (name, price, stock)
      VALUES (${name}, ${price}, ${stock})
    `;
  } catch {
    return { message: 'Database error: gagal menambahkan produk' };
  }

  redirect('/dashboard/produk');
}

// Update produk
export async function updateProduk(
  id: string,
  prevState: StateProduk,
  formData: FormData
): Promise<StateProduk> {
  const validatedFields = UpdateProduk.safeParse({
    name: formData.get("name"),
    price: Number(formData.get("price")),
    stock: Number(formData.get("stock")),
    status: Number(formData.get("status")),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Produk.',
    };
  }

  const { name, price, stock, status } = validatedFields.data;

  if (stock < 0) {
    throw new Error('Stok tidak boleh minus.');
  }

  try {
    await sql`
      UPDATE produk
      SET name = ${name}, price = ${price}, stock = ${stock}, status = ${status}, updatedAt = NOW()
      WHERE produk_id = ${id};
    `;
    console.log("✅ Update sukses:", { id, name, price, stock, status });
  } catch {
    return { message: 'Database Error: Failed to Update Produk.' };
  }

  revalidatePath('/dashboard/produk');
  redirect('/dashboard/produk');
}

// Nonaktifkan produk
export async function statusProduk(id: string) {
  try {
    // Ambil status produk saat ini
    const result = await sql`
      SELECT status FROM produk WHERE produk_id = ${id};
    `;

    if (result.length === 0) {
      throw new Error('Produk tidak ditemukan.');
    }

    const currentStatus = result[0].status;
    const newStatus = currentStatus === 1 ? 2 : 1; // toggle

    await sql`
      UPDATE produk
      SET status = ${newStatus}, updatedAt = NOW()
      WHERE produk_id = ${id};
    `;

    revalidatePath('/dashboard/produk');
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Gagal mengganti status Produk.');
  }
}

interface MidtransAction {
  name: string;
  method: string;
  url: string;
}

// Tambah transaksi
export async function createTransaksi(
  state: StateTransaksi,
  formData: FormData
): Promise<StateTransaksi> {
  const customer = formData.get("customer") as string;
  const pay = parseFloat(formData.get("pay") as string) || 0;
  const paymentMethod = formData.get("payment_method") as string; // cash / qris

  // ambil produk & quantity dari form
  const produkEntries = [...formData.entries()]
    .filter(([key]) => key.startsWith("produk_id_"))
    .map(([key, val]) => ({
      produkId: val as string,
      quantity: Number(formData.get(key.replace("produk_id", "quantity")) || 1),
    }));

  // validasi input
  const validatedFields = TransaksiSchema.safeParse({
    customer,
    pay,
    produkEntries,
  });

  if (!validatedFields.success) {
    return {
      message: "Validation error",
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { customer: cust, pay: payAmount, produkEntries: validProduk } =
    validatedFields.data;

  try {
    let transaksi_id: string = "";
    let total = 0;
    let qrisUrl: string | null = null;

    await sql.begin(async (tx) => {
      // hitung total harga
      for (const { produkId, quantity } of validProduk) {
        const produkResult = await tx`
          SELECT produk_id, price, stock
          FROM produk
          WHERE produk_id = ${produkId} AND status = 1
          FOR UPDATE
        `;
        const produk = produkResult[0];
        if (!produk)
          throw new Error(`Produk dengan ID ${produkId} tidak ditemukan`);
        if (produk.stock < quantity)
          throw new Error(`Stok tidak cukup untuk produk ${produkId}`);
        total += Number(produk.price) * quantity;
      }

      let status: "pending" | "paid" = "pending";
      let back = 0;

      if (paymentMethod === "cash") {
        if (payAmount < total)
          throw new Error("Pembayaran kurang dari total harga");
        status = "paid";
        back = payAmount - total;
      }

      // simpan transaksi awal
      const trxResult = await tx`
        INSERT INTO transaksi (customer, totalPrice, pay, back, status, payment_method, qris_url)
        VALUES (${cust}, ${total}, ${payAmount}, ${back}, ${status}, ${paymentMethod}, ${qrisUrl})
        RETURNING transaksi_id
      `;
      transaksi_id = trxResult[0].transaksi_id;

      // simpan detail transaksi
      for (const { produkId, quantity } of validProduk) {
        const produkResult = await tx`
          SELECT price FROM produk WHERE produk_id = ${produkId}
        `;
        const produk = produkResult[0];
        const subTotal = Number(produk.price) * quantity;

        await tx`
          INSERT INTO detail_transaksi (transaksi_id, produk_id, quantity, subtotal)
          VALUES (${transaksi_id}, ${produkId}, ${quantity}, ${subTotal})
        `;
      }

      // kalau cash → langsung kurangi stok
      if (paymentMethod === "cash") {
        for (const { produkId, quantity } of validProduk) {
          await tx`
            UPDATE produk SET stock = stock - ${quantity} WHERE produk_id = ${produkId}
          `;
        }
      }
    });

    // kalau QRIS → generate link pakai CoreAPI
    if (paymentMethod === "qris") {
      const parameter = {
        payment_type: "qris",
        transaction_details: {
          order_id: transaksi_id,
          gross_amount: total,
        },
        qris: {
          acquirer: "gopay", // atau "bca", "cimb", dll
        },
      };

      const qrisTransaction = await coreApi.charge(parameter);

      // Gunakan tipe MidtransAction, bukan 'any'
      qrisUrl =
        qrisTransaction.actions?.find(
          (a: MidtransAction) => a.name === "generate-qr-code"
        )?.url || null;

      // update transaksi dengan qris_url
      await sql`
        UPDATE transaksi SET qris_url = ${qrisUrl} WHERE transaksi_id = ${transaksi_id}
      `;
    }

    revalidatePath("/dashboard/transaksi");

    return {
      message: "Transaksi berhasil dibuat",
      success: true,
      errors: {},
      transaksiId: transaksi_id,
    } as StateTransaksi & { transaksiId?: string };
  } catch (err) {
    const error = err as Error;
    console.error(error.message);
    return {
      message: null,
      success: false,
      errors: { status: ["Gagal membuat transaksi: " + error.message] },
    };
  }
}

// Hapus transaksi 
export async function deleteTransaksi(id: string) {
  try {
    await sql`DELETE FROM transaksis WHERE id = ${id}`;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Gagal menghapus transaksi.');
  }
}