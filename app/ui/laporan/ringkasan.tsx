"use client";

import { Laporan } from "@/app/lib/definitions";

export function RingkasanLaporan({ laporan }: { laporan: Laporan }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="p-3 bg-gray-100 rounded">
        <span className="block font-semibold">Total Penjualan</span>
        Rp {laporan.totalSales.toLocaleString()}
      </div>
      <div className="p-3 bg-gray-100 rounded">
        <span className="block font-semibold">Jumlah Transaksi</span>
        {laporan.jumlahTransaksi}
      </div>
      <div className="p-3 bg-gray-100 rounded">
        <span className="block font-semibold">Rata-rata per Transaksi</span>
        Rp {laporan.rataRata.toLocaleString(undefined, { maximumFractionDigits: 0 })}
      </div>
      <div className="p-3 bg-gray-100 rounded">
        <span className="block font-semibold">Status Transaksi</span>
        Paid: {laporan.paidCount}, Pending: {laporan.pendingCount}
      </div>
    </div>
  );
}
