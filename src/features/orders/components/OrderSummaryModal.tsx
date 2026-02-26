/**
 * OrderSummaryModal Component
 * Modal displaying order summary before confirmation
 */

import { Button } from "@/components";
import { X, Check, Receipt, Soup, Salad, CupSoda, IceCream, Utensils, CircleOff, ArrowRightLeft, Info, PackagePlus } from "lucide-react";
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
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-carbon-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl max-w-2xl w-full h-[90vh] sm:h-auto sm:max-h-[90vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300">
        {/* Header - Fixed Height */}
        <div className="bg-gradient-to-br from-carbon-900 to-carbon-800 px-6 py-5 sm:py-6 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shadow-inner">
                <Receipt className="w-6 h-6 text-sage-400" />
              </div>
              <div>
                <h2 className="text-white font-semibold text-lg sm:text-2xl tracking-tight">
                  Revisar Pedido
                </h2>
                <p className="text-carbon-400 text-xs sm:text-sm font-medium tracking-wide">
                  {orderType === OrderType.DINE_IN
                    ? `Mesa ${tableId} • ${orders.length} servicios`
                    : `Para Llevar • ${orders.length} servicios`}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-carbon-400 hover:text-white transition-all active:scale-90"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="p-4 sm:p-8 overflow-y-auto flex-1 bg-sage-50/30">
          <div className="space-y-4 sm:space-y-6">
            {orders.map((order, index) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl border-2 border-sage-100 shadow-sm overflow-hidden"
              >
                {/* Order Item Header */}
                <div className="p-4 sm:p-5 border-b border-sage-50 flex items-start justify-between bg-white">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-carbon-900 text-white flex items-center justify-center font-semibold text-xs">
                      {index + 1}
                    </span>
                    <h3 className="font-semibold text-base sm:text-lg text-carbon-900">
                      {order.protein
                        ? `Almuerzo ${order.protein.name}`
                        : order.looseItems.length > 0
                          ? order.looseItems[0].name + (order.looseItems.length > 1 ? ` (+${order.looseItems.length - 1})` : "")
                          : "Productos a la Carta"}
                    </h3>
                  </div>
                  <span className="font-semibold text-base sm:text-xl text-sage-600">
                    ${order.total.toLocaleString("es-CO")}
                  </span>
                </div>

                {/* Specific Details */}
                <div className="p-4 sm:p-5 space-y-4">
                  {order.lunch && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                      {order.lunch.soup && (
                        <div className="flex items-center gap-2 text-carbon-600 font-medium">
                          <Soup className="w-4 h-4 text-amber-500" />
                          <span className="truncate">{order.lunch.soup.name}</span>
                        </div>
                      )}
                      {order.lunch.principle && (
                        <div className="flex items-center gap-2 text-carbon-600 font-medium">
                          <Utensils className="w-4 h-4 text-emerald-500" />
                          <span className="truncate">{order.lunch.principle.name}</span>
                        </div>
                      )}
                      {order.lunch.salad && (
                        <div className="flex items-center gap-2 text-carbon-600 font-medium">
                          <Salad className="w-4 h-4 text-lime-500" />
                          <span className="truncate">{order.lunch.salad.name}</span>
                        </div>
                      )}
                      {order.lunch.drink && (
                        <div className="flex items-center gap-2 text-carbon-600 font-medium">
                          <CupSoda className="w-4 h-4 text-blue-500" />
                          <span className="truncate">{order.lunch.drink.name}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Enhanced Replacements & Extras Notes */}
                  <div className="space-y-2">
                    {order.lunch?.replacements && order.lunch.replacements.length > 0 && (
                      <div className="bg-amber-50/50 rounded-2xl p-3 border border-amber-100">
                        <div className="flex items-center gap-2 mb-1.5">
                          <ArrowRightLeft className="w-3.5 h-3.5 text-amber-600" />
                          <span className="text-[10px] font-semibold tracking-wide text-amber-700">Cambios Solicitados</span>
                        </div>
                        <div className="space-y-1">
                          {order.lunch.replacements.map((r) => (
                            <div key={r.id} className="flex items-center gap-2 text-[11px] text-amber-800 font-medium">
                              <CircleOff className="w-3 h-3 opacity-50" />
                              <span>Sin {r.fromName}</span>
                              <ArrowRightLeft className="w-3 h-3 opacity-30" />
                              <span className="font-bold">{r.itemName}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {order.looseItems.length > 0 && (
                      <div className="bg-sage-50/50 rounded-2xl p-3 border border-sage-100">
                        <div className="flex items-center gap-2 mb-1.5">
                          <PackagePlus className="w-3.5 h-3.5 text-sage-600" />
                          <span className="text-[10px] font-semibold tracking-wide text-sage-700">Adiciones / Extras</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {order.looseItems.map((i) => (
                            <span key={i.id} className="px-2 py-1 bg-white rounded-lg border border-sage-200 text-[11px] font-bold text-carbon-700">
                              {i.name} <span className="text-sage-500 ml-1">x{i.quantity}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {order.notes && (
                      <div className="flex gap-2 p-3 bg-carbon-50 rounded-2xl border border-carbon-100">
                        <Info className="w-4 h-4 text-carbon-400 shrink-0" />
                        <p className="text-[11px] sm:text-xs text-carbon-600 leading-relaxed font-medium">
                          {order.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Total & Actions - Fixed Bottom */}
        <div className="px-6 py-6 sm:px-8 border-t border-carbon-100 bg-white shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm font-bold text-carbon-400 tracking-wide">Total del Pedido</span>
            <span className="text-3xl sm:text-4xl font-semibold text-carbon-900 tracking-tight">
              ${tableTotal.toLocaleString("es-CO")}
            </span>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="ghost"
              size="lg"
              fullWidth
              onClick={onClose}
              className="rounded-2xl h-14 sm:h-16 font-bold text-carbon-500 hover:bg-carbon-50"
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={onConfirm}
              disabled={isPending}
              isLoading={isPending}
              className="rounded-2xl h-14 sm:h-16 bg-carbon-900 hover:bg-carbon-800 text-white font-semibold shadow-xl shadow-carbon-200"
            >
              <Check className="w-5 h-5 mr-2 stroke-[3px]" />
              Confirmar Orden
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
