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
        produk_id, 
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

export async function fetchTransaksiProduk(): Promise<Produk[]> {
  const rows = await sql<{
    produk_id: string;
    name: string;
    price: number;
    stock: number;
    status: number;
    createdat: Date;
    updatedat: Date;
  }[]>`
    SELECT produk_id, name, price, stock, status, createdAt, updatedAt
    FROM produk
  `;

  // Map field agar cocok dengan Produk
  return rows.map((row) => ({
    produk_id: row.produk_id,
    name: row.name,
    price: row.price,
    stock: row.stock,
    status: row.status,
    createdAt: row.createdat,
    updatedAt: row.updatedat,
  }));
}


export async function fetchFilteredProduk(
  query: string,
  currentPage: number,
  showInactive: boolean
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const statusCondition = showInactive ? sql`status != 1` : sql`status = 1`;

    const products = await sql<Produk[]>`
      SELECT
        produk_id,
        name,
        price,
        stock,
        status,
        createdat AS "createdAt",
        updatedat AS "updatedAt"
      FROM produk
      WHERE
        ${statusCondition} AND (
          name ILIKE ${`%${query}%`} OR
          price::text ILIKE ${`%${query}%`} OR
          stock::text ILIKE ${`%${query}%`}
        )
      ORDER BY createdAt DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return products;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch products.');
  }
}



export async function fetchProdukById(produk_id: string) {
  try {
    const data = await sql<Produk[]>`
      SELECT 
        produk_id, 
        name, 
        price, 
        stock,
        status, 
        createdat AS "createdAt",
        updatedat AS "updatedAt"
      FROM produk
      WHERE produk_id = ${produk_id}
    `;
    return data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Gagal mengambil detail produk.');
  }
}

export async function fetchProdukPages(query: string, currentPage: number, showInactive: boolean) {
  try {
    const statusCondition = showInactive ? sql`status != 1` : sql`status = 1`;

    const data = await sql`
      SELECT COUNT(*)
      FROM produk
      WHERE
        ${statusCondition} AND (
          name ILIKE ${`%${query}%`} OR
          price::text ILIKE ${`%${query}%`} OR
          stock::text ILIKE ${`%${query}%`} OR
          createdAt::text ILIKE ${`%${query}%`} OR
          updatedAt::text ILIKE ${`%${query}%`}
        )
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
      SELECT 
        t.transaksi_id,
        t.customer,
        t."totalPrice",
        t.pay,
        t.back,
        t.status,
        t."createdAt",
        COALESCE(
          json_agg(
            json_build_object(
              'dt_id', dt.dt_id,
              'produk_id', dt.produk_id,
              'nama_produk', p.name,
              'quantity', dt.quantity,
              'subTotal', (p.price * dt.quantity),
            )
          ) FILTER (WHERE dt.dt_id IS NOT NULL), 
          '[]'
        ) AS details
      FROM transaksi t
      LEFT JOIN detail_transaksi dt ON t.transaksi_id = dt.transaksi_id
      LEFT JOIN produk p ON dt.produk_id = p.produk_id
      GROUP BY t.transaksi_id
      ORDER BY t."createdAt" DESC
    `;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Gagal mengambil data transaksi.');
  }
}


export async function fetchFilteredTransaksi(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const transactions = await sql<Transaksi[]>`
      SELECT
        transaksi_id,
        customer,
        totalprice AS "totalPrice",
        pay,
        back,
        status,
        createdat AS "createdAt"
      FROM transaksi
      WHERE
          customer ILIKE ${`%${query}%`} OR
          status ILIKE ${`%${query}%`} OR
          createdat::text ILIKE ${`%${query}%`} OR
          totalprice::text ILIKE ${`%${query}%`}
      ORDER BY createdat DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return transactions;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch transaksi.');
  }
}


export async function fetchTransaksiPages(query: string, currentPage: number) {
  try {
    const data = await sql`
      SELECT COUNT(*)
      FROM transaksi
      WHERE
          customer ILIKE ${`%${query}%`} OR
          status ILIKE ${`%${query}%`} OR
          createdAt::text ILIKE ${`%${query}%`} OR
          totalPrice::text ILIKE ${`%${query}%`}
    `;

    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of transaksi.');
  }
}

export async function getDetailTransaksi(id: string) {
  const [trx] = await sql`
    SELECT transaksi_id, customer, totalprice, pay, back, status, createdat
    FROM transaksi
    WHERE transaksi_id = ${id}
  `;

  const items = await sql`
    SELECT d.quantity, d.subtotal, p.name
    FROM detail_transaksi d
    JOIN produk p ON d.produk_id = p.produk_id
    WHERE d.transaksi_id = ${id}
  `;

  return {
    ...trx,
    items,
  };
}

//laporan
export async function fetchLaporan(month: number, year: number) {
  try {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    // Ambil transaksi bulan tersebut
    const transaksiList = await sql<Transaksi[]>`
      SELECT transaksi_id, customer, totalPrice, pay, back, status, createdAt
      FROM transaksi
      WHERE createdAt >= ${startDate} AND createdAt < ${endDate}
      ORDER BY createdAt DESC
    `;

    const totalSales = transaksiList
      .filter((trx) => trx.status === 'paid')
      .reduce((sum, trx) => sum + Number(trx.totalPrice), 0);

    const jumlahTransaksi = transaksiList.length;
    const rataRata = jumlahTransaksi ? totalSales / jumlahTransaksi : 0;

    const paidCount = transaksiList.filter((trx) => trx.status === 'paid').length;
    const pendingCount = transaksiList.filter((trx) => trx.status === 'pending').length;

    return {
      month,
      year,
      totalSales,
      jumlahTransaksi,
      rataRata,
      paidCount,
      pendingCount,
      transaksi: transaksiList,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Gagal mengambil data laporan.');
  }
}
