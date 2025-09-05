import { fetchLaporan } from "@/app/lib/data";
import { RingkasanLaporan } from "app/ui/laporan/ringkasan";
import { TabelLaporan } from "app/ui/laporan/table";
import { bulanNama } from "app/ui/laporan/bulan";

export default async function LaporanPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string }>;
}) {
  const params = await searchParams;
  const month = Number(params?.month) || new Date().getMonth() + 1;
  const year = Number(params?.year) || new Date().getFullYear();

  const laporan = await fetchLaporan(month, year);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Laporan Penjualan {bulanNama[month - 1]} {year}
      </h1>

      <RingkasanLaporan laporan={laporan} />
      <TabelLaporan transaksi={laporan.transaksi} />
    </div>
  );
}
