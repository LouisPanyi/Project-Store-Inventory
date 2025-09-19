import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import postgres from 'postgres';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// Fungsi untuk mengambil data pengguna (diubah)
async function getUser(identifier: string): Promise<User | undefined> {
  try {
    let user;
    // Cek apakah identifier adalah email atau bukan
    if (identifier.includes('@')) {
      user = await sql<User[]>`SELECT * FROM users WHERE email = ${identifier}`;
    } else {
      user = await sql<User[]>`SELECT * FROM users WHERE name = ${identifier}`;
    }
    return user[0];
  } catch (error) {
    console.error('Gagal mendapatkan data pengguna:', error);
    throw new Error('Gagal mendapatkan data pengguna.');
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        // Validasi input dengan Zod
        const parsedCredentials = z
          .object({
            // Validasi 'identifier' sebagai string, bukan lagi 'email'
            identifier: z.string(),
            password: z.string().min(6),
          })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { identifier, password } = parsedCredentials.data;
          const user = await getUser(identifier);
          if (!user) return null; // Jika pengguna tidak ditemukan

          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) return user;
        }

        console.log('Kredensial tidak valid');
        return null;
      },
    }),
  ],
});