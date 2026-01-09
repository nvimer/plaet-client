import { OrderStatus, type Order, type OrderType } from "@/types";
import { useState } from "react";
import { useOrders } from "../hooks";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { Button, Card, EmptyState, Skeleton } from "@/components";
import {
    CheckCircle,
    Clock,
    Plus,
    ShoppingCart,
    TrendingUp,
} from "lucide-react";
import {
    AddItemModal,
    CreateOrderModal,
    OrderCard,
    OrderDetailModal,
    OrderFilters,
} from "../components";

/**
 * OrdersPage Component
 *
 * Main page for orders management
 */
export function OrdersPage() {
    // ============ STATE =============
    // Filters
    const [statusFilter, setStatusFilter] = useState<OrderStatus | "ALL">("ALL");
    const [typeFilter, setTypeFilter] = useState<OrderType | "ALL">("ALL");

    // Modals
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showAddItemModal, setShowAddItemModal] = useState(false);

    // ============== QUERIES ===============
    const { data: orders, isLoading, error } = useOrders();

    // ================ COMPUTED VALUES =================
    // Filter orders
    const filteredOrders = orders?.filter((order) => {
        const matchesStatus =
            statusFilter === "ALL" || order.status === statusFilter;
        const matchesType = typeFilter === "ALL" || order.type === typeFilter;
        return matchesStatus && matchesStatus;
    });

    // Calculate counts
    const counts = {
        all: orders?.length || 0,
        pending:
            orders?.filter((o) => o.status === OrderStatus.PENDING).length || 0,
        inKitchen:
            orders?.filter((o) => o.status === OrderStatus.IN_KITCHEN).length || 0,
        ready: orders?.filter((o) => o.status === OrderStatus.READY).length || 0,
        delivered:
            orders?.filter((o) => o.status === OrderStatus.DELIVERED).length || 0,
    };

    // Calculate stats
    const todayTotal = orders?.reduce((sum, o) => sum + o.totalAmount, 0) || 0;
    const avgOrderValue = orders?.length ? todayTotal / orders.length : 0;

    // ============= HANDLERS ===============
    const handleViewDetail = (order: Order) => {
        setSelectedOrder(order);
        setShowDetailModal(true);
    };

    // const handleAddPayment = (order: Order) => {
    //     // Could open a payment modal
    //     console.log("Add payment for order: ", order.id);
    // };

    const handleResetFilters = () => {
        setStatusFilter("ALL");
        setTypeFilter("ALL");
    };

    // ============ LOADING STATE ===========
    if (isLoading) {
        return (
            <DashboardLayout>
                {/* Header Skeleton */}
                <div>
                    <Skeleton />
                    <Skeleton />
                </div>

                {/* Stats Skeleton  */}
                <div>
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} />
                    ))}
                </div>
            </DashboardLayout>
        );
    }

    // ========== ERROR STATE =============
    if (error) {
        return (
            <DashboardLayout>
                <div>
                    <Card>
                        <div>
                            <div>
                                <span>⚠️</span>
                            </div>
                            <h2>Error al cargar los pedidos</h2>
                            <p>{error.message}</p>
                            <Button>Reintentar</Button>
                        </div>
                    </Card>
                </div>
            </DashboardLayout>
        );
    }

    // =============== MAIN RENDER =================
    return (
        <DashboardLayout>
            {/* ============ PAGE HEADER =============== */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-4xl font-semibold text-carbon-900 tracking-tight">
                        Gestión de Pedidos
                    </h1>
                    <p className="text-[15px] text-carbon-600 font-light">
                        Administra los pedidos del restaurante
                    </p>
                </div>

                {/* New Order Button */}
                <Button
                    variant="primary"
                    size="lg"
                    onClick={() => setShowCreateModal(true)}
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Nuevo Pedido
                </Button>
            </div>
            {/* ================ STATS CARD ================== */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {/* Total Orders */}
                <Card variant="elevated" padding="md">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-sage-green-100 rounded-xl flex items-center justify-center">
                            <ShoppingCart className="w-6 h-6 5 text-sage-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-carbon-600 font-light">
                                Total Pedidos
                            </p>
                            <p className="text-2xl font-bold text-carbon-900">{counts.all}</p>
                        </div>
                    </div>
                </Card>

                {/* Pending */}
                <Card variant="elevated" padding="md">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                            <Clock />
                        </div>
                        <div>
                            <p className="text-sm text-carbon-600 font-light">Pendientes</p>
                            <p className="text-2xl font-bold text-carbon-900">
                                {counts.pending}
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Ready  */}
                <Card variant="elevated" padding="md">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <CheckCircle />
                        </div>
                        <div>
                            <p className="text-sm text-carbon-600 font-light">Listos</p>
                            <p className="text-2xl font-bold text-carbon-900">
                                {counts.ready}
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Today's sales */}
                <Card variant="elevated" padding="md">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                            <TrendingUp />
                        </div>
                        <div>
                            <p className="text-sm text-carbon-600 font-light">Ventas hoy</p>
                            <p className="text-2xl font-bold text-carbon-900">
                                ${todayTotal.toLocaleString("es-CO")}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
            {/* ================ FILTERS ================= */}
            <OrderFilters
                statusFilter={statusFilter}
                typeFilter={typeFilter}
                onStatusChange={setStatusFilter}
                onTypeChange={setTypeFilter}
                onReset={handleResetFilters}
                counts={counts}
            />
            {/* ============ ORDERS GRID ============== */}
            {filteredOrders && filteredOrders.length > 0 ? (
                <div>
                    {filteredOrders?.map((order) => (
                        <OrderCard
                            key={order.id}
                            order={order}
                            onViewDetail={handleViewDetail}
                        />
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon={<ShoppingCart />}
                    title={
                        statusFilter === "ALL" && typeFilter === "ALL"
                            ? "No hay pedidos"
                            : "No hay pedidos con estos filtros"
                    }
                    description={
                        statusFilter === "ALL" && typeFilter === "ALL"
                            ? "Crea tu primer pedido para comenzar"
                            : "Cambia los filtros para ver otros pedidos"
                    }
                    actionLabel={
                        statusFilter === "ALL" && typeFilter === "ALL"
                            ? "Crear Primer Pedido"
                            : undefined
                    }
                    onAction={
                        statusFilter === "ALL" && typeFilter === "ALL"
                            ? () => setShowCreateModal(true)
                            : undefined
                    }
                />
            )}

            {/* =============== MODALS =============== */}
            {/* Create Order Modal */}
            <CreateOrderModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
            />

            {/* Order Detail Modal  */}
            <OrderDetailModal
                isOpen={showDetailModal}
                onClose={() => {
                    setShowDetailModal(false);
                    setSelectedOrder(null);
                }}
                order={selectedOrder}
            />

            {/* Add Item Modal */}
            <AddItemModal
                isOpen={showAddItemModal}
                onClose={() => {
                    setShowAddItemModal(false);
                    setSelectedOrder(null);
                }}
                order={selectedOrder}
            />
        </DashboardLayout>
    );
}
