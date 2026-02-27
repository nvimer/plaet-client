/**
 * GroupedOrderCard Component
 *
 * Displays a group of individual orders associated with the same table/time.
 * Dynamically changes actions and styles based on the operational stage.
 */

import {
  User,
  Clock,
  ChevronDown,
  ChevronUp,
  ReceiptText,
  Eye,
  UtensilsCrossed,
  ChefHat,
  DollarSign,
  CheckCircle,
  Truck,
  AlertCircle
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

  // Logic for primary actions
  const pendingPaymentOrders = groupedOrder.orders.filter(o => o.status === OrderStatus.PENDING || o.status === OrderStatus.SENT_TO_CASHIER);
  const paidWaitingKitchen = groupedOrder.orders.filter(o => o.status === OrderStatus.PAID);
  const readyForDelivery = groupedOrder.orders.filter(o => o.status === OrderStatus.READY);
  
  const needsBilling = pendingPaymentOrders.length > 0;
  const canSendToKitchen = paidWaitingKitchen.length > 0;
  const canDeliver = readyForDelivery.length > 0;

  const handleSendAllToKitchen = (e: React.MouseEvent) => {
    e.stopPropagation();
    paidWaitingKitchen.forEach(order => {
      updateStatus({ id: order.id, orderStatus: OrderStatus.IN_KITCHEN });
    });
  };

  const handleDeliverAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    readyForDelivery.forEach(order => {
      updateStatus({ id: order.id, orderStatus: OrderStatus.DELIVERED });
    });
  };

  return (
    <Card
      variant="elevated"
      className={cn(
        "overflow-hidden border-2 transition-all duration-300 rounded-3xl h-full flex flex-col",
        isExpanded ? "border-sage-300 shadow-soft-xl" : "border-sage-100 hover:border-sage-300 hover:shadow-soft-lg",
        needsBilling && !isExpanded && "border-amber-200/60 bg-amber-50/10",
        canSendToKitchen && !needsBilling && !isExpanded && "border-emerald-200/60 bg-emerald-50/10"
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
              <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-md flex-shrink-0 transition-colors",
                needsBilling ? "bg-amber-500" : "bg-carbon-900"
              )}>
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
                    {waitTime.text}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <OrderTypeBadge type={groupedOrder.type} />
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
                ${Number(groupedOrder.totalAmount).toLocaleString("es-CO")}
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Action Area (Simplified when collapsed) */}
        {!isExpanded && (
          <div className="mt-auto pt-5">
            {needsBilling ? (
              <Button
                variant="primary"
                className="w-full bg-carbon-900 hover:bg-carbon-800 text-white rounded-2xl h-14 shadow-lg active:scale-[0.98] transition-all font-black uppercase tracking-widest text-xs"
                onClick={(e) => { e.stopPropagation(); onViewDetail(groupedOrder.id); }}
              >
                <DollarSign className="w-5 h-5 mr-2" />
                Registrar Pago
              </Button>
            ) : canSendToKitchen ? (
              <Button
                variant="primary"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl h-14 shadow-lg active:scale-[0.98] transition-all font-black uppercase tracking-widest text-xs"
                onClick={handleSendAllToKitchen}
                disabled={isUpdating}
              >
                <ChefHat className="w-5 h-5 mr-2" />
                Enviar a Cocina
              </Button>
            ) : canDeliver ? (
              <Button
                variant="primary"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl h-14 shadow-lg active:scale-[0.98] transition-all font-black uppercase tracking-widest text-xs"
                onClick={handleDeliverAll}
                disabled={isUpdating}
              >
                <Truck className="w-5 h-5 mr-2" />
                Entregar Todo
              </Button>
            ) : (
              <div className="bg-sage-50/50 rounded-xl p-3 border border-sage-100 flex items-center justify-between">
                <p className="text-xs text-carbon-500 font-bold flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
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
        <div className="border-t border-sage-200 bg-sage-50/50">
          <div className="p-5 space-y-4">
            {groupedOrder.orders.map((order, idx) => (
              <div 
                key={order.id}
                className={cn(
                  "bg-white rounded-2xl border-2 p-4 shadow-sm transition-all duration-200 hover:shadow-md",
                  (order.status === OrderStatus.PENDING || order.status === OrderStatus.SENT_TO_CASHIER) ? "border-amber-100 shadow-amber-50/50" : "border-sage-50"
                )}
              >
                <div className="flex items-center justify-between mb-4 border-b border-sage-50 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-carbon-900 flex items-center justify-center text-white font-bold text-xs shadow-inner">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-carbon-900 tracking-tight">
                        Pedido #{order.id.slice(-4).toUpperCase()}
                      </p>
                      <OrderStatusBadge status={order.status} size="sm" showIcon={false} />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-carbon-900">
                      ${Number(order.totalAmount).toLocaleString("es-CO")}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 mb-4 px-1">
                  {order.items?.map((item) => (
                    <div key={item.id} className="flex items-start gap-3 text-sm">
                      <span className="text-carbon-400 font-bold min-w-[1.5rem] bg-carbon-50 px-1.5 py-0.5 rounded text-xs text-center">{item.quantity}x</span>
                      <div className="flex-1">
                        <span className="text-carbon-800 font-medium">{item.menuItem?.name || 'Producto'}</span>
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
                    className="h-10 text-[10px] font-black uppercase tracking-widest rounded-xl border-sage-200 text-carbon-600 hover:text-sage-700 hover:bg-sage-50"
                  >
                    <Eye className="w-3.5 h-3.5 mr-2" />
                    Ver Detalle
                  </Button>
                  
                  {order.status === OrderStatus.READY && (
                    <Button
                      variant="primary"
                      fullWidth
                      onClick={(e) => {
                        e.stopPropagation();
                        updateStatus({ id: order.id, orderStatus: OrderStatus.DELIVERED });
                      }}
                      className="h-10 text-[10px] font-black uppercase tracking-widest rounded-xl bg-indigo-600 hover:bg-indigo-700"
                    >
                      <Truck className="w-3.5 h-3.5 mr-2" />
                      Entregar
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-5 pt-0 flex gap-3">
            <Button
              variant="outline"
              fullWidth
              className="bg-white border-2 border-carbon-200 text-carbon-700 hover:bg-carbon-50 rounded-2xl h-14 font-black uppercase tracking-widest text-[10px]"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetail(groupedOrder.id);
              }}
            >
              <ReceiptText className="w-5 h-5 mr-2" />
              Factura de Mesa
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}