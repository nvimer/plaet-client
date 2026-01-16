import { OrderStatus, type Order } from "@/types";
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
import { Button, Card } from "@/components";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { OrderTypeBadge } from "./OrderTypeBadge";

// ========== TYPES ==========
interface OrderCardProps {
    order: Order;
    onViewDetail: (orderId: string) => void;
}

/**
 * OrderCard Component
 *
 * Displays a single order with status and quick actions
 */
export function OrderCard({ order, onViewDetail }: OrderCardProps) {
    // ============= HOOKS =============
    const { mutate: updateStatus, isPending } = useUpdateOrderStatus();

    // ============ COMPUTED VALUES =================
    // Format order ID for display
    const shortId = `#${order.id.slice(-6).toUpperCase()}`;

    // Format time
    const createdTime = new Date(order.createdAt).toLocaleTimeString("es-CO", {
        hour: "2-digit",
        minute: "2-digit",
    });

    // Calculate items count
    const itemsCount =
        order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

    // ============ NEXT STATUS LOGIC ==============
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

    // ============= HANDLERS =============
    const handleStatusChange = () => {
        if (!nextStatus) return;

        updateStatus(
            { id: order.id, orderStatus: nextStatus.status },
            {
                onSuccess: () => {
                    toast.success("Estado Actualizado", {
                        description: `Pedido ${shortId} ahora está ${nextStatus.label.toLowerCase()}`,
                        icon: "✅",
                    });
                },
                onError: (error: any) => {
                    toast.error("Error al actualizar estado", {
                        description: error.response?.data?.message || error.message,
                        icon: "❌",
                    });
                },
            },
        );
    };

    // ============= RENDER ===============
    return (
        <Card
            variant="elevated"
            padding="lg"
            hover
            className="transition-all duration-300 hover:shadow-soft-xl hover:-translate-y-1"
        >
            {/* ============= HEADER ============ */}
            <div className="flex items-start justify-between mb-4">
                {/* Order ID and Time*/}
                <div>
                    <h3 className="text-lg font-bold text-carbon-900">{shortId}</h3>
                    <div className="flex items-center gap-1 text-carbon-500 text-sm">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{createdTime}</span>
                    </div>
                </div>

                {/* Status Badge */}
                <OrderStatusBadge status={order.status} />
            </div>

            {/* ============ INFO ROW ============ */}
            <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
                {/* Table */}
                {order.table && (
                    <div className="flex items-center gap-1.5 text-carbon-600">
                        <MapPin className="w-4 h-4 to-sage-green-600" />
                        <span className="font-medium">Mesa {order.table.number}</span>
                    </div>
                )}

                {/* Waiter */}
                {order.waiter && (
                    <div className="flex items-center gap-1.5 text-carbon-600">
                        <User className="w-4 h-4" />
                        <span>{order.waiter.firstName} {order.waiter.lastName}</span>
                    </div>
                )}

                {/* Order Type */}
                <OrderTypeBadge type={order.type} />
            </div>

            {/* =========== ITEMS PREVIEW ============= */}
            <div className="mb-4 p-3 bg-sage-50 rounded-xl border border-sage-border-subtle">
                <p className="text-sm text-carbon-700 font-light">
                    <span className="font-semibold text-carbon-900">{itemsCount}</span>{" "}
                    productos
                </p>

                {/* Show first 2 items */}
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

            {/* =============== TOTAL =============== */}
            <div className="flex items-center justify-between mb-4 p-3 bg-gradient-sage rounded-xl">
                <span className="text-sm font-medium text-carbon-700">Total</span>
                <span className="text-xl font-bold text-sage-green-600">
                    ${order.totalAmount.toLocaleString("es-CO")}
                </span>
            </div>

            {/* =============== ACTIONS =============== */}
            <div className="flex gap-3 pt-4 border-t border-sage-border-subtle">
                {/* View detail button */}
                <Button
                    variant="ghost"
                    size="md"
                    onClick={() => onViewDetail(order.id)}
                    className="flex-1"
                >
                    <Eye className="w-4 h-4 mr-2" />
                    Ver Detalle
                </Button>

                {/* Next Status Button */}
                {nextStatus && (
                    <Button
                        variant="primary"
                        size="md"
                        onClick={handleStatusChange}
                        disabled={isPending}
                        isLoading={isPending}
                        className="flex-1"
                    >
                        {!isPending && <nextStatus.icon />}
                        {nextStatus.label}
                    </Button>
                )}
            </div>
        </Card>
    );
}
