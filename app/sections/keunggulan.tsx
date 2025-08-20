"use client";

import { motion } from "framer-motion";

const fadeVariant = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  exit: { opacity: 0, y: -50, transition: { duration: 0.6 } },
};

export default function Keunggulan({ sectionRef }: { sectionRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <motion.section
      ref={sectionRef}
      variants={fadeVariant}
      initial="hidden"
      whileInView="visible"
      exit="exit"
      viewport={{ once: false, amount: 0.5 }}
      className="max-w-5xl mx-auto text-center"
    >
      <h2 className="text-3xl font-bold text-gray-800">Mengapa Belanja di Kami?</h2>
      <div className="grid md:grid-cols-3 gap-8 mt-10">
        <div className="p-6 bg-white rounded-2xl shadow">🕊️ Barang rohani Katolik terlengkap</div>
        <div className="p-6 bg-white rounded-2xl shadow">🚚 Pengiriman cepat & aman</div>
        <div className="p-6 bg-white rounded-2xl shadow">🙏 Membantu memperkuat iman umat</div>
      </div>
    </motion.section>
  );
}
