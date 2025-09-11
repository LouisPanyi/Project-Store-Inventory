"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type Props = {
  data: { date: string; total: number }[];
};

export default function SalesChart({ data }: Props) {
  return (
    <div className="flex flex-col">
        {/* Judul di luar box */}
      <h2 className="text-lg font-semibold text-gray-700 mb-2">
        Penjualan 7 Hari Terakhir
      </h2>

      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <Bar
          data={{
            labels: data.map((d) => {
              const date = new Date(d.date);
              return new Intl.DateTimeFormat("id-ID", { weekday: "long" }).format(date);
            }),
            datasets: [
              {
                label: "Penjualan",
                data: data.map((d) => d.total),
                backgroundColor: "rgba(245, 158, 11, 0.7)", // orange semi-transparent
                borderRadius: 8, // sudut bar lebih bulat
                barPercentage: 0.6,
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: {
              legend: { display: false }, // sembunyikan legend
              tooltip: { enabled: true },
            },
            scales: {
              x: {
                grid: { display: false }, // hilangkan grid X
                ticks: { color: "#4B5563", font: { size: 12, weight: 500 } }, // warna & tebal
              },
              y: {
                grid: { display: false }, // hilangkan grid Y
                ticks: { color: "#4B5563", font: { size: 12 } },
              },
            },
          }}
        />
      </div>
    </div>
  );
}
