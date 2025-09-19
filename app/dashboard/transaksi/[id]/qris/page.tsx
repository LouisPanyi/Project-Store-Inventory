"use client"; 

import { useState, useEffect } from 'react';
import Image from "next/image";
import { useRouter } from 'next/navigation';

function QrisView({ qrisUrl, transaksiId }: { qrisUrl: string; transaksiId: string }) {
  const router = useRouter();
  const [status, setStatus] = useState('pending');

  useEffect(() => {
    if (!transaksiId) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/transaksi/status/${transaksiId}`);
        if (!response.ok) return;
        const data = await response.json();
        if (data.status !== status) {
          setStatus(data.status);
        }
      } catch (error) {
        console.error("Gagal memeriksa status:", error);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [transaksiId, status]);

  useEffect(() => {
    if (status === 'paid') {
      alert('Pembayaran berhasil!');
      router.push('/dashboard/transaksi');
    } else if (status === 'canceled' || status === 'expire') {
      alert('Pembayaran gagal atau kedaluwarsa.');
      router.push('/dashboard/transaksi');
    }
  }, [status, router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-xl font-semibold mb-4">Scan QRIS untuk Pembayaran</h1>
        <Image src={qrisUrl} alt="QRIS QR Code" width={300} height={300} priority />
        <div className="mt-6">
          <p className="font-semibold text-lg animate-pulse">
            {status === 'pending' && 'Menunggu Pembayaran...'}
            {status === 'paid' && 'Pembayaran Berhasil! Mengarahkan...'}
            {(status === 'canceled' || status === 'expire') && 'Gagal. Mengarahkan...'}
          </p>
          <p className="text-sm text-gray-500 mt-2">Jangan tutup atau refresh halaman ini.</p>
        </div>
      </div>
    </div>
  );
}


interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ qrisUrl: string }>;
}

export default async function QrisPage({ params: paramsPromise, searchParams: searchParamsPromise }: PageProps) {
  const params = await paramsPromise;
  const searchParams = await searchParamsPromise;

  return (
    <QrisView 
      transaksiId={params.id} 
      qrisUrl={searchParams.qrisUrl} 
    />
  );
}