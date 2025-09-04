"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {keunggulanList} from "app/ui/keunggulanList";

const fadeVariant = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  exit: { opacity: 0, y: -50, transition: { duration: 0.6 } },
};

export default function Keunggulan({ sectionRef }: { sectionRef: React.RefObject<HTMLDivElement | null> }) {
  const localRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(sectionRef || localRef, { once: false, margin: "-50px 0px -50px 0px" });

  return (
    <motion.section
      ref={sectionRef || localRef}
      variants={fadeVariant}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      exit="exit"
      className="max-w-5xl mx-auto text-center"
    >
      <h2 className="text-3xl font-bold text-gray-800">Mengapa Belanja di Kami?</h2>
      <div className="grid md:grid-cols-3 gap-8 mt-10">
        {keunggulanList.map((item, index) => (
          <motion.div
            key={index}
            layout
            className={`p-6 bg-white rounded-2xl shadow transition-all ${
              isInView ? "scale-105 bg-purple-50" : ""
            }`}
          >
            <motion.h3 className="font-semibold text-gray-700">{item.title}</motion.h3>
            {isInView && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 text-gray-600 text-sm"
              >
                {item.desc}
              </motion.p>
            )}
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
