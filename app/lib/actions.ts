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

    redirect('/dashboard/produk'); // sukses langsung redirect
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
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Produk.',
        };
    }

    const { name, price, stock } = validatedFields.data;

    try {
        await sql`
      UPDATE produk
      SET name = ${name}, price = ${price}, stock = ${stock}, updatedAt = NOW()
      WHERE id = ${id};
    `;
    } catch (error) {
        return { message: 'Database Error: Failed to Update Produk.' };
    }

    revalidatePath('/dashboard/produk');
    redirect('/dashboard/produk');
}


// Hapus produk
export async function deleteProduk(id: string) {
  try {
    await sql`
      DELETE FROM produk WHERE id = ${id};
    `;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Gagal menghapus produk.");
  }
}


// Tambah transaksi
export async function createTransaksi(formData: FormData) {
    const customer = formData.get('customer') as string;
    const produkId = parseInt(formData.get('produkId') as string, 10);
    const quantity = parseInt(formData.get('quantity') as string, 10);

    try {
        // Ambil data produk
        const [produk] = await sql`
      SELECT id, price, stock FROM produks WHERE id = ${produkId}
    `;

        if (!produk) {
            throw new Error('Produk tidak ditemukan.');
        }
        if (produk.stock < quantity) {
            throw new Error('Stok tidak cukup.');
        }

        const totalPrice = Number(produk.price) * quantity;

        // Buat transaksi
        await sql`
      INSERT INTO transaksis (customer, produk_id, quantity, totalPrice, created_at)
      VALUES (${customer}, ${produkId}, ${quantity}, ${totalPrice}, NOW())
    `;

        // Update stok produk
        await sql`
      UPDATE produks
      SET stock = stock - ${quantity}, updated_at = NOW()
      WHERE id = ${produkId}
    `;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Gagal membuat transaksi.');
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