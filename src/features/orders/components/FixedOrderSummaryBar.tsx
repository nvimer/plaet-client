import { ShoppingBag } from "lucide-react";

interface LooseItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface FixedOrderSummaryBarProps {
  looseItems: LooseItem[];
  total: number;
  hasProtein?: boolean;
  currentProteinName?: string;
  onOrder: () => void;
  scrollToOrder: () => void;
}

export function FixedOrderSummaryBar({
  looseItems,
  total,
  hasProtein = false,
  currentProteinName,
  onOrder,
  scrollToOrder,
}: FixedOrderSummaryBarProps) {
  const itemCount = looseItems.reduce((sum, item) => sum + item.quantity, 0);

  if (itemCount === 0 && !hasProtein) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pb-[env(safe-area-inset-bottom)] bg-white">
      {/* Bottom bar */}
      <div className="bg-white border-t border-sage-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
        {/* Clickable summary row */}
        <button
          onClick={scrollToOrder}
          className="w-full px-4 py-3 sm:py-4 flex items-center justify-between active:bg-sage-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            {/* Items badge */}
            <div className="relative">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-sage-100 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-sage-700" />
              </div>
              {(itemCount > 0 || hasProtein) && (
                <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-rose-500 flex items-center justify-center shadow-md border-2 border-white">
                  <span className="text-[10px] sm:text-xs font-bold text-white">
                    {itemCount + (hasProtein ? 1 : 0)}
                  </span>
                </div>
              )}
            </div>

            {/* Text */}
            <div className="text-left min-w-0">
              <p className="text-sm font-bold text-carbon-900 truncate max-w-[120px] sm:max-w-none">
                {hasProtein
                  ? currentProteinName || "Almuerzo"
                  : `${itemCount} productos`}
              </p>
              <p className="text-[10px] sm:text-xs text-carbon-500 flex items-center gap-1">
                {itemCount > 0 && hasProtein
                  ? `+ ${itemCount} extras`
                  : "Tu pedido actual"}
              </p>
            </div>
          </div>

          {/* Price and button */}
          <div className="flex items-center gap-2 sm:gap-4">
            <p className="text-lg sm:text-xl font-black text-sage-800 whitespace-nowrap">
              ${total.toLocaleString("es-CO")}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOrder();
              }}
              className="px-5 sm:px-8 py-2.5 sm:py-3 bg-sage-600 text-white font-bold rounded-xl shadow-lg hover:bg-sage-700 active:scale-95 transition-all text-sm sm:text-base whitespace-nowrap"
            >
              ORDENAR
            </button>
          </div>
        </button>
      </div>
    </div>
  );
}

export default FixedOrderSummaryBar;
