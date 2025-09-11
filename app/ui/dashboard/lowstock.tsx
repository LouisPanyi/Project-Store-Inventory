"use client";

type Props = {
  products: { id: string; name: string; stock: number }[];
};

export default function LowStock({ products }: Props) {
  return (
    <div className="flex flex-col">
      {/* Judul di luar box */}
      <h2 className="text-lg font-semibold text-gray-700 mb-2">
        Stok Rendah
      </h2>

      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <ul className="space-y-2">
          {products.length === 0 && (
            <li className="py-2 text-sm text-gray-500 text-center">
              Semua stok aman 👍
            </li>
          )}
          {products.map((p) => (
            <li
              key={p.id}
              className="py-2 px-3 flex justify-between items-center text-sm text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
            >
              <span className="font-medium">{p.name}</span>
              <span className="font-semibold">{p.stock} unit</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
