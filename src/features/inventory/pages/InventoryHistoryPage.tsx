import { useState } from "react";
import { SidebarLayout } from "@/layouts/SidebarLayout";
import {
  Card,
  Badge,
  Skeleton,
  EmptyState,
  Pagination,
} from "@/components";
import { useAllStockHistory } from "@/features/inventory/hooks";
import {
  History,
  ArrowUpCircle,
  ArrowDownCircle,
  RotateCcw,
  ShoppingBag,
  Info,
  XCircle,
} from "lucide-react";
import { cn } from "@/utils/cn";

/**
 * InventoryHistoryPage Component
 * 
 * Displays a global list of all stock adjustments and movements.
 */
export function InventoryHistoryPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const { data: historyData, isLoading } = useAllStockHistory({ page, limit });

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("es-CO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(dateString));
  };

  const formatTime = (dateString: string) => {
    return new Intl.DateTimeFormat("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date(dateString));
  };

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
      case "ORDER_CANCELLED":
        return <XCircle className="w-5 h-5 text-success-400" />;
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
      case "ORDER_CANCELLED":
        return "Cancelación";
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
                    <th className="px-6 py-4 text-[10px] font-black text-carbon-400 tracking-wide">Fecha</th>
                    <th className="px-6 py-4 text-[10px] font-black text-carbon-400 tracking-wide">Producto</th>
                    <th className="px-6 py-4 text-[10px] font-black text-carbon-400 tracking-wide">Tipo</th>
                    <th className="px-6 py-4 text-[10px] font-black text-carbon-400 tracking-wide text-center">Cantidad</th>
                    <th className="px-6 py-4 text-[10px] font-black text-carbon-400 tracking-wide">Stock Final</th>
                    <th className="px-6 py-4 text-[10px] font-black text-carbon-400 tracking-wide">Nota</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sage-50">
                  {historyData.data.map((entry) => (
                    <tr key={entry.id} className="hover:bg-sage-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-carbon-900 capitalize">
                            {formatDate(entry.createdAt)}
                          </span>
                          <span className="text-[10px] text-carbon-400 font-medium">
                            {formatTime(entry.createdAt)} hs
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
                            entry.adjustmentType === "MANUAL_ADD" || 
                            entry.adjustmentType === "DAILY_RESET" ||
                            entry.adjustmentType === "ORDER_CANCELLED"
                              ? "success"
                              : "error"
                          }
                          className="font-black"
                        >
                          {entry.adjustmentType === "MANUAL_ADD" || 
                           entry.adjustmentType === "DAILY_RESET" ||
                           entry.adjustmentType === "ORDER_CANCELLED" ? "+" : "-"}
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
