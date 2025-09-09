import { fetchLaporan } from "@/app/lib/data";
import { Ringkasan } from "@/app/ui/laporan/ringkasan";
import { Table } from "@/app/ui/laporan/table";
import { bulanNama } from "@/app/ui/laporan/bulan";
import { Filter } from "@/app/ui/laporan/filter";
import { RevenueChart } from "@/app/ui/laporan/revenue-chart";
import { ProdukTerlaris } from "@/app/ui/laporan/produk-terlaris";

type LaporanSearchParams = {
  month?: string;
  year?: string;
};

export default async function LaporanPage({
  searchParams,
}: {
  searchParams?: LaporanSearchParams;
}) {
  const currentDate = new Date();
  const month = Number(searchParams?.month) || currentDate.getMonth() + 1;
  const year = Number(searchParams?.year) || currentDate.getFullYear();

  const laporan = await fetchLaporan(month, year);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Laporan Penjualan {bulanNama[month - 1]} {year}
        </h1>
        <Filter month={month} year={year} />
      </div>

      <Ringkasan laporan={laporan} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RevenueChart transaksi={laporan.transaksi} month={month} year={year} />
        <ProdukTerlaris produkTerlaris={laporan.produkTerlaris} />
      </div>
      <Table transaksi={laporan.transaksi} />
    </div>
  );
}
