'use client';

import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { createProduk, StateProduk } from '@/app/lib/actions';
import { useActionState } from 'react';
import { Produk } from '@/app/lib/definitions';

export default function FormProduk({ produks }: { produks: Produk[]}) {
  const initialState: StateProduk = { message: null, errors: {} };
  const [state, formAction] = useActionState(createProduk, initialState);

  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Nama Produk */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Nama Produk
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Masukkan nama produk"
            className="peer block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
            required
            aria-describedby="name-error"
          />
          <div id="name-error" aria-live="polite" aria-atomic="true">
            {state.errors?.name &&
              state.errors.name.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Harga Produk */}
        <div className="mb-4">
          <label htmlFor="price" className="mb-2 block text-sm font-medium">
            Harga Produk
          </label>
          <input
            id="price"
            name="price"
            type="number"
            step="0.01"
            placeholder="Masukkan harga"
            className="peer block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
            required
            aria-describedby="price-error"
          />
          <div id="price-error" aria-live="polite" aria-atomic="true">
            {state.errors?.price &&
              state.errors.price.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Stok Produk */}
        <div className="mb-4">
          <label htmlFor="stock" className="mb-2 block text-sm font-medium">
            Stok Produk
          </label>
          <input
            id="stock"
            name="stock"
            type="number"
            placeholder="Masukkan jumlah stok"
            className="peer block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
            required
            aria-describedby="stock-error"
          />
          <div id="stock-error" aria-live="polite" aria-atomic="true">
            {state.errors?.stock &&
              state.errors.stock.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/produk"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">
          Create Produk
        </Button>
      </div>
    </form>
  );
}
