import { PencilIcon, PlusIcon, EyeSlashIcon, EyeIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { statusProduk } from '@/app/lib/actions';

export function CreateProduk() {
  return (
    <Link
      href="/dashboard/produk/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Tambah Produk</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateProduk({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/produk/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function StatusProduk({ id, status }: { id: string; status: number }) {
  const changeStatusWithId = statusProduk.bind(null, id);

  return (
    <form action={changeStatusWithId}>
      <button
        type="submit"
        className="rounded-md border p-2 hover:bg-gray-100"
        title={status === 1 ? 'Nonaktifkan Produk' : 'Aktifkan Produk'}
      >
        {status === 1 ? (
          <EyeIcon className="w-5" />
        ) : (
          <EyeSlashIcon className="w-5" />
        )}
      </button>
    </form>
  );
}

export function ChangeStatus({ showInactive }: { showInactive: boolean }) {
  return (
    <Link
      href={`?showInactive=${!showInactive}`} // simple toggle
      className={`w-10 h-10 rounded-lg text-white flex items-center justify-center transition-colors ${showInactive ? 'bg-rose-500 hover:bg-rose-600' : 'bg-blue-500 hover:bg-blue-600'
        }`}
    >
      {showInactive ? <EyeSlashIcon className="w-5" /> : <EyeIcon className="w-5" />}
    </Link>
  );
}

