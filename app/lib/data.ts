import postgres from 'postgres';
import {
  Produk,
  Transaksi,
} from './definitions';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const ITEMS_PER_PAGE = 6;
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
        t.totalprice as "totalPrice",
        t.pay,
        t.back,
        t.status,
        t.createdat as "createdAt",
        COALESCE(
          json_agg(
            json_build_object(
              'dt_id', dt.dt_id,
              'produk_id', dt.produk_id,
              'nama_produk', p.name,
              'quantity', dt.quantity,
              'subTotal', (p.price * dt.quantity)
            )
          ) FILTER (WHERE dt.dt_id IS NOT NULL), 
          '[]'
        ) AS details
      FROM transaksi t
      LEFT JOIN detail_transaksi dt ON t.transaksi_id = dt.transaksi_id
      LEFT JOIN produk p ON dt.produk_id = p.produk_id
      GROUP BY t.transaksi_id
      ORDER BY t.createdAt DESC
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
  sortBy: string = 'createdAt', 
  orderBy: string = 'desc'
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  // Daftar kolom yang valid untuk diurutkan (keamanan)
  const validSortColumns = ['customer', 'totalPrice', 'status', 'createdAt'];
  const validOrderValues = ['asc', 'desc'];

  // Validasi input
  const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'createdAt';
  const sortOrder = validOrderValues.includes(orderBy) ? orderBy : 'desc';

  try {
    // Perhatikan bahwa kita menggunakan sql.unsafe() untuk ORDER BY dinamis.
    // Ini aman karena kita sudah memvalidasi input di atas.
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
      ORDER BY ${sql(sortColumn)} ${sql.unsafe(sortOrder)} -- <-- PERUBAHAN DI SINI
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return transactions;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch transaksi.');
  }
}


export async function fetchTransaksiPages(query: string) {
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
type DetailRow = {
  dt_id: string;
  produk_id: string;
  transaksi_id: string;
  nama_produk: string;
  quantity: number;
  subtotal: number;
};

type TransaksiRow = {
  transaksi_id: string;
  customer: string;
  totalPrice: number;
  pay: number;
  back: number;
  status: "pending" | "paid";
  createdAt: string;  
  details: DetailRow[];
};

export async function fetchLaporan(month: number, year: number) {
  try {
    if (month < 1 || month > 12) {
      throw new Error("Invalid month. Must be between 1 and 12.");
    }
    if (year < 1900 || year > 2100) {
      throw new Error("Invalid year.");
    }

    // Query dengan tipe generic
    const result = await sql<TransaksiRow[]>`
      SELECT
        t.transaksi_id,
        t.customer,
        t.totalprice as "totalPrice",
        t.pay,
        t.back,
        t.status,
        t.createdat as "createdAt",
        COALESCE(
          json_agg(
            json_build_object(
              'dt_id', dt.dt_id,
              'produk_id', dt.produk_id,
              'transaksi_id', dt.transaksi_id,
              'nama_produk', p.name,
              'quantity', dt.quantity,
              'subtotal', dt.subtotal
            ) ORDER BY p.name
          ) FILTER (WHERE dt.dt_id IS NOT NULL),
          '[]'::json
        ) AS details
      FROM transaksi t
      LEFT JOIN detail_transaksi dt ON t.transaksi_id = dt.transaksi_id
      LEFT JOIN produk p ON dt.produk_id = p.produk_id
      WHERE 
        EXTRACT(MONTH FROM t.createdAt) = ${month}
        AND EXTRACT(YEAR FROM t.createdAt) = ${year}
        AND t.status = 'paid'
      GROUP BY t.transaksi_id
      ORDER BY t.createdAt DESC
    `;

    // Map ke tipe Transaksi yang sudah kamu buat
    const transaksi: Transaksi[] = result.map((row) => ({
      transaksi_id: row.transaksi_id,
      dt_id: "",
      customer: row.customer,
      totalPrice: Number(row.totalPrice || 0),
      pay: Number(row.pay || 0),
      back: Number(row.back || 0),
      status: row.status,
      qris_url: "",
      payment_method: "",
      createdAt: new Date(row.createdAt),
      details: Array.isArray(row.details)
        ? row.details.map((d) => ({
            dt_id: d.dt_id,
            produk_id: d.produk_id,
            transaksi_id: d.transaksi_id,
            nama_produk: d.nama_produk,
            quantity: d.quantity.toString(),
            subtotal: Number(d.subtotal),
            transaksi: {} as Transaksi,
            produk: {} as Produk,
          }))
        : [],
    }));

    // Statistik
    const totalPendapatan = transaksi.reduce((sum, t) => sum + t.totalPrice, 0);
    const totalTransaksi = transaksi.length;
    const rataRataPenjualan =
      totalTransaksi > 0 ? totalPendapatan / totalTransaksi : 0;

    // Produk terlaris
    const produkStats = new Map<
      string,
      { nama: string; quantity: number; revenue: number }
    >();

    transaksi.forEach((t) => {
      t.details.forEach((d) => {
        const existing =
          produkStats.get(d.produk_id) || {
            nama: d.nama_produk,
            quantity: 0,
            revenue: 0,
          };
        existing.quantity += Number(d.quantity);
        existing.revenue += d.subtotal;
        produkStats.set(d.produk_id, existing);
      });
    });

    const produkTerlaris = Array.from(produkStats.values())
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    return {
      transaksi,
      totalPendapatan,
      totalTransaksi,
      rataRataPenjualan,
      produkTerlaris,
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Gagal mengambil data laporan.");
  }
}

export async function fetchDashboardData() {
  const produkList = await fetchTransaksiProduk();
  const transaksiList = await fetchTransaksi();

  // ✅ filter hanya transaksi paid
  const paidTransactions = transaksiList.filter((t) => t.status === "paid");

  // produk
  const totalProducts = produkList.filter((p) => p.status === 1).length;
  const totalStock = produkList.reduce((sum, p) => sum + p.stock, 0);

  // transaksi bulan ini
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const thisMonthTransactions = paidTransactions.filter(
    (t) => t.createdAt >= startOfMonth
  );
  const totalTransactions = thisMonthTransactions.length;
  const totalRevenue = thisMonthTransactions.reduce(
    (sum, t) => sum + t.totalPrice,
    0
  );

  // penjualan 7 hari terakhir
  const last7days = new Date();
  last7days.setDate(last7days.getDate() - 6);

  const sales = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split("T")[0];

    const total = paidTransactions
      .filter((t) => t.createdAt.toISOString().split("T")[0] === dateStr)
      .reduce((sum, t) => sum + t.totalPrice, 0);

    return { date: dateStr, total };
  });

  // transaksi terbaru
  const transactions = [...paidTransactions]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5)
    .map((trx) => ({
      id: trx.transaksi_id,
      customer: trx.customer,
      total: trx.totalPrice,
      date: trx.createdAt.toISOString().split("T")[0],
    }));

  // stok rendah
  const lowStock = produkList
    .filter((p) => p.stock < 5 && p.status === 1)
    .map((p) => ({
      id: p.produk_id,
      name: p.name,
      stock: p.stock,
    }));

  return {
    stats: { totalProducts, totalStock, totalTransactions, totalRevenue },
    sales,
    transactions,
    lowStock,
  };
}

