import { OrderStatus, type Order } from "@/types";
import type { AxiosErrorWithResponse } from "@/types/common";
import { useState } from "react";
import { useDeleteOrder, useUpdateOrderStatus } from "../../hooks";
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
import { OrderStatusBadge } from "../OrderStatusBadge";
import { OrderTypeBadge } from "../OrderTypeBadge";
import { Button, Card, ConfirmDialog, BaseModal } from "@/components";

// ================ TYPES ===============
interface OrderDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: Order | null;
    onAddPayment?: (order: Order) => void;
}

/**
 * OrderDetailModal Component
 *
 * Modal showing full order details with actions
 */
export function OrderDetailModal({
    isOpen,
    onClose,
    order,
    onAddPayment,
}: OrderDetailModalProps) {
    // ============= STATE =================
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // ============= HOOKS ==============
    const { mutate: updateStatus, isPending: isUpdatingStatus } =
        useUpdateOrderStatus();
    const { mutate: deleteOrder, isPending: isDeleting } = useDeleteOrder();

    // ============== EARLY RETURN ================
    if (!order) return null;

    // ================= COMPUTED VALUES =====================
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

    // Calculate paid amount
    const paidAmount = order.payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
    const remainingAmount = order.totalAmount - paidAmount;

    // ============== STATUS ACTIONS =============
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

    // =================== HANDLERS =====================
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
                setShowDeleteConfirm(false);
                onClose();
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
            <BaseModal
                isOpen={isOpen}
                onClose={onClose}
                title={`Pedido ${shortId}`}
                subtitle={`Creado ${createdDate} a las ${createdTime}`}
                size="lg"
            >
                <div className="space-y-6">
                    {/* ================ STATUS & TYPE ================ */}
                    <div className="flex flex-wrap items-center gap-3">
                        <OrderStatusBadge status={order.status} size="lg" />
                        <OrderTypeBadge type={order.type} size="md" />
                    </div>

                    {/* ================= ORDER INFO ==================== */}
                    <Card variant="bordered" padding="md">
                        <div className="grid grid-cols-2 gap-4">
                            {/* Table */}
                            {order.table && (
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-sage-green-600" />
                                    <span className="text-carbon-700">
                                        Mesa <strong>{order.table.number}</strong>
                                    </span>
                                </div>
                            )}

                            {/* Waiter */}
                            {order.waiter && (
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-carbon-500" />
                                    <span className="text-carbon-700">{order.waiter.name}</span>
                                </div>
                            )}

                            {/* Date */}
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-carbon-500" />
                                <span className="text-carbon-700">{createdDate}</span>
                            </div>

                            {/* Time */}
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-carbon-500" />
                                <span className="text-carbon-700">{createdTime}</span>
                            </div>
                        </div>
                    </Card>

                    {/* ============== ITEM LIST ================== */}
                    <div>
                        <h4 className="font-semibold text-carbon-900 mb-3">
                            Productos ({order.items?.length || 0})
                        </h4>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {order.items?.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between p-3 bg-sage-50 rounded-xl"
                                >
                                    <div className="flex-1">
                                        <p className="font-medium text-carbon-900">
                                            {item.quantity}x {item.menuItem?.name || "Producto"}
                                        </p>
                                        {item.notes && (
                                            <p className="text-sm text-carbon-500 italic">
                                                Nota: {item.notes}
                                            </p>
                                        )}
                                    </div>
                                    <p className="font-semibold text-carbon-900">
                                        $
                                        {(item.priceAtOrder * item.quantity).toLocaleString(
                                            "es-CO",
                                        )}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* =================== TOTALS ======================= */}
                    <Card variant="elevated" padding="md" className="bg-gradient-sage">
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
                            <div className="flex justify-between text-xl font-bold text-carbon-900 pt-2 border-t border-sage-green-200">
                                <span>Total</span>
                                <span>${remainingAmount.toLocaleString("es-CO")}</span>
                            </div>
                        </div>
                    </Card>

                    {/* ============= PAYMENTS ============= */}
                    {order.payments && order.payments.length > 0 && (
                        <div>
                            <h4 className="font-semibold text-carbon-900 mb-3">
                                Pagos Registrados
                            </h4>
                            <div className="space-y-2">
                                {order.payments.map((payment) => (
                                    <div
                                        key={payment.id}
                                        className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-200"
                                    >
                                        <div className="flex items-center gap-2">
                                            <CreditCard className="w-4 h-4 text-green-600" />
                                            <span className="text-carbon-700">{payment.method}</span>
                                        </div>
                                        <span className="font-semibold text-green-700">
                                            ${payment.amount.toLocaleString("es-CO")}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* =================== ACTIONS =================== */}
                    <div className="flex flex-wrap gap-3 pt-4 border-t border-sage-border-subtle">
                        {/* Status Actions  */}
                        {availableActions.map((action) => (
                            <Button
                                key={action.to}
                                variant={action.variant}
                                size="md"
                                onClick={() => handleStatusChange(action.to)}
                                disabled={isUpdatingStatus}
                                isLoading={isUpdatingStatus}
                            >
                                {!isUpdatingStatus && <action.icon className="w-4 h-4 mr-2" />}
                                {action.label}
                            </Button>
                        ))}

                        {/* Add Payment Button */}
                        {remainingAmount > 0 && onAddPayment && (
                            <Button
                                variant="secondary"
                                size="md"
                                onClick={() => onAddPayment(order)}
                            >
                                <DollarSign className="w-4 h-4 mr-2" />
                                Registrar Pago
                            </Button>
                        )}

                        {/* Delete Button */}
                        <Button
                            variant="ghost"
                            size="md"
                            onClick={() => setShowDeleteConfirm(true)}
                            className="text-red-600 hover:bg-red-50 ml-auto"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Eliminar
                        </Button>
                    </div>
                </div>
            </BaseModal>

            {/* ======= DELETE CONFIRMATION ======== */}
            <ConfirmDialog
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={handleDelete}
                title="Eliminar Pedido"
                message={`¿Estás seguros de eliminar el pedido ${shortId}? Esta acción no se puede deshacer.`}
                confirmText="Eliminar"
                cancelText="Cancelar"
                variant="danger"
                isLoading={isDeleting}
            />
        </>
    );
}
