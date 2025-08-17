import Form from '@/app/ui/produk/edit-form';
import Breadcrumbs from '@/app/ui/produk/breadcrumbs';
import { fetchProdukById } from '@/app/lib/data';
import { notFound } from 'next/navigation';

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const id = params.id;
    const [produk] = await Promise.all([
        fetchProdukById(id),
    ]);

    if (!produk) {
        notFound();
    }
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    {
                        label: 'Produk',
                        href: '/dashboard/produk'
                    },
                    {
                        label: 'Edit Produk',
                        href: `/dashboard/produk/${id}/edit`,
                        active: true,
                    },
                ]}
            />
            <Form produk={produk} />
        </main>
    );
}