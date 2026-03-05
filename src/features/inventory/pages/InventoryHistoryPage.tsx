import { useState } from "react";
import { SidebarLayout } from "@/layouts/SidebarLayout";
import {
  Card,
  Badge,
  Skeleton,
  EmptyState,
  Pagination,
} from "@/components";
import { useAllStockHistory } from "../hooks";
import {
  History,
  ArrowUpCircle,
  ArrowDownCircle,
  RotateCcw,
  ShoppingBag,
  Info,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { format } from "date-fns";
import { es } from "date-fns/locale";

/**
 * InventoryHistoryPage Component
 * 
 * Displays a global list of all stock adjustments and movements.
 */
export function InventoryHistoryPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const { data: historyData, isLoading } = useAllStockHistory({ page, limit });

  const getAdjustmentIcon = (type: string) => {
    switch (type) {
      case "MANUAL_ADD":
        return <ArrowUpCircle className="w-5 h-5 text-success-500" />;
      case "MANUAL_REMOVE":
        return <ArrowDownCircle className="w-5 h-5 text-error-500" />;
      case "DAILY_RESET":
        return <RotateCcw className="w-5 h-5 text-warning-500" />;
      case "ORDER_DEDUCT":
        return <ShoppingBag className="w-5 h-5 text-blue-500" />;
      default:
        return <Info className="w-5 h-5 text-carbon-400" />;
    }
  };

  const getAdjustmentLabel = (type: string) => {
    switch (type) {
      case "MANUAL_ADD":
        return "Entrada Manual";
      case "MANUAL_REMOVE":
        return "Salida Manual";
      case "DAILY_RESET":
        return "Reinicio Diario";
      case "ORDER_DEDUCT":
        return "Venta";
      default:
        return type;
    }
  };

  return (
    <SidebarLayout hideTitle fullWidth>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Header */}
        <header className="space-y-2">
          <div className="flex items-center gap-2 text-blue-600">
            <History className="w-5 h-5" />
            <span className="text-[10px] font-semibold tracking-[0.2em]">Auditoría de Stock</span>
          </div>
          <h1 className="text-4xl font-bold text-carbon-900 tracking-tight">Historial de Movimientos</h1>
          <p className="text-lg text-carbon-500 font-medium">Registro detallado de todas las entradas y salidas del inventario.</p>
        </header>

        {/* History List */}
        <Card variant="elevated" padding="none" className="overflow-hidden border-none shadow-smooth-lg rounded-3xl">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} height={60} className="rounded-xl" />
              ))}
            </div>
          ) : historyData?.data && historyData.data.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-sage-50/50 border-b border-sage-100">
                    <th className="px-6 py-4 text-[10px] font-black text-carbon-400 uppercase tracking-widest">Fecha</th>
                    <th className="px-6 py-4 text-[10px] font-black text-carbon-400 uppercase tracking-widest">Producto</th>
                    <th className="px-6 py-4 text-[10px] font-black text-carbon-400 uppercase tracking-widest">Tipo</th>
                    <th className="px-6 py-4 text-[10px] font-black text-carbon-400 uppercase tracking-widest text-center">Cantidad</th>
                    <th className="px-6 py-4 text-[10px] font-black text-carbon-400 uppercase tracking-widest">Stock Final</th>
                    <th className="px-6 py-4 text-[10px] font-black text-carbon-400 uppercase tracking-widest">Nota</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sage-50">
                  {historyData.data.map((entry) => (
                    <tr key={entry.id} className="hover:bg-sage-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-carbon-900">
                            {format(new Date(entry.createdAt), "dd MMM, yyyy", { locale: es })}
                          </span>
                          <span className="text-[10px] text-carbon-400 font-medium">
                            {format(new Date(entry.createdAt), "HH:mm 'hs'", { locale: es })}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-carbon-700">
                          {entry.menuItem?.name || `Item #${entry.menuItemId}`}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getAdjustmentIcon(entry.adjustmentType)}
                          <span className="text-xs font-bold text-carbon-600">
                            {getAdjustmentLabel(entry.adjustmentType)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Badge
                          variant={
                            entry.adjustmentType === "MANUAL_ADD" || entry.adjustmentType === "DAILY_RESET"
                              ? "success"
                              : "error"
                          }
                          className="font-black"
                        >
                          {entry.adjustmentType === "MANUAL_ADD" || entry.adjustmentType === "DAILY_RESET" ? "+" : "-"}
                          {Math.abs(entry.quantity)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-mono font-bold text-carbon-900 bg-carbon-50 px-2 py-1 rounded-lg border border-carbon-100">
                          {entry.newStock}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-carbon-500 font-medium truncate max-w-[150px] block">
                          {entry.reason || "—"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-20">
              <EmptyState
                icon={<History className="w-12 h-12" />}
                title="Sin movimientos registrados"
                description="Aún no se han realizado ajustes de stock ni ventas que afecten el inventario."
              />
            </div>
          )}

          {historyData?.meta && historyData.meta.totalPages > 1 && (
            <div className="p-6 border-t border-sage-100 bg-white">
              <Pagination
                currentPage={page}
                totalPages={historyData.meta.totalPages}
                totalItems={historyData.meta.total}
                itemsPerPage={limit}
                onPageChange={setPage}
                onItemsPerPageChange={setLimit}
              />
            </div>
          )}
        </Card>
      </div>
    </SidebarLayout>
  );
}
