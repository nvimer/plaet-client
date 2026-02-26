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
  currentOrderTotal,
  tableTotal,
  hasProtein = false,
  currentProteinName,
  onAddOrder,
  onShowSummary,
  scrollToOrder,
  ordersCount,
}: FixedOrderSummaryBarProps) {
  const currentItemCount = looseItems.reduce((sum, item) => sum + item.quantity, 0);
  const hasCurrentOrder = currentItemCount > 0 || hasProtein;

  if (!hasCurrentOrder && ordersCount === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pb-[env(safe-area-inset-bottom)] bg-white border-t border-sage-200 shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
      {/* 1. Botón de Agregar a la orden (Visible solo si hay un pedido en curso) */}
      {hasCurrentOrder && (
        <div className="p-4 bg-white/95 backdrop-blur-md">
          <button
            onClick={onAddOrder}
            className="w-full h-14 bg-sage-600 text-white font-bold rounded-2xl shadow-lg hover:bg-sage-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <span>Agregar a la Orden</span>
            <span className="bg-sage-700 px-2 py-1 rounded-lg text-sm">
              ${currentOrderTotal.toLocaleString("es-CO")}
            </span>
          </button>
        </div>
      )}

      {/* 2. Botón de Ver Resumen (Visible solo si hay pedidos confirmados en la mesa) */}
      {ordersCount > 0 && (
        <div className={cn(
          "p-4 bg-carbon-900 text-white flex items-center justify-between cursor-pointer active:bg-carbon-800 transition-colors",
          hasCurrentOrder ? "border-t border-carbon-800" : ""
        )}
        onClick={onShowSummary}
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Receipt className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shadow-md border-2 border-carbon-900">
                <span className="text-[10px] font-bold text-white">
                  {ordersCount}
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold tracking-wide">Ver Resumen</p>
              <p className="text-xs text-carbon-400 font-medium">Confirmar y enviar a cocina</p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-xl font-bold tracking-tight">
              ${tableTotal.toLocaleString("es-CO")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default FixedOrderSummaryBar;
