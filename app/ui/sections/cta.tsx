"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";

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
        <a
          href="https://wa.me/6281247741735?text=Halo%20Toko%20Ratu%20Rosari,%20saya%20ingin%20bertanya."
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/tombol-wa.png" 
            alt="WhatsApp"
            width={200}
            height={200}
            className="hover:scale-110 transition-transform"
          />
        </a>
      </div>
    </motion.section>
  );
}
