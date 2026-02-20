/**
 * OrdersListPanel Component
 * Right column showing list of orders for the table
 */

import { Card, Button } from "@/components";
import { cn } from "@/utils/cn";
import { Receipt, ShoppingBag, Edit2, Trash2 } from "lucide-react";
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
      className="overflow-hidden rounded-2xl h-fit sticky top-6"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-sage-600 to-sage-500 px-4 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Receipt className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-white font-semibold text-xl">
                {isDineIn ? "Pedidos Mesa" : "Pedidos"}
              </h2>
              <p className="text-sage-100 text-sm">{orders.length} items</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-white">
              ${tableTotal.toLocaleString("es-CO")}
            </p>
            <p className="text-sage-100 text-xs">Total</p>
          </div>
        </div>
      </div>

      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3 max-h-[60vh] lg:max-h-[calc(100vh-400px)] overflow-y-auto">
        {orders.length === 0 ? (
          <div className="text-center py-8 sm:py-12 px-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-sage-100 text-sage-400 flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <ShoppingBag className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <p className="text-carbon-700 font-medium text-sm sm:text-base">
              No hay pedidos
            </p>
            <p className="text-xs sm:text-sm text-carbon-500 mt-1">
              Agrega el primer pedido
            </p>
          </div>
        ) : (
          orders.map((order, index) => (
            <div
              key={order.id}
              className={cn(
                "p-3 sm:p-4 rounded-xl border-2 transition-all duration-200",
                currentOrderIndex === index
                  ? "border-amber-400 bg-amber-50 shadow-md"
                  : "border-sage-200 bg-white hover:border-sage-300 hover:shadow-sm",
              )}
            >
              <div className="flex items-start justify-between mb-2 sm:mb-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-sage-100 to-sage-200 text-sage-700 flex items-center justify-center font-bold text-xs sm:text-base">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-bold text-carbon-900 text-sm sm:text-base">
                      {order.protein ? order.protein.name : "Productos sueltos"}
                    </p>
                    <p className="text-xs sm:text-sm text-sage-700 font-semibold">
                      ${order.total.toLocaleString("es-CO")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-0 sm:gap-1">
                  <button
                    onClick={() => onEdit(index)}
                    className="p-2 sm:p-3 text-carbon-400 hover:text-sage-600 hover:bg-sage-100 rounded-lg sm:rounded-xl transition-colors"
                    title="Editar"
                  >
                    <Edit2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button
                    onClick={() => onDuplicate(index)}
                    className="p-2 sm:p-3 text-carbon-400 hover:text-sage-600 hover:bg-sage-100 rounded-lg sm:rounded-xl transition-colors"
                    title="Duplicar"
                  >
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => onRemove(index)}
                    className="p-2 sm:p-3 text-carbon-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg sm:rounded-xl transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>

              {/* Order details */}
              <div className="flex flex-wrap gap-1.5 sm:gap-2 text-[10px] sm:text-xs ml-10 sm:ml-13">
                {order.looseItems.length > 0 && (
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full font-medium">
                    {order.looseItems.reduce((sum, i) => sum + i.quantity, 0)}{" "}
                    extras
                  </span>
                )}
                {order.notes && (
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full font-medium italic truncate max-w-[150px] sm:max-w-none">
                    Nota: {order.notes}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Confirm button */}
      {orders.length > 0 && (
        <div className="p-4 border-t border-sage-200 bg-sage-50">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={onShowSummary}
            disabled={isPending}
            className="min-h-[64px] rounded-xl text-lg"
          >
            <Receipt className="w-6 h-6 mr-2" />
            Ver Resumen
            <span className="ml-2 opacity-90">
              (${tableTotal.toLocaleString("es-CO")})
            </span>
          </Button>
        </div>
      )}
    </Card>
  );
}
