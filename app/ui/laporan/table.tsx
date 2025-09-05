"use client";

import { Transaksi } from "@/app/lib/definitions";

export function TabelLaporan({ transaksi }: { transaksi: Transaksi[] }) {
  return (
    <table className="w-full border-collapse border">
      <thead>
        <tr className="bg-gray-100">
          <th className="border px-3 py-1">#</th>
          <th className="border px-3 py-1">Customer</th>
          <th className="border px-3 py-1">Total</th>
          <th className="border px-3 py-1">Bayar</th>
          <th className="border px-3 py-1">Kembali</th>
          <th className="border px-3 py-1">Status</th>
          <th className="border px-3 py-1">Tanggal</th>
        </tr>
      </thead>
      <tbody>
        {transaksi.map((trx, idx) => {
          const tgl = new Date(trx.createdAt);
          const formattedDate = `${tgl.getDate().toString().padStart(2, "0")}/${(tgl.getMonth() + 1)
            .toString()
            .padStart(2, "0")}/${tgl.getFullYear()}`;
          return (
            <tr key={trx.transaksi_id} className="hover:bg-gray-50">
              <td className="border px-3 py-1">{idx + 1}</td>
              <td className="border px-3 py-1">{trx.customer}</td>
              <td className="border px-3 py-1">Rp {Number(trx.totalPrice).toLocaleString()}</td>
              <td className="border px-3 py-1">Rp {Number(trx.pay).toLocaleString()}</td>
              <td className="border px-3 py-1">Rp {Number(trx.back).toLocaleString()}</td>
              <td className="border px-3 py-1">{trx.status}</td>
              <td className="border px-3 py-1">{formattedDate}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
