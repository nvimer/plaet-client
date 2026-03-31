/**
 * GroupedOrderCard Component
 *
 * Displays a group of individual orders associated with the same table/time.
 * Dynamically changes actions and styles based on the operational stage.
 */

import { Button, Card, OrderStatusBadge, OrderTypeBadge } from "@/components";
import {
  Clock,
  ChevronDown,
  ChevronUp,
  ReceiptText,
  DollarSign,
  Truck,
  XCircle,
  CheckCircle,
} from "lucide-react";
import { useState, useMemo } from "react";
import { cn } from "@/utils/cn";
import type { GroupedOrder } from "../pages/OrdersPage";
import { useUpdateOrderItemStatus } from "../hooks";
import { OrderStatus, OrderItemStatus, type Order, type OrderItem } from "@/types";

interface GroupedOrderCardProps {
  groupedOrder: GroupedOrder;
  onViewDetail: (orderId: string) => void;
  onPayTable: (orders: Order[]) => void;
}

/**
 * Calculate wait time and format it
 */
function getWaitTime(createdAt: string, finishedAt?: string): {
  minutes: number;
  text: string;
  isUrgent: boolean;
} {
  const created = new Date(createdAt);
  const end = finishedAt ? new Date(finishedAt) : new Date();
  const diffMs = end.getTime() - created.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) {
    return { minutes: 0, text: "Ahora", isUrgent: false };
  } else if (diffMinutes < 60) {
    return {
      minutes: diffMinutes,
      text: `${diffMinutes}m`,
      isUrgent: !finishedAt && diffMinutes > 20,
    };
  } else {
    const hours = Math.floor(diffMinutes / 60);
    const mins = diffMinutes % 60;
    return {
      minutes: diffMinutes,
      text: `${hours}h ${mins}m`,
      isUrgent: !finishedAt,
    };
  }
}

export function GroupedOrderCard({
  groupedOrder,
  onViewDetail,
  onPayTable,
}: GroupedOrderCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { mutate: updateItemStatus } = useUpdateOrderItemStatus();
  
  // Use the latest update time from the orders if the group is fully resolved
  const isCompleted = groupedOrder.orders.every(o => o.status === OrderStatus.PAID || o.status === OrderStatus.CANCELLED);
  const latestUpdateTime = isCompleted 
    ? new Date(Math.max(...groupedOrder.orders.map(o => new Date(o.updatedAt).getTime()))).toISOString()
    : undefined;
    
  const waitTime = getWaitTime(groupedOrder.createdAt, latestUpdateTime);

  const createdTime = new Date(groupedOrder.createdAt).toLocaleTimeString("es-CO", {
  hour: "2-digit",
  minute: "2-digit",
  });
  const totalItems = groupedOrder.orders.reduce(
    (sum, order) => sum + (order.items?.length || 0),
    0
  );

  // Helper to check if an item actually goes to kitchen
  const isKitchenBound = (i: OrderItem) => i.menuItemId && !i.notes?.toLowerCase().includes("portacomida");

  // Logic for primary actions based on account and items
  const activeOrders = groupedOrder.orders.filter(o => o.status === OrderStatus.OPEN || o.status === OrderStatus.SENT_TO_CASHIER);
  const allItems = groupedOrder.orders.flatMap(o => o.items || []);

  // Aggregation Logic for Preview
  const aggregatedItems = useMemo(() => {
    const groups: Record<string, { name: string; quantity: number; isLunch: boolean }> = {};

    allItems.forEach((item) => {
      const isLunch = item.notes?.toLowerCase().startsWith("almuerzo:") || false;
      const rawName = item.menuItem?.name || item.notes || "Producto";
      
      // Clean name for lunch items to group correctly (remove "Almuerzo: ")
      let displayName = rawName;
      if (isLunch && rawName.toLowerCase().startsWith("almuerzo:")) {
        displayName = rawName.substring(rawName.indexOf(":") + 1).trim();
      }

      // Unique key based on ID and type
      const key = `${item.menuItemId || 'notes'}-${isLunch}-${displayName}`;

      if (!groups[key]) {
        groups[key] = {
          name: displayName,
          quantity: 0,
          isLunch,
        };
      }
      groups[key].quantity += item.quantity;
    });

    return Object.values(groups).sort((a, b) => {
      // Sort: Lunch items first, then others
      if (a.isLunch && !b.isLunch) return -1;
      if (!a.isLunch && b.isLunch) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [allItems]);

  const kitchenItems = allItems.filter(isKitchenBound);

  const itemsReadyForDelivery = kitchenItems.filter(i => i.status === OrderItemStatus.READY);
  
  const needsBilling = activeOrders.length > 0;
  const canDeliver = itemsReadyForDelivery.length > 0;
  
  // An order is "all delivered" if all its kitchen items are delivered
  // Non-kitchen items don't block this state
  const allDelivered = kitchenItems.length > 0 
    ? kitchenItems.every(i => i.status === OrderItemStatus.DELIVERED)
    : groupedOrder.orders.every(o => o.status === OrderStatus.PAID);

  const allCancelled = groupedOrder.orders.every(o => o.status === OrderStatus.CANCELLED);

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
        "overflow-hidden border-2 transition-all duration-300 rounded-2xl xl:rounded-[2.5rem] flex flex-col group min-h-[280px] xl:min-h-[320px]",
        isExpanded ? "border-carbon-900 shadow-soft-2xl" : "border-sage-100 hover:border-sage-300 hover:shadow-soft-xl",
        needsBilling && !isExpanded && "bg-white",
        canDeliver && !isExpanded && "border-success-500 ring-4 ring-success-50 animate-pulse-subtle"
      )}
    >
      {/* Header: Table Info & Group Stats */}
      <div 
        className={cn(
          "p-4 sm:p-6 cursor-pointer transition-colors duration-300 flex-none",
          isExpanded ? "bg-carbon-900 text-white" : "bg-white"
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 xl:mb-6">
          <div className="flex items-center gap-3 xl:gap-4 min-w-0 flex-1">
            {/* TABLE NUMBER BOX */}
            <div className={cn(
              "w-12 h-12 xl:w-16 xl:h-16 rounded-xl xl:rounded-[1.25rem] flex items-center justify-center shadow-md transition-all duration-500 shrink-0",
              isExpanded ? "bg-white text-carbon-900" : "bg-carbon-900 text-white group-hover:rotate-3"
            )}>
              <span className="text-xl xl:text-3xl font-black tracking-tighter">
                {groupedOrder.table ? groupedOrder.table.number : "S/M"}
              </span>
            </div>
            
            <div className="min-w-0">
              <h3 className={cn(
                "text-xs xl:text-sm font-semibold tracking-wide truncate",
                isExpanded ? "text-white/60" : "text-carbon-400"
              )}>
                {groupedOrder.table ? "Mesa" : "Pedido"}
              </h3>
              <div className="flex flex-col items-start gap-1">
                <span className={cn("text-base xl:text-xl font-bold truncate", isExpanded ? "text-white" : "text-carbon-900")}>
                  {groupedOrder.table ? `Mesa ${groupedOrder.table.number}` : `#${groupedOrder.id.slice(-4).toUpperCase()}`}
                </span>
                {groupedOrder.table && (
                  <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-md", isExpanded ? "bg-white/20 text-white" : "bg-carbon-100 text-carbon-500")}>
                    #{groupedOrder.id.slice(-4).toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1 shrink-0">
            <div className={cn(
              "flex items-center gap-1.5 px-2 xl:px-3 py-1 rounded-full text-[9px] xl:text-[10px] font-semibold tracking-wide transition-colors whitespace-nowrap",
              isExpanded ? "bg-white/10 text-white" : "bg-sage-100 text-sage-600"
            )}>
              <Clock className="w-3 h-3" />
              {isCompleted ? "Completado" : waitTime.text}
            </div>
            <div className={cn(
              "text-[9px] xl:text-[10px] font-bold opacity-60 whitespace-nowrap",
              isExpanded ? "text-white" : "text-carbon-400"
            )}>
              Ingreso: {createdTime}
            </div>
          </div>
        </div>

        {/* Content Preview */}
        {!isExpanded && (
          <div className="h-36 xl:h-40 overflow-hidden mb-2">
            <div className="flex flex-wrap gap-2 mb-3 xl:mb-4">
              <OrderTypeBadge type={groupedOrder.type} />
              <div className="px-2 xl:px-3 py-1 rounded-full bg-carbon-50 text-carbon-600 text-[8px] xl:text-[9px] font-black border border-carbon-100 tracking-wide">
                {groupedOrder.orders.length} {groupedOrder.orders.length === 1 ? 'Servicio' : 'Servicios'}
              </div>
            </div>
            
            <div className="space-y-1 xl:space-y-1.5 opacity-80">
              {aggregatedItems.slice(0, 4).map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-[10px] xl:text-xs text-carbon-600 font-medium">
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    item.isLunch ? "bg-primary-500" : "bg-sage-300"
                  )} />
                  <span className="truncate">
                    <span className="font-black text-carbon-900">{item.quantity}x</span>{" "}
                    {item.isLunch && <span className="text-[8px] xl:text-[9px] font-bold text-primary-600 uppercase mr-1">Alm:</span>}
                    {item.name}
                  </span>
                </div>
              ))}
              {aggregatedItems.length > 4 && (
                <p className="text-[9px] xl:text-[10px] text-carbon-400 font-bold pl-3.5">+ {aggregatedItems.length - 4} productos más...</p>
              )}
            </div>
          </div>
        )}

        <div className={cn(
          "mt-auto pt-4 xl:pt-6 border-t flex items-center justify-between",
          isExpanded ? "border-white/10" : "border-sage-50"
        )}>
          <div>
            <p className={cn(
              "text-[9px] xl:text-[10px] font-semibold tracking-wide mb-0.5",
              isExpanded ? "text-white/40" : "text-carbon-400"
            )}>Total Cuenta</p>
            <p className={cn(
              "text-2xl xl:text-3xl font-black tracking-tighter",
              isExpanded ? "text-white" : "text-carbon-900"
            )}>
              ${Number(groupedOrder.totalAmount).toLocaleString("es-CO")}
            </p>
          </div>
          {isExpanded ? <ChevronUp className="w-5 xl:w-6 h-5 xl:h-6 opacity-40" /> : <ChevronDown className="w-5 xl:w-6 h-5 xl:h-6 text-carbon-300" />}
        </div>

        {/* Dynamic Action Area (Simplified when collapsed) */}
        {!isExpanded && (
          <div className="mt-4 xl:mt-6">
            {needsBilling ? (
              <Button
                variant="primary"
                className="w-full bg-carbon-900 hover:bg-carbon-800 text-white rounded-xl xl:rounded-2xl h-12 xl:h-16 shadow-xl active:scale-[0.98] transition-all font-semibold tracking-[0.15em] text-[10px] xl:text-xs"
                onClick={(e) => { e.stopPropagation(); onPayTable(groupedOrder.orders); }}
              >
                <DollarSign className="w-4 xl:w-5 h-4 xl:h-5 mr-1.5 xl:mr-2" />
                Registrar Pago
              </Button>
            ) : canDeliver ? (
              <Button
                variant="primary"
                className="w-full bg-success-600 hover:bg-success-700 text-white rounded-xl xl:rounded-2xl h-12 xl:h-16 shadow-xl active:scale-[0.98] transition-all font-semibold tracking-[0.15em] text-[10px] xl:text-xs"
                onClick={handleDeliverAll}
              >
                <Truck className="w-4 xl:w-5 h-4 xl:h-5 mr-1.5 xl:mr-2" />
                Entregar Todo
              </Button>
            ) : allDelivered ? (
              <div className="bg-success-50 rounded-xl xl:rounded-2xl p-3 xl:p-4 border border-success-100 flex items-center justify-between">
                <p className="text-[10px] xl:text-xs text-success-600 font-semibold tracking-wide flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Entregado
                </p>
                <span className="text-[9px] xl:text-[10px] font-black text-carbon-400 tracking-wide">{totalItems} productos</span>
              </div>
            ) : allCancelled ? (
              <div className="bg-error-50 rounded-xl xl:rounded-2xl p-3 xl:p-4 border border-error-100 flex items-center justify-between">
                <p className="text-[10px] xl:text-xs text-error-600 font-semibold tracking-wide flex items-center gap-2">
                  <XCircle className="w-4 h-4" />
                  Cancelado
                </p>
                <span className="text-[9px] xl:text-[10px] font-black text-carbon-400 tracking-wide">{totalItems} productos</span>
              </div>
            ) : (
              <div className="bg-sage-50 rounded-xl xl:rounded-2xl p-3 xl:p-4 border border-sage-100 flex items-center justify-between">
                <p className="text-[10px] xl:text-xs text-carbon-500 font-semibold tracking-wide flex items-center gap-2">
                  <Clock className="w-4 h-4 text-warning-500" />
                  En preparación...
                </p>
                <span className="text-[9px] xl:text-[10px] font-black text-carbon-400 uppercase">{totalItems} productos</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Expanded Details: CLEAN TICKET VIEW */}
      {isExpanded && (
        <div className="flex-1 bg-carbon-50/50 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 xl:p-6 space-y-4 xl:space-y-6">
            {groupedOrder.orders.map((order, idx) => (
              <div key={order.id} className="relative">
                {/* Order Divider/Header */}
                <div className="flex items-center gap-2 mb-3 xl:mb-4">
                  <div className="h-px flex-1 bg-carbon-200" />
                  <span className="text-[9px] xl:text-[10px] font-black text-carbon-400 uppercase tracking-[0.2em]">Servicio {idx + 1}</span>
                  <div className="h-px flex-1 bg-carbon-200" />
                </div>

                <div className="space-y-2 xl:space-y-3">
                  {order.items?.map((item) => (
                    <div key={item.id} className="flex items-start justify-between gap-2 xl:gap-4">
                      <div className="flex items-start gap-2 xl:gap-3">
                        <span className="bg-white border border-carbon-200 text-carbon-900 font-black w-6 h-6 xl:w-7 xl:h-7 rounded-lg flex items-center justify-center text-[9px] xl:text-[10px] shrink-0 shadow-sm">
                          {item.quantity}
                        </span>
                        <div>
                          <p className="text-[10px] xl:text-xs font-bold text-carbon-900 uppercase tracking-tight">
                            {item.menuItem?.name || item.notes || 'Producto'}
                          </p>
                          {item.notes && item.menuItem && (
                            <p className="text-[9px] xl:text-[10px] text-carbon-500 italic mt-0.5 line-clamp-1">
                              {item.notes}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="text-[10px] xl:text-xs font-bold text-carbon-600 tabular-nums">
                        ${Number(item.priceAtOrder || 0).toLocaleString("es-CO")}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-3 xl:mt-4 flex items-center justify-between">
                  <OrderStatusBadge status={order.status} size="sm" showIcon={false} />
                  <button 
                    onClick={(e) => { e.stopPropagation(); onViewDetail(order.id); }}
                    className="text-[9px] xl:text-[10px] font-black text-primary-600 hover:text-primary-700 tracking-wide underline underline-offset-4"
                  >
                    Detalles
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 xl:p-6 bg-white border-t border-carbon-100">
            <Button
              variant="primary"
              fullWidth
              className="bg-carbon-900 text-white rounded-xl xl:rounded-2xl h-12 xl:h-14 font-semibold tracking-wide text-[10px] xl:text-[10px] shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetail(groupedOrder.id);
              }}
            >
              <ReceiptText className="w-4 h-4 mr-2 text-sage-400" />
              Ver Factura Completa
            </Button>
          </div>
        </div>
      )}
        </Card>
      );
    }
    