import Form from '@/app/ui/produk/create-form';
import Breadcrumbs from '@/app/ui/produk/breadcrumbs';
import { fetchProduk } from '@/app/lib/data';

export default async function Page() {
    const produks = await fetchProduk();

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    {
                        label: 'produk',
                        href: '/dashboard/produk'
                    },
                    {
                        label: 'Tambah Produk',
                        href: '/dashboard/produk/create',
                        active: true,
                    },
                ]}
            />
            <Form produks={produks} />
        </main>
    );
}