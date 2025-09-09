import bcrypt from 'bcrypt';
import postgres from 'postgres';
import { invoices, customers, revenue, users } from '../lib/placeholder-data';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function seedUsers() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `;

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return sql`
        INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
    }),
  );

  return insertedUsers;
}

async function seedInvoices() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS invoices (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      customer_id UUID NOT NULL,
      amount INT NOT NULL,
      status VARCHAR(255) NOT NULL,
      date DATE NOT NULL
    );
  `;

  const insertedInvoices = await Promise.all(
    invoices.map(
      (invoice) => sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${invoice.customer_id}, ${invoice.amount}, ${invoice.status}, ${invoice.date})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedInvoices;
}

async function seedCustomers() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS customers (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      image_url VARCHAR(255) NOT NULL
    );
  `;

  const insertedCustomers = await Promise.all(
    customers.map(
      (customer) => sql`
        INSERT INTO customers (id, name, email, image_url)
        VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.image_url})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedCustomers;
}

async function seedRevenue() {
  await sql`
    CREATE TABLE IF NOT EXISTS revenue (
      month VARCHAR(4) NOT NULL UNIQUE,
      revenue INT NOT NULL
    );
  `;

  const insertedRevenue = await Promise.all(
    revenue.map(
      (rev) => sql`
        INSERT INTO revenue (month, revenue)
        VALUES (${rev.month}, ${rev.revenue})
        ON CONFLICT (month) DO NOTHING;
      `,
    ),
  );

  return insertedRevenue;
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
      seedCustomers(),
      seedInvoices(),
      seedRevenue(),
      seedProduk(),
      seedTransaksi(),
      seedDetailTransaksi(),
    ]);

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
