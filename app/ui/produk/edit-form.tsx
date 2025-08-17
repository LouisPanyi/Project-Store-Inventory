'use client';

import { Produk } from '@/app/lib/definitions';
import { updateProduk, StateProduk } from '@/app/lib/actions';
import { useActionState } from 'react';
import { Button } from '@/app/ui/button';
import Link from 'next/link';
import { CheckIcon, ClockIcon, TagIcon, CurrencyDollarIcon, ArchiveBoxIcon } from '@heroicons/react/24/outline';

export default function EditProdukForm({ produk }: { produk: Produk }) {
  const initialState: StateProduk = { message: null, errors: {} };
  const updateProdukWithId = updateProduk.bind(null, produk.id);
  const [state, formAction] = useActionState(updateProdukWithId, initialState);

  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Nama Produk */}
        <div className="mb-4">
          <label htmlFor="nama" className="mb-2 block text-sm font-medium">
            Nama Produk
          </label>
          <div className="relative">
            <input
              id="name"
              name="name"
              type="text"
              defaultValue={produk.name}
              placeholder="Masukkan nama produk"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            />
            <TagIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        {/* Harga Produk */}
        <div className="mb-4">
          <label htmlFor="harga" className="mb-2 block text-sm font-medium">
            Harga Produk
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                defaultValue={produk.price}
                placeholder="Masukkan harga produk"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* Stok Produk */}
        <div className="mb-4">
          <label htmlFor="stok" className="mb-2 block text-sm font-medium">
            Stok Produk
          </label>
          <div className="relative">
            <input
              id="stock"
              name="stock"
              type="number"
              defaultValue={produk.stock}
              placeholder="Masukkan jumlah stok"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            />
            <ArchiveBoxIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/produk"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Edit Produk</Button>
      </div>
    </form>
  );
}
