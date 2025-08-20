"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const fadeVariant = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  exit: { opacity: 0, y: -50, transition: { duration: 0.6 } },
};

export default function Hero({ sectionRef }: { sectionRef: React.RefObject<HTMLDivElement| null> }) {
  return (
    <motion.section
      ref={sectionRef}
      variants={fadeVariant}
      initial="hidden"
      whileInView="visible"
      exit="exit"
      viewport={{ once: false, amount: 0.5 }}
      className="text-center min-h-screen flex flex-col justify-center items-center"
    >
      <h1 className="text-4xl md:text-6xl font-bold text-gray-800">
        Toko Ratu Rosari
      </h1>
      <p className="mt-4 text-lg md:text-xl text-gray-600">
        Barang Rohani Katolik untuk Menguatkan Iman Anda
      </p>
      <Button className="mt-6 px-6 py-3 text-lg rounded-full">
        Belanja Sekarang
      </Button>
    </motion.section>
  );
}
