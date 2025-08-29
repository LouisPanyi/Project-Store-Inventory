"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { kategori } from "app/ui/kategori";

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
        {kategori.map((item) => (
          <div
            key={item.name}
            className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition flex flex-col items-center"
          >
            <div className="w-40 h-40 relative mb-4">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover rounded-xl"
              />
            </div>
            <p className="font-semibold text-gray-700">{item.name}</p>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
