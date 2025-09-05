import { formatCurrency, formatDate, getStatusTransaksi } from '@/app/lib/utils';
import { fetchFilteredTransaksi } from '@/app/lib/data';
import { DetailTransaksi } from './buttons';

export default async function TransaksiTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const transaksis = await fetchFilteredTransaksi(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          {/* MOBILE VIEW */}
          <div className="md:hidden">
            {transaksis?.map((t) => (
              <div key={t.transaksi_id} className="mb-2 w-full rounded-md bg-white p-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="font-medium">{t.customer}</p>
                  </div>
                  <p className="text-lg font-semibold">{formatCurrency(t.totalPrice)}</p>
                </div>
                <div className="flex w-full items-center justify-end pt-4 gap-2">

                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP VIEW */}
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">Customer</th>
                <th scope="col" className="px-3 py-5 font-medium">Total</th>
                <th scope="col" className="px-3 py-5 font-medium">Bayar</th>
                <th scope="col" className="px-3 py-5 font-medium">Kembali</th>
                <th scope="col" className="px-3 py-5 font-medium">Status</th>
                <th scope="col" className="px-3 py-5 font-medium">Dibuat</th>
                <th scope="col" className="relative py-3 pl-6 pr-3"><span className="sr-only">Action</span></th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {transaksis?.map((t) => (
                <tr
                  key={t.transaksi_id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">{t.customer}</td>
                  <td className="whitespace-nowrap px-3 py-3">{formatCurrency(t.totalPrice)}</td>
                  <td className="whitespace-nowrap px-3 py-3">{formatCurrency(t.pay)}</td>
                  <td className="whitespace-nowrap px-3 py-3">{formatCurrency(t.back)}</td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {(() => {
                      const { label, className } = getStatusTransaksi(t.status);
                      return (
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}
                        >
                          {label}
                        </span>
                      );
                    })()}
                  </td>

                  <td className="whitespace-nowrap px-3 py-3">{formatDate(t.createdAt)}</td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <DetailTransaksi transaksiId={t.transaksi_id} />
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
