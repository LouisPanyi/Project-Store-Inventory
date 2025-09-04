'use client';

import { useActionState, useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { createTransaksi, StateTransaksi } from '@/app/lib/actions';
import { UserIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

type Produk = { produk_id: string; name: string; price: number; stock: number };
type ProdukRow = { produkId: string; quantity: number };

export default function CreateTransaksiForm({ produkList }: { produkList: Produk[] }) {
  const initialState: StateTransaksi = { message: null, errors: {} };
  const [state, formAction] = useActionState(createTransaksi, initialState);

  const [rows, setRows] = useState<ProdukRow[]>([{ produkId: '', quantity: 1 }]);
  const [pay, setPay] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [back, setBack] = useState(0);

  // Hitung total harga
  useEffect(() => {
    let total = 0;
    for (const row of rows) {
      const produk = produkList.find((p) => p.produk_id === row.produkId);
      if (produk) total += produk.price * row.quantity;
    }
    setTotalPrice(total);
    setBack(pay - total);
  }, [rows, pay, produkList]);

  const addRow = () => setRows([...rows, { produkId: '', quantity: 1 }]);
  const removeRow = (idx: number) => setRows(rows.filter((_, i) => i !== idx));

  return (
    <form action={formAction} className="space-y-6">
      {/* Customer Info */}
      <div className="rounded-lg border bg-white shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Customer Info</h2>
        <div className="relative">
          <input
            id="customer"
            name="customer"
            type="text"
            placeholder="Masukkan nama customer"
            className="peer block w-full rounded-md border border-gray-300 py-2 pl-10 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <UserIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      {/* Produk List */}
      <div className="rounded-lg border bg-white shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Pilih Produk</h2>
        {rows.map((row, idx) => {
          const produk = produkList.find((p) => p.produk_id === row.produkId);
          const subTotal = produk ? produk.price * row.quantity : 0;

          return (
            <div key={idx} className="flex flex-col md:flex-row md:items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
              {/* Produk Select */}
              <select
                name={`produk_id_${idx}`}
                value={row.produkId}
                onChange={(e) => {
                  const newRows = [...rows];
                  newRows[idx].produkId = e.target.value;
                  setRows(newRows);
                }}
                className="w-full md:w-1/2 rounded-md border border-gray-300 py-2 pl-2 text-sm focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">-- Pilih Produk --</option>
                {produkList.map((p) => (
                  <option key={p.produk_id} value={p.produk_id}>
                    {p.name} (stok: {p.stock})
                  </option>
                ))}
              </select>

              {/* Quantity */}
              <input
                type="number"
                min={1}
                value={row.quantity}
                onChange={(e) => {
                  const newRows = [...rows];
                  newRows[idx].quantity = Number(e.target.value);
                  setRows(newRows);
                }}
                className="w-full md:w-20 rounded-md border border-gray-300 py-2 pl-2 text-sm focus:ring-2 focus:ring-indigo-500"
                required
              />

              {/* Subtotal */}
              <span className="text-sm font-medium text-gray-700">
                Subtotal: Rp {subTotal.toLocaleString()}
              </span>

              {/* Remove Button */}
              {idx > 0 && (
                <button
                  type="button"
                  onClick={() => removeRow(idx)}
                  className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          );
        })}
        <button
          type="button"
          onClick={addRow}
          className="flex items-center gap-1 text-indigo-600 hover:underline mt-2"
        >
          <PlusIcon className="h-4 w-4" /> Tambah Produk
        </button>
      </div>

      {/* Payment Info */}
      <div className="rounded-lg border bg-white shadow-sm p-6 space-y-3">
        <h2 className="text-lg font-semibold mb-4">Pembayaran</h2>
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <label className="w-full md:w-1/3 font-medium">Total Harga</label>
          <input
            type="number"
            name="totalPrice"
            value={totalPrice}
            readOnly
            className="w-full md:w-2/3 rounded-md border border-gray-300 bg-gray-100 py-2 pl-3 text-sm"
          />
        </div>
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <label className="w-full md:w-1/3 font-medium">Bayar</label>
          <input
            type="number"
            name="pay"
            value={pay}
            onChange={(e) => setPay(Number(e.target.value))}
            className="w-full md:w-2/3 rounded-md border border-gray-300 py-2 pl-3 text-sm focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <label className="w-full md:w-1/3 font-medium">Kembalian</label>
          <input
            type="number"
            name="back"
            value={back >= 0 ? back : ""}
            readOnly
            className="w-full md:w-2/3 rounded-md border border-gray-300 bg-gray-100 py-2 pl-3 text-sm"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Link
          href="/dashboard/transaksi"
          className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
        >
          Cancel
        </Link>
        <Button type="submit">Create Transaksi</Button>
      </div>
    </form>
  );
}
