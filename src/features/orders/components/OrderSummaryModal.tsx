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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-sage-600 to-sage-500 px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Receipt className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-white font-semibold text-xl">Resumen del Pedido</h2>
                <p className="text-sage-100 text-sm">
                  {orderType === OrderType.DINE_IN ? `Mesa ${tableId}` : 'Pedido'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-xl text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="space-y-4">
            {orders.map((order, index) => (
              <div key={order.id} className="p-4 bg-sage-50 rounded-xl border border-sage-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-sage-200 text-sage-700 flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </span>
                    <span className="font-bold text-carbon-900">
                      {order.protein ? `Almuerzo ${order.protein.name}` : "Productos sueltos"}
                    </span>
                  </div>
                  <span className="font-bold text-sage-700">
                    ${order.total.toLocaleString("es-CO")}
                  </span>
                </div>
                
                {/* Detailed lunch breakdown */}
                {order.lunch && (
                  <div className="ml-10 mb-3 p-3 bg-white rounded-lg border border-sage-200">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {order.lunch.rice && (
                        <div className="flex items-center gap-1">
                          <span>🍚</span>
                          <span className="text-carbon-600">{order.lunch.rice.name}</span>
                        </div>
                      )}
                      {order.lunch.soup && (
                        <div className="flex items-center gap-1">
                          <span>🍲</span>
                          <span className="text-carbon-600">{order.lunch.soup.name}</span>
                        </div>
                      )}
                      {order.lunch.principle && (
                        <div className="flex items-center gap-1">
                          <span>🥔</span>
                          <span className="text-carbon-600">{order.lunch.principle.name}</span>
                        </div>
                      )}
                      {order.lunch.salad && (
                        <div className="flex items-center gap-1">
                          <span>🥗</span>
                          <span className="text-carbon-600">{order.lunch.salad.name}</span>
                        </div>
                      )}
                      {order.lunch.drink && (
                        <div className="flex items-center gap-1">
                          <span>🥤</span>
                          <span className="text-carbon-600">{order.lunch.drink.name}</span>
                        </div>
                      )}
                      {order.lunch.extra && (
                        <div className="flex items-center gap-1">
                          <span>🍌</span>
                          <span className="text-carbon-600">{order.lunch.extra.name}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Replacements */}
                    {order.lunch.replacements.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-sage-100">
                        <p className="text-xs font-medium text-emerald-600 mb-1">Reemplazos:</p>
                        <div className="space-y-1">
                          {order.lunch.replacements.map(r => (
                            <p key={r.id} className="text-xs text-carbon-500">
                              No {r.fromName} → {r.itemName}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="ml-10 space-y-1 text-sm text-carbon-600">
                  {order.looseItems.length > 0 && (
                    <p>Productos sueltos: {order.looseItems.map(i => 
                      `${i.name} (x${i.quantity})`
                    ).join(", ")}</p>
                  )}
                  {order.notes && (
                    <p className="text-amber-600 italic">Nota: {order.notes}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="mt-6 p-4 bg-gradient-to-r from-sage-100 to-sage-50 rounded-xl border-2 border-sage-300">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-carbon-900">Total</span>
              <span className="text-3xl font-bold text-sage-700">
                ${tableTotal.toLocaleString("es-CO")}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-sage-200 bg-sage-50">
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="lg"
              fullWidth
              onClick={onClose}
              className="min-h-[56px]"
            >
              <X className="w-5 h-5 mr-2" />
              Cancelar
            </Button>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={onConfirm}
              disabled={isPending}
              isLoading={isPending}
              className="min-h-[56px]"
            >
              <Check className="w-5 h-5 mr-2" />
              Confirmar Pedido
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
