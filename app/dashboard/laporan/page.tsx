import { fetchLaporan } from "@/app/lib/data";

export default async function LaporanPage({ searchParams }: { searchParams?: { month?: string, year?: string } }) {
  const month = Number(searchParams?.month) || new Date().getMonth() + 1;
  const year = Number(searchParams?.year) || new Date().getFullYear();

  const laporan = await fetchLaporan(month, year);

  const bulanNama = [
    'Januari','Februari','Maret','April','Mei','Juni',
    'Juli','Agustus','September','Oktober','November','Desember'
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Laporan Penjualan {bulanNama[month - 1]} {year}
      </h1>

      {/* Ringkasan */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-3 bg-gray-100 rounded">
          <span className="block font-semibold">Total Penjualan</span>
          Rp {laporan.totalSales.toLocaleString()}
        </div>
        <div className="p-3 bg-gray-100 rounded">
          <span className="block font-semibold">Jumlah Transaksi</span>
          {laporan.jumlahTransaksi}
        </div>
        <div className="p-3 bg-gray-100 rounded">
          <span className="block font-semibold">Rata-rata per Transaksi</span>
          Rp {laporan.rataRata.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </div>
        <div className="p-3 bg-gray-100 rounded">
          <span className="block font-semibold">Status Transaksi</span>
          Paid: {laporan.paidCount}, Pending: {laporan.pendingCount}
        </div>
      </div>

      {/* Tabel Transaksi */}
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-3 py-1">#</th>
            <th className="border px-3 py-1">Customer</th>
            <th className="border px-3 py-1">Total</th>
            <th className="border px-3 py-1">Bayar</th>
            <th className="border px-3 py-1">Kembali</th>
            <th className="border px-3 py-1">Status</th>
            <th className="border px-3 py-1">Tanggal</th>
          </tr>
        </thead>
        <tbody>
          {laporan.transaksi.map((trx, idx) => {
            const tgl = new Date(trx.createdAt);
            const formattedDate = `${tgl.getDate().toString().padStart(2,'0')}/${(tgl.getMonth()+1).toString().padStart(2,'0')}/${tgl.getFullYear()}`;
            return (
              <tr key={trx.transaksi_id} className="hover:bg-gray-50">
                <td className="border px-3 py-1">{idx+1}</td>
                <td className="border px-3 py-1">{trx.customer}</td>
                <td className="border px-3 py-1">Rp {Number(trx.totalPrice).toLocaleString()}</td>
                <td className="border px-3 py-1">Rp {Number(trx.pay).toLocaleString()}</td>
                <td className="border px-3 py-1">Rp {Number(trx.back).toLocaleString()}</td>
                <td className="border px-3 py-1">{trx.status}</td>
                <td className="border px-3 py-1">{formattedDate}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
