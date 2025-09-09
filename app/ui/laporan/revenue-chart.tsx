"use client";

import { useMemo } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { bulanNama } from "./bulan";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type RevenueChartProps = {
    transaksi: Array<{ totalPrice: number; createdAt: string | Date }>;
    month?: number;
    year?: number;
};

export function RevenueChart({ transaksi, month, year }: RevenueChartProps) {
    const daysInMonth = month
        ? new Date(year || new Date().getFullYear(), month, 0).getDate()
        : 31;
    const dataPerDay = Array(daysInMonth).fill(0);

    transaksi.forEach((t) => {
        const date = new Date(t.createdAt);
        const tDay = date.getDate() - 1;
        const tMonth = date.getMonth() + 1;
        const tYear = date.getFullYear();
        if ((month && tMonth !== month) || (year && tYear !== year)) return;
        dataPerDay[tDay] += t.totalPrice;
    });

    const chartData = useMemo(
        () => ({
            labels: Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`),
            datasets: [
                {
                    label: "Pendapatan per hari (IDR)",
                    data: dataPerDay,
                    backgroundColor: "rgba(59, 130, 246, 0.6)",
                    borderColor: "rgba(59, 130, 246, 1)",
                    borderWidth: 1,
                    borderRadius: 4,
                },
            ],
        }),
        [dataPerDay, daysInMonth]
    );

    const options = useMemo(
        () => ({
            responsive: true,
            maintainAspectRatio: false, // <--- sangat penting agar chart menyesuaikan tinggi container
            plugins: { legend: { position: "top" as const } },
            scales: {
                x: { grid: { display: false } },
                y: {
                    grid: { display: false },
                    ticks: {
                        callback: (value: number | string) => "Rp " + Number(value).toLocaleString(),
                    },
                },
            },
        }),
        []
    );

    return (
        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg flex flex-col h-full p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                Pendapatan {month ? bulanNama[month - 1] : ""} {year || ""}
            </h2>
            {/* Container chart flex-grow */}
            <div className="flex-1">
                <Bar data={chartData} options={options} className="w-full h-full" />
            </div>
        </div>
    );
}
