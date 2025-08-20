"use client";

import { motion } from "framer-motion";

const fadeVariant = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  exit: { opacity: 0, y: -50, transition: { duration: 0.6 } },
};

export default function Kategori({ sectionRef }: { sectionRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <motion.section
      ref={sectionRef}
      variants={fadeVariant}
      initial="hidden"
      whileInView="visible"
      exit="exit"
      viewport={{ once: false, amount: 0.5 }}
      className="max-w-6xl mx-auto text-center"
    >
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
    </motion.section>
  );
}
