'use client';

import { bulanNama } from './bulan';

type FilterProps = {
  month: number;
  year: number;
};

export function Filter({ month, year }: FilterProps) {
  return (
    <div className="flex gap-2">
      <select
        defaultValue={month}
        onChange={(e) => {
          window.location.href = `/laporan?month=${e.target.value}&year=${year}`;
        }}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {bulanNama.map((nama, index) => (
          <option key={index} value={index + 1}>
            {nama}
          </option>
        ))}
      </select>

      <select
        defaultValue={year}
        onChange={(e) => {
          window.location.href = `/laporan?month=${month}&year=${e.target.value}`;
        }}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {[2023, 2024, 2025].map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
  );
}
