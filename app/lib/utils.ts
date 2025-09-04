import { Revenue } from './definitions';

export const formatCurrency = (amount: number) => {
  return amount.toLocaleString('id-ID', {
    style: 'currency',
    currency: 'IDR',
  });
};

export const formatDateToLocal = (
  dateStr: string,
  locale: string = 'en-US',
) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

export const generateYAxis = (revenue: Revenue[]) => {
  // Calculate what labels we need to display on the y-axis
  // based on highest record and in 1000s
  const yAxisLabels = [];
  const highestRecord = Math.max(...revenue.map((month) => month.revenue));
  const topLabel = Math.ceil(highestRecord / 1000) * 1000;

  for (let i = topLabel; i >= 0; i -= 1000) {
    yAxisLabels.push(`$${i / 1000}K`);
  }

  return { yAxisLabels, topLabel };
};

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};

//format tanggal
export function formatDate(date: Date | string) {
  // if (typeof window === "undefined") {
  //   console.log("[SERVER] RAW VALUE:", date);
  // } else {
  //   console.log("[CLIENT] RAW VALUE:", date);
  // }

  let parsedDate: Date;

  if (date instanceof Date) {
    parsedDate = date;
  } else if (typeof date === "string") {
    const isoString = date.replace(" ", "T").split(".")[0] + "Z";
    parsedDate = new Date(isoString);
  } else {
    return "-";
  }

  if (isNaN(parsedDate.getTime())) {
    console.log("INVALID DATE DETECTED");
    return "-";
  }

  return parsedDate.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getStatusLabel(status: number): string {
  switch (status) {
    case 1: return "Aktif";
    case 2: return "Nonaktif";
    case 3: return "Discontinued";
    default: return "Unknown";
  }
}

type StatusConfig = {
  label: string;
  className: string;
};

export function getStatusTransaksi(status: string | number): StatusConfig {
  const key = String(status ?? "")
    .trim()
    .toLowerCase();

  const mapping: Record<string, StatusConfig> = {
    paid: { label: "Paid", className: "bg-green-100 text-green-800" },
    unpaid: { label: "Unpaid", className: "bg-red-100 text-red-800" },
    pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800" },
    cancelled: { label: "Cancelled", className: "bg-gray-100 text-gray-800" },
  };

  return (
    mapping[key] || { label: "Unknown", className: "bg-gray-100 text-gray-800" }
  );
}