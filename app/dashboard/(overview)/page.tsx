import QuickStats from "app/ui/dashboard/quickstats";
import SalesChart from "app/ui/dashboard/saleschart";
import RecentActivity from "app/ui/dashboard/recent-activity";
import LowStock from "app/ui/dashboard/lowstock";
import { fetchDashboardData } from "app/lib/data"; 

export default async function DashboardPage() {
  const { stats, sales, transactions, lowStock } = await fetchDashboardData();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard Homepage</h1>
      {/* Ringkasan */}
      <QuickStats stats={stats} />

      {/* Grid isi utama */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SalesChart data={sales} />
        <LowStock products={lowStock} />
      </div>

      {/* Aktivitas terbaru */}
      <RecentActivity transactions={transactions} />
    </div>
  );
}
