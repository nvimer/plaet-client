import { useState } from "react";
import { useSalesPrediction } from "../hooks/useAnalytics";
import { Skeleton } from "@/components";
import { AlertCircle, Calendar, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/utils/formatUtils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { PredictionDataPoint } from "@/services/analyticsApi";

const formatShortDate = (dateStr: string) => {
  return new Intl.DateTimeFormat('es-CO', { month: 'short', day: 'numeric' }).format(new Date(dateStr));
};

const formatDayName = (dateStr: string) => {
  return new Intl.DateTimeFormat('es-CO', { weekday: 'long' }).format(new Date(dateStr));
};

export const PredictionsView = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [targetDate, setTargetDate] = useState(tomorrow.toISOString().split("T")[0]);

  const { data, isLoading, isError } = useSalesPrediction(targetDate);

  if (isLoading) return <Skeleton className="h-[400px] w-full rounded-3xl" />;
  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] text-error-500 bg-error-50 rounded-3xl">
        <AlertCircle className="w-10 h-10 mb-2" />
        <p>Error cargando predicciones. Asegúrese de seleccionar una fecha válida.</p>
      </div>
    );
  }

  const chartData = [...(data.historicalData || [])].reverse().map((d: PredictionDataPoint) => ({
    name: formatShortDate(d.date),
    ventas: d.sales,
  }));

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-sage-200/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h3 className="text-lg font-semibold text-carbon-900">Proyección de Ventas</h3>
          <p className="text-sm text-carbon-500">
            Basado en el historial de ventas ponderadas (últimos 4 {formatDayName(targetDate)}s)
          </p>
        </div>
        <div className="flex items-center gap-4 bg-sage-50 p-2 rounded-2xl">
          <Calendar className="w-5 h-5 text-carbon-500 ml-2" />
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="bg-transparent border-none text-carbon-900 font-medium focus:ring-0 cursor-pointer"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-sage-200/50 h-[400px]">
          <h4 className="text-sm font-medium text-carbon-500 mb-6">Historial Base</h4>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#64748b" }} />
              <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `$${val/1000}k`} />
              <Tooltip formatter={(val: number) => formatCurrency(val)} />
              <Bar dataKey="ventas" fill="#94a3b8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-primary-900 rounded-3xl p-8 shadow-md flex flex-col justify-center text-white relative overflow-hidden h-[400px]">
          <div className="absolute top-0 right-0 p-6 opacity-20">
            <TrendingUp className="w-32 h-32" />
          </div>
          <div className="relative z-10">
            <h4 className="text-primary-200 font-medium mb-2">Ventas Proyectadas</h4>
            <div className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              {formatCurrency(data.predictedSales)}
            </div>
            <p className="text-primary-100 text-sm opacity-90 leading-relaxed mt-4">
              Esta proyección utiliza promedios móviles ponderados. Te recomendamos preparar inventario basándote en esta expectativa para el {formatDayName(targetDate)}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
