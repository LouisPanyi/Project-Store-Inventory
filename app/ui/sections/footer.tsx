"use client";

import { motion } from "framer-motion";

const fadeVariant = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  exit: { opacity: 0, y: -50, transition: { duration: 0.6 } },
};

export default function Footer({ sectionRef }: { sectionRef: React.RefObject<HTMLDivElement | null > }) {
  return (
    <motion.section
      ref={sectionRef}
      variants={fadeVariant}
      initial="hidden"
      whileInView="visible"
      exit="exit"
      viewport={{ once: false, amount: 0.5 }}
      className="text-center bg-gray-900 text-white p-6 rounded-lg"
    >
      <p className="font-semibold">📍 Alamat: Jln. W.R Soepratman, Barong Tongkok, Kutai Barat, Kalimantan Timur 75777</p>
      <p>📱 WhatsApp: +62813-4510-6916</p>
      <p>📷 Instagram: @tokoraturosari</p>
      <p>🕘 Jam buka: Senin–Minggu, 08:00 – 21:00 WITA</p>
    </motion.section>
  );
}
