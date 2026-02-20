import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { SalesSummary } from "@/types";

interface SalesOverviewChartProps {
  data: SalesSummary["byPaymentMethod"];
}

/**
 * SALES OVERVIEW CHART
 * Visualizes sales distribution by payment method.
 */
export const SalesOverviewChart: React.FC<SalesOverviewChartProps> = ({ data = [] }) => {
  // Map payment methods to readable labels and colors
  const chartData = data.map((item) => ({
    name: item.method === "CASH" ? "Efectivo" : item.method === "NEQUI" ? "Nequi" : "Tiquetera",
    valor: item.amount,
    color: item.method === "CASH" ? "#10b981" : item.method === "NEQUI" ? "#8b5cf6" : "#f59e0b",
  }));

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "#64748b", fontSize: 12 }}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <Tooltip 
            cursor={{ fill: "#f8fafc" }}
            contentStyle={{ 
              borderRadius: "12px", 
              border: "none", 
              boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
              padding: "12px"
            }}
            formatter={(value: number) => [`$${value.toLocaleString()}`, "Ventas"]}
          />
          <Bar dataKey="valor" radius={[6, 6, 0, 0]} barSize={50}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
