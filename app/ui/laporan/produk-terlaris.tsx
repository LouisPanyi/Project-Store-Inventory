import { formatCurrency } from "@/app/lib/utils";

type ProdukTerlarisProps = {
  produkTerlaris: Array<{
    nama: string;
    quantity: number;
    revenue: number;
  }>;
};

export function ProdukTerlaris({ produkTerlaris }: ProdukTerlarisProps) {
  if (!produkTerlaris || produkTerlaris.length === 0) return null;

  return (
    <div className="px-6 py-4 bg-gradient-to-r from-orange-50 to-red-50 border-b border-gray-200 rounded-lg flex flex-col h-full">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
        Top 5 Produk Terlaris
      </h2>
      <div className="space-y-3 flex-1 overflow-y-auto">
        {produkTerlaris.map((produk, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span
                className={`text-lg font-bold ${
                  index === 0
                    ? "text-yellow-500"
                    : index === 1
                    ? "text-gray-400"
                    : index === 2
                    ? "text-orange-600"
                    : "text-gray-600"
                }`}
              >
                #{index + 1}
              </span>
              <div>
                <p className="font-medium text-gray-800">{produk.nama}</p>
                <p className="text-sm text-gray-500">{produk.quantity} unit terjual</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-800">{formatCurrency(produk.revenue)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
