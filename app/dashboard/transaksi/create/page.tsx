import Form from '@/app/ui/transaksi/create-form';
import Breadcrumbs from '@/app/ui/transaksi/breadcrumbs';
import { fetchTransaksiProduk } from '@/app/lib/data';

export default async function Page() {
  const produkList = await fetchTransaksiProduk();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          {
            label: 'Transaksi',
            href: '/dashboard/transaksi'
          },
          {
            label: 'Tambah Transaksi',
            href: '/dashboard/transaksi/create',
            active: true
          },
        ]}
      />
      <Form produkList={produkList} />
    </main>
  );
}
