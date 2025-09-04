import Pagination from '@/app/ui/produk/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/produk/table';
import { CreateProduk, ChangeStatus } from '@/app/ui/produk/buttons';
import { lusitana } from '@/app/ui/fonts';
import { Suspense } from 'react';
import { ProduksTableSkeleton } from '@/app/ui/skeletons';
import { fetchProdukPages } from '@/app/lib/data';

interface SearchParams {
  query?: string;
  page?: string;
  showInactive?: string;
}

export default async function Page(props: { searchParams: Promise<SearchParams> }) {
  const searchParams = await props.searchParams;
  
  const query = searchParams?.query ?? '';
  const currentPage = Number(searchParams?.page) || 1;
  const showInactive = searchParams?.showInactive === 'true'; 

  const totalPages = await fetchProdukPages(query, currentPage, showInactive);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>List Produk Aktif</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Cari produk..." />
        <ChangeStatus showInactive={showInactive} />
        <CreateProduk />
      </div>
      <Suspense key={query + currentPage + showInactive} fallback={<ProduksTableSkeleton />}>
        <Table query={query} currentPage={currentPage} showInactive={showInactive} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
