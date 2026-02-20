import { Card } from "@/components";
import { cn } from "@/utils/cn";
import {
  Utensils,
  Plus,
  ArrowRightLeft,
  ShoppingBag,
  Copy,
} from "lucide-react";

/**
 * OrderItem
 */
interface OrderItem {
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  type: "base" | "protein" | "substitution" | "additional";
}

/**
 * OrderSummary Props
 */
export interface OrderSummaryProps {
  items: OrderItem[];
  total: number;
  onDuplicate?: () => void;
  className?: string;
}

/**
 * OrderSummary Component
 *
 * Muestra el desglose detallado del pedido con todos los items,
 * sustituciones y adicionales. Incluye botón para duplicar el pedido.
 *
 * @example
 * ```tsx
 * <OrderSummary
 *   items={[
 *     { name: "Almuerzo completo", quantity: 1, unitPrice: 10000, totalPrice: 10000, type: "base" },
 *     { name: "Carne a la plancha", quantity: 1, unitPrice: 10000, totalPrice: 10000, type: "protein" },
 *     { name: "Sust: Sopa → Principio", quantity: 1, unitPrice: 0, totalPrice: 0, type: "substitution" },
 *     { name: "Huevo adicional", quantity: 1, unitPrice: 2000, totalPrice: 2000, type: "additional" },
 *   ]}
 *   total={12000}
 *   onDuplicate={handleDuplicate}
 * />
 * ```
 */
export function OrderSummary({
  items,
  total,
  onDuplicate,
  className,
}: OrderSummaryProps) {
  const baseItem = items.find((i) => i.type === "base");
  const proteinItem = items.find((i) => i.type === "protein");
  const substitutions = items.filter((i) => i.type === "substitution");
  const additionals = items.filter((i) => i.type === "additional");

  return (
    <Card className={cn("overflow-hidden", className)}>
      {/* Header */}
      <div className="bg-gradient-to-r from-sage-600 to-sage-500 px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold text-base sm:text-lg flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Resumen del Pedido
          </h3>
          {onDuplicate && (
            <button
              onClick={onDuplicate}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Copy className="w-4 h-4" />
              Duplicar
            </button>
          )}
        </div>
      </div>

      {/* Items */}
      <div className="p-4 space-y-3">
        {/* Base + Protein */}
        {(baseItem || proteinItem) && (
          <div className="p-3 bg-sage-50 rounded-xl border border-sage-200">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-sage-100 flex items-center justify-center">
                <Utensils className="w-5 h-5 text-sage-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-carbon-900">
                  Almuerzo Completo
                </p>
                {proteinItem && (
                  <p className="text-sm text-carbon-600">
                    Proteína: {proteinItem.name}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="font-bold text-lg text-sage-700">
                  $
                  {(
                    baseItem?.totalPrice ||
                    proteinItem?.totalPrice ||
                    0
                  ).toLocaleString("es-CO")}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Substitutions */}
        {substitutions.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-carbon-500 uppercase tracking-wide flex items-center gap-1">
              <ArrowRightLeft className="w-3 h-3" />
              Sustituciones (sin costo)
            </p>
            {substitutions.map((sub, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2.5 bg-amber-50 rounded-lg border border-amber-200"
              >
                <span className="text-sm text-carbon-700">{sub.name}</span>
                <span className="text-sm font-medium text-amber-700">
                  Sin costo
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Additionals */}
        {additionals.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-carbon-500 uppercase tracking-wide flex items-center gap-1">
              <Plus className="w-3 h-3" />
              Adicionales
            </p>
            {additionals.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-sage-200"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-carbon-900">
                    {item.name}
                  </span>
                  {item.quantity > 1 && (
                    <span className="text-xs text-carbon-500">
                      x{item.quantity}
                    </span>
                  )}
                </div>
                <span className="text-sm font-semibold text-sage-700">
                  ${item.totalPrice.toLocaleString("es-CO")}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {items.length === 0 && (
          <div className="text-center py-6 text-carbon-500">
            <p className="text-sm">No hay items en el pedido</p>
            <p className="text-xs mt-1">
              Selecciona una proteína para comenzar
            </p>
          </div>
        )}
      </div>

      {/* Total */}
      {items.length > 0 && (
        <div className="border-t border-sage-200 p-4 bg-sage-50/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-carbon-600">Total del pedido</p>
              <p className="text-xs text-carbon-500">
                {items.reduce((sum, i) => sum + i.quantity, 0)} items
              </p>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-sage-700">
              ${total.toLocaleString("es-CO")}
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}
