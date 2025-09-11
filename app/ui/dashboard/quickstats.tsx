"use client";

import { CardStat } from "app/ui/dashboard/cards";

type Props = {
  stats: {
    totalProducts: number;
    totalStock: number;
    totalTransactions: number;
    totalRevenue: number;
  };
};

export default function QuickStats({ stats }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <CardStat title="Total Produk Aktif" value={stats.totalProducts} />
      <CardStat title="Total Stok Barang" value={stats.totalStock} />
      <CardStat title="Transaksi Bulan Ini" value={stats.totalTransactions} />
      <CardStat
        title="Pendapatan Bulan Ini"
        value={`Rp ${stats.totalRevenue.toLocaleString("id-ID")}`}
        color="text-green-600"
      />
    </div>
  );
}
