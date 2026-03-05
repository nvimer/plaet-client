import { useMemo } from "react";
import { Card, StatCard } from "@/components";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import type { MenuItem } from "@/types";
import { InventoryType } from "@/types";
import { Package, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";

interface InventoryDashboardProps {
  items: MenuItem[];
}

/**
 * InventoryDashboard Component
 * Refined design with premium cards and consistent spacing.
 */
export function InventoryDashboard({ items }: InventoryDashboardProps) {
  const stats = useMemo(() => {
    const tracked = items.filter(
      (item) => item.inventoryType === InventoryType.TRACKED,
    );
    const unlimited = items.filter(
      (item) => item.inventoryType === InventoryType.UNLIMITED,
    );
    const lowStock = tracked.filter(
      (item) =>
        item.stockQuantity !== undefined &&
        item.lowStockAlert !== undefined &&
        item.stockQuantity <= item.lowStockAlert &&
        item.stockQuantity > 0,
    );
    const outOfStock = tracked.filter((item) => item.stockQuantity === 0);
    const healthyStock = tracked.filter(
      (item) =>
        item.stockQuantity !== undefined &&
        item.lowStockAlert !== undefined &&
        item.stockQuantity > item.lowStockAlert,
    );

    return {
      total: items.length,
      tracked: tracked.length,
      unlimited: unlimited.length,
      lowStock: lowStock.length,
      outOfStock: outOfStock.length,
      healthyStock: healthyStock.length,
    };
  }, [items]);

  const inventoryTypeData = [
    { name: "Rastreado", value: stats.tracked, color: "#769B86" },
    { name: "Ilimitado", value: stats.unlimited, color: "#9CA3AF" },
  ];

  const stockStatusData = [
    { name: "Stock OK", value: stats.healthyStock, color: "#22c55e" },
    { name: "Stock Bajo", value: stats.lowStock, color: "#f59e0b" },
    { name: "Sin Stock", value: stats.outOfStock, color: "#ef4444" },
  ].filter((item) => item.value > 0);

  const weeklyMovementsData = [
    { day: "Lun", entradas: 45, salidas: 38 },
    { day: "Mar", entradas: 52, salidas: 42 },
    { day: "Mié", entradas: 38, salidas: 55 },
    { day: "Jue", entradas: 65, salidas: 48 },
    { day: "Vie", entradas: 78, salidas: 82 },
    { day: "Sáb", entradas: 95, salidas: 105 },
    { day: "Dom", entradas: 42, salidas: 35 },
  ];

  return (
    <div className="space-y-8">
      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Items"
          value={stats.total.toString()}
          variant="info"
          icon={<Package className="w-6 h-6" />}
        />
        <StatCard
          title="Stock OK"
          value={stats.healthyStock.toString()}
          variant="success"
          icon={<CheckCircle2 className="w-6 h-6" />}
        />
        <StatCard
          title="Stock Bajo"
          value={stats.lowStock.toString()}
          variant="warning"
          icon={<TrendingUp className="w-6 h-6" />}
        />
        <StatCard
          title="Sin Stock"
          value={stats.outOfStock.toString()}
          variant="error"
          icon={<AlertTriangle className="w-6 h-6" />}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weekly Movements - Main Chart */}
        <Card variant="elevated" padding="lg" className="lg:col-span-2 shadow-smooth-lg border-none rounded-3xl bg-white">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-carbon-900 tracking-tight">Movimientos Recientes</h3>
            <p className="text-sm text-carbon-500 font-medium">Histórico de entradas y salidas de stock</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyMovementsData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 12, fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 12, fontWeight: 600 }} />
                <Tooltip
                  cursor={{ fill: '#F8FAFC' }}
                  contentStyle={{ backgroundColor: "#111827", borderRadius: "16px", border: "none", color: "#fff", boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
                  itemStyle={{ color: "#fff", fontSize: "12px", fontWeight: "bold" }}
                />
                <Bar dataKey="entradas" name="Entradas" fill="#769B86" radius={[6, 6, 0, 0]} barSize={20} />
                <Bar dataKey="salidas" name="Salidas" fill="#EF4444" radius={[6, 6, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Distribution Card */}
        <Card variant="elevated" padding="lg" className="shadow-smooth-lg border-none rounded-3xl bg-carbon-900 text-white">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Package className="w-5 h-5 text-sage-400" />
            Estado de Rastreo
          </h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={inventoryTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {inventoryTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: "#1F2937", border: "none", borderRadius: "12px", fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-4">
            {inventoryTypeData.map((item) => (
              <div key={item.name} className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs font-bold text-white/80">{item.name}</span>
                </div>
                <span className="text-sm font-black text-white">{item.value} ud.</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}