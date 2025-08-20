"use client";

import { motion } from "framer-motion";

const fadeVariant = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  exit: { opacity: 0, y: -50, transition: { duration: 0.6 } },
};

export default function Testimoni({ sectionRef }: { sectionRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <motion.section
      ref={sectionRef}
      variants={fadeVariant}
      initial="hidden"
      whileInView="visible"
      exit="exit"
      viewport={{ once: false, amount: 0.5 }}
      className="max-w-3xl mx-auto text-center"
    >
      <h2 className="text-3xl font-bold text-gray-800">Testimoni Umat</h2>
      <div className="mt-10 space-y-6">
        <p className="italic">
          "Saya sangat puas belanja di Toko Ratu Rosari. Barangnya berkualitas dan pelayanan ramah." – Ibu Maria
        </p>
        <p className="italic">
          "Patung Kristus yang saya beli sangat indah dan membuat doa keluarga lebih khusyuk." – Pak Antonius
        </p>
      </div>
    </motion.section>
  );
}
