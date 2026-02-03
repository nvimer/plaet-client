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
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { OrderTypeBadge } from "./OrderTypeBadge";
import { cn } from "@/utils/cn";

interface OrderCardProps {
  order: Order;
  onViewDetail: (orderId: string) => void;
}

const STATUS_CONFIG = {
  [OrderStatus.PENDING]: {
    label: "Pendiente",
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    badge: "bg-amber-100 text-amber-700 border-amber-200",
    accent: "bg-amber-500",
  },
  [OrderStatus.IN_KITCHEN]: {
    label: "En Cocina",
    bg: "bg-orange-50",
    border: "border-orange-200",
    text: "text-orange-700",
    badge: "bg-orange-100 text-orange-700 border-orange-200",
    accent: "bg-orange-500",
  },
  [OrderStatus.READY]: {
    label: "Listo",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
    accent: "bg-emerald-500",
  },
  [OrderStatus.DELIVERED]: {
    label: "Entregado",
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
    badge: "bg-blue-100 text-blue-700 border-blue-200",
    accent: "bg-blue-500",
  },
  [OrderStatus.PAID]: {
    label: "Pagado",
    bg: "bg-sage-50",
    border: "border-sage-200",
    text: "text-sage-700",
    badge: "bg-sage-100 text-sage-700 border-sage-200",
    accent: "bg-sage-500",
  },
  [OrderStatus.SENT_TO_CASHIER]: {
    label: "En Caja",
    bg: "bg-purple-50",
    border: "border-purple-200",
    text: "text-purple-700",
    badge: "bg-purple-100 text-purple-700 border-purple-200",
    accent: "bg-purple-500",
  },
  [OrderStatus.CANCELLED]: {
    label: "Cancelado",
    bg: "bg-rose-50",
    border: "border-rose-200",
    text: "text-rose-700",
    badge: "bg-rose-100 text-rose-700 border-rose-200",
    accent: "bg-rose-500",
  },
} as const;

/**
 * OrderCard Component
 *
 * Modern card for a single order: clear hierarchy, status accent, quick actions.
 * Touch-friendly design with status-based color coding.
 */
export function OrderCard({ order, onViewDetail }: OrderCardProps) {
  const { mutate: updateStatus, isPending } = useUpdateOrderStatus();

  const config = STATUS_CONFIG[order.status];
  const shortId = `#${order.id.slice(-6).toUpperCase()}`;
  
  const createdTime = new Date(order.createdAt).toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const itemsCount = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const getNextStatus = (): {
    status: OrderStatus;
    label: string;
    icon: typeof ChefHat;
  } | null => {
    switch (order.status) {
      case OrderStatus.PENDING:
        return { status: OrderStatus.IN_KITCHEN, label: "Enviar a Cocina", icon: ChefHat };
      case OrderStatus.IN_KITCHEN:
        return { status: OrderStatus.READY, label: "Marcar Listo", icon: CheckCircle };
      case OrderStatus.READY:
        return { status: OrderStatus.DELIVERED, label: "Entregar", icon: Truck };
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
      }
    );
  };

  return (
    <article
      className={cn(
        "group relative overflow-hidden",
        "bg-white rounded-2xl border-2 shadow-sm",
        "transition-all duration-200",
        "hover:shadow-md hover:border-sage-200",
        config.border
      )}
    >
      {/* Status accent bar */}
      <div className={cn("h-1.5 w-full", config.accent)} aria-hidden />

      <div className="p-5 sm:p-6">
        {/* Header: ID + time + status */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-bold text-carbon-900">{shortId}</h3>
              <span className="text-sm text-carbon-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {createdTime}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              {order.table && (
                <div className="flex items-center gap-1.5 text-carbon-600">
                  <MapPin className="w-4 h-4 text-sage-600" />
                  <span className="font-medium">Mesa {order.table.number}</span>
                </div>
              )}
              {order.waiter && (
                <div className="flex items-center gap-1.5 text-carbon-600">
                  <User className="w-4 h-4" />
                  <span>{order.waiter.firstName} {order.waiter.lastName}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex-shrink-0">
            <OrderStatusBadge status={order.status} />
          </div>
        </div>

        {/* Order Type Badge */}
        <div className="mb-4">
          <OrderTypeBadge type={order.type} />
        </div>

        {/* Items Preview */}
        <div className={cn("mb-4 p-3 rounded-xl border", config.bg, config.border)}>
          <p className="text-sm font-medium text-carbon-700 mb-2">
            <span className={cn("font-bold", config.text)}>{itemsCount}</span> productos
          </p>
          <div className="space-y-1">
            {order.items?.slice(0, 2).map((item) => (
              <p key={item.id} className="text-sm text-carbon-600 truncate">
                • {item.quantity}x {item.menuItem?.name || "Producto"}
              </p>
            ))}
            {(order.items?.length || 0) > 2 && (
              <p className="text-sm text-carbon-500 italic">
                +{(order.items?.length || 0) - 2} más...
              </p>
            )}
          </div>
        </div>

        {/* Total */}
        <div className="flex items-center justify-between mb-4 p-3 bg-sage-50 rounded-xl border border-sage-100">
          <span className="text-sm font-medium text-carbon-700">Total</span>
          <span className="text-xl font-bold text-sage-700">
            ${order.totalAmount.toLocaleString("es-CO")}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t border-sage-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewDetail(order.id)}
            className="flex-1 min-h-[44px]"
          >
            <Eye className="w-4 h-4 mr-2" />
            Ver Detalle
          </Button>
          {nextStatus && (
            <Button
              variant="primary"
              size="sm"
              onClick={handleStatusChange}
              disabled={isPending}
              isLoading={isPending}
              className="flex-1 min-h-[44px]"
            >
              {!isPending && <nextStatus.icon className="w-4 h-4 mr-2" />}
              {nextStatus.label}
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
