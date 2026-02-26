import React from "react";
import { StatCard } from "@/components/ui/StatCard/StatCard";
import { TrendingUp, ShoppingBag, Wallet, DollarSign } from "lucide-react";
import type { DailySummaryResponse } from "@/services/analyticsApi";

interface StatsGridProps {
  data: DailySummaryResponse;
}

/**
 * STATS GRID
 * KPI cards for the main dashboard metrics.
 */
export const StatsGrid: React.FC<StatsGridProps> = ({ data }) => {
  const totalSales = data.salesSummary?.totalSold || 0;
  const orderCount = data.salesSummary?.orderCount || 0;
  const totalExpenses = data.totalExpenses || 0;
  const netBalance = data.netBalance || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Ventas Brutas"
        value={`$${totalSales.toLocaleString("es-CO")}`}
        icon={<DollarSign />}
        variant="success"
      />
      <StatCard
        title="Pedidos"
        value={orderCount.toString()}
        icon={<ShoppingBag />}
        variant="primary"
      />
      <StatCard
        title="Egresos / Gastos"
        value={`$${totalExpenses.toLocaleString("es-CO")}`}
        icon={<TrendingUp className="rotate-180 text-error-500" />}
        variant="error"
      />
      <StatCard
        title="Utilidad Neta"
        value={`$${netBalance.toLocaleString("es-CO")}`}
        icon={<Wallet />}
        variant="info"
      />
    </div>
  );
};