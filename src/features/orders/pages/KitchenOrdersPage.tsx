import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { OrderStatus } from "@/types";
import type { AxiosErrorWithResponse } from "@/types/common";
import { useOrders } from "../hooks";
import { useUpdateOrderStatus } from "../hooks/useUpdateOrderStatus";
import { FullScreenLayout } from "@/layouts/FullScreenLayout";
import { Button, Card, Skeleton, EmptyState } from "@/components";
import { OrderStatusBadge } from "../components/OrderStatusBadge";
import { ROUTES, getOrderDetailRoute } from "@/app/routes";
import { toast } from "sonner";
import {
  ChefHat,
  Clock,
  CheckCircle,
  ArrowRight,
  UtensilsCrossed,
} from "lucide-react";
import type { Order } from "@/types";

/**
 * KitchenOrdersPage Component
 *
 * Full-screen page optimized for kitchen view.
 * Shows orders sorted by arrival time (oldest first).
 * Allows kitchen managers to change order statuses.
 *
 * Features:
 * - Orders sorted by creation time (oldest first)
 * - Large, easy-to-read order cards
 * - Quick status change buttons
 * - Filter by status (IN_KITCHEN, PENDING, READY)
 * - Visual indicators for order priority
 */
export function KitchenOrdersPage() {
  const navigate = useNavigate();
  const { data: orders, isLoading, error } = useOrders();
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateOrderStatus();

  // Filter state - only show orders relevant to kitchen
  const [statusFilter, setStatusFilter] = useState<
    OrderStatus.IN_KITCHEN | OrderStatus.PENDING | OrderStatus.READY | "ALL"
  >("ALL");

  // Filter and sort orders
  const kitchenOrders = useMemo(() => {
    if (!orders) return [];

    // Filter orders relevant to kitchen
    const relevantStatuses = [
      OrderStatus.PENDING,
      OrderStatus.IN_KITCHEN,
      OrderStatus.READY,
    ];

    let filtered = orders.filter((order) =>
      relevantStatuses.includes(order.status)
    );

    // Apply status filter if not "ALL"
    if (statusFilter !== "ALL") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    // Sort by creation time (oldest first) - most urgent orders first
    return filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateA - dateB;
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
      pending:
        relevantOrders.filter((o) => o.status === OrderStatus.PENDING).length,
      inKitchen:
        relevantOrders.filter((o) => o.status === OrderStatus.IN_KITCHEN)
          .length,
      ready:
        relevantOrders.filter((o) => o.status === OrderStatus.READY).length,
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

          toast.success(statusMessages[newStatus] || "Estado actualizado", {
            icon: "✅",
          });
        },
        onError: (error: AxiosErrorWithResponse) => {
          toast.error("Error al actualizar estado", {
            description:
              error.response?.data?.message || error.message,
            icon: "❌",
          });
        },
      }
    );
  };

  // Handle view detail
  const handleViewDetail = (orderId: string) => {
    navigate(getOrderDetailRoute(orderId));
  };

  // ============ LOADING STATE ===========
  if (isLoading) {
    return (
      <FullScreenLayout title="Cocina" backRoute={ROUTES.DASHBOARD}>
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </FullScreenLayout>
    );
  }

  // ========== ERROR STATE =============
  if (error) {
    return (
      <FullScreenLayout title="Cocina" backRoute={ROUTES.DASHBOARD}>
        <div className="flex items-center justify-center min-h-[400px]">
          <Card>
            <div className="text-center p-8">
              <div className="text-4xl mb-4">⚠️</div>
              <h2 className="text-2xl font-semibold text-carbon-900 mb-2">
                Error al cargar los pedidos
              </h2>
              <p className="text-carbon-600 mb-4">{error.message}</p>
              <Button onClick={() => window.location.reload()}>
                Reintentar
              </Button>
            </div>
          </Card>
        </div>
      </FullScreenLayout>
    );
  }

  // =============== MAIN RENDER =================
  return (
    <FullScreenLayout title="Cocina" backRoute={ROUTES.DASHBOARD}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* ============ HEADER =============== */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-semibold text-carbon-900 tracking-tight mb-2">
              Vista de Cocina
            </h1>
            <p className="text-carbon-600">
              Órdenes ordenadas por tiempo de llegada (más antiguas primero)
            </p>
          </div>
        </div>

        {/* ============ STATUS FILTERS =============== */}
        <div className="flex gap-3 flex-wrap">
          <Button
            variant={statusFilter === "ALL" ? "primary" : "ghost"}
            size="md"
            onClick={() => setStatusFilter("ALL")}
          >
            Todas ({counts.total})
          </Button>
          <Button
            variant={
              statusFilter === OrderStatus.PENDING ? "primary" : "ghost"
            }
            size="md"
            onClick={() => setStatusFilter(OrderStatus.PENDING)}
          >
            <Clock className="w-4 h-4 mr-2" />
            Pendientes ({counts.pending})
          </Button>
          <Button
            variant={
              statusFilter === OrderStatus.IN_KITCHEN ? "primary" : "ghost"
            }
            size="md"
            onClick={() => setStatusFilter(OrderStatus.IN_KITCHEN)}
          >
            <ChefHat className="w-4 h-4 mr-2" />
            En Cocina ({counts.inKitchen})
          </Button>
          <Button
            variant={statusFilter === OrderStatus.READY ? "primary" : "ghost"}
            size="md"
            onClick={() => setStatusFilter(OrderStatus.READY)}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Listos ({counts.ready})
          </Button>
        </div>

        {/* ============ ORDERS GRID ============= */}
        {kitchenOrders.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
            icon={<ChefHat />}
            title="No hay pedidos en cocina"
            description={
              statusFilter === "ALL"
                ? "No hay pedidos pendientes, en cocina o listos"
                : "No hay pedidos con este estado"
            }
          />
        )}
      </div>
    </FullScreenLayout>
  );
}

/**
 * KitchenOrderCard Component
 *
 * Large, easy-to-read card optimized for kitchen display.
 * Shows order details and quick action buttons.
 */
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
  // Calculate time since order creation
  const timeSinceCreation = useMemo(() => {
    const now = new Date().getTime();
    const created = new Date(order.createdAt).getTime();
    const diffMinutes = Math.floor((now - created) / (1000 * 60));

    if (diffMinutes < 1) return "Hace menos de 1 minuto";
    if (diffMinutes === 1) return "Hace 1 minuto";
    if (diffMinutes < 60) return `Hace ${diffMinutes} minutos`;

    const hours = Math.floor(diffMinutes / 60);
    if (hours === 1) return "Hace 1 hora";
    return `Hace ${hours} horas`;
  }, [order.createdAt]);

  // Get next status based on current status
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
  const nextStatusLabel: Record<OrderStatus, string> = {
    [OrderStatus.IN_KITCHEN]: "En Cocina",
    [OrderStatus.READY]: "Listo",
    [OrderStatus.DELIVERED]: "Entregado",
    [OrderStatus.PENDING]: "Pendiente",
    [OrderStatus.PAID]: "Pagado",
    [OrderStatus.SENT_TO_CASHIER]: "Enviado a Caja",
    [OrderStatus.CANCELLED]: "Cancelado",
  };

  return (
    <Card variant="elevated" padding="lg" className="hover:shadow-lg transition-all">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-2xl font-bold text-carbon-900">
              Pedido #{order.id.slice(-6).toUpperCase()}
            </h3>
            <OrderStatusBadge status={order.status} />
          </div>
          <div className="flex items-center gap-4 text-sm text-carbon-600">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{timeSinceCreation}</span>
            </div>
            {order.table && (
              <div className="flex items-center gap-1">
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
          <h4 className="font-semibold text-carbon-900 mb-2">Items:</h4>
          <div className="space-y-1">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-carbon-700">
                  {item.quantity}x{" "}
                  {item.menuItem?.name || `Item #${item.menuItemId}`}
                </span>
                {item.notes && (
                  <span className="text-carbon-500 italic text-xs">
                    ({item.notes})
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
          <p className="text-sm text-yellow-800 font-medium">Notas:</p>
          <p className="text-sm text-yellow-700">{order.notes}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-sage-border-subtle">
        {nextStatus && (
          <Button
            variant="primary"
            size="md"
            onClick={() => onStatusChange(order.id, nextStatus)}
            disabled={isUpdating}
            className="flex-1"
          >
            {nextStatus === OrderStatus.IN_KITCHEN && (
              <ChefHat className="w-4 h-4 mr-2" />
            )}
            {nextStatus === OrderStatus.READY && (
              <CheckCircle className="w-4 h-4 mr-2" />
            )}
            {nextStatus === OrderStatus.DELIVERED && (
              <ArrowRight className="w-4 h-4 mr-2" />
            )}
            Marcar como {nextStatusLabel[nextStatus]}
          </Button>
        )}
        <Button
          variant="ghost"
          size="md"
          onClick={() => onViewDetail(order.id)}
        >
          Ver Detalle
        </Button>
      </div>
    </Card>
  );
}
