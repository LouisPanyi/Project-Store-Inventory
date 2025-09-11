"use client";

import React from "react";
import { DetailTransaksi, Transaksi } from "@/app/lib/definitions";
import { useState } from "react";
import { formatCurrency, formatDate } from "@/app/lib/utils";

type TableProps = {
  transaksi: Transaksi[];
};

export function Table({ transaksi }: TableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  // Ambil bulan dan tahun saat ini
  const now = new Date();
  const monthName = new Intl.DateTimeFormat("id-ID", { month: "long" }).format(now);
  const year = now.getFullYear();

  if (transaksi.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-8 text-center">
        <p className="text-gray-500">Tidak ada transaksi pada periode ini</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">
          Detail Transaksi Bulan {monthName} ({year})
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bayar
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kembalian
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tanggal
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Detail
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {transaksi.map((t) => (
              <React.Fragment key={t.transaksi_id}>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {t.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right font-medium">
                    {formatCurrency(t.totalPrice)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">
                    {formatCurrency(t.pay)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">
                    {formatCurrency(t.back)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        t.status === "paid"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {t.status === "paid" ? "Paid" : "Pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {formatDate(t.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => toggleRow(t.transaksi_id)}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      {expandedRows.has(t.transaksi_id) ? "Tutup" : "Lihat"}
                    </button>
                  </td>
                </tr>

                {expandedRows.has(t.transaksi_id) && (
                  <tr key={t.transaksi_id + "-detail"}>
                    <td colSpan={8} className="px-6 py-4 bg-gray-50">
                      <div className="space-y-2">
                        <p className="font-semibold text-sm text-gray-700 mb-3">
                          Detail Produk:
                        </p>
                        <div className="bg-white rounded p-3 space-y-2">
                          {t.details.map((d: DetailTransaksi) => (
                            <div
                              key={d.dt_id}
                              className="flex justify-between text-sm py-1 border-b last:border-0"
                            >
                              <span className="text-gray-700">
                                {d.nama_produk}{" "}
                                <span className="text-gray-500 ml-2">
                                  x {d.quantity}
                                </span>
                              </span>
                              <span className="font-medium text-gray-900">
                                {formatCurrency(d.subtotal)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
