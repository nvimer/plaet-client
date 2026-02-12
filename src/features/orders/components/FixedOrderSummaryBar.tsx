import { ChevronUp, ShoppingBag } from "lucide-react";

interface LooseItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface FixedOrderSummaryBarProps {
  looseItems: LooseItem[];
  total: number;
  onOrder: () => void;
  scrollToOrder: () => void;
}

export function FixedOrderSummaryBar({
  looseItems,
  total,
  onOrder,
  scrollToOrder,
}: FixedOrderSummaryBarProps) {
  const itemCount = looseItems.reduce((sum, item) => sum + item.quantity, 0);

  if (itemCount === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 safe-area-inset-bottom">
      {/* Bottom bar */}
      <div className="bg-white border-t border-sage-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
        {/* Clickable summary row */}
        <button
          onClick={scrollToOrder}
          className="w-full px-4 py-4 flex items-center justify-between active:bg-sage-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            {/* Items badge */}
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-sage-100 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-sage-700" />
              </div>
              {itemCount > 0 && (
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center shadow-md">
                  <span className="text-xs font-bold text-white">{itemCount}</span>
                </div>
              )}
            </div>
            
            {/* Text */}
            <div className="text-left">
              <p className="text-sm font-medium text-carbon-700">
                {itemCount} {itemCount === 1 ? "producto" : "productos"}
              </p>
              <p className="text-xs text-carbon-400 flex items-center gap-1">
                <ChevronUp className="w-3 h-3" />
                Tu pedido
              </p>
            </div>
          </div>

          {/* Price and button */}
          <div className="flex items-center gap-3">
            <p className="text-xl font-black text-sage-800">
              ${total.toLocaleString()}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOrder();
              }}
              className="px-6 py-3 bg-sage-600 text-white font-bold rounded-xl shadow-lg hover:bg-sage-700 active:scale-95 transition-all"
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
