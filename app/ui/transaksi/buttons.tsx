"use client";

import { ExclamationCircleIcon, PlusIcon} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useState } from "react";
import DtPopup from "./dt-popup";

export function CreateTransaksi() {
  return (
    <Link
      href="/dashboard/transaksi/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Tambah Transaksi</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link> 
  );
}

export function DetailTransaksi({ transaksiId }: { transaksiId: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-md border p-2 hover:bg-gray-100"
      >
        <ExclamationCircleIcon className="w-5" />
      </button>

      {open && (
        <DtPopup transaksiId={transaksiId} onClose={() => setOpen(false)} />
      )}
    </>
  );
}