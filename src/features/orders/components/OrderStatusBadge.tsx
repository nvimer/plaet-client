import { Badge } from "@/components";
import { OrderStatus } from "@/types";
import {
  CheckCircle,
  ChefHat,
  Clock,
  CreditCard,
  ReceiptText,
  Truck,
  XCircle,
} from "lucide-react";

// =========== TYPES ============
interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

/**
 * OrderStatusBadge Component
 *
 * Displays order status with appropiate color and icon
 */
export function OrderStatusBadge({
  status,
  size = "md",
  showIcon = true,
}: OrderStatusBadgeProps) {
  // =========== STATUS CONFIG =========
  const statusConfig: Record<
    OrderStatus,
    {
      label: string;
      variant: "warning" | "info" | "success" | "error" | "neutral";
      icon: typeof Clock;
      className: string;
    }
  > = {
    [OrderStatus.OPEN]: {
      label: "Abierto",
      variant: "info",
      icon: Clock,
      className: "bg-blue-50 text-blue-700 border-blue-300",
    },
    [OrderStatus.SENT_TO_CASHIER]: {
      label: "En caja",
      variant: "warning",
      icon: ReceiptText,
      className: "bg-yellow-50 text-yellow-700 border-yellow-300",
    },
    [OrderStatus.PAID]: {
      label: "Pagado",
      variant: "success",
      icon: CreditCard,
      className: "bg-emerald-50 text-emerald-700 border-emerald-300",
    },
    [OrderStatus.CANCELLED]: {
      label: "Cancelado",
      variant: "error",
      icon: XCircle,
      className: "bg-red-50 text-red-700 border-red-300",
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  // ============= RENDER ==============
  return (
    <Badge
      variant={config.variant}
      size={size}
      className={`${config.className} border`}
    >
      {showIcon && <Icon className="w-3.5 h-3.5 mr-1.5" />}
      {config.label}
    </Badge>
  );
}
