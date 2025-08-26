import Pagination from '@/app/ui/produk/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/produk/table';
import { CreateProduk } from '@/app/ui/produk/buttons';
import { lusitana } from '@/app/ui/fonts';
import { Suspense } from 'react';
import { ProduksTableSkeleton } from '@/app/ui/skeletons';
import { fetchProdukPages } from '@/app/lib/data';

interface SearchParams {
  query?: string;
  page?: string;
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const query = params?.query ?? '';
  const currentPage = Number(params?.page) || 1;
  const totalPages = await fetchProdukPages(query, currentPage);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>List Produk</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Cari produk..." />
        <button
          // onClick={() => setShowInactive(!showInactive)}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          {/* {showInactive ? 'Tampilkan Aktif' : 'Tampilkan Tidak Aktif'} */}
        </button>
        <CreateProduk />
      </div>
      <Suspense key={query + currentPage} fallback={<ProduksTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
