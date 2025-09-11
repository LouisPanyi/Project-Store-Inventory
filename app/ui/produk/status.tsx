import React from "react";
import clsx from "clsx";

export function StatusBadge({ status }: { status: number }) {
  const labelMap: Record<number, string> = {
    1: "Aktif",
    2: "Nonaktif",
    3: "Discontinued",
  };

  const colorMap: Record<number, string> = {
    1: "bg-green-100 text-green-800 ring-green-600/20",
    2: "bg-gray-100 text-gray-800 ring-gray-600/20",
    3: "bg-red-100 text-red-800 ring-red-600/20",
  };

  const label = labelMap[status] ?? "Unknown";
  const color =
    colorMap[status] ??
    "bg-yellow-100 text-yellow-800 ring-yellow-600/20";

  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset",
        color
      )}
    >
      {label}
    </span>
  );
}