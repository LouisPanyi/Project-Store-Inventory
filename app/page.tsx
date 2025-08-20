"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Footer from "../components/ui/sections/footer";
import CTA from "../components/ui/sections/cta";
import About from "../components/ui/sections/about";
import Hero from "../components/ui/sections/hero";
import Kategori from "../components/ui/sections/kategori";
import Keunggulan from "../components/ui/sections/keunggulan";
import Produk from "../components/ui/sections/produk";
import Testimoni from "../components/ui/sections/testimoni";
import Link from "next/link";


export default function HomePage() {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const kategoriRef = useRef<HTMLDivElement | null>(null);
  const keunggulanRef = useRef<HTMLDivElement | null>(null);
  const produkRef = useRef<HTMLDivElement | null>(null);
  const testimoniRef = useRef<HTMLDivElement | null>(null);
  const aboutRef = useRef<HTMLDivElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const footerRef = useRef<HTMLDivElement | null>(null);

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };


  return (
    <main className="relative w-full bg-white">
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled
          ? "bg-white shadow-md text-gray-800"
          : "bg-white text-gray-800"
          }`}
      >


        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          <h1 className="text-xl font-bold">Toko Ratu Rosari</h1>

          {/* Menu */}
          <div className="hidden md:flex gap-6 font-medium">
            <button onClick={() => scrollTo(heroRef)} className="hover:text-purple-600">Home</button>
            <button onClick={() => scrollTo(kategoriRef)} className="hover:text-purple-600">Koleksi</button>
            <button onClick={() => scrollTo(keunggulanRef)} className="hover:text-purple-600">Keunggulan</button>
            <button onClick={() => scrollTo(produkRef)} className="hover:text-purple-600">Produk</button>
            <button onClick={() => scrollTo(testimoniRef)} className="hover:text-purple-600">Testimoni</button>
            <button onClick={() => scrollTo(aboutRef)} className="hover:text-purple-600">Tentang</button>
            <button onClick={() => scrollTo(ctaRef)} className="hover:text-purple-600">CTA</button>
          </div>

          {/* Login */}
          <Link href="/login">
            <Button className="ml-4">Login</Button>
          </Link>
        </div>
      </nav>

      <div className="pt-24 space-y-32">
        <Hero sectionRef={heroRef} />
        <Kategori sectionRef={kategoriRef} />
        <Keunggulan sectionRef={keunggulanRef} />
        <Produk sectionRef={produkRef} />
        <Testimoni sectionRef={testimoniRef} />
        <About sectionRef={aboutRef} />
        <CTA sectionRef={ctaRef} />
        <Footer sectionRef={footerRef} />
      </div>
    </main>
  );
}
