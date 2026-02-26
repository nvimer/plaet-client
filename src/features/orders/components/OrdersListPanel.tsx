/**
 * OrdersListPanel Component
 * Right column showing list of orders for the table
 */

import { Card, Button } from "@/components";
import { cn } from "@/utils/cn";
import { Receipt, ShoppingBag, Edit2, Trash2, PackagePlus, Info, Check } from "lucide-react";
import type { TableOrder } from "../types/orderBuilder";

interface OrdersListPanelProps {
  orders: TableOrder[];
  currentOrderIndex: number | null;
  tableTotal: number;
  isDineIn: boolean;
  isPending: boolean;
  onEdit: (index: number) => void;
  onRemove: (index: number) => void;
  onDuplicate: (index: number) => void;
  onShowSummary: () => void;
}

export function OrdersListPanel({
  orders,
  currentOrderIndex,
  tableTotal,
  isDineIn,
  isPending,
  onEdit,
  onRemove,
  onDuplicate,
  onShowSummary,
}: OrdersListPanelProps) {
  return (
    <Card
      variant="elevated"
      className="overflow-hidden rounded-2xl sm:rounded-3xl h-fit sticky top-6 shadow-smooth-lg border-none flex flex-col max-h-[85vh] sm:max-h-[calc(100vh-40px)]"
    >
      {/* Professional Header - Matches OrderSummaryModal */}
      <div className="bg-gradient-to-br from-carbon-900 to-carbon-800 px-5 py-5 sm:px-6 sm:py-6 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/10 flex items-center justify-center shadow-inner">
              <Receipt className="w-5 h-5 sm:w-6 sm:h-6 text-sage-400" />
            </div>
            <div>
              <h2 className="text-white font-semibold text-lg sm:text-xl tracking-tight">
                {isDineIn ? "Pedidos Mesa" : "Pedidos"}
              </h2>
              <p className="text-carbon-400 text-[10px] sm:text-xs font-semibold uppercase tracking-widest mt-0.5">
                {orders.length} {orders.length === 1 ? 'servicio' : 'servicios'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              ${tableTotal.toLocaleString("es-CO")}
            </p>
            <p className="text-carbon-400 text-[10px] sm:text-xs font-semibold uppercase tracking-widest mt-0.5">Total</p>
          </div>
        </div>
      </div>

      <div className="p-3 sm:p-5 space-y-3 sm:space-y-4 overflow-y-auto flex-1 bg-sage-50/30">
        {orders.length === 0 ? (
          <div className="text-center py-12 sm:py-16 px-4 flex flex-col items-center justify-center h-full">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-sage-100 text-sage-400 flex items-center justify-center mx-auto mb-4 sm:mb-5 shadow-inner">
              <ShoppingBag className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <p className="text-carbon-800 font-semibold text-base sm:text-lg tracking-tight">
              Aún no hay pedidos
            </p>
            <p className="text-sm text-carbon-500 mt-1 max-w-[200px] mx-auto">
              Configura el primer almuerzo o agrega productos a la orden.
            </p>
          </div>
        ) : (
          orders.map((order, index) => (
            <div
              key={order.id}
              className={cn(
                "p-4 rounded-2xl border-2 transition-all duration-300 relative group overflow-hidden",
                currentOrderIndex === index
                  ? "border-warning-400 bg-warning-50 shadow-md"
                  : "border-sage-200 bg-white hover:border-sage-400 hover:shadow-soft-md",
              )}
            >
              {/* Editing Indicator Strip */}
              {currentOrderIndex === index && (
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-warning-400" />
              )}

              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="flex items-start gap-3">
                  <span className={cn(
                    "w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-bold text-xs sm:text-sm shadow-sm flex-shrink-0 mt-0.5",
                    currentOrderIndex === index 
                      ? "bg-warning-500 text-white" 
                      : "bg-carbon-900 text-white"
                  )}>
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-bold text-carbon-900 text-sm sm:text-base tracking-tight leading-tight">
                      {order.protein 
                        ? order.protein.name 
                        : order.looseItems.length > 0 
                          ? order.looseItems[0].name + (order.looseItems.length > 1 ? ` (+${order.looseItems.length - 1})` : "")
                          : "Productos sueltos"}
                    </p>
                    <p className={cn(
                      "text-sm font-semibold mt-0.5",
                      currentOrderIndex === index ? "text-warning-700" : "text-sage-600"
                    )}>
                      ${order.total.toLocaleString("es-CO")}
                    </p>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-1 sm:gap-1.5 -mt-1 -mr-1">
                  <button
                    onClick={() => onEdit(index)}
                    className={cn(
                      "p-2 sm:p-2.5 rounded-xl transition-all active:scale-90",
                      currentOrderIndex === index 
                        ? "text-warning-600 bg-warning-100 hover:bg-warning-200" 
                        : "text-carbon-400 hover:text-sage-600 hover:bg-sage-100"
                    )}
                    title="Editar"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDuplicate(index)}
                    className="p-2 sm:p-2.5 text-carbon-400 hover:text-sage-600 hover:bg-sage-100 rounded-xl transition-all active:scale-90"
                    title="Duplicar"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => onRemove(index)}
                    className="p-2 sm:p-2.5 text-carbon-400 hover:text-error-500 hover:bg-error-50 rounded-xl transition-all active:scale-90"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Order Context Tags */}
              <div className="flex flex-col gap-1.5 ml-11 sm:ml-13">
                {order.looseItems.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    <PackagePlus className="w-3.5 h-3.5 text-info-500" />
                    <span className="text-[11px] font-medium text-info-700">
                      {order.looseItems.reduce((sum, i) => sum + i.quantity, 0)} extras adicionados
                    </span>
                  </div>
                )}
                {order.notes && (
                  <div className="flex items-start gap-1.5 mt-0.5">
                    <Info className="w-3.5 h-3.5 text-warning-600 flex-shrink-0 mt-0.5" />
                    <span className="text-[11px] font-medium text-warning-800 line-clamp-2">
                      {order.notes}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer / Confirm button */}
      {orders.length > 0 && (
        <div className="p-4 sm:p-5 border-t border-sage-200 bg-white flex-shrink-0">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={onShowSummary}
            disabled={isPending}
            className="h-14 sm:h-16 rounded-2xl text-base sm:text-lg font-bold bg-carbon-900 hover:bg-carbon-800 text-white shadow-xl shadow-carbon-200"
          >
            <Check className="w-5 h-5 mr-2 stroke-[3px]" />
            Ver Resumen
            <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-lg text-sm">
              ${tableTotal.toLocaleString("es-CO")}
            </span>
          </Button>
        </div>
      )}
    </Card>
  );
}