import Pagination from '@/app/ui/produk/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/transaksi/table';
import { CreateTransaksi } from '@/app/ui/transaksi/buttons'; // jika ada tombol create
import { lusitana } from '@/app/ui/fonts';
import { Suspense } from 'react';
import { TransaksiTableSkeleton } from '@/app/ui/skeletons';
import { fetchTransaksiPages } from '@/app/lib/data';

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
  const totalPages = await fetchTransaksiPages(query, currentPage);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>List Transaksi</h1>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Cari transaksi..." />
        <CreateTransaksi />
      </div>

      <Suspense key={query + currentPage} fallback={<TransaksiTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>

      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
