import { OrderStatusBadge } from "@/components";
import { useParams, useNavigate } from "react-router-dom";
import { OrderStatus } from "@/types";
import type { AxiosErrorWithResponse } from "@/types/common";
import type { LucideIcon } from "lucide-react";
import { useOrder, useDeleteOrder, useUpdateOrderStatus, useAddPayment } from "../hooks";
import {
  Calendar,
  Clock,
  CreditCard,
  DollarSign,
  MapPin,
  Trash2,
  User,
  XCircle,
  ReceiptText,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "sonner";
import { SidebarLayout } from "@/layouts/SidebarLayout";
import { PaymentModal, type PaymentEntry } from "../components/PaymentModal";
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
  const { mutate: deleteOrder, isPending: isDeleting } = useDeleteOrder();
  const { mutateAsync: addPaymentAsync } = useAddPayment();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [showDetailedBreakdown, setShowDetailedBreakdown] = useState(false);

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

  // Status actions (Simplified for Master-Detail flow)
  const statusActions: {
    from: OrderStatus[];
    to: OrderStatus;
    label: string;
    icon: LucideIcon;
    variant: "primary" | "secondary" | "outline";
  }[] = [
    {
      from: [OrderStatus.OPEN],
      to: OrderStatus.SENT_TO_CASHIER,
      label: "Pedir Cuenta",
      icon: ReceiptText,
      variant: "primary",
    },
    {
      from: [OrderStatus.SENT_TO_CASHIER],
      to: OrderStatus.PAID,
      label: "Registrar Pago",
      icon: DollarSign,
      variant: "primary",
    },
    {
      from: [OrderStatus.OPEN, OrderStatus.SENT_TO_CASHIER],
      to: OrderStatus.CANCELLED,
      label: "Cancelar Mesa",
      icon: XCircle,
      variant: "outline",
    },
  ];

  const availableActions = statusActions.filter((action) =>
    action.from.includes(order.status),
  );

  // Handlers
  const handleStatusChange = (newStatus: OrderStatus) => {
    // If target status is PAID, we open the modal instead
    if (newStatus === OrderStatus.PAID) {
      setIsPaymentModalOpen(true);
      return;
    }

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

  const handleConfirmPayment = async (payments: PaymentEntry[], orderIds: string[]) => {
    setIsProcessingPayment(true);
    try {
      // We process each payment in sequence for robustness
      // Although normally there's only one orderId in this page
      for (const payment of payments) {
        for (const orderId of orderIds) {
          await addPaymentAsync({
            orderId,
            paymentData: {
              method: payment.method,
              amount: payment.amount,
              transactionRef: payment.reference,
              phone: payment.phone
            }
          });
        }
      }
      
      setIsPaymentModalOpen(false);
      toast.success("Pago registrado correctamente");
      // Redirect to orders list after payment
      navigate(ROUTES.ORDERS);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      toast.error("Error al registrar pagos", {
        description: err.response?.data?.message || err.message
      });
    } finally {
      setIsProcessingPayment(false);
    }
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border-2 border-sage-100 shadow-smooth-md">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-sage-50 flex items-center justify-center text-sage-600 shadow-inner shrink-0">
                <ReceiptText className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-carbon-400 tracking-wide leading-none mb-1.5 uppercase">Estado Actual</p>
                <OrderStatusBadge status={order.status} />
              </div>
            </div>
            <div className="sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-sage-50">
              <p className="text-[10px] font-bold text-carbon-400 tracking-wide mb-0.5 uppercase">Total del Pedido</p>
              <p className="text-2xl sm:text-3xl font-bold text-carbon-900 tracking-tight break-words">
                ${Number(order.totalAmount).toLocaleString("es-CO")}
              </p>
            </div>
          </div>

          {/* Info Grid */}
          <Card variant="bordered" padding="md" className="rounded-2xl border-2">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {order.table && (
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-[10px] font-bold text-carbon-400 tracking-wide uppercase">Ubicación</span>
                  <div className="flex items-center gap-2 text-carbon-700 font-bold">
                    <div className="w-8 h-8 rounded-lg bg-sage-100 flex items-center justify-center text-sage-600 shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span className="truncate">Mesa {order.table.number}</span>
                  </div>
                </div>
              )}

              {order.waiter && (
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-[10px] font-bold text-carbon-400 tracking-wide uppercase">Atendido por</span>
                  <div className="flex items-center gap-2 text-carbon-700 font-bold">
                    <div className="w-8 h-8 rounded-lg bg-carbon-100 flex items-center justify-center text-carbon-600 shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="truncate">{order.waiter.firstName}</span>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-1 min-w-0">
                <span className="text-[10px] font-bold text-carbon-400 tracking-wide uppercase">Fecha</span>
                <div className="flex items-center gap-2 text-carbon-700 font-bold">
                  <div className="w-8 h-8 rounded-lg bg-carbon-100 flex items-center justify-center text-carbon-600 shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <span className="truncate">{createdDate}</span>
                </div>
              </div>

              <div className="flex flex-col gap-1 min-w-0">
                <span className="text-[10px] font-bold text-carbon-400 tracking-wide uppercase">Hora</span>
                <div className="flex items-center gap-2 text-carbon-700 font-bold">
                  <div className="w-8 h-8 rounded-lg bg-carbon-100 flex items-center justify-center text-carbon-600 shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <span className="truncate">{createdTime}</span>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Items List */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-carbon-900 uppercase text-xs tracking-widest flex items-center gap-2">
                  <div className="w-1.5 h-4 bg-sage-500 rounded-full" />
                  Items del Pedido ({order.items?.length || 0})
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetailedBreakdown(!showDetailedBreakdown)}
                  className="text-xs font-bold text-carbon-500 flex items-center gap-1"
                >
                  {showDetailedBreakdown ? (
                    <>
                      <ChevronUp className="w-4 h-4" />
                      Menos detalles
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      Más detalles
                    </>
                  )}
                </Button>
              </div>
              <div className="space-y-2">
                {order.items?.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-white rounded-2xl border-2 border-sage-50 shadow-sm gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-carbon-900 truncate">
                        {item.quantity}x {item.menuItem?.name || "Producto"}
                      </p>
                      {showDetailedBreakdown && (
                        <p className="text-xs text-carbon-400 mt-1 font-medium">
                          Unitario: ${Number(item.priceAtOrder).toLocaleString("es-CO")}
                        </p>
                      )}
                      {item.notes && (
                        <p className="text-sm text-carbon-500 italic mt-1 font-medium break-words">
                          📝 {item.notes}
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-carbon-900 text-lg">
                        $
                        {Number(item.priceAtOrder * item.quantity).toLocaleString(
                          "es-CO",
                        )}
                      </p>
                      {showDetailedBreakdown && (
                        <p className="text-xs text-carbon-400 font-medium">
                          ({item.quantity} × ${Number(item.priceAtOrder).toLocaleString("es-CO")})
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Financial Summary */}
            <div className="space-y-6">
              <h4 className="font-bold text-carbon-900 uppercase text-xs tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-4 bg-success-500 rounded-full" />
                Resumen Financiero
              </h4>
              <Card
                variant="elevated"
                padding="md"
                className="bg-carbon-900 text-white rounded-3xl border-none shadow-xl overflow-hidden relative"
              >
                <div className="space-y-4 relative z-10">
                  <div className="flex justify-between text-carbon-400 font-bold text-xs tracking-wide">
                    <span>Subtotal</span>
                    <span>${Number(order.totalAmount).toLocaleString("es-CO")}</span>
                  </div>
                  {paidAmount > 0 && (
                    <div className="flex justify-between text-success-400 font-bold text-xs tracking-wide">
                      <span>Pagado</span>
                      <span>-${paidAmount.toLocaleString("es-CO")}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-end pt-2 border-t border-white/10">
                    <span className="text-sm font-medium tracking-wide text-carbon-400">Pendiente</span>
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
                  <p className="text-[10px] font-bold text-carbon-400 tracking-wide px-1">Pagos Recibidos</p>
                  {order.payments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-3 bg-success-50/50 rounded-xl border border-success-100"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-success-100 flex items-center justify-center text-success-600">
                          <CreditCard className="w-4 h-4" />
                        </div>
                        <span className="text-carbon-700 font-bold text-sm">
                          {payment.method}
                        </span>
                      </div>
                      <span className="font-bold text-success-700">
                        ${Number(payment.amount).toLocaleString("es-CO")}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions Bar */}
          <div className="flex flex-col sm:flex-row gap-3 pt-8 mt-4 border-t border-sage-200">
            {remainingAmount > 0 ? (
              <Button
                variant="primary"
                size="lg"
                onClick={() => setIsPaymentModalOpen(true)}
                isLoading={isProcessingPayment}
                className="flex-1 min-h-[64px] rounded-2xl font-bold bg-carbon-900 hover:bg-carbon-800 text-white shadow-xl shadow-carbon-200"
              >
                <div className="flex items-center justify-center min-w-0">
                  <DollarSign className="w-6 h-6 mr-2 shrink-0" />
                  <span className="truncate">REGISTRAR PAGO</span>
                </div>
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
                  <div className="flex items-center justify-center min-w-0">
                    {!isUpdatingStatus && <action.icon className="w-6 h-6 mr-2 shrink-0" />}
                    <span className="truncate">{action.label}</span>
                  </div>
                </Button>
              ))
            )}

            <Tooltip content="Eliminar Pedido">
              <Button
                variant="ghost"
                size="lg"
                onClick={() => setShowDeleteConfirm(true)}
                className="text-error-600 hover:bg-error-50 h-[64px] px-6 rounded-2xl font-bold shrink-0 sm:flex-initial"
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            </Tooltip>
          </div>
        </div>
      </SidebarLayout>

      {/* Payment & Delete Modals */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        orders={[order]}
        onConfirm={handleConfirmPayment}
        isPending={isProcessingPayment}
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
