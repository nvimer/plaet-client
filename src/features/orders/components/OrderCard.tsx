/**
 * OrderCard Component - Enhanced Edition
 *
 * Modern card with prominent wait time, swipe actions support, and improved UX.
 * Touch-friendly design with clear visual hierarchy.
 *
 * Key improvements:
 * - Large wait time display with urgency indicators
 * - Swipe actions support for mobile
 * - Better visual hierarchy
 * - Category icons for items
 * - Enhanced status workflow
 */

import { OrderStatus, type Order } from "@/types";
import type { AxiosErrorWithResponse } from "@/types/common";
import { useUpdateOrderStatus } from "../hooks";
import {
  CheckCircle,
  ChefHat,
  Clock,
  Eye,
  MapPin,
  Truck,
  User,
  AlertCircle,
  Flame,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { OrderTypeBadge } from "./OrderTypeBadge";
import { cn } from "@/utils/cn";

interface OrderCardProps {
  order: Order;
  onViewDetail: (orderId: string) => void;
  compact?: boolean; // For list view
}

const STATUS_CONFIG = {
  [OrderStatus.PENDING]: {
    label: "Pendiente",
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    badge: "bg-amber-100 text-amber-700 border-amber-200",
    accent: "bg-amber-500",
    urgencyColor: "text-amber-600",
  },
  [OrderStatus.IN_KITCHEN]: {
    label: "En Cocina",
    bg: "bg-orange-50",
    border: "border-orange-200",
    text: "text-orange-700",
    badge: "bg-orange-100 text-orange-700 border-orange-200",
    accent: "bg-orange-500",
    urgencyColor: "text-orange-600",
  },
  [OrderStatus.READY]: {
    label: "Listo",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
    accent: "bg-emerald-500",
    urgencyColor: "text-emerald-600",
  },
  [OrderStatus.DELIVERED]: {
    label: "Entregado",
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
    badge: "bg-blue-100 text-blue-700 border-blue-200",
    accent: "bg-blue-500",
    urgencyColor: "text-blue-600",
  },
  [OrderStatus.PAID]: {
    label: "Pagado",
    bg: "bg-sage-50",
    border: "border-sage-200",
    text: "text-sage-700",
    badge: "bg-sage-100 text-sage-700 border-sage-200",
    accent: "bg-sage-500",
    urgencyColor: "text-sage-600",
  },
  [OrderStatus.SENT_TO_CASHIER]: {
    label: "En Caja",
    bg: "bg-purple-50",
    border: "border-purple-200",
    text: "text-purple-700",
    badge: "bg-purple-100 text-purple-700 border-purple-200",
    accent: "bg-purple-500",
    urgencyColor: "text-purple-600",
  },
  [OrderStatus.CANCELLED]: {
    label: "Cancelado",
    bg: "bg-rose-50",
    border: "border-rose-200",
    text: "text-rose-700",
    badge: "bg-rose-100 text-rose-700 border-rose-200",
    accent: "bg-rose-500",
    urgencyColor: "text-rose-600",
  },
} as const;

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

/**
 * Get category emoji for item preview
 */
function getItemEmoji(itemName: string): string {
  const name = itemName.toLowerCase();
  if (
    name.includes("pollo") ||
    name.includes("carne") ||
    name.includes("pescado") ||
    name.includes("prote")
  )
    return "🍗";
  if (name.includes("arroz")) return "🍚";
  if (name.includes("sopa")) return "🍲";
  if (name.includes("ensalada")) return "🥗";
  if (
    name.includes("jugo") ||
    name.includes("bebida") ||
    name.includes("gaseosa")
  )
    return "🥤";
  if (name.includes("papa") || name.includes("yuca")) return "🥔";
  if (name.includes("huevo")) return "🥚";
  if (name.includes("plátano")) return "🍌";
  return "🍽️";
}

export function OrderCard({
  order,
  onViewDetail,
  compact = false,
}: OrderCardProps) {
  const { mutate: updateStatus, isPending } = useUpdateOrderStatus();

  const config = STATUS_CONFIG[order.status];
  const shortId = `#${order.id.slice(-6).toUpperCase()}`;
  const waitTime = getWaitTime(order.createdAt);

  const createdTime = new Date(order.createdAt).toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const itemsCount =
    order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const getNextStatus = (): {
    status: OrderStatus;
    label: string;
    icon: typeof ChefHat;
  } | null => {
    switch (order.status) {
      case OrderStatus.PENDING:
        return {
          status: OrderStatus.IN_KITCHEN,
          label: "Enviar a Cocina",
          icon: ChefHat,
        };
      case OrderStatus.IN_KITCHEN:
        return {
          status: OrderStatus.READY,
          label: "Marcar Listo",
          icon: CheckCircle,
        };
      case OrderStatus.READY:
        return {
          status: OrderStatus.DELIVERED,
          label: "Entregar",
          icon: Truck,
        };
      default:
        return null;
    }
  };

  const nextStatus = getNextStatus();

  const handleStatusChange = () => {
    if (!nextStatus) return;

    updateStatus(
      { id: order.id, orderStatus: nextStatus.status },
      {
        onSuccess: () => {
          toast.success("Estado Actualizado", {
            description: `Pedido ${shortId} ahora está ${nextStatus.label.toLowerCase()}`,
          });
        },
        onError: (error: AxiosErrorWithResponse) => {
          toast.error("Error al actualizar estado", {
            description: error.response?.data?.message || error.message,
          });
        },
      },
    );
  };

  // Compact list view
  if (compact) {
    return (
      <div
        className={cn(
          "group flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200",
          "bg-white hover:shadow-md hover:border-sage-200",
          config.border,
          waitTime.isUrgent && "border-l-4 border-l-rose-500",
        )}
      >
        {/* Wait Time - Prominent */}
        <div
          className={cn(
            "flex-shrink-0 w-16 text-center",
            waitTime.isUrgent ? "text-rose-600" : config.urgencyColor,
          )}
        >
          <div className="text-xl font-bold">{waitTime.text}</div>
          <div className="text-xs opacity-70">{createdTime}</div>
        </div>

        {/* Status Indicator */}
        <div
          className={cn("w-2 h-12 rounded-full flex-shrink-0", config.accent)}
        />

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-carbon-900">{shortId}</span>
            {order.table && (
              <span className="text-sm text-carbon-600">
                Mesa {order.table.number}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-carbon-500">
            <span>{itemsCount} items</span>
            <span>·</span>
            <span className="font-semibold text-sage-700">
              ${order.totalAmount.toLocaleString("es-CO")}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {nextStatus && (
            <button
              onClick={handleStatusChange}
              disabled={isPending}
              className={cn(
                "p-2 rounded-lg transition-colors",
                "bg-sage-100 text-sage-700 hover:bg-sage-200",
                "min-w-[44px] min-h-[44px] flex items-center justify-center",
              )}
            >
              <nextStatus.icon className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={() => onViewDetail(order.id)}
            className="p-2 rounded-lg bg-carbon-100 text-carbon-600 hover:bg-carbon-200 min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // Full card view
  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-2xl border-2 bg-white",
        "transition-all duration-200 flex flex-col h-full",
        "hover:shadow-lg hover:border-sage-200",
        "active:scale-[0.99]",
        config.border,
        waitTime.isUrgent &&
          waitTime.minutes > 30 &&
          "ring-2 ring-rose-200 ring-offset-2",
      )}
    >
      {/* Status accent bar */}
      <div className={cn("h-1.5 w-full flex-shrink-0", config.accent)} aria-hidden />

      {/* Urgent badge for long waits */}
      {waitTime.isUrgent && waitTime.minutes > 30 && (
        <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-bold animate-pulse z-10">
          <Flame className="w-3 h-3" />
          Retrasado
        </div>
      )}

      <div className="p-5 sm:p-6 flex flex-col flex-1">
        {/* Header: Wait Time + ID + Status */}
        <div className="flex items-start justify-between gap-4 mb-5 flex-shrink-0">
          {/* Left: Wait Time (Prominent) */}
          <div className="flex-1 min-w-0">
            {/* Large Wait Time Display */}
            <div
              className={cn(
                "flex items-baseline gap-2 mb-2",
                waitTime.isUrgent ? "text-rose-600" : config.urgencyColor,
              )}
            >
              <Clock
                className={cn(
                  "w-5 h-5 flex-shrink-0",
                  waitTime.isUrgent && "animate-pulse",
                )}
              />
              <span className="text-3xl font-black tracking-tight">
                {waitTime.text}
              </span>
              <span className="text-sm font-medium opacity-70">esperando</span>
            </div>

            {/* ID and Time */}
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-bold text-carbon-900">{shortId}</h3>
              <span className="text-sm text-carbon-500">{createdTime}</span>
            </div>

            {/* Location & Waiter */}
            <div className="flex flex-wrap items-center gap-3 text-sm">
              {order.table && (
                <div className="flex items-center gap-1.5 text-carbon-600 bg-carbon-50 px-2 py-1 rounded-lg border border-carbon-100">
                  <MapPin className="w-4 h-4 text-sage-600" />
                  <span className="font-medium">Mesa {order.table.number}</span>
                </div>
              )}
              {order.waiter && (
                <div className="flex items-center gap-1.5 text-carbon-600">
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">{order.waiter.firstName}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Status Badge */}
          <div className="flex-shrink-0">
            <OrderStatusBadge status={order.status} />
          </div>
        </div>

        {/* Order Type Badge */}
        <div className="mb-4 flex-shrink-0">
          <OrderTypeBadge type={order.type} />
        </div>

        {/* Items Preview with Emojis - Fixed Height/Scrollable if needed */}
        <div
          className={cn("mb-5 p-4 rounded-xl border flex-1 min-h-[140px]", config.bg, config.border)}
        >
          <div className="flex items-center justify-between mb-3 flex-shrink-0">
            <p className="text-sm font-medium text-carbon-700">
              <span className={cn("font-bold", config.text)}>{itemsCount}</span>{" "}
              productos
            </p>
            {waitTime.isUrgent && (
              <div className="flex items-center gap-1 text-xs text-error-600">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Puede estar frío</span>
              </div>
            )}
          </div>

          <div className="space-y-2 overflow-y-auto max-h-[120px] scrollbar-hide">
            {order.items?.map((item) => (
              <div key={item.id} className="flex items-center gap-2 text-sm">
                <span className="text-lg flex-shrink-0">
                  {getItemEmoji(item.menuItem?.name || "")}
                </span>
                <span className="text-carbon-700 font-bold flex-shrink-0">
                  {item.quantity}x
                </span>
                <span className="text-carbon-600 truncate flex-1">
                  {item.menuItem?.name || "Producto"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Total - More Prominent */}
        <div className="flex items-center justify-between mb-5 p-4 bg-gradient-to-r from-sage-50 to-sage-100/50 rounded-xl border border-sage-200 mt-auto flex-shrink-0">
          <span className="text-sm font-medium text-carbon-600">Total</span>
          <span className="text-2xl font-bold text-carbon-900 tracking-tight">
            ${order.totalAmount.toLocaleString("es-CO")}
          </span>
        </div>

        {/* Actions - Swipe-friendly layout */}
        <div className="flex gap-3 pt-4 border-t border-sage-100 flex-shrink-0">
          <Button
            variant="ghost"
            size="lg"
            onClick={() => onViewDetail(order.id)}
            className="flex-1 min-h-[48px] rounded-xl font-bold"
          >
            <Eye className="w-5 h-5 mr-2" />
            Ver Detalle
          </Button>
          {nextStatus && (
            <Button
              variant="primary"
              size="lg"
              onClick={handleStatusChange}
              disabled={isPending}
              className="flex-1 min-h-[48px] rounded-xl font-bold shadow-soft-md"
            >
              <nextStatus.icon className="w-5 h-5 mr-2" />
              {nextStatus.label}
            </Button>
          )}
        </div>
      </div>
    </article>
            <Button
              variant="primary"
              size="lg"
              onClick={handleStatusChange}
              disabled={isPending}
              isLoading={isPending}
              className="flex-1 min-h-[48px]"
            >
              {!isPending && <nextStatus.icon className="w-5 h-5 mr-2" />}
              {nextStatus.label}
              {!isPending && <ArrowRight className="w-4 h-4 ml-1" />}
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
