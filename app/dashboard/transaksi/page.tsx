import Pagination from '@/app/ui/transaksi/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/transaksi/table';
import { CreateTransaksi } from '@/app/ui/transaksi/buttons';
import { lusitana } from '@/app/ui/fonts';
import { Suspense } from 'react';
import { TransaksiTableSkeleton } from '@/app/ui/skeletons';
import { fetchTransaksiPages } from '@/app/lib/data';

// Definisikan tipe untuk props halaman
interface PageProps {
  searchParams: Promise<{ // Definisikan sebagai Promise di sini
    query?: string;
    page?: string;
    sort?: string;
    order?: string;
  }>;
}

export default async function Page({ searchParams: searchParamsPromise }: PageProps) {
  const searchParams = await searchParamsPromise;

  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  
  const totalPages = await fetchTransaksiPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>List Transaksi</h1>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Cari transaksi..." />
        <CreateTransaksi />
      </div>

      <Suspense key={query + currentPage + searchParams?.sort + searchParams?.order} fallback={<TransaksiTableSkeleton />}>
        <Table 
          query={query} 
          currentPage={currentPage} 
          // Teruskan 'searchParams' yang sudah menjadi objek biasa
          searchParams={searchParams}
        />
      </Suspense>

      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}