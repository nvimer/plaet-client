/**
 * GroupedOrderCard Component
 *
 * Displays a group of individual orders associated with the same table/time.
 * Hierarchical view: Order Group -> Individual Selections -> Items
 */

import {
  User,
  Clock,
  ChevronDown,
  ChevronUp,
  Receipt,
  Eye,
  ArrowRight,
  UtensilsCrossed,
  ChefHat,
} from "lucide-react";
import { useState } from "react";
import { Button, Card } from "@/components";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { OrderTypeBadge } from "./OrderTypeBadge";
import { cn } from "@/utils/cn";
import type { GroupedOrder } from "../pages/OrdersPage";
import { useUpdateOrderStatus } from "../hooks";
import { OrderStatus } from "@/types";

interface GroupedOrderCardProps {
  groupedOrder: GroupedOrder;
  onViewDetail: (orderId: string) => void;
}

/**
 * Calculate wait time and format it
 */
function getWaitTime(createdAt: string): {
  minutes: number;
  text: string;
  isUrgent: boolean;
} {
  const created = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - created.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) {
    return { minutes: 0, text: "Ahora", isUrgent: false };
  } else if (diffMinutes < 60) {
    return {
      minutes: diffMinutes,
      text: `${diffMinutes}m`,
      isUrgent: diffMinutes > 20,
    };
  } else {
    const hours = Math.floor(diffMinutes / 60);
    const mins = diffMinutes % 60;
    return {
      minutes: diffMinutes,
      text: `${hours}h ${mins}m`,
      isUrgent: true,
    };
  }
}

export function GroupedOrderCard({
  groupedOrder,
  onViewDetail,
}: GroupedOrderCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateOrderStatus();
  
  const waitTime = getWaitTime(groupedOrder.createdAt);
  
  const createdTime = new Date(groupedOrder.createdAt).toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const totalItems = groupedOrder.orders.reduce(
    (sum, order) => sum + (order.items?.length || 0),
    0
  );

  const pendingOrders = groupedOrder.orders.filter(o => o.status === OrderStatus.PENDING);
  const canSendToKitchen = pendingOrders.length > 0;

  const handleSendAllToKitchen = (e: React.MouseEvent) => {
    e.stopPropagation();
    pendingOrders.forEach(order => {
      updateStatus({ id: order.id, orderStatus: OrderStatus.IN_PREPARATION });
    });
  };

  return (
    <Card
      variant="elevated"
      className={cn(
        "overflow-hidden border-2 transition-all duration-300 rounded-3xl h-full flex flex-col",
        isExpanded ? "border-sage-300 shadow-soft-xl" : "border-sage-100 hover:border-sage-300 hover:shadow-soft-lg"
      )}
    >
      {/* Header: Table Info & Group Stats */}
      <div 
        className={cn(
          "p-5 cursor-pointer transition-colors duration-300 flex-1 flex flex-col",
          isExpanded ? "bg-sage-50/50" : "bg-white"
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between gap-4 flex-shrink-0">
          <div className="flex-1 min-w-0">
            {/* Table / Location Info */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-carbon-900 flex items-center justify-center text-white shadow-md flex-shrink-0">
                {groupedOrder.table ? (
                  <span className="text-2xl font-bold">{groupedOrder.table.number}</span>
                ) : (
                  <UtensilsCrossed className="w-7 h-7 text-sage-400" />
                )}
              </div>
              <div className="min-w-0">
                <h3 className="text-xl font-bold text-carbon-900 leading-tight tracking-tight truncate">
                  {groupedOrder.table ? `Mesa ${groupedOrder.table.number}` : "Sin Mesa"}
                </h3>
                <div className="flex items-center gap-2 text-sm text-carbon-500 mt-1">
                  <Clock className="w-4 h-4 text-carbon-400" />
                  <span className="font-medium">{createdTime}</span>
                  <span className="text-carbon-300">•</span>
                  <span className={cn("font-semibold", waitTime.isUrgent ? "text-error-600 animate-pulse" : "text-sage-600")}>
                    Hace {waitTime.text}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <OrderTypeBadge type={groupedOrder.type} />
              <OrderStatusBadge status={groupedOrder.status} />
              <div className="px-3 py-1 rounded-xl bg-carbon-50 text-carbon-600 text-[11px] font-bold border border-carbon-200 tracking-wide">
                {groupedOrder.orders.length} {groupedOrder.orders.length === 1 ? 'SERVICIO' : 'SERVICIOS'}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end justify-between h-full gap-4">
            {isExpanded ? (
              <ChevronUp className="w-6 h-6 text-carbon-400 bg-carbon-50 rounded-full p-1" />
            ) : (
              <ChevronDown className="w-6 h-6 text-carbon-400 bg-carbon-50 rounded-full p-1" />
            )}
            <div className="text-right mt-auto">
              <p className="text-[10px] text-carbon-400 font-bold uppercase tracking-widest mb-0.5">Total</p>
              <p className="text-2xl font-bold text-carbon-900 tracking-tight">
                ${groupedOrder.totalAmount.toLocaleString("es-CO")}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Action Button for PENDING orders - Pushed to bottom of the main area */}
        <div className="mt-auto pt-5">
          {!isExpanded && canSendToKitchen && (
            <div className="pt-5 border-t border-sage-100">
              <Button
                variant="primary"
                className="w-full bg-sage-600 hover:bg-sage-700 text-white rounded-xl h-12 shadow-md active:scale-[0.98] transition-all"
                onClick={handleSendAllToKitchen}
                disabled={isUpdating}
              >
                <ChefHat className="w-5 h-5 mr-2" />
                Enviar todo a Cocina
              </Button>
            </div>
          )}
          
          {!isExpanded && !canSendToKitchen && (
            <div className="bg-sage-50/50 rounded-xl p-3 border border-sage-100">
              <p className="text-xs text-carbon-500 font-medium flex items-center gap-2">
                <Info className="w-3.5 h-3.5" />
                Contiene {totalItems} productos en total
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Expanded Details: List of individual orders */}
      {isExpanded && (
        <div className="border-t border-sage-200 bg-sage-50/50">
          {canSendToKitchen && (
            <div className="p-5 pb-0">
              <Button
                variant="primary"
                className="w-full bg-sage-600 hover:bg-sage-700 text-white rounded-xl h-12 shadow-md active:scale-[0.98] transition-all"
                onClick={handleSendAllToKitchen}
                disabled={isUpdating}
              >
                <ChefHat className="w-5 h-5 mr-2" />
                Enviar todo a Cocina ({pendingOrders.length})
              </Button>
            </div>
          )}

          <div className="p-5 space-y-4">
            {groupedOrder.orders.map((order, idx) => (
              <div 
                key={order.id}
                className={cn(
                  "bg-white rounded-2xl border-2 p-4 shadow-sm transition-all duration-200 hover:shadow-md",
                  order.status === OrderStatus.PENDING ? "border-sage-200" : "border-carbon-100 opacity-90"
                )}
              >
                <div className="flex items-center justify-between mb-4 border-b border-sage-50 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-carbon-900 flex items-center justify-center text-white font-bold text-xs shadow-inner">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-carbon-900 tracking-tight">
                        Pedido #{order.id.slice(-4)}
                      </p>
                      {order.waiter && (
                        <p className="text-xs text-carbon-500 flex items-center gap-1 font-medium mt-0.5">
                          <User className="w-3.5 h-3.5 text-sage-500" /> {order.waiter.firstName}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <OrderStatusBadge status={order.status} className="mb-1" />
                    <p className="text-sm font-bold text-sage-600">
                      ${order.totalAmount.toLocaleString("es-CO")}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 mb-4 px-1">
                  {order.items?.map((item) => (
                    <div key={item.id} className="flex items-start gap-3 text-sm">
                      <span className="text-carbon-400 font-bold min-w-[1.5rem] bg-carbon-50 px-1.5 py-0.5 rounded text-xs text-center">{item.quantity}x</span>
                      <span className="text-carbon-800 font-medium flex-1">{item.menuItem?.name || 'Producto'}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewDetail(order.id);
                    }}
                    className="h-10 text-sm rounded-xl border-sage-200 text-carbon-600 hover:text-sage-700 hover:bg-sage-50"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Ver Detalle
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-5 pt-0">
            <Button
              variant="outline"
              fullWidth
              className="bg-white border-2 border-carbon-200 text-carbon-700 hover:bg-carbon-50 rounded-xl h-12 font-bold"
              onClick={(e) => {
                e.stopPropagation();
                // If there's a specific table billing page, navigate there
                // For now, view detail of first order
                onViewDetail(groupedOrder.orders[0].id);
              }}
            >
              <Receipt className="w-5 h-5 mr-2" />
              Ver Factura de Mesa
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}

