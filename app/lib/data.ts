import postgres from 'postgres';
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
  Produk,
  Transaksi,
  Laporan,
} from './definitions';
import { formatCurrency } from './utils';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function fetchRevenue() {
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in produkion :)

    // console.log('Fetching revenue data...');
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await sql<Revenue[]>`SELECT * FROM revenue`;

    // console.log('Data fetch completed after 3 seconds.');

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  try {
    const data = await sql<LatestInvoiceRaw[]>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`;

    const latestInvoices = data.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0][0].count ?? '0');
    const numberOfCustomers = Number(data[1][0].count ?? '0');
    const totalPaidInvoices = formatCurrency(data[2][0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(data[2][0].pending ?? '0');

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<InvoicesTable[]>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    const data = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    const data = await sql<InvoiceForm[]>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    const invoice = data.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomers() {
  try {
    const customers = await sql<CustomerField[]>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchFilteredCustomers(query: string) {
  try {
    const data = await sql<CustomersTableType[]>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;

    const customers = data.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}

//produk
export async function fetchProduk() {
  try {
    const data = await sql<Produk[]>`
      SELECT 
        id, 
        name, 
        price, 
        stock,
        status, 
        createdAt, 
        updatedAt
      FROM produk
      WHERE status = 1
      ORDER BY createdAt DESC
    `;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Gagal mengambil data produk.');
  }
}

export async function fetchFilteredProduk(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const products = await sql<Produk[]>`
      SELECT
        id,
        name,
        price,
        stock,
        status,
        createdat AS "createdAt",
        updatedat AS "updatedAt"
      FROM produk
      WHERE
        name ILIKE ${`%${query}%`} OR
        price::text ILIKE ${`%${query}%`} OR
        stock::text ILIKE ${`%${query}%`}
      ORDER BY createdAt DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return products;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch products.');
  }
}

export async function fetchProdukById(id: string) {
  try {
    const data = await sql<Produk[]>`
      SELECT 
        id, 
        name, 
        price, 
        stock,
        status, 
        createdat AS "createdAt",
        updatedat AS "updatedAt"
      FROM produk
      WHERE id = ${id}
    `;
    return data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Gagal mengambil detail produk.');
  }
}

export async function fetchProdukPages(query: string, currentPage: number) {
  try {
    const data = await sql`
      SELECT COUNT(*)
      FROM produk
      WHERE
        name ILIKE ${`%${query}%`} OR
        price::text ILIKE ${`%${query}%`} OR
        stock::text ILIKE ${`%${query}%`} OR
        createdAt::text ILIKE ${`%${query}%`} OR
        updatedAt::text ILIKE ${`%${query}%`}
    `;

    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of products.');
  }
}

//transaksi
export async function fetchTransaksi() {
  try {
    const data = await sql<Transaksi[]>`
      SELECT t.id, t.customer, t.produk_id, t.quantity, t.total_price, t.createdAt,
             p.id AS produk_id, p.name AS produk_name, p.price AS produk_price
      FROM transaksi t
      JOIN produks p ON t.produk_id = p.id
      ORDER BY t.createdAt DESC
    `;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Gagal mengambil data transaksi.');
  }
}

//laporan
export async function fetchLaporan(month: number, year: number) {
  try {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const transaksi = await sql<Transaksi[]>`
      SELECT t.id, t.customer, t.produk_id, t.quantity, t.total_price, t.createdAt,
             p.id AS produk_id, p.name AS produk_name, p.price AS produk_price
      FROM transaksi t
      JOIN produk p ON t.produk_id = p.id
      WHERE t.createdAt >= ${startDate} AND t.createdAt < ${endDate}
      ORDER BY t.createdAt DESC
    `;

    const totalSales = transaksi.reduce((sum, t) => sum + Number(t.totalPrice), 0);

    const laporan: Laporan = {
      month,
      year,
      totalSales,
      transaksi,
    };

    return laporan;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Gagal mengambil data laporan.');
  }
}