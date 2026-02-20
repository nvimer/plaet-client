import { useParams, useNavigate } from "react-router-dom";
import { OrderStatus } from "@/types";
import type { AxiosErrorWithResponse } from "@/types/common";
import { useOrder, useDeleteOrder, useUpdateOrderStatus } from "../hooks";
import {
  Calendar,
  CheckCircle,
  ChefHat,
  Clock,
  CreditCard,
  DollarSign,
  MapPin,
  Trash2,
  Truck,
  User,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { SidebarLayout } from "@/layouts/SidebarLayout";
import { OrderStatusBadge } from "../components/OrderStatusBadge";
import { OrderTypeBadge } from "../components/OrderTypeBadge";
import {
  Button,
  Card,
  ConfirmDialog,
  Skeleton,
  EmptyState,
} from "@/components";
import { ROUTES } from "@/app/routes";
import { useState } from "react";

/**
 * OrderDetailPage Component
 *
 * Full-screen page showing complete order details with actions.
 * Replaces the previous modal-based approach for better UX.
 */
export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: order, isLoading, error } = useOrder(id);
  const { mutate: updateStatus, isPending: isUpdatingStatus } =
    useUpdateOrderStatus();
  const { mutate: deleteOrder, isPending: isDeleting } = useDeleteOrder();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Early returns
  if (isLoading) {
    return (
      <SidebarLayout title="Cargando..." backRoute={ROUTES.ORDERS}>
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-64" />
          <Skeleton className="h-48" />
        </div>
      </SidebarLayout>
    );
  }

  if (error || !order) {
    return (
      <SidebarLayout title="Error" backRoute={ROUTES.ORDERS}>
        <EmptyState
          icon={<XCircle />}
          title="Pedido no encontrado"
          description="El pedido que buscas no existe o fue eliminado"
          actionLabel="Volver a Pedidos"
          onAction={() => navigate(ROUTES.ORDERS)}
        />
      </SidebarLayout>
    );
  }

  // Computed values
  const shortId = `#${order.id.slice(-6).toUpperCase()}`;
  const createdDate = new Date(order.createdAt).toLocaleString("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const createdTime = new Date(order.createdAt).toLocaleString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const paidAmount = order.payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
  const remainingAmount = order.totalAmount - paidAmount;

  // Status actions
  const statusActions: {
    from: OrderStatus[];
    to: OrderStatus;
    label: string;
    icon: typeof ChefHat;
    variant: "primary" | "secondary" | "outline";
  }[] = [
    {
      from: [OrderStatus.PENDING],
      to: OrderStatus.IN_KITCHEN,
      label: "Enviar a Cocina",
      icon: ChefHat,
      variant: "primary",
    },
    {
      from: [OrderStatus.IN_KITCHEN],
      to: OrderStatus.READY,
      label: "Marcar Listo",
      icon: CheckCircle,
      variant: "primary",
    },
    {
      from: [OrderStatus.READY],
      to: OrderStatus.DELIVERED,
      label: "Entregar",
      icon: Truck,
      variant: "primary",
    },
    {
      from: [OrderStatus.PENDING, OrderStatus.IN_KITCHEN],
      to: OrderStatus.CANCELLED,
      label: "Cancelar",
      icon: XCircle,
      variant: "outline",
    },
  ];

  const availableActions = statusActions.filter((action) =>
    action.from.includes(order.status),
  );

  // Handlers
  const handleStatusChange = (newStatus: OrderStatus) => {
    updateStatus(
      { id: order.id, orderStatus: newStatus },
      {
        onSuccess: () => {
          toast.success("Estado actualizado", { icon: "✅" });
        },
        onError: (error: AxiosErrorWithResponse) => {
          toast.error("Error al actualizar", {
            description: error.response?.data?.message || error.message,
          });
        },
      },
    );
  };

  const handleDelete = () => {
    deleteOrder(order.id, {
      onSuccess: () => {
        toast.success("Pedido eliminado", { icon: "🗑️" });
        navigate(ROUTES.ORDERS);
      },
      onError: (error: AxiosErrorWithResponse) => {
        toast.error("Error al eliminar", {
          description: error.response?.data?.message || error.message,
        });
      },
    });
  };

  return (
    <>
      <SidebarLayout
        title={`Pedido ${shortId}`}
        subtitle={`Creado ${createdDate} a las ${createdTime}`}
        backRoute={ROUTES.ORDERS}
      >
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Status & Type */}
          <div className="flex flex-wrap items-center gap-3">
            <OrderStatusBadge status={order.status} size="lg" />
            <OrderTypeBadge type={order.type} size="md" />
          </div>

          {/* Order Info */}
          <Card variant="bordered" padding="md">
            <div className="grid grid-cols-2 gap-4">
              {order.table && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-sage-green-600" />
                  <span className="text-carbon-700">
                    Mesa <strong>{order.table.number}</strong>
                  </span>
                </div>
              )}

              {order.waiter && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-carbon-500" />
                  <span className="text-carbon-700">
                    {order.waiter.firstName} {order.waiter.lastName}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-carbon-500" />
                <span className="text-carbon-700">{createdDate}</span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-carbon-500" />
                <span className="text-carbon-700">{createdTime}</span>
              </div>
            </div>
          </Card>

          {/* Items List */}
          <div>
            <h4 className="font-semibold text-carbon-900 mb-3">
              Productos ({order.items?.length || 0})
            </h4>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {order.items?.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-sage-50 rounded-xl"
                >
                  <div className="flex-1">
                    <p className="font-medium text-carbon-900">
                      {item.quantity}x {item.menuItem?.name || "Producto"}
                    </p>
                    {item.notes && (
                      <p className="text-sm text-carbon-500 italic mt-1">
                        Nota: {item.notes}
                      </p>
                    )}
                  </div>
                  <p className="font-semibold text-carbon-900 text-lg">
                    $
                    {(item.priceAtOrder * item.quantity).toLocaleString(
                      "es-CO",
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <Card
            variant="elevated"
            padding="md"
            className="bg-gradient-to-r from-sage-green-50 to-sage-green-100"
          >
            <div className="space-y-2">
              <div className="flex justify-between text-carbon-700">
                <span>Subtotal</span>
                <span>${order.totalAmount.toLocaleString("es-CO")}</span>
              </div>
              {paidAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Pagado</span>
                  <span>-${paidAmount.toLocaleString("es-CO")}</span>
                </div>
              )}
              <div className="flex justify-between text-2xl font-bold text-carbon-900 pt-2 border-t border-sage-green-200">
                <span>Total</span>
                <span>${remainingAmount.toLocaleString("es-CO")}</span>
              </div>
            </div>
          </Card>

          {/* Payments */}
          {order.payments && order.payments.length > 0 && (
            <div>
              <h4 className="font-semibold text-carbon-900 mb-3">
                Pagos Registrados
              </h4>
              <div className="space-y-2">
                {order.payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200"
                  >
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-green-600" />
                      <span className="text-carbon-700 font-medium">
                        {payment.method}
                      </span>
                    </div>
                    <span className="font-semibold text-green-700 text-lg">
                      ${payment.amount.toLocaleString("es-CO")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-sage-border-subtle">
            {availableActions.map((action) => (
              <Button
                key={action.to}
                variant={action.variant}
                size="lg"
                onClick={() => handleStatusChange(action.to)}
                disabled={isUpdatingStatus}
                isLoading={isUpdatingStatus}
              >
                {!isUpdatingStatus && <action.icon className="w-5 h-5 mr-2" />}
                {action.label}
              </Button>
            ))}

            {remainingAmount > 0 && (
              <Button
                variant="secondary"
                size="lg"
                onClick={() => {
                  // TODO: Navigate to payment page
                  toast.info("Funcionalidad de pago próximamente");
                }}
              >
                <DollarSign className="w-5 h-5 mr-2" />
                Registrar Pago
              </Button>
            )}

            <Button
              variant="ghost"
              size="lg"
              onClick={() => setShowDeleteConfirm(true)}
              className="text-red-600 hover:bg-red-50 ml-auto"
            >
              <Trash2 className="w-5 h-5 mr-2" />
              Eliminar
            </Button>
          </div>
        </div>
      </SidebarLayout>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Eliminar Pedido"
        message={`¿Estás seguro de eliminar el pedido ${shortId}? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
        isLoading={isDeleting}
      />
    </>
  );
}
