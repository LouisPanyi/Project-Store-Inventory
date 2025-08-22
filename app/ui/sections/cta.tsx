"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const fadeVariant = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  exit: { opacity: 0, y: -50, transition: { duration: 0.6 } },
};

export default function CTA({ sectionRef }: { sectionRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <motion.section
      ref={sectionRef}
      variants={fadeVariant}
      initial="hidden"
      whileInView="visible"
      exit="exit"
      viewport={{ once: false, amount: 0.5 }}
      className="text-center"
    >
      <h2 className="text-3xl font-bold text-gray-800">🙏 Temukan Perlengkapan Rohani Anda Hari Ini</h2>
      <div className="mt-6 flex gap-4 justify-center">
        <Button className="px-6 py-3 text-lg rounded-full">Belanja Sekarang</Button>
        <Button variant="outline" className="px-6 py-3 text-lg rounded-full">Hubungi Kami</Button>
      </div>
    </motion.section>
  );
}
