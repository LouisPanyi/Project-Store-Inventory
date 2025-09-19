import { UpdateProduk, StatusProduk } from '@/app/ui/produk/buttons';
import { formatCurrency, formatDate } from '@/app/lib/utils';
import { fetchFilteredProduk } from '@/app/lib/data';
import { StatusBadge } from '@/app/ui/produk/status';

export default async function produksTable({
    query,
    currentPage,
    showInactive,
}: {
   query: string;
  currentPage: number;
  showInactive: boolean;
}) {
    const produks = await fetchFilteredProduk(query, currentPage, showInactive);

    return (
        <div className="mt-6 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
                    <div className="md:hidden">
                        {produks?.map((produk) => (
                            <div
                                key={produk.produk_id}
                                className="mb-2 w-full rounded-md bg-white p-4"
                            >
                                <div className="flex items-center justify-between border-b pb-4">
                                    <div>
                                        <p className="font-medium">
                                            {produk.name}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Stok: {produk.stock}
                                        </p>
                                    </div>
                                    <p className="text-lg font-semibold">
                                        {formatCurrency(produk.price)}
                                    </p>
                                </div>
                                <div className="flex w-full items-center justify-end pt-4 gap-2">
                                    <UpdateProduk id={produk.produk_id} />
                                    <StatusProduk id={produk.produk_id} status={produk.status} />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* DESKTOP VIEW */}
                    <table className="hidden min-w-full text-gray-900 md:table">
                        <thead className="rounded-lg text-left text-sm font-normal">
                            <tr>
                                <th scope="col" className="px-4 py-5 font-medium">
                                    Nama Produk
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Harga
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Stok
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Status
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Dibuat
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Terakhir Update
                                </th>
                                <th scope="col" className="relative py-3 pl-6 pr-3 text-right sm:pr-6">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {produks?.map((produk) => (
                                <tr
                                    key={produk.produk_id}
                                    className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                                >
                                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                                        {produk.name}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        {formatCurrency(produk.price)}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        {produk.stock}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                       <StatusBadge status={produk.status} />
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        {formatDate(produk.createdAt)}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        {formatDate(produk.updatedAt)}
                                    </td>
                                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                                        <div className="flex justify-end gap-3">
                                            <UpdateProduk id={produk.produk_id} />
                                            <StatusProduk id={produk.produk_id} status={produk.status}/>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
