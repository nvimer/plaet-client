import { useMemo } from "react";
import { Card } from "@/components";
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
 *
 * Displays comprehensive inventory analytics with charts and statistics
 */
export function InventoryDashboard({ items }: InventoryDashboardProps) {
  // Calculate statistics
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

  // Data for pie chart (inventory type distribution)
  const inventoryTypeData = [
    { name: "Rastreado", value: stats.tracked, color: "#22c55e" },
    { name: "Ilimitado", value: stats.unlimited, color: "#6b7280" },
  ];

  // Data for pie chart (stock status distribution - only tracked items)
  const stockStatusData = [
    { name: "Stock OK", value: stats.healthyStock, color: "#22c55e" },
    { name: "Stock Bajo", value: stats.lowStock, color: "#f59e0b" },
    { name: "Sin Stock", value: stats.outOfStock, color: "#ef4444" },
  ].filter((item) => item.value > 0);

  // Mock data for weekly movements (in real app, this would come from API)
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
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card variant="elevated" className="p-4 border-l-4 border-l-sage-500">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sage-100 rounded-lg">
              <Package className="w-5 h-5 text-sage-600" />
            </div>
            <div>
              <p className="text-sm text-carbon-500">Total Items</p>
              <p className="text-2xl font-bold text-carbon-900">
                {stats.total}
              </p>
            </div>
          </div>
        </Card>

        <Card variant="elevated" className="p-4 border-l-4 border-l-blue-500">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-carbon-500">Stock OK</p>
              <p className="text-2xl font-bold text-carbon-900">
                {stats.healthyStock}
              </p>
            </div>
          </div>
        </Card>

        <Card variant="elevated" className="p-4 border-l-4 border-l-amber-500">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-carbon-500">Stock Bajo</p>
              <p className="text-2xl font-bold text-carbon-900">
                {stats.lowStock}
              </p>
            </div>
          </div>
        </Card>

        <Card variant="elevated" className="p-4 border-l-4 border-l-rose-500">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <p className="text-sm text-carbon-500">Sin Stock</p>
              <p className="text-2xl font-bold text-carbon-900">
                {stats.outOfStock}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Movements Chart */}
        <Card variant="elevated" className="p-6">
          <h3 className="text-lg font-semibold text-carbon-800 mb-4">
            Movimientos de Stock - Últimos 7 días
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyMovementsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="day"
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  axisLine={{ stroke: "#e5e7eb" }}
                />
                <YAxis
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  axisLine={{ stroke: "#e5e7eb" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="entradas"
                  name="Entradas"
                  fill="#22c55e"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="salidas"
                  name="Salidas"
                  fill="#ef4444"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Inventory Distribution Chart */}
        <Card variant="elevated" className="p-6">
          <h3 className="text-lg font-semibold text-carbon-800 mb-4">
            Distribución de Inventario
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={inventoryTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {inventoryTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-sage-50 rounded-lg">
              <p className="text-2xl font-bold text-sage-600">
                {stats.tracked}
              </p>
              <p className="text-sm text-carbon-600">Rastreados</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-600">
                {stats.unlimited}
              </p>
              <p className="text-sm text-carbon-600">Ilimitados</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Stock Status Distribution */}
      {stats.tracked > 0 && (
        <Card variant="elevated" className="p-6">
          <h3 className="text-lg font-semibold text-carbon-800 mb-4">
            Estado del Stock (Items Rastreados)
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stockStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${((percent || 0) * 100).toFixed(0)}%`
                  }
                >
                  {stockStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}
    </div>
  );
}
