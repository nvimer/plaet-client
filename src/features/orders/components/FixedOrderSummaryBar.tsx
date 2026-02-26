import { ShoppingBag, Receipt } from "lucide-react";
import { cn } from "@/utils/cn";

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
}

export function FixedOrderSummaryBar({
  looseItems,
  currentOrderTotal = 0,
  tableTotal = 0,
  hasProtein = false,
  currentProteinName,
  onAddOrder,
  onShowSummary,
  scrollToOrder,
  ordersCount = 0,
}: FixedOrderSummaryBarProps) {
  const currentItemCount = looseItems.reduce((sum, item) => sum + item.quantity, 0);
  const hasCurrentOrder = currentItemCount > 0 || hasProtein;

  if (!hasCurrentOrder && ordersCount === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pb-[env(safe-area-inset-bottom)] bg-white border-t border-sage-200 shadow-[0_-8px_30px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden">
      {/* 1. Mini Status Bar (Visible solo si hay pedidos confirmados Y estamos agregando uno nuevo) */}
      {ordersCount > 0 && hasCurrentOrder && (
        <div 
          className="bg-carbon-900 text-white px-4 py-1.5 flex items-center justify-between cursor-pointer active:bg-carbon-800 transition-colors border-b border-carbon-800"
          onClick={onShowSummary}
        >
          <div className="flex items-center gap-2">
            <Receipt className="w-3.5 h-3.5 text-sage-400" />
            <span className="text-[10px] font-black uppercase tracking-wider">Mesa: {ordersCount} servicios</span>
          </div>
          <span className="text-xs font-black tracking-tight">${tableTotal.toLocaleString("es-CO")}</span>
        </div>
      )}

      {/* 2. Main Action Container */}
      <div className="p-3 bg-white/95 flex gap-2">
        {hasCurrentOrder ? (
          <button
            onClick={onAddOrder}
            className="flex-1 h-12 bg-sage-600 text-white font-bold rounded-xl shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm"
          >
            <span>Agregar a la orden</span>
            <span className="bg-white/20 px-1.5 py-0.5 rounded text-[11px] font-black">
              ${currentOrderTotal.toLocaleString("es-CO")}
            </span>
          </button>
        ) : (
          ordersCount > 0 && (
            <button
              onClick={onShowSummary}
              className="flex-1 h-12 bg-carbon-900 text-white font-bold rounded-xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-between px-4 text-sm"
            >
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-sage-400" />
                <span>Confirmar Mesa ({ordersCount})</span>
              </div>
              <span className="font-black">${tableTotal.toLocaleString("es-CO")}</span>
            </button>
          )
        )}
      </div>
    </div>
  );
}

export default FixedOrderSummaryBar;
