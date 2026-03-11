import { BaseModal, Skeleton } from "@/components";
import { useStockHistory } from "../hooks";
import { History, Package } from "lucide-react";
import type { StockHistoryEntry } from "@/types";

interface StockHistoryModalProps {
  itemId: number;
  itemName: string;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * StockHistoryModal Component
 *
 * Modal to display stock history for a menu item
 */
export function StockHistoryModal({
  itemId,
  itemName,
  isOpen,
  onClose,
}: StockHistoryModalProps) {
  const { data: history, isLoading } = useStockHistory(itemId);

  const getTypeLabel = (type: StockHistoryEntry["adjustmentType"]): string => {
    const labels: Record<StockHistoryEntry["adjustmentType"], string> = {
      MANUAL_ADD: "Agregado",
      MANUAL_REMOVE: "Removido",
      DAILY_RESET: "Reset Diario",
      ORDER_DEDUCT: "Pedido",
      ORDER_CANCELLED: "Cancelación",
    };
    return labels[type] || type;
  };

  const getTypeColor = (type: StockHistoryEntry["adjustmentType"]): string => {
    const colors: Record<StockHistoryEntry["adjustmentType"], string> = {
      MANUAL_ADD: "text-success-600 bg-success-50 border-success-200",
      MANUAL_REMOVE: "text-error-600 bg-error-50 border-error-200",
      DAILY_RESET: "text-blue-600 bg-blue-50 border-blue-200",
      ORDER_DEDUCT: "text-info-600 bg-info-50 border-info-200",
      ORDER_CANCELLED: "text-success-600 bg-success-50 border-success-200",
    };
    return colors[type] || "text-carbon-600 bg-carbon-50 border-carbon-200";
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString("es-CO", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Historial de Stock - ${itemName}`}
      size="lg"
    >
      <div className="max-h-[600px] overflow-y-auto">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-20" />
            ))}
          </div>
        ) : history && history.length > 0 ? (
          <div className="space-y-3">
            {history.map((entry) => (
              <div
                key={entry.id}
                className={`p-4 rounded-xl border-2 ${getTypeColor(entry.adjustmentType)}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    <span className="font-semibold">
                      {getTypeLabel(entry.adjustmentType)}
                    </span>
                    <span className="font-bold text-lg">
                      {entry.adjustmentType === "MANUAL_REMOVE" || entry.adjustmentType === "ORDER_DEDUCT" ? "-" : "+"}
                      {Math.abs(entry.quantity)}
                    </span>
                  </div>
                  <span className="text-sm opacity-75">
                    {formatDate(entry.createdAt)}
                  </span>
                </div>
                {entry.reason && (
                  <p className="text-sm mt-2 opacity-90">{entry.reason}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <History className="w-12 h-12 text-carbon-300 mx-auto mb-4" />
            <p className="text-carbon-600">No hay historial de stock</p>
          </div>
        )}
      </div>
    </BaseModal>
  );
}
