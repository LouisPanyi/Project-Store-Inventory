"use client";

type CardStatProps = {
  title: string;
  value: string | number;
  color?: string;
};

export function CardStat({ title, value, color }: CardStatProps) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <p className={`text-2xl font-bold ${color ?? "text-gray-800"}`}>
        {value}
      </p>
    </div>
  );
}
