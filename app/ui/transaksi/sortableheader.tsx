'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';

export default function SortableHeader({
  column,
  label,
}: {
  column: string;
  label: string;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentSort = searchParams.get('sort');
  const currentOrder = searchParams.get('order');

  const isSortingThisColumn = currentSort === column;
  const newOrder = isSortingThisColumn && currentOrder === 'asc' ? 'desc' : 'asc';

  const params = new URLSearchParams(searchParams);
  params.set('sort', column);
  params.set('order', newOrder);

  return (
    <th scope="col" className="px-3 py-5 font-medium">
      <Link href={`${pathname}?${params.toString()}`} className="flex items-center gap-1">
        {label}
        {isSortingThisColumn ? (
          currentOrder === 'asc' ? (
            <ArrowUpIcon className="h-4 w-4" />
          ) : (
            <ArrowDownIcon className="h-4 w-4" />
          )
        ) : null}
      </Link>
    </th>
  );
}