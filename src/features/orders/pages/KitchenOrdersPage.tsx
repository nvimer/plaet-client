import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { OrderStatus } from "@/types";
import type { AxiosErrorWithResponse } from "@/types/common";
import { useOrders } from "../hooks";
import { useUpdateOrderStatus } from "../hooks/useUpdateOrderStatus";
import { SidebarLayout } from "@/layouts/SidebarLayout";
import { Button, Card, Skeleton, EmptyState, Badge } from "@/components";
import { OrderStatusBadge } from "../components/OrderStatusBadge";
import { ROUTES, getOrderDetailRoute } from "@/app/routes";
import { toast } from "sonner";
import {
  ChefHat,
  Clock,
  CheckCircle,
  ArrowRight,
  UtensilsCrossed,
  RefreshCw,
  AlertCircle,
  Timer,
} from "lucide-react";
import type { Order } from "@/types";
import { cn } from "@/utils/cn";

/**
 * KitchenOrdersPage Component
 * 
 * Kitchen display for order management.
 * Shows orders sorted by arrival time (oldest first).
 * Allows kitchen staff to update order statuses.
 * 
 * Features:
 * - Auto-refresh every 30 seconds
 * - Orders sorted by urgency (creation time)
 * - Large touch-friendly buttons for tablet/kiosk use
 * - Visual priority indicators
 * - Status filtering
 */
export function KitchenOrdersPage() {
  const navigate = useNavigate();
  const { data: orders, isLoading, error, refetch } = useOrders();
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateOrderStatus();

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 30000);

    return () => clearInterval(interval);
  }, [refetch]);

  // Filter state
  const [statusFilter, setStatusFilter] = useState<
    OrderStatus.IN_KITCHEN | OrderStatus.PENDING | OrderStatus.READY | "ALL"
  >("ALL");

  // Filter and sort orders
  const kitchenOrders = useMemo(() => {
    if (!orders) return [];

    const relevantStatuses = [
      OrderStatus.PENDING,
      OrderStatus.IN_KITCHEN,
      OrderStatus.READY,
    ];

    let filtered = orders.filter((order) =>
      relevantStatuses.includes(order.status)
    );

    if (statusFilter !== "ALL") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    // Sort by creation time (oldest first) - most urgent
    return filtered.sort((a, b) => {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
  }, [orders, statusFilter]);

  // Calculate counts
  const counts = useMemo(() => {
    if (!orders) {
      return { pending: 0, inKitchen: 0, ready: 0, total: 0 };
    }

    const relevantOrders = orders.filter((order) =>
      [OrderStatus.PENDING, OrderStatus.IN_KITCHEN, OrderStatus.READY].includes(
        order.status
      )
    );

    return {
      pending: relevantOrders.filter((o) => o.status === OrderStatus.PENDING).length,
      inKitchen: relevantOrders.filter((o) => o.status === OrderStatus.IN_KITCHEN).length,
      ready: relevantOrders.filter((o) => o.status === OrderStatus.READY).length,
      total: relevantOrders.length,
    };
  }, [orders]);

  // Handle status change
  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateStatus(
      { id: orderId, orderStatus: newStatus },
      {
        onSuccess: () => {
          const statusMessages: Record<OrderStatus, string> = {
            [OrderStatus.PENDING]: "Pedido marcado como pendiente",
            [OrderStatus.IN_KITCHEN]: "Pedido en preparación",
            [OrderStatus.READY]: "Pedido listo para entregar",
            [OrderStatus.DELIVERED]: "Pedido entregado",
            [OrderStatus.PAID]: "Pedido pagado",
            [OrderStatus.SENT_TO_CASHIER]: "Pedido enviado a caja",
            [OrderStatus.CANCELLED]: "Pedido cancelado",
          };

          toast.success(statusMessages[newStatus] || "Estado actualizado");
        },
        onError: (error: AxiosErrorWithResponse) => {
          toast.error("Error al actualizar estado", {
            description: error.response?.data?.message || error.message,
          });
        },
      }
    );
  };

  // Handle view detail
  const handleViewDetail = (orderId: string) => {
    navigate(getOrderDetailRoute(orderId));
  };

  // Loading state
  if (isLoading) {
    return (
      <SidebarLayout
        title="Vista de Cocina"
        subtitle="Gestión de pedidos en preparación"
        backRoute={ROUTES.DASHBOARD}
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} variant="card" height={100} />
            ))}
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} variant="card" height={300} />
            ))}
          </div>
        </div>
      </SidebarLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <SidebarLayout
        title="Vista de Cocina"
        subtitle="Gestión de pedidos en preparación"
        backRoute={ROUTES.DASHBOARD}
      >
        <div className="flex items-center justify-center min-h-[50vh]">
          <Card variant="elevated" padding="lg" className="max-w-md w-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-rose-500" />
              </div>
              <h2 className="text-xl font-bold text-carbon-900 mb-2">
                Error al cargar pedidos
              </h2>
              <p className="text-carbon-500 mb-6">{error.message}</p>
              <Button variant="primary" size="lg" onClick={() => window.location.reload()} fullWidth>
                Reintentar
              </Button>
            </div>
          </Card>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout
      title="Vista de Cocina"
      subtitle="Gestión de pedidos en preparación"
      backRoute={ROUTES.DASHBOARD}
      actions={
        <div className="flex items-center gap-2 text-sm text-carbon-500 bg-sage-50 px-3 py-1.5 rounded-lg">
          <RefreshCw className="w-4 h-4" />
          <span>Auto-refresh: 30s</span>
        </div>
      }
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total"
          count={counts.total}
          icon={<ChefHat className="w-5 h-5" />}
          color="sage"
        />
        <StatCard
          label="Pendientes"
          count={counts.pending}
          icon={<Clock className="w-5 h-5" />}
          color="amber"
          isUrgent={counts.pending > 3}
        />
        <StatCard
          label="En Cocina"
          count={counts.inKitchen}
          icon={<Timer className="w-5 h-5" />}
          color="orange"
        />
        <StatCard
          label="Listos"
          count={counts.ready}
          icon={<CheckCircle className="w-5 h-5" />}
          color="emerald"
        />
      </div>

      {/* Pending Alert */}
      {counts.pending > 0 && (
        <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
              {counts.pending}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-amber-900">
                Pedidos Pendientes
              </h3>
              <p className="text-amber-700">
                {counts.pending === 1 
                  ? "Hay 1 pedido esperando ser atendido" 
                  : `Hay ${counts.pending} pedidos esperando ser atendidos`
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <FilterButton
          active={statusFilter === "ALL"}
          onClick={() => setStatusFilter("ALL")}
          icon={<ChefHat className="w-5 h-5" />}
          label="Todas"
          count={counts.total}
        />
        <FilterButton
          active={statusFilter === OrderStatus.PENDING}
          onClick={() => setStatusFilter(OrderStatus.PENDING)}
          icon={<Clock className="w-5 h-5" />}
          label="Pendientes"
          count={counts.pending}
          color="amber"
        />
        <FilterButton
          active={statusFilter === OrderStatus.IN_KITCHEN}
          onClick={() => setStatusFilter(OrderStatus.IN_KITCHEN)}
          icon={<Timer className="w-5 h-5" />}
          label="En Cocina"
          count={counts.inKitchen}
          color="orange"
        />
        <FilterButton
          active={statusFilter === OrderStatus.READY}
          onClick={() => setStatusFilter(OrderStatus.READY)}
          icon={<CheckCircle className="w-5 h-5" />}
          label="Listos"
          count={counts.ready}
          color="emerald"
        />
      </div>

      {/* Orders Grid */}
      {kitchenOrders.length > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {kitchenOrders.map((order) => (
            <KitchenOrderCard
              key={order.id}
              order={order}
              onStatusChange={handleStatusChange}
              onViewDetail={handleViewDetail}
              isUpdating={isUpdating}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<ChefHat className="w-16 h-16" />}
          title="No hay pedidos en cocina"
          description={
            statusFilter === "ALL"
              ? "No hay pedidos pendientes, en cocina o listos"
              : "No hay pedidos con este estado"
          }
        />
      )}
    </SidebarLayout>
  );
}

// Stat Card Component
interface StatCardProps {
  label: string;
  count: number;
  icon: React.ReactNode;
  color: "sage" | "amber" | "orange" | "emerald";
  isUrgent?: boolean;
}

function StatCard({ label, count, icon, color, isUrgent }: StatCardProps) {
  const colorClasses = {
    sage: "bg-sage-50 border-sage-200 text-sage-700",
    amber: "bg-amber-50 border-amber-200 text-amber-700",
    orange: "bg-orange-50 border-orange-200 text-orange-700",
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-700",
  };

  return (
    <Card className={cn("p-4", colorClasses[color])}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">{label}</p>
          <p className={cn("text-2xl font-bold", isUrgent && "text-rose-600")}>
            {count}
          </p>
        </div>
        <div className="opacity-60">{icon}</div>
      </div>
      {isUrgent && (
        <Badge variant="error" size="sm" className="mt-2">
          Urgente
        </Badge>
      )}
    </Card>
  );
}

// Filter Button Component
interface FilterButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  count: number;
  color?: "default" | "amber" | "orange" | "emerald";
}

function FilterButton({ active, onClick, icon, label, count, color = "default" }: FilterButtonProps) {
  const colorClasses = {
    default: "",
    amber: active ? "bg-amber-100 text-amber-800 border-amber-300" : "",
    orange: active ? "bg-orange-100 text-orange-800 border-orange-300" : "",
    emerald: active ? "bg-emerald-100 text-emerald-800 border-emerald-300" : "",
  };

  return (
    <Button
      variant={active ? "primary" : "outline"}
      size="lg"
      onClick={onClick}
      className={cn(
        "min-h-[56px] flex items-center gap-2",
        !active && "border-2",
        colorClasses[color]
      )}
    >
      {icon}
      <span>{label}</span>
      <span className={cn(
        "ml-2 px-2 py-0.5 text-xs font-bold rounded-full",
        active ? "bg-white text-sage-700" : "bg-sage-100 text-sage-600"
      )}>
        {count}
      </span>
    </Button>
  );
}

// Kitchen Order Card Component
interface KitchenOrderCardProps {
  order: Order;
  onStatusChange: (orderId: string, status: OrderStatus) => void;
  onViewDetail: (orderId: string) => void;
  isUpdating: boolean;
}

function KitchenOrderCard({
  order,
  onStatusChange,
  onViewDetail,
  isUpdating,
}: KitchenOrderCardProps) {
  // Calculate time since creation
  const timeInfo = useMemo(() => {
    const now = new Date().getTime();
    const created = new Date(order.createdAt).getTime();
    const diffMinutes = Math.floor((now - created) / (1000 * 60));

    let text: string;
    let isWarning = false;

    if (diffMinutes < 1) {
      text = "Hace menos de 1 min";
    } else if (diffMinutes === 1) {
      text = "Hace 1 minuto";
    } else if (diffMinutes < 60) {
      text = `Hace ${diffMinutes} minutos`;
      isWarning = diffMinutes > 20; // Warning if > 20 minutes
    } else {
      const hours = Math.floor(diffMinutes / 60);
      text = hours === 1 ? "Hace 1 hora" : `Hace ${hours} horas`;
      isWarning = true;
    }

    return { text, isWarning, diffMinutes };
  }, [order.createdAt]);

  // Get next status
  const getNextStatus = (): OrderStatus | null => {
    switch (order.status) {
      case OrderStatus.PENDING:
        return OrderStatus.IN_KITCHEN;
      case OrderStatus.IN_KITCHEN:
        return OrderStatus.READY;
      case OrderStatus.READY:
        return OrderStatus.DELIVERED;
      default:
        return null;
    }
  };

  const nextStatus = getNextStatus();
  
  const nextStatusConfig: Record<OrderStatus, { label: string; icon: React.ReactNode; color: string }> = {
    [OrderStatus.IN_KITCHEN]: { 
      label: "En Cocina", 
      icon: <Timer className="w-5 h-5" />,
      color: "bg-orange-500 hover:bg-orange-600"
    },
    [OrderStatus.READY]: { 
      label: "Listo", 
      icon: <CheckCircle className="w-5 h-5" />,
      color: "bg-emerald-500 hover:bg-emerald-600"
    },
    [OrderStatus.DELIVERED]: { 
      label: "Entregado", 
      icon: <ArrowRight className="w-5 h-5" />,
      color: "bg-blue-500 hover:bg-blue-600"
    },
    [OrderStatus.PENDING]: { label: "Pendiente", icon: <Clock className="w-5 h-5" />, color: "" },
    [OrderStatus.PAID]: { label: "Pagado", icon: <CheckCircle className="w-5 h-5" />, color: "" },
    [OrderStatus.SENT_TO_CASHIER]: { label: "Enviado a Caja", icon: <ArrowRight className="w-5 h-5" />, color: "" },
    [OrderStatus.CANCELLED]: { label: "Cancelado", icon: <AlertCircle className="w-5 h-5" />, color: "" },
  };

  return (
    <Card variant="elevated" padding="lg" className="hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold text-carbon-900">
              Pedido #{order.id.slice(-6).toUpperCase()}
            </h3>
            <OrderStatusBadge status={order.status} />
          </div>
          <div className="flex items-center gap-4 text-sm text-carbon-600">
            <div className={cn("flex items-center gap-1.5", timeInfo.isWarning && "text-rose-600 font-semibold")}>
              <Clock className="w-4 h-4" />
              <span>{timeInfo.text}</span>
              {timeInfo.isWarning && <span className="text-xs">(¡Urgente!)</span>}
            </div>
            {order.table && (
              <div className="flex items-center gap-1.5">
                <UtensilsCrossed className="w-4 h-4" />
                <span>Mesa {order.table.number}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Items */}
      {order.items && order.items.length > 0 && (
        <div className="mb-4 space-y-2">
          <h4 className="text-sm font-semibold text-carbon-700 uppercase tracking-wide">Items:</h4>
          <div className="space-y-2">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-sage-50 rounded-lg"
              >
                <span className="font-medium text-carbon-700">
                  {item.quantity}x {item.menuItem?.name || `Item #${item.menuItemId}`}
                </span>
                {item.notes && (
                  <span className="text-xs text-carbon-500 italic bg-yellow-100 px-2 py-0.5 rounded">
                    {item.notes}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {order.notes && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800 font-medium">📝 Notas: {order.notes}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-sage-100">
        {nextStatus && (
          <Button
            variant="primary"
            size="lg"
            onClick={() => onStatusChange(order.id, nextStatus)}
            disabled={isUpdating}
            className={cn("flex-1", nextStatusConfig[nextStatus].color)}
          >
            {nextStatusConfig[nextStatus].icon}
            <span className="ml-2">Marcar como {nextStatusConfig[nextStatus].label}</span>
          </Button>
        )}
        <Button
          variant="ghost"
          size="lg"
          onClick={() => onViewDetail(order.id)}
          className="min-w-[120px]"
        >
          Ver Detalle
        </Button>
      </div>
    </Card>
  );
}
