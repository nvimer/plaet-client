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
} from "lucide-react";
import { useState } from "react";
import { Button, Card } from "@/components";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { OrderTypeBadge } from "./OrderTypeBadge";
import { cn } from "@/utils/cn";
import type { GroupedOrder } from "../pages/OrdersPage";

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
  const waitTime = getWaitTime(groupedOrder.createdAt);
  
  const createdTime = new Date(groupedOrder.createdAt).toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const totalItems = groupedOrder.orders.reduce(
    (sum, order) => sum + (order.items?.length || 0),
    0
  );

  return (
    <Card
      variant="elevated"
      className={cn(
        "overflow-hidden border-2 transition-all duration-200",
        isExpanded ? "ring-2 ring-sage-200" : "hover:shadow-md"
      )}
    >
      {/* Header: Table Info & Group Stats */}
      <div 
        className="p-4 sm:p-5 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Table / Location Info */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sage-500 to-sage-600 flex items-center justify-center text-white shadow-soft-sm">
                {groupedOrder.table ? (
                  <span className="text-xl font-black">{groupedOrder.table.number}</span>
                ) : (
                  <UtensilsCrossed className="w-6 h-6" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-carbon-900 leading-tight">
                  {groupedOrder.table ? `Mesa ${groupedOrder.table.number}` : "Sin Mesa"}
                </h3>
                <div className="flex items-center gap-2 text-sm text-carbon-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{createdTime}</span>
                  <span>•</span>
                  <span className={cn(waitTime.isUrgent ? "text-rose-600 font-bold" : "")}>
                    Hace {waitTime.text}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <OrderTypeBadge type={groupedOrder.type} />
              <OrderStatusBadge status={groupedOrder.status} />
              <div className="px-2.5 py-0.5 rounded-full bg-carbon-100 text-carbon-600 text-xs font-bold border border-carbon-200 uppercase tracking-wider">
                {groupedOrder.orders.length} {groupedOrder.orders.length === 1 ? 'Pedido' : 'Pedidos'}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="text-right">
              <p className="text-xs text-carbon-400 font-bold uppercase tracking-widest">Total Mesa</p>
              <p className="text-2xl font-black text-sage-700">
                ${groupedOrder.totalAmount.toLocaleString("es-CO")}
              </p>
            </div>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-carbon-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-carbon-400" />
            )}
          </div>
        </div>
      </div>

      {/* Group Summary Preview (when collapsed) */}
      {!isExpanded && (
        <div className="px-5 pb-5 pt-0">
          <div className="bg-sage-50/50 rounded-xl p-3 border border-sage-100">
            <p className="text-xs text-carbon-500 font-medium">
              Contiene {totalItems} productos en total
            </p>
          </div>
        </div>
      )}

      {/* Expanded Details: List of individual orders */}
      {isExpanded && (
        <div className="border-t border-sage-100 bg-sage-50/30">
          <div className="p-4 space-y-3">
            {groupedOrder.orders.map((order, idx) => (
              <div 
                key={order.id}
                className="bg-white rounded-xl border border-sage-200 p-4 shadow-sm group/item"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-sage-100 flex items-center justify-center text-sage-600 font-bold text-sm">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-carbon-800">
                        Pedido #{order.id.slice(-4).toUpperCase()}
                      </p>
                      {order.waiter && (
                        <p className="text-xs text-carbon-400 flex items-center gap-1">
                          <User className="w-3 h-3" /> {order.waiter.firstName}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-carbon-900">
                      ${order.totalAmount.toLocaleString("es-CO")}
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5 mb-4">
                  {order.items?.map((item) => (
                    <div key={item.id} className="flex items-start gap-2 text-sm">
                      <span className="text-carbon-500 font-bold min-w-[1.5rem]">{item.quantity}x</span>
                      <span className="text-carbon-700 flex-1">{item.menuItem?.name || 'Producto'}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    fullWidth
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewDetail(order.id);
                    }}
                    className="h-9 text-xs"
                  >
                    <Eye className="w-3.5 h-3.5 mr-1.5" />
                    Ver Detalle
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    fullWidth
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewDetail(order.id);
                    }}
                    className="h-9 text-xs"
                  >
                    Atender
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 pt-0">
            <Button
              variant="outline"
              fullWidth
              className="bg-white border-sage-200 text-sage-700 hover:bg-sage-50"
              onClick={(e) => {
                e.stopPropagation();
                // If there's a specific table billing page, navigate there
                // For now, view detail of first order
                onViewDetail(groupedOrder.orders[0].id);
              }}
            >
              <Receipt className="w-4 h-4 mr-2" />
              Ver Factura de Mesa
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
