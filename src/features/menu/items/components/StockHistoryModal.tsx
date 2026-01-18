import { BaseModal } from "@/components/ui/BaseModal";
import { useStockHistory } from "../hooks";
import { Skeleton } from "@/components";
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

  const getTypeLabel = (type: StockHistoryEntry["type"]): string => {
    const labels: Record<StockHistoryEntry["type"], string> = {
      ADD: "Agregado",
      REMOVE: "Removido",
      RESET: "Reset Diario",
      ORDER: "Pedido",
      ADJUSTMENT: "Ajuste",
    };
    return labels[type] || type;
  };

  const getTypeColor = (type: StockHistoryEntry["type"]): string => {
    const colors: Record<StockHistoryEntry["type"], string> = {
      ADD: "text-green-600 bg-green-50 border-green-200",
      REMOVE: "text-red-600 bg-red-50 border-red-200",
      RESET: "text-blue-600 bg-blue-50 border-blue-200",
      ORDER: "text-purple-600 bg-purple-50 border-purple-200",
      ADJUSTMENT: "text-yellow-600 bg-yellow-50 border-yellow-200",
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
                className={`p-4 rounded-xl border-2 ${getTypeColor(entry.type)}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    <span className="font-semibold">
                      {getTypeLabel(entry.type)}
                    </span>
                    <span className="font-bold text-lg">
                      {entry.type === "REMOVE" ? "-" : "+"}
                      {entry.quantity}
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
