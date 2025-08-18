import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center w-full">
      {/* Hero Section */}
      <section className="h-screen w-full flex flex-col justify-center items-center text-center bg-gradient-to-b from-blue-100 to-white">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800">
          Toko Ratu Rosari
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-600">
          Barang Rohani Katolik untuk Menguatkan Iman Anda
        </p>
        <Button className="mt-6 px-6 py-3 text-lg rounded-full">
          Belanja Sekarang
        </Button>
      </section>

      {/* Kategori */}
      <section className="py-20 w-full max-w-6xl text-center">
        <h2 className="text-3xl font-bold text-gray-800">✨ Koleksi Kami</h2>
        <div className="grid md:grid-cols-4 gap-6 mt-10">
          {["Rosario", "Patung & Salib", "Perlengkapan Misa", "Buku & Doa"].map(
            (item) => (
              <div
                key={item}
                className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition"
              >
                <p className="font-semibold text-gray-700">{item}</p>
              </div>
            )
          )}
        </div>
      </section>

      {/* Keunggulan */}
      <section className="py-20 w-full bg-gray-100 text-center">
        <h2 className="text-3xl font-bold text-gray-800">Mengapa Belanja di Kami?</h2>
        <div className="grid md:grid-cols-3 gap-8 mt-10 max-w-5xl mx-auto">
          <div className="p-6 bg-white rounded-2xl shadow">🕊️ Barang rohani Katolik terlengkap</div>
          <div className="p-6 bg-white rounded-2xl shadow">🚚 Pengiriman cepat & aman</div>
          <div className="p-6 bg-white rounded-2xl shadow">🙏 Membantu memperkuat iman umat</div>
        </div>
      </section>

      {/* Produk Terbaru */}
      <section className="py-20 w-full max-w-6xl text-center">
        <h2 className="text-3xl font-bold text-gray-800">Produk Terbaru</h2>
        <div className="grid md:grid-cols-4 gap-6 mt-10">
          {["Rosario Kayu Zaitun", "Patung Bunda Maria", "Salib Kayu Ukir", "Buku Novena Harian"].map(
            (item) => (
              <div
                key={item}
                className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition"
              >
                <p className="font-semibold text-gray-700">{item}</p>
              </div>
            )
          )}
        </div>
      </section>

      {/* Testimoni */}
      <section className="py-20 w-full bg-gray-100 text-center">
        <h2 className="text-3xl font-bold text-gray-800">Testimoni Umat</h2>
        <div className="max-w-3xl mx-auto mt-10 space-y-6">
          <p className="italic">"Saya sangat puas belanja di Toko Ratu Rosari. Barangnya berkualitas dan pelayanan ramah." – Ibu Maria</p>
          <p className="italic">"Patung Kristus yang saya beli sangat indah dan membuat doa keluarga lebih khusyuk." – Pak Antonius</p>
        </div>
      </section>

      {/* Tentang Kami */}
      <section className="py-20 w-full max-w-3xl text-center">
        <h2 className="text-3xl font-bold text-gray-800">Tentang Kami</h2>
        <p className="mt-6 text-gray-600 leading-relaxed">
          Toko Ratu Rosari hadir dengan misi sederhana: menyediakan barang rohani Katolik berkualitas agar setiap umat semakin dekat dengan Tuhan. 
          Kami percaya setiap produk rohani adalah sarana berkat dan pengingat kasih Allah.
        </p>
      </section>

      {/* Call To Action */}
      <section className="py-20 w-full bg-blue-50 text-center">
        <h2 className="text-3xl font-bold text-gray-800">🙏 Temukan Perlengkapan Rohani Anda Hari Ini</h2>
        <div className="mt-6 flex gap-4 justify-center">
          <Button className="px-6 py-3 text-lg rounded-full">Belanja Sekarang</Button>
          <Button variant="outline" className="px-6 py-3 text-lg rounded-full">Hubungi Kami</Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 w-full bg-gray-900 text-white text-center">
        <p className="font-semibold">📍 Alamat: Jln. W.R Soepratman, Barong Tongkok, Kec. Barong Tongkok, Kabupaten Kutai Barat, Kalimantan Timur 75777</p>
        <p>📱 WhatsApp: +62813-4510-6916</p>
        <p>📷 Instagram: @tokoraturosari</p>
        <p>🕘 Jam buka: Senin–Minggu, 08:00 – 21:00 WITA</p>
      </footer>
    </main>
  );
}
