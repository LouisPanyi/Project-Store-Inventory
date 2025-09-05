'use server';

import { z } from 'zod';
import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string({
        invalid_type_error: 'Please select a customer.',
    }),
    amount: z.coerce
        .number()
        .gt(0, { message: 'Please enter an amount greater than $0.' }),
    status: z.enum(['pending', 'paid'], {
        invalid_type_error: 'Please select an invoice status.',
    }),
    date: z.string(),
});

const ProdukSchema = z.object({
    name: z.string().min(1, { message: 'Nama wajib diisi' }),
    price: z.coerce.number().min(1, { message: 'Harga minimal 1' }),
    stock: z.coerce.number().min(0, { message: 'Stok tidak boleh minus' }),
});

const UpdateProduk = z.object({
    name: z.string().min(1, { message: 'Nama produk wajib diisi' }),
    price: z.coerce.number().positive({ message: 'Harga harus lebih dari 0' }),
    stock: z.coerce.number().int().nonnegative({ message: 'Stok tidak boleh negatif' }),
    status: z.number().int().min(1).max(3), // 1 = Aktif, 2 = Nonaktif, 3 = Discontinued
});

const TransaksiSchema = z.object({
    customer: z.string().min(1, 'Nama customer wajib diisi.'),
    produkId: z.string().min(1, 'Produk wajib dipilih.'),
    quantity: z.number().min(1, 'Jumlah minimal 1.'),
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
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
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
    } catch (error) {
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
        name: formData.get('name'),
        price: formData.get('price'),
        stock: formData.get('stock'),
        status: formData.get('status'),
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
      WHERE id = ${id};
    `;
    } catch (error) {
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

// Tambah transaksi
export async function createTransaksi(
  state: StateTransaksi,
  formData: FormData
): Promise<StateTransaksi> {
  const customer = formData.get("customer") as string;
  const pay = parseFloat(formData.get("pay") as string) || 0;

  const produkEntries = [...formData.entries()]
    .filter(([key]) => key.startsWith("produk_id_"))
    .map(([key, val]) => ({
      produkId: val as string,
      quantity: Number(formData.get(key.replace("produk_id", "quantity")) || 1),
    }));

  try {
    await sql.begin(async (tx) => {
      let total = 0;
      for (const { produkId, quantity } of produkEntries) {
        const [produk] = await tx`
          SELECT produk_id, price, stock FROM produk WHERE produk_id = ${produkId} AND status = 1 FOR UPDATE
        `;
        if (!produk) throw new Error("Produk tidak ditemukan");
        if (produk.stock < quantity) throw new Error(`Stok tidak cukup untuk ${produkId}`);

        total += Number(produk.price) * quantity;
      }

      const back = pay - total;
      const status = pay >= total ? "paid" : "pending";

      const [trx] = await tx`
        INSERT INTO transaksi (customer, totalPrice, pay, back, status)
        VALUES (${customer}, ${total}, ${pay}, ${back}, ${status})
        RETURNING transaksi_id
      `;

      for (const { produkId, quantity } of produkEntries) {
        const [produk] = await tx`SELECT price FROM produk WHERE produk_id = ${produkId}`;
        const subTotal = Number(produk.price) * quantity;
        await tx`
          INSERT INTO detail_transaksi (transaksi_id, produk_id, quantity, subtotal)
          VALUES (${trx.transaksi_id}, ${produkId}, ${quantity}, ${subTotal})
        `;
        await tx`UPDATE produk SET stock = stock - ${quantity} WHERE produk_id = ${produkId}`;
      }
    });

    // ✅ hanya dipanggil setelah transaksi sukses
    revalidatePath("/dashboard/transaksi");
    redirect("/dashboard/transaksi");
  } catch (err: any) {
    return { message: null, errors: { status: [err.message] } };
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