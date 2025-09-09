type RingkasanProps = {
  laporan: {
    totalPendapatan: number;
    totalTransaksi: number;
    rataRataPenjualan?: number;
  };
};

export function Ringkasan({ laporan }: RingkasanProps) {
  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg shadow-sm">
        <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Total Pendapatan</h2>
        <p className="text-2xl font-bold text-green-700 mt-2">{formatRupiah(laporan.totalPendapatan)}</p>
      </div>
      <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg shadow-sm">
        <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Jumlah Transaksi</h2>
        <p className="text-2xl font-bold text-blue-700 mt-2">{laporan.totalTransaksi}</p>
      </div>
      <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg shadow-sm">
        <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Rata-rata Penjualan</h2>
        <p className="text-2xl font-bold text-purple-700 mt-2">
          {formatRupiah(laporan.rataRataPenjualan || 0)}
        </p>
      </div>
    </div>
  );
}