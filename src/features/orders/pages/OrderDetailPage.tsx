import { useParams, useNavigate } from "react-router-dom";
import { OrderStatus, PaymentMethod } from "@/types";
import type { AxiosErrorWithResponse } from "@/types/common";
import { useOrder, useDeleteOrder, useUpdateOrderStatus, useAddPayment } from "../hooks";
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
  Calculator,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { SidebarLayout } from "@/layouts/SidebarLayout";
import { OrderStatusBadge } from "../components/OrderStatusBadge";
import { OrderTypeBadge } from "../components/OrderTypeBadge";
import { PaymentModal } from "../components/PaymentModal";
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
 * Updated with mandatory payment before kitchen flow.
 */
export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: order, isLoading, error } = useOrder(id);
  const { mutate: updateStatus, isPending: isUpdatingStatus } =
    useUpdateOrderStatus();
  const { mutate: addPayment, isPending: isAddingPayment } = useAddPayment();
  const { mutate: deleteOrder, isPending: isDeleting } = useDeleteOrder();
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

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

  const paidAmount = order.payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;
  const remainingAmount = Math.max(0, Number(order.totalAmount) - paidAmount);

  // Status actions (Simplified for post-payment flow)
  const statusActions: {
    from: OrderStatus[];
    to: OrderStatus;
    label: string;
    icon: any;
    variant: "primary" | "secondary" | "outline";
  }[] = [
    {
      from: [OrderStatus.PAID], // Only allow kitchen after payment
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
      from: [OrderStatus.PENDING, OrderStatus.PAID, OrderStatus.IN_KITCHEN],
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

  const handleConfirmPayment = (method: PaymentMethod, amount: number, reference?: string) => {
    addPayment({
      orderId: order!.id,
      paymentData: {
        method,
        amount,
        transactionRef: reference
      }
    }, {
      onSuccess: () => {
        setIsPaymentModalOpen(false);
        toast.success("Pago registrado correctamente");
        
        // Auto-send to kitchen if fully paid
        if (amount >= remainingAmount) {
          updateStatus({ 
            id: order!.id, 
            orderStatus: OrderStatus.IN_KITCHEN 
          }, {
            onSuccess: () => {
              toast.success("Pedido enviado a Cocina automáticamente");
            }
          });
        }
      },
      onError: (error: AxiosErrorWithResponse) => {
        toast.error("Error al registrar pago", {
          description: error.response?.data?.message || error.message
        });
      }
    });
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
        backRoute={ROUTES.ORDERS}
      >
        <div className="max-w-4xl mx-auto space-y-8 pb-24 pt-4">
          {/* Status & Type Banner - Refined */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-5 rounded-2xl border-2 border-sage-100 shadow-smooth-md">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-sage-50 flex items-center justify-center text-sage-600 shadow-inner">
                <Receipt className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-carbon-400 uppercase tracking-widest leading-none mb-1.5">Estado Actual</p>
                <OrderStatusBadge status={order.status} />
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-carbon-400 uppercase tracking-widest mb-0.5">Total del Pedido</p>
              <p className="text-3xl font-bold text-carbon-900 tracking-tight">${Number(order.totalAmount).toLocaleString("es-CO")}</p>
            </div>
          </div>

          {/* Info Grid */}
          <Card variant="bordered" padding="md" className="rounded-2xl border-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {order.table && (
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-carbon-400 uppercase tracking-widest">Ubicación</span>
                  <div className="flex items-center gap-2 text-carbon-700 font-bold">
                    <div className="w-8 h-8 rounded-lg bg-sage-100 flex items-center justify-center text-sage-600">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span>Mesa {order.table.number}</span>
                  </div>
                </div>
              )}

              {order.waiter && (
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-carbon-400 uppercase tracking-widest">Atendido por</span>
                  <div className="flex items-center gap-2 text-carbon-700 font-bold">
                    <div className="w-8 h-8 rounded-lg bg-carbon-100 flex items-center justify-center text-carbon-600">
                      <User className="w-4 h-4" />
                    </div>
                    <span>{order.waiter.firstName}</span>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-carbon-400 uppercase tracking-widest">Fecha</span>
                <div className="flex items-center gap-2 text-carbon-700 font-bold">
                  <div className="w-8 h-8 rounded-lg bg-carbon-100 flex items-center justify-center text-carbon-600">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <span>{createdDate}</span>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-carbon-400 uppercase tracking-widest">Hora</span>
                <div className="flex items-center gap-2 text-carbon-700 font-bold">
                  <div className="w-8 h-8 rounded-lg bg-carbon-100 flex items-center justify-center text-carbon-600">
                    <Clock className="w-4 h-4" />
                  </div>
                  <span>{createdTime}</span>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Items List */}
            <div className="lg:col-span-2 space-y-4">
              <h4 className="font-bold text-carbon-900 uppercase text-xs tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-4 bg-sage-500 rounded-full" />
                Items del Pedido ({order.items?.length || 0})
              </h4>
              <div className="space-y-2">
                {order.items?.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-white rounded-2xl border-2 border-sage-50 shadow-sm"
                  >
                    <div className="flex-1">
                      <p className="font-bold text-carbon-900">
                        {item.quantity}x {item.menuItem?.name || "Producto"}
                      </p>
                      {item.notes && (
                        <p className="text-sm text-carbon-500 italic mt-1 font-medium">
                          📝 {item.notes}
                        </p>
                      )}
                    </div>
                    <p className="font-bold text-carbon-900 text-lg">
                      $
                      {Number(item.priceAtOrder * item.quantity).toLocaleString(
                        "es-CO",
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Financial Summary */}
            <div className="space-y-6">
              <h4 className="font-bold text-carbon-900 uppercase text-xs tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-4 bg-emerald-500 rounded-full" />
                Resumen Financiero
              </h4>
              <Card
                variant="elevated"
                padding="md"
                className="bg-carbon-900 text-white rounded-3xl border-none shadow-xl overflow-hidden relative"
              >
                <div className="space-y-4 relative z-10">
                  <div className="flex justify-between text-carbon-400 font-bold text-xs uppercase tracking-widest">
                    <span>Subtotal</span>
                    <span>${Number(order.totalAmount).toLocaleString("es-CO")}</span>
                  </div>
                  {paidAmount > 0 && (
                    <div className="flex justify-between text-emerald-400 font-bold text-xs uppercase tracking-widest">
                      <span>Pagado</span>
                      <span>-${paidAmount.toLocaleString("es-CO")}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-end pt-2 border-t border-white/10">
                    <span className="text-sm font-bold uppercase tracking-widest text-carbon-400">Pendiente</span>
                    <span className="text-3xl font-black text-white tracking-tighter">
                      ${remainingAmount.toLocaleString("es-CO")}
                    </span>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl" />
              </Card>

              {/* Payments History */}
              {order.payments && order.payments.length > 0 && (
                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-carbon-400 uppercase tracking-widest px-1">Pagos Recibidos</p>
                  {order.payments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-3 bg-emerald-50/50 rounded-xl border border-emerald-100"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                          <CreditCard className="w-4 h-4" />
                        </div>
                        <span className="text-carbon-700 font-bold text-sm">
                          {payment.method}
                        </span>
                      </div>
                      <span className="font-bold text-emerald-700">
                        ${Number(payment.amount).toLocaleString("es-CO")}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions Bar */}
          <div className="flex flex-wrap gap-3 pt-8 mt-4 border-t border-sage-200">
            {remainingAmount > 0 ? (
              <Button
                variant="primary"
                size="lg"
                onClick={() => setIsPaymentModalOpen(true)}
                isLoading={isAddingPayment}
                className="flex-1 min-h-[64px] rounded-2xl font-bold bg-carbon-900 hover:bg-carbon-800 text-white shadow-xl shadow-carbon-200"
              >
                <DollarSign className="w-6 h-6 mr-2" />
                REGISTRAR PAGO
              </Button>
            ) : (
              availableActions.map((action) => (
                <Button
                  key={action.to}
                  variant={action.variant}
                  size="lg"
                  onClick={() => handleStatusChange(action.to)}
                  disabled={isUpdatingStatus}
                  isLoading={isUpdatingStatus}
                  className="flex-1 min-h-[64px] rounded-2xl font-bold"
                >
                  {!isUpdatingStatus && <action.icon className="w-6 h-6 mr-2" />}
                  {action.label}
                </Button>
              ))
            )}

            <Button
              variant="ghost"
              size="lg"
              onClick={() => setShowDeleteConfirm(true)}
              className="text-error-600 hover:bg-error-50 h-[64px] px-6 rounded-2xl font-bold"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </SidebarLayout>

      {/* Payment & Delete Modals */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        orderTotal={Number(order.totalAmount)}
        remainingAmount={remainingAmount}
        onConfirm={handleConfirmPayment}
        isPending={isAddingPayment}
      />

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