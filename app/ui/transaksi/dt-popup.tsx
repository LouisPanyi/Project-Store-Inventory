"use client";

import { formatDate } from "@/app/lib/utils";
import { Dialog } from "@headlessui/react";
import { XMarkIcon, PrinterIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

export default function DtPopup({
    transaksiId,
    onClose,
}: {
    transaksiId: string;
    onClose: () => void;
}) {
    const [detail, setDetail] = useState<any>(null);

    useEffect(() => {
        fetch(`/api/transaksi/${transaksiId}`)
            .then((res) => res.json())
            .then((data) => setDetail(data));
    }, [transaksiId]);

    return (
        <Dialog open={true} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-lg w-[400px] p-6 space-y-4">
                    <div className="flex justify-between items-center border-b pb-2">
                        <h2 className="text-lg font-semibold">Detail Transaksi</h2>
                        <button onClick={onClose}>
                            <XMarkIcon className="w-5 h-5" />
                        </button>
                    </div>

                    {!detail ? (
                        <p className="text-sm">Loading...</p>
                    ) : (
                        <div
                            id="print-area"
                            className="text-sm font-mono text-center space-y-2"
                        >
                            {/* Header toko */}
                            <div>
                                <p className="font-bold text-lg">Toko Rohani Ratu Rosari</p>
                                <p>Jln. W.R Soepratman, Barong Tongkok, Kutai Barat, Kalimantan Timur 75777</p>
                                <p>Telp: 0813-4510-6916</p>
                                <p>{detail.transaksi_id}</p>
                            </div>

                            <hr className="border-dashed" />

                            {/* Info transaksi */}
                            <div className="text-left">
                                <p>
                                    <strong>Tanggal:</strong> {detail?.date ? formatDate(detail.date) : "-"}
                                </p>
                                <p>
                                    <strong>Customer:</strong> {detail.customer}
                                </p>
                                <p>
                                    <strong>Status:</strong> {detail.status}
                                </p>
                            </div>

                            <hr className="border-dashed" />

                            {/* Daftar item */}
                            <div className="text-left">
                                {detail.items.map((item: any, i: number) => (
                                    <div key={i} className="flex justify-between">
                                        <span>
                                            {item.name} {item.quantity} x {item.price}
                                        </span>
                                        <span>Rp {item.subtotal.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>

                            <hr className="border-dashed" />

                            {/* Total dan pembayaran */}
                            <div className="text-left space-y-1">
                                <div className="flex justify-between">
                                    <span>Sub Total</span>
                                    <span>Rp {detail.totalPrice.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between font-bold">
                                    <span>Total</span>
                                    <span>Rp {detail.totalPrice.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Bayar</span>
                                    <span>Rp {detail.pay.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Kembalian</span>
                                    <span>Rp {detail.back.toLocaleString()}</span>
                                </div>
                            </div>

                            <hr className="border-dashed" />

                            {/* Footer */}
                            <div>
                                <p>Terima kasih telah berbelanja</p>
                                <p className="text-xs">Saran & kritik: ratu-rosari-store.vercel.app</p>
                            </div>
                        </div>
                    )}

                    {/* Tombol Cetak */}
                    <button
                        onClick={() => {
                            const printContent =
                                document.getElementById("print-area")?.innerHTML;
                            const printWindow = window.open("", "", "width=600,height=400");
                            printWindow!.document.write(`
                <html>
                  <head>
                    <title>Struk</title>
                    <style>
                      body { font-family: monospace; text-align:center; }
                      hr { border-top: 1px dashed black; }
                      .flex { display: flex; justify-content: space-between; }
                    </style>
                  </head>
                  <body>${printContent}</body>
                </html>
              `);
                            printWindow!.document.close();
                            printWindow!.print();
                        }}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                    >
                        <PrinterIcon className="w-4 h-4" />
                        Cetak Struk
                    </button>
                </div>
            </div>
        </Dialog>
    );
}
