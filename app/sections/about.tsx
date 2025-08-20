"use client";

import { motion } from "framer-motion";

const fadeVariant = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    exit: { opacity: 0, y: -50, transition: { duration: 0.6 } },
};

export default function About({ sectionRef }: { sectionRef: React.RefObject<HTMLDivElement | null> }) {
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
            <h2 className="text-3xl font-bold text-gray-800">Tentang Kami</h2>
            <p className="mt-6 text-gray-600 leading-relaxed">
                Toko Ratu Rosari hadir dengan misi sederhana: menyediakan barang rohani Katolik berkualitas agar setiap umat semakin dekat dengan Tuhan.
                Kami percaya setiap produk rohani adalah sarana berkat dan pengingat kasih Allah.
            </p>
        </motion.section>
    );
}
