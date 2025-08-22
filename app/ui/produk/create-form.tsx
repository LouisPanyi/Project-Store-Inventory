'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { createProduk, StateProduk } from '@/app/lib/actions';
import { useActionState } from 'react';
import { TagIcon, CurrencyDollarIcon, ArchiveBoxIcon } from '@heroicons/react/24/outline';

type CreateProdukFormProps = {
  produks: { name: string }[]; 
};

export default function CreateProdukForm({ produks }: CreateProdukFormProps) {
  const initialState: StateProduk = { message: null, errors: {} };
  const [state, formAction] = useActionState(createProduk, initialState);
  const [duplicateError, setDuplicateError] = useState<string | null>(null);

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value.trim().toLowerCase();
    const exists = produks.some(
      (p) => p.name.trim().toLowerCase() === value
    );
    if (exists) {
      setDuplicateError('Nama produk sudah ada!');
    } else {
      setDuplicateError(null);
    }
  }

  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Nama Produk */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Nama Produk
          </label>
          <div className="relative">
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Masukkan nama produk"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              required
              aria-describedby="name-error"
              onChange={handleNameChange}
            />
            <TagIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="name-error" aria-live="polite" aria-atomic="true">
            {duplicateError && (
              <p className="mt-2 text-sm text-red-500">{duplicateError}</p>
            )}
            {state.errors?.name?.map((error: string) => (
              <p key={error} className="mt-2 text-sm text-red-500">{error}</p>
            ))}
          </div>
        </div>

        {/* Harga Produk */}
        <div className="mb-4">
          <label htmlFor="price" className="mb-2 block text-sm font-medium">
            Harga Produk
          </label>
          <div className="relative">
            <input
              id="price"
              name="price"
              type="number"
              step="0.01"
              placeholder="Masukkan harga"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              required
              aria-describedby="price-error"
            />
            <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="price-error" aria-live="polite" aria-atomic="true">
            {state.errors?.price?.map((error: string) => (
              <p key={error} className="mt-2 text-sm text-red-500">{error}</p>
            ))}
          </div>
        </div>

        {/* Stok Produk */}
        <div className="mb-4">
          <label htmlFor="stock" className="mb-2 block text-sm font-medium">
            Stok Produk
          </label>
          <div className="relative">
            <input
              id="stock"
              name="stock"
              type="number"
              placeholder="Masukkan jumlah stok"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              min={1}
              required
              aria-describedby="stock-error"
            />
            <ArchiveBoxIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="stock-error" aria-live="polite" aria-atomic="true">
            {state.errors?.stock?.map((error: string) => (
              <p key={error} className="mt-2 text-sm text-red-500">{error}</p>
            ))}
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
        <Button type="submit" disabled={!!duplicateError}>
          Create Produk
        </Button>
      </div>
    </form>
  );
}
