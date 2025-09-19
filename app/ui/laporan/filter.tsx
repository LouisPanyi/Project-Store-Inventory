"use client";

import { bulanNama } from "./bulan";
import { useRouter, useSearchParams } from "next/navigation";

type FilterProps = {
  month: number;
  year: number;
};

export function Filter({ month, year }: FilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Tahun: tahun ini dan 2 tahun sebelumnya
  const currentYear = new Date().getFullYear();
  const years = [currentYear - 2, currentYear - 1, currentYear];

  const handleChange = (newMonth: number, newYear: number) => {
    const query = new URLSearchParams(searchParams.toString());
    query.set("month", newMonth.toString());
    query.set("year", newYear.toString());

    // ✅ pastikan path sesuai lokasi laporan
    router.push(`/dashboard/laporan?${query.toString()}`);
  };

  const selectClasses =
    "px-4 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none select-none-arrow";

  const renderSelect = (
    value: number,
    options: { value: number; label: string }[],
    onChange: (v: number) => void
  ) => (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={selectClasses}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Custom panah */}
      <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
        <svg
          className="w-4 h-4 text-gray-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );

  return (
    <div className="flex gap-2">
      {/* Bulan */}
      {renderSelect(
        month,
        bulanNama.map((nama, idx) => ({ value: idx + 1, label: nama })),
        (newMonth) => handleChange(newMonth, year)
      )}

      {/* Tahun */}
      {renderSelect(
        year,
        years.map((y) => ({ value: y, label: y.toString() })),
        (newYear) => handleChange(month, newYear)
      )}
    </div>
  );
}
