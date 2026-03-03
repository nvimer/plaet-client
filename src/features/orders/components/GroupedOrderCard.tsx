/**
 * GroupedOrderCard Component
 *
 * Displays a group of individual orders associated with the same table/time.
 * Dynamically changes actions and styles based on the operational stage.
 */

import {
  Clock,
  ChevronDown,
  ChevronUp,
  ReceiptText,
  Eye,
  UtensilsCrossed,
  ChefHat,
  DollarSign,
  Truck,
  XCircle,
  CheckCircle,
} from "lucide-react";
import { useState } from "react";
import { Button, Card } from "@/components";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { OrderTypeBadge } from "./OrderTypeBadge";
import { cn } from "@/utils/cn";
import type { GroupedOrder } from "../pages/OrdersPage";
import { useUpdateOrderStatus, useUpdateOrderItemStatus } from "../hooks";
import { OrderStatus, OrderItemStatus, type Order } from "@/types";

interface GroupedOrderCardProps {
  groupedOrder: GroupedOrder;
  onViewDetail: (orderId: string) => void;
  onPayTable: (orders: Order[]) => void;
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
  onPayTable,
}: GroupedOrderCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { mutate: updateStatus } = useUpdateOrderStatus();
  const { mutate: updateItemStatus } = useUpdateOrderItemStatus();
  
  const waitTime = getWaitTime(groupedOrder.createdAt);
  
  // Calculate auto-cancel warning (10 min limit)
  const minutesRemaining = Math.max(0, 10 - waitTime.minutes);
  const isNearAutoCancel = waitTime.minutes >= 7; // Warning after 7 mins

  const createdTime = new Date(groupedOrder.createdAt).toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const totalItems = groupedOrder.orders.reduce(
    (sum, order) => sum + (order.items?.length || 0),
    0
  );

  // Logic for primary actions based on account and items
  const activeOrders = groupedOrder.orders.filter(o => o.status === OrderStatus.OPEN || o.status === OrderStatus.SENT_TO_CASHIER);
  const itemsPendingKitchen = groupedOrder.orders.flatMap(o => o.items || []).filter(i => i.status === OrderItemStatus.PENDING);
  const itemsReadyForDelivery = groupedOrder.orders.flatMap(o => o.items || []).filter(i => i.status === OrderItemStatus.READY);
  
  const needsBilling = activeOrders.length > 0;
  const canSendToKitchen = itemsPendingKitchen.length > 0;
  const canDeliver = itemsReadyForDelivery.length > 0;
  
  const allDelivered = groupedOrder.orders.every(o => 
    o.items?.every(i => i.status === OrderItemStatus.DELIVERED)
  );
  const allCancelled = groupedOrder.orders.every(o => o.status === OrderStatus.CANCELLED);

  const handleSendAllToKitchen = (e: React.MouseEvent) => {
    e.stopPropagation();
    itemsPendingKitchen.forEach(item => {
      updateItemStatus({ orderId: item.orderId, itemId: item.id, status: OrderItemStatus.IN_KITCHEN });
    });
  };

  const handleDeliverAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    itemsReadyForDelivery.forEach(item => {
      updateItemStatus({ orderId: item.orderId, itemId: item.id, status: OrderItemStatus.DELIVERED });
    });
  };

  return (
    <Card
      variant="elevated"
      className={cn(
        "overflow-hidden border-2 transition-all duration-300 rounded-[2.5rem] h-full flex flex-col group",
        isExpanded ? "border-carbon-900 shadow-soft-2xl scale-[1.02]" : "border-sage-100 hover:border-sage-300 hover:shadow-soft-xl",
        needsBilling && !isExpanded && "bg-white",
        isNearAutoCancel && needsBilling && "border-rose-200 ring-4 ring-rose-50",
        canDeliver && !isExpanded && "border-emerald-500 ring-4 ring-emerald-50 animate-pulse-subtle"
      )}
    >
      {/* Header: Table Info & Group Stats */}
      <div 
        className={cn(
          "p-6 cursor-pointer transition-colors duration-300 flex-1 flex flex-col",
          isExpanded ? "bg-carbon-900 text-white" : "bg-white"
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            {/* TABLE NUMBER BOX */}
            <div className={cn(
              "w-16 h-16 rounded-[1.25rem] flex items-center justify-center shadow-md transition-all duration-500",
              isExpanded ? "bg-white text-carbon-900" : "bg-carbon-900 text-white group-hover:rotate-3"
            )}>
              <span className="text-3xl font-black tracking-tighter">
                {groupedOrder.table ? groupedOrder.table.number : "S/M"}
              </span>
            </div>
            
            <div>
              <h3 className={cn(
                "text-sm font-black uppercase tracking-widest",
                isExpanded ? "text-white/60" : "text-carbon-400"
              )}>
                {groupedOrder.table ? "Mesa" : "Pedido"}
              </h3>
              <div className="flex items-center gap-2">
                <span className={cn("text-xl font-bold", isExpanded ? "text-white" : "text-carbon-900")}>
                  {groupedOrder.table ? `Local ${groupedOrder.table.number}` : `#${groupedOrder.id.slice(-4).toUpperCase()}`}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <div className={cn(
              "flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-colors",
              isExpanded ? "bg-white/10 text-white" : 
              isNearAutoCancel ? "bg-rose-100 text-rose-600 animate-pulse" : "bg-sage-100 text-sage-600"
            )}>
              <Clock className="w-3 h-3" />
              {needsBilling ? `Cancela en ${minutesRemaining}m` : waitTime.text}
            </div>
            <div className={cn(
              "text-[10px] font-bold opacity-60",
              isExpanded ? "text-white" : "text-carbon-400"
            )}>
              Ingreso: {createdTime}
            </div>
          </div>
        </div>

        {/* Content Preview */}
        {!isExpanded && (
          <div className="flex-1">
            <div className="flex flex-wrap gap-2 mb-4">
              <OrderTypeBadge type={groupedOrder.type} />
              <div className="px-3 py-1 rounded-full bg-carbon-50 text-carbon-600 text-[9px] font-black border border-carbon-100 uppercase tracking-widest">
                {groupedOrder.orders.length} {groupedOrder.orders.length === 1 ? 'Servicio' : 'Servicios'}
              </div>
            </div>
            
            <div className="space-y-1.5 opacity-80">
              {groupedOrder.orders.flatMap(o => o.items || []).slice(0, 3).map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-carbon-600 font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-sage-300" />
                  <span className="truncate">{item.quantity}x {item.menuItem?.name}</span>
                </div>
              ))}
              {totalItems > 3 && (
                <p className="text-[10px] text-carbon-400 font-bold pl-3.5">+ {totalItems - 3} productos más...</p>
              )}
            </div>
          </div>
        )}

        <div className={cn(
          "mt-6 pt-6 border-t flex items-center justify-between",
          isExpanded ? "border-white/10" : "border-sage-50"
        )}>
          <div>
            <p className={cn(
              "text-[10px] font-black uppercase tracking-widest mb-0.5",
              isExpanded ? "text-white/40" : "text-carbon-400"
            )}>Total Cuenta</p>
            <p className={cn(
              "text-3xl font-black tracking-tighter",
              isExpanded ? "text-white" : "text-carbon-900"
            )}>
              ${Number(groupedOrder.totalAmount).toLocaleString("es-CO")}
            </p>
          </div>
          {isExpanded ? <ChevronUp className="w-6 h-6 opacity-40" /> : <ChevronDown className="w-6 h-6 text-carbon-300" />}
        </div>

        {/* Dynamic Action Area (Simplified when collapsed) */}
        {!isExpanded && (
          <div className="mt-6">
            {needsBilling ? (
              <Button
                variant="primary"
                className="w-full bg-carbon-900 hover:bg-carbon-800 text-white rounded-2xl h-16 shadow-xl active:scale-[0.98] transition-all font-black uppercase tracking-[0.15em] text-xs"
                onClick={(e) => { e.stopPropagation(); onPayTable(groupedOrder.orders); }}
              >
                <DollarSign className="w-5 h-5 mr-2" />
                Registrar Pago
              </Button>
            ) : canDeliver ? (
              <Button
                variant="primary"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl h-16 shadow-xl active:scale-[0.98] transition-all font-black uppercase tracking-[0.15em] text-xs"
                onClick={handleDeliverAll}
              >
                <Truck className="w-5 h-5 mr-2" />
                Entregar Todo
              </Button>
            ) : allDelivered ? (
              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 flex items-center justify-between">
                <p className="text-xs text-emerald-600 font-black uppercase tracking-widest flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Entregado
                </p>
                <span className="text-[10px] font-black text-carbon-400 uppercase tracking-widest">{totalItems} productos</span>
              </div>
            ) : allCancelled ? (
              <div className="bg-rose-50 rounded-2xl p-4 border border-rose-100 flex items-center justify-between">
                <p className="text-xs text-rose-600 font-black uppercase tracking-widest flex items-center gap-2">
                  <XCircle className="w-4 h-4" />
                  Cancelado
                </p>
                <span className="text-[10px] font-black text-carbon-400 uppercase tracking-widest">{totalItems} productos</span>
              </div>
            ) : (
              <div className="bg-sage-50 rounded-2xl p-4 border border-sage-100 flex items-center justify-between">
                <p className="text-xs text-carbon-500 font-black uppercase tracking-widest flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500" />
                  En preparación...
                </p>
                <span className="text-[10px] font-black text-carbon-400 uppercase">{totalItems} productos</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Expanded Details: List of individual orders */}
      {isExpanded && (
        <div className="border-t border-white/10 bg-white/5 backdrop-blur-md">
          <div className="p-6 space-y-4">
            {groupedOrder.orders.map((order, idx) => (
              <div 
                key={order.id}
                className={cn(
                  "bg-white rounded-[1.5rem] border-2 p-5 shadow-sm transition-all duration-200",
                  (order.status === OrderStatus.OPEN || order.status === OrderStatus.SENT_TO_CASHIER) ? "border-amber-100" : "border-sage-50"
                )}
              >
                <div className="flex items-center justify-between mb-4 border-b border-sage-50 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-carbon-900 flex items-center justify-center text-white font-bold text-xs shadow-inner">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="text-sm font-black text-carbon-900 tracking-tight">
                        Servicio #{order.id.slice(-4).toUpperCase()}
                      </p>
                      <OrderStatusBadge status={order.status} size="sm" showIcon={false} />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-carbon-900">
                      ${Number(order.totalAmount).toLocaleString("es-CO")}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 mb-4 px-1">
                  {order.items?.map((item) => (
                    <div key={item.id} className="flex items-start gap-3 text-sm">
                      <span className="text-carbon-400 font-black min-w-[1.5rem] bg-carbon-50 px-1.5 py-0.5 rounded text-[10px] text-center">{item.quantity}x</span>
                      <div className="flex-1">
                        <span className="text-carbon-800 font-bold text-xs uppercase">{item.menuItem?.name || 'Producto'}</span>
                        {item.notes && <p className="text-[10px] text-carbon-400 italic">"{item.notes}"</p>}
                      </div>
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
                    className="h-12 text-[10px] font-black uppercase tracking-widest rounded-xl border-sage-200 text-carbon-600 hover:text-sage-700 hover:bg-sage-50"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Detalles
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-6 pt-0 flex gap-3">
            <Button
              variant="outline"
              fullWidth
              className="bg-white border-2 border-carbon-200 text-carbon-700 hover:bg-carbon-50 rounded-2xl h-16 font-black uppercase tracking-widest text-[10px]"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetail(groupedOrder.id);
              }}
            >
              <ReceiptText className="w-5 h-5 mr-2" />
              Ver Factura Mesa
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}