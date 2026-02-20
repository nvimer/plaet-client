import React from "react";
import { StatCard } from "@/components/ui/StatCard/StatCard";
import { TrendingUp, ShoppingBag, Wallet, Receipt } from "lucide-react";
import { DailyAnalytics } from "@/types/analytics";

interface StatsGridProps {
  data: DailyAnalytics;
}

/**
 * STATS GRID
 * KPI cards for the main dashboard metrics.
 */
export const StatsGrid: React.FC<StatsGridProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Ventas Totales"
        value={`$${data.salesSummary.totalSales.toLocaleString()}`}
        icon={TrendingUp}
        trend={{ value: 12, isUp: true }} // Mock trend for UX
        variant="success"
      />
      <StatCard
        title="Pedidos"
        value={data.salesSummary.orderCount.toString()}
        icon={ShoppingBag}
        variant="primary"
      />
      <StatCard
        title="Balance Neto"
        value={`$${data.netBalance.toLocaleString()}`}
        icon={Wallet}
        variant="info"
      />
      <StatCard
        title="Gastos Registrados"
        value={`$${(data.salesSummary.totalSales - data.netBalance).toLocaleString()}`}
        icon={Receipt}
        variant="warning"
      />
    </div>
  );
};
