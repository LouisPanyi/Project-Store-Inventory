"use client";

type Props = {
  transactions: { id: string; customer: string; total: number; date: string }[];
};

export default function RecentActivity({ transactions }: Props) {
  return (
    <div className="flex flex-col">
      {/* Judul di luar box */}
      <h2 className="text-lg font-semibold text-gray-700 mb-2">
        Transaksi Terbaru
      </h2>

      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <ul className="space-y-2">
          {transactions.length === 0 && (
            <li className="py-2 text-sm text-gray-500 text-center">
              Belum ada transaksi
            </li>
          )}
          {transactions.map((trx) => (
            <li
              key={trx.id}
              className="py-2 px-3 flex justify-between items-center text-sm bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
            >
              <span className="font-medium">{trx.customer}</span>
              <span className="font-semibold text-gray-800">
                Rp {trx.total.toLocaleString("id-ID")}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
