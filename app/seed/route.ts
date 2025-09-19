import bcrypt from 'bcrypt';
import postgres from 'postgres';
import { users } from '../lib/placeholder-data';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function seedUsers() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNQUE,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `;

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return sql`
        INSERT INTO users (name, email, password)
        VALUES (${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
    }),
  );

  return insertedUsers;
}

// Produk
async function seedProduk() {
  await sql`DROP TABLE IF EXISTS produk CASCADE`;

  await sql`
    CREATE TABLE produk (
      produk_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      price INT NOT NULL,
      stock INT NOT NULL,
      image VARCHAR(255) NULL,
      category VARCHAR(100) NULL,
      description TEXT NULL,
      status SMALLINT NOT NULL DEFAULT 1, 
      createdAt TIMESTAMP DEFAULT NOW(),
      updatedAt TIMESTAMP DEFAULT NOW()
    );
  `;
}

// Transaksi
async function seedTransaksi() {
  await sql`DROP TABLE IF EXISTS transaksi CASCADE`;

  await sql`
    CREATE TABLE transaksi (
      transaksi_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      customer VARCHAR(255) NOT NULL,
      totalPrice INT NOT NULL,
      pay INT NOT NULL,
      back INT NOT NULL,
      qris_url VARCHAR(255) NULL,
      payment_method VARCHAR(50) NOT NULL,
      status VARCHAR(10) NOT NULL,
      createdAt TIMESTAMP DEFAULT NOW()
    );
  `;
}

// Detail Transaksi
async function seedDetailTransaksi() {
  await sql`DROP TABLE IF EXISTS detail_transaksi CASCADE`;

  await sql`
    CREATE TABLE detail_transaksi (
      dt_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      transaksi_id UUID NOT NULL REFERENCES transaksi(transaksi_id) ON DELETE CASCADE,
      produk_id UUID NOT NULL REFERENCES produk(produk_id) ON DELETE CASCADE,
      quantity INT NOT NULL,
      subtotal INT NOT NULL,
      createdAt TIMESTAMP DEFAULT NOW()
    );
  `;
}

export async function GET() {
  try {
    await sql.begin(() => [
      seedUsers(),
      seedProduk(),
      seedTransaksi(),
      seedDetailTransaksi(),
    ]);

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
