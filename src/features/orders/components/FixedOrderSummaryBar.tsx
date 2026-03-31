import { ReceiptText, Plus, ArrowRight } from "lucide-react";

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
  ordersCount = 0,
}: FixedOrderSummaryBarProps) {
  const currentItemCount = looseItems.reduce((sum, item) => sum + item.quantity, 0);
  const hasCurrentOrder = currentItemCount > 0 || hasProtein;

  if (!hasCurrentOrder && ordersCount === 0) {
    return null;
  }

  return (
    <div className="bg-white border-t-2 border-sage-200 shadow-[0_-8px_40px_rgba(0,0,0,0.12)] flex flex-col overflow-hidden pb-[env(safe-area-inset-bottom)] w-full">
      {/* 1. Mini Status Bar (Visible solo si hay pedidos confirmados Y estamos agregando uno nuevo) */}
      {ordersCount > 0 && hasCurrentOrder && (
        <div 
          className="bg-gradient-to-r from-carbon-900 to-carbon-800 text-white cursor-pointer active:opacity-90 transition-opacity w-full"
          onClick={onShowSummary}
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between w-full">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center">
                <ReceiptText className="w-3.5 h-3.5 text-warning-400" />
              </div>
              <span className="text-xs font-semibold tracking-wide">Mesa: {ordersCount} {ordersCount === 1 ? 'servicio' : 'servicios'}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-black tracking-tight">${Number(tableTotal).toLocaleString("es-CO")}</span>
              <ArrowRight className="w-4 h-4 text-white/50" />
            </div>
          </div>
        </div>
      )}

      {/* 2. Main Action Container */}
      <div className="w-full bg-white">
        <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-3 flex gap-2.5 sm:gap-3 w-full">
          {hasCurrentOrder ? (
            <button
              onClick={onAddOrder}
              className="flex-1 h-12 sm:h-14 bg-gradient-to-r from-sage-600 to-sage-700 text-white font-bold rounded-2xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-between px-4 sm:px-6 text-sm sm:text-base hover:shadow-xl hover:from-sage-500 hover:to-sage-600"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-xs sm:text-sm font-semibold leading-tight">Agregar a la orden</span>
                  {hasProtein && currentProteinName && (
                    <span className="text-[10px] text-white/70 font-medium">{currentProteinName}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-white/20 px-2.5 py-1 rounded-lg text-xs sm:text-sm font-black">
                  ${Number(currentOrderTotal).toLocaleString("es-CO")}
                </span>
              </div>
            </button>
          ) : (
            ordersCount > 0 && (
              <button
                onClick={onShowSummary}
                className="flex-1 h-12 sm:h-14 bg-gradient-to-r from-carbon-900 to-carbon-800 text-white font-bold rounded-2xl shadow-xl active:scale-[0.98] transition-all flex items-center justify-between px-4 sm:px-6 text-sm sm:text-base hover:shadow-2xl hover:from-carbon-800 hover:to-carbon-700"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <ReceiptText className="w-5 h-5 sm:w-6 sm:h-6 text-sage-400" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-semibold">Confirmar Mesa</span>
                    <span className="text-[10px] text-white/60">{ordersCount} {ordersCount === 1 ? 'pedido' : 'pedidos'}</span>
                  </div>
                </div>
                <span className="font-black tracking-tight text-base">${Number(tableTotal).toLocaleString("es-CO")}</span>
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}

