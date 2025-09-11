export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

export type Invoice = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  status: 'pending' | 'paid';
};

export type Revenue = {
  month: string;
  revenue: number;
};

export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
  amount: number;
};

export type InvoicesTable = {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: string;
  total_paid: string;
};

export type CustomerField = {
  id: string;
  name: string;
};

export type InvoiceForm = {
  id: string;
  customer_id: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type Produk = {
  produk_id: string;
  name: string;
  price: number;
  stock: number;
  status: number;
  createdAt: Date;
  updatedAt: Date;
};

export type Transaksi = {
  transaksi_id: string;
  dt_id: string;
  customer: string;
  totalPrice: number;
  pay: number;
  back: number;
  status: 'pending' | 'paid';
  createdAt: Date;
  details: DetailTransaksi[];
};

export type DetailTransaksi = {
  dt_id: string;
  produk_id: string;
  transaksi_id: string;
  nama_produk: string;
  quantity: string;
  subtotal: number;
  transaksi: Transaksi;
  produk: Produk;
};

export type Laporan = {
  month: number;
  year: number;
  totalSales: number;
  jumlahTransaksi: number;
  rataRata: number;
  paidCount: number;
  pendingCount: number;
  transaksi: Transaksi[];
};

export type TransaksiItem = {
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
};

export type TransaksiDetail = {
  transaksi_id: string;
  date: string;
  customer: string;
  status: string;
  items: TransaksiItem[];
  totalPrice: number;
  pay: number;
  back: number;
};