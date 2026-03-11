import { useState, useMemo } from "react";
import { useMenuEngineering } from "../hooks/useAnalytics";
import { Skeleton } from "@/components";
import { AlertCircle, Star, TrendingDown, Target, HelpCircle } from "lucide-react";
import { formatCurrency } from "@/utils/formatUtils";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ZAxis } from "recharts";
import type { MenuEngineeringItem } from "@/services/analyticsApi";

export const MenuEngineeringView = () => {
  const today = new Date();
  const lastMonth = new Date();
  lastMonth.setMonth(today.getMonth() - 1);
  
  const [startDate, setStartDate] = useState(lastMonth.toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(today.toISOString().split("T")[0]);

  const { data, isLoading, isError } = useMenuEngineering(startDate, endDate);

  // Pre-process for chart in a single pass O(N)
  const { stars, plowhorses, puzzles, dogs } = useMemo(() => {
    const groups = { 
      stars: [] as MenuEngineeringItem[], 
      plowhorses: [] as MenuEngineeringItem[], 
      puzzles: [] as MenuEngineeringItem[], 
      dogs: [] as MenuEngineeringItem[] 
    };
    
    if (!data) return groups;
    
    data.forEach((d: MenuEngineeringItem) => {
      if (d.category === "Star") groups.stars.push(d);
      else if (d.category === "Plowhorse") groups.plowhorses.push(d);
      else if (d.category === "Puzzle") groups.puzzles.push(d);
      else if (d.category === "Dog") groups.dogs.push(d);
    });
    
    return groups;
  }, [data]);

  if (isLoading) return <Skeleton className="h-[400px] w-full rounded-3xl" />;
  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] text-error-500 bg-error-50 rounded-3xl">
        <AlertCircle className="w-10 h-10 mb-2" />
        <p>Error cargando la ingeniería de menú.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-sage-200/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h3 className="text-lg font-semibold text-carbon-900">Matriz BCG de Menú</h3>
          <p className="text-sm text-carbon-500">Popularidad vs Rentabilidad Estimada</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-sage-50 border-none rounded-xl text-carbon-900 font-medium focus:ring-0"
          />
          <span className="text-carbon-500">a</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-sage-50 border-none rounded-xl text-carbon-900 font-medium focus:ring-0"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-sage-200/50 h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" dataKey="quantity" name="Cantidad Vendida" />
              <YAxis type="number" dataKey="revenue" name="Ingreso" tickFormatter={(v) => `$${v/1000}k`} />
              <ZAxis type="category" dataKey="name" name="Plato" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={(val: number, name: string) => name === "Ingreso" ? formatCurrency(val) : val} />
              
              <Scatter name="Stars" data={stars} fill="#10b981">
                {stars.map((_e: MenuEngineeringItem, index: number) => <Cell key={`star-${index}`} fill="#10b981" />)}
              </Scatter>
              <Scatter name="Plowhorses" data={plowhorses} fill="#3b82f6">
                {plowhorses.map((_e: MenuEngineeringItem, index: number) => <Cell key={`plow-${index}`} fill="#3b82f6" />)}
              </Scatter>
              <Scatter name="Puzzles" data={puzzles} fill="#f59e0b">
                {puzzles.map((_e: MenuEngineeringItem, index: number) => <Cell key={`puz-${index}`} fill="#f59e0b" />)}
              </Scatter>
              <Scatter name="Dogs" data={dogs} fill="#ef4444">
                {dogs.map((_e: MenuEngineeringItem, index: number) => <Cell key={`dog-${index}`} fill="#ef4444" />)}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-4">
          <div className="bg-success-50 text-success-900 p-4 rounded-3xl flex gap-4">
            <div className="bg-white p-2 rounded-2xl h-fit"><Star className="w-5 h-5 text-success-500" /></div>
            <div>
              <h4 className="font-semibold text-sm">Estrellas ({stars.length})</h4>
              <p className="text-xs opacity-80 mb-2">Alta popularidad, alto margen. Mantenlos muy visibles.</p>
              <div className="text-xs max-h-24 overflow-y-auto space-y-1">
                {stars.slice(0,5).map((d: MenuEngineeringItem) => <div key={d.name}>• {d.name}</div>)}
              </div>
            </div>
          </div>
          <div className="bg-blue-50 text-blue-900 p-4 rounded-3xl flex gap-4">
            <div className="bg-white p-2 rounded-2xl h-fit"><Target className="w-5 h-5 text-blue-500" /></div>
            <div>
              <h4 className="font-semibold text-sm">Caballitos ({plowhorses.length})</h4>
              <p className="text-xs opacity-80 mb-2">Alta popularidad, bajo margen. Sube el precio o reduce costo.</p>
              <div className="text-xs max-h-24 overflow-y-auto space-y-1">
                {plowhorses.slice(0,5).map((d: MenuEngineeringItem) => <div key={d.name}>• {d.name}</div>)}
              </div>
            </div>
          </div>
          <div className="bg-warning-50 text-warning-900 p-4 rounded-3xl flex gap-4">
            <div className="bg-white p-2 rounded-2xl h-fit"><HelpCircle className="w-5 h-5 text-warning-500" /></div>
            <div>
              <h4 className="font-semibold text-sm">Rompecabezas ({puzzles.length})</h4>
              <p className="text-xs opacity-80 mb-2">Baja popularidad, alto margen. Mejora su ubicación en el menú.</p>
              <div className="text-xs max-h-24 overflow-y-auto space-y-1">
                {puzzles.slice(0,5).map((d: MenuEngineeringItem) => <div key={d.name}>• {d.name}</div>)}
              </div>
            </div>
          </div>
          <div className="bg-error-50 text-error-900 p-4 rounded-3xl flex gap-4">
            <div className="bg-white p-2 rounded-2xl h-fit"><TrendingDown className="w-5 h-5 text-error-500" /></div>
            <div>
              <h4 className="font-semibold text-sm">Perros ({dogs.length})</h4>
              <p className="text-xs opacity-80 mb-2">Baja popularidad, bajo margen. Considera eliminarlos.</p>
              <div className="text-xs max-h-24 overflow-y-auto space-y-1">
                {dogs.slice(0,5).map((d: MenuEngineeringItem) => <div key={d.name}>• {d.name}</div>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
