export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
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
  customer: string;
  totalPrice: number;
  pay: number;
  back: number;
  qris_url: string;
  payment_method: string;
  status: string;
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
  qris_url?: string;
  totalPrice: number;
  pay: number;
  back: number;
  items: TransaksiItem[];
};