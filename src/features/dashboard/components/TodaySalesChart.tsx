import React, { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { Order } from "@/types";

interface TodaySalesChartProps {
  orders: Order[];
}

/**
 * TODAY SALES CHART
 * Smooth AreaChart showing sales trend throughout the day.
 */
export const TodaySalesChart: React.FC<TodaySalesChartProps> = ({ orders = [] }) => {
  // Aggregate sales by hour O(N)
  const hourlyData = useMemo(() => {
    // Initialize buckets for hours 8 to 21
    const buckets: Record<number, number> = {};
    for (let h = 8; h <= 21; h++) buckets[h] = 0;

    // Single pass over orders
    orders.forEach(o => {
      if (o.status !== "PAID") return;
      const hour = new Date(o.createdAt).getHours();
      if (hour >= 8 && hour <= 21) {
        buckets[hour] += Number(o.totalAmount || 0);
      }
    });

    // Map to recharts format
    return Object.entries(buckets).map(([hour, total]) => ({
      hour: `${hour}:00`,
      total,
    }));
  }, [orders]);

  return (
    <div className="h-[280px] w-full pt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={hourlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="hour" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            minTickGap={30}
          />
          <YAxis 
            hide
          />
          <Tooltip 
            contentStyle={{ 
              borderRadius: "16px", 
              border: "none", 
              boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
              padding: "12px"
            }}
            formatter={(value: number) => [`$${value.toLocaleString()}`, "Ventas"]}
          />
          <Area
            type="monotone"
            dataKey="total"
            stroke="#10b981"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorTotal)"
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
