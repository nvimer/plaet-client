/**
 * OrderSummaryModal Component
 * Modal displaying order summary before confirmation
 */

import { Button } from "@/components";
import { X, Check, Receipt } from "lucide-react";
import type { TableOrder } from "../types/orderBuilder";
import { OrderType } from "@/types";

interface OrderSummaryModalProps {
  isOpen: boolean;
  orders: TableOrder[];
  tableTotal: number;
  orderType: OrderType;
  tableId: number | null;
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function OrderSummaryModal({
  isOpen,
  orders,
  tableTotal,
  orderType,
  tableId,
  isPending,
  onClose,
  onConfirm,
}: OrderSummaryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl max-w-2xl w-full h-auto max-h-[92vh] sm:max-h-[90vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-sage-600 to-sage-500 px-4 py-3 sm:px-6 sm:py-5 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Receipt className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h2 className="text-white font-bold text-base sm:text-xl">
                  Confirmar Pedido
                </h2>
                <p className="text-sage-100 text-[10px] sm:text-sm">
                  {orderType === OrderType.DINE_IN
                    ? `Mesa ${tableId} • ${orders.length} items`
                    : `Para Llevar • ${orders.length} items`}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg sm:rounded-xl text-white transition-colors"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-6 overflow-y-auto flex-1">
          <div className="space-y-3 sm:space-y-4">
            {orders.map((order, index) => (
              <div
                key={order.id}
                className="p-3 sm:p-4 bg-sage-50 rounded-xl border border-sage-200"
              >
                <div className="flex items-start justify-between mb-2 sm:mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-sage-200 text-sage-700 flex items-center justify-center font-bold text-xs sm:text-sm">
                      {index + 1}
                    </span>
                    <span className="font-bold text-sm sm:text-base text-carbon-900 truncate max-w-[180px] sm:max-w-none">
                      {order.protein
                        ? `Almuerzo ${order.protein.name}`
                        : "Productos sueltos"}
                    </span>
                  </div>
                  <span className="font-bold text-sm sm:text-base text-sage-700">
                    ${order.total.toLocaleString("es-CO")}
                  </span>
                </div>

                {/* Detailed lunch breakdown - More compact */}
                {order.lunch && (
                  <div className="ml-9 mb-2 p-2 sm:p-3 bg-white/60 rounded-lg border border-sage-200/50">
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] sm:text-sm">
                      {order.lunch.rice && (
                        <div className="flex items-center gap-1.5">
                          <span className="opacity-80">🍚</span>
                          <span className="text-carbon-600 truncate">
                            {order.lunch.rice.name}
                          </span>
                        </div>
                      )}
                      {order.lunch.soup && (
                        <div className="flex items-center gap-1.5">
                          <span className="opacity-80">🍲</span>
                          <span className="text-carbon-600 truncate">
                            {order.lunch.soup.name}
                          </span>
                        </div>
                      )}
                      {order.lunch.principle && (
                        <div className="flex items-center gap-1.5">
                          <span className="opacity-80">🥔</span>
                          <span className="text-carbon-600 truncate">
                            {order.lunch.principle.name}
                          </span>
                        </div>
                      )}
                      {order.lunch.salad && (
                        <div className="flex items-center gap-1.5">
                          <span className="opacity-80">🥗</span>
                          <span className="text-carbon-600 truncate">
                            {order.lunch.salad.name}
                          </span>
                        </div>
                      )}
                      {order.lunch.drink && (
                        <div className="flex items-center gap-1.5">
                          <span className="opacity-80">🥤</span>
                          <span className="text-carbon-600 truncate">
                            {order.lunch.drink.name}
                          </span>
                        </div>
                      )}
                      {order.lunch.extra && (
                        <div className="flex items-center gap-1.5">
                          <span className="opacity-80">🍌</span>
                          <span className="text-carbon-600 truncate">
                            {order.lunch.extra.name}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Replacements */}
                    {order.lunch.replacements.length > 0 && (
                      <div className="mt-1.5 pt-1.5 border-t border-sage-100">
                        <div className="space-y-0.5">
                          {order.lunch.replacements.map((r) => (
                            <p
                              key={r.id}
                              className="text-[10px] sm:text-xs text-carbon-500 italic"
                            >
                              Reemplazo: No {r.fromName} → {r.itemName}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="ml-9 space-y-1 text-[11px] sm:text-sm text-carbon-500">
                  {order.looseItems.length > 0 && (
                    <p className="flex flex-wrap gap-1">
                      <span className="font-medium text-carbon-700">
                        Extras:
                      </span>
                      {order.looseItems
                        .map((i) => `${i.name} (x${i.quantity})`)
                        .join(", ")}
                    </p>
                  )}
                  {order.notes && (
                    <p className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100 mt-1">
                      📝 {order.notes}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Total Section - Compact */}
          <div className="mt-4 p-3 sm:p-4 bg-gradient-to-r from-sage-100 to-sage-50 rounded-xl border-2 border-sage-300">
            <div className="flex items-center justify-between">
              <span className="text-base sm:text-lg font-bold text-carbon-900">
                Total a Pagar
              </span>
              <span className="text-2xl sm:text-3xl font-black text-sage-700">
                ${tableTotal.toLocaleString("es-CO")}
              </span>
            </div>
          </div>
        </div>

        {/* Actions - Responsive height */}
        <div className="p-4 sm:p-6 border-t border-sage-200 bg-white sm:bg-sage-50 flex-shrink-0">
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="lg"
              fullWidth
              onClick={onClose}
              className="min-h-[50px] sm:min-h-[56px] text-sm sm:text-base"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Cancelar
            </Button>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={onConfirm}
              disabled={isPending}
              isLoading={isPending}
              className="min-h-[50px] sm:min-h-[56px] text-sm sm:text-base shadow-lg shadow-sage-200"
            >
              <Check className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Confirmar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
