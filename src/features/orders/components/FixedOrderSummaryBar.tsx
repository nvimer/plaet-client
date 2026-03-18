import { ReceiptText, Zap, Plus } from "lucide-react";

interface LooseItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface FixedOrderSummaryBarProps {
  looseItems: LooseItem[];
  currentOrderTotal: number;
  tableTotal: number;
  hasProtein?: boolean;
  currentProteinName?: string;
  onAddOrder: () => void;
  onShowSummary: () => void;
  scrollToOrder: () => void;
  ordersCount: number;
  isHistorical?: boolean;
}

export function FixedOrderSummaryBar({
  looseItems,
  currentOrderTotal = 0,
  tableTotal = 0,
  hasProtein = false,
  _currentProteinName,
  onAddOrder,
  onShowSummary,
  _scrollToOrder,
  ordersCount = 0,
  isHistorical = false,
}: FixedOrderSummaryBarProps) {
  const currentItemCount = looseItems.reduce((sum, item) => sum + item.quantity, 0);
  const hasCurrentOrder = currentItemCount > 0 || hasProtein;

  if (!hasCurrentOrder && ordersCount === 0) {
    return null;
  }

  return (
    <div className="bg-white border-t border-sage-200 shadow-[0_-8px_30px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden pb-[env(safe-area-inset-bottom)] w-full">
      {/* 1. Mini Status Bar (Visible only if there are confirmed orders AND we are adding a new one) */}
      {ordersCount > 0 && hasCurrentOrder && !isHistorical && (
        <div 
          className="bg-carbon-900 text-white border-b border-carbon-800 cursor-pointer active:bg-carbon-800 transition-colors w-full"
          onClick={onShowSummary}
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <ReceiptText className="w-3.5 h-3.5 text-sage-400" />
              <span className="text-[10px] font-bold tracking-wide">Mesa: {ordersCount} servicios</span>
            </div>
            <span className="text-xs font-bold tracking-tight">${Number(tableTotal).toLocaleString("es-CO")}</span>
          </div>
        </div>
      )}

      {/* 2. Main Action Container */}
      <div className="w-full bg-white/95">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex gap-2 w-full">
          {hasCurrentOrder ? (
            <button
              onClick={onAddOrder}
              className={cn(
                "flex-1 h-12 sm:h-14 font-bold rounded-xl shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm sm:text-base",
                isHistorical 
                  ? "bg-warning-500 text-carbon-900 hover:bg-warning-600" 
                  : "bg-sage-600 text-white hover:bg-sage-700"
              )}
            >
              {isHistorical ? (
                <>
                  <Zap className="w-5 h-5 fill-current" />
                  <span>Ingreso Rápido</span>
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  <span>Agregar a la orden</span>
                </>
              )}
              <span className={cn(
                "px-2 py-0.5 rounded text-xs sm:text-sm font-bold",
                isHistorical ? "bg-carbon-900/10" : "bg-white/20"
              )}>
                ${Number(currentOrderTotal).toLocaleString("es-CO")}
              </span>
            </button>
          ) : (
            ordersCount > 0 && (
              <button
                onClick={onShowSummary}
                className="flex-1 h-12 sm:h-14 bg-carbon-900 text-white font-bold rounded-xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-between px-6 text-sm sm:text-base hover:bg-carbon-800"
              >
                <div className="flex items-center gap-2">
                  <ReceiptText className="w-4 h-4 sm:w-5 sm:h-5 text-sage-400" />
                  <span>Confirmar {isHistorical ? "Ingreso" : `Mesa (${ordersCount})`}</span>
                </div>
                <span className="font-bold tracking-tight">${Number(tableTotal).toLocaleString("es-CO")}</span>
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}

import { cn } from "@/utils/cn";
export default FixedOrderSummaryBar;
