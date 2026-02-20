import React from "react";
import { StatCard } from "@/components/ui/StatCard/StatCard";
import { TrendingUp, ShoppingBag, Wallet, Receipt } from "lucide-react";
import type { DailyAnalytics } from "@/types";

interface StatsGridProps {
  data: DailyAnalytics;
}

/**
 * STATS GRID
 * KPI cards for the main dashboard metrics.
 */
export const StatsGrid: React.FC<StatsGridProps> = ({ data }) => {
  const totalSales = data.salesSummary?.totalSales || 0;
  const orderCount = data.salesSummary?.orderCount || 0;
  const netBalance = data.netBalance || 0;
  const totalExpenses = totalSales - netBalance;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Ventas Totales"
        value={`$${totalSales.toLocaleString()}`}
        icon={<TrendingUp />}
        trend={{ value: 12, isUp: true }} // Mock trend for UX
        variant="success"
      />
      <StatCard
        title="Pedidos"
        value={orderCount.toString()}
        icon={<ShoppingBag />}
        variant="primary"
      />
      <StatCard
        title="Balance Neto"
        value={`$${netBalance.toLocaleString()}`}
        icon={<Wallet />}
        variant="info"
      />
      <StatCard
        title="Gastos Registrados"
        value={`$${totalExpenses.toLocaleString()}`}
        icon={<Receipt />}
        variant="warning"
      />
    </div>
  );
};
