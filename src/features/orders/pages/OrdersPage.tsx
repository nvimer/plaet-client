import { OrderStatus, type OrderType } from "@/types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOrders } from "../hooks";
import { Button, Card, EmptyState, Skeleton, StatCard } from "@/components";
import {
    CheckCircle,
    Clock,
    Plus,
    ShoppingCart,
    TrendingUp,
} from "lucide-react";
import { OrderCard, OrderFilters } from "../components";
import { ROUTES, getOrderDetailRoute } from "@/app/routes";

/**
 * OrdersPage Component
 *
 * Main page for orders management
 */
export function OrdersPage() {
    const navigate = useNavigate();

    // ============ STATE =============
    // Filters
    const [statusFilter, setStatusFilter] = useState<OrderStatus | "ALL">("ALL");
    const [typeFilter, setTypeFilter] = useState<OrderType | "ALL">("ALL");

    // ============== QUERIES ===============
    const { data: orders, isLoading, error } = useOrders();

    // ================ COMPUTED VALUES =================
    // Filter orders
    const filteredOrders = orders?.filter((order) => {
        const matchesStatus =
            statusFilter === "ALL" || order.status === statusFilter;
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

    // ============= HANDLERS ===============
    const handleViewDetail = (orderId: string) => {
        navigate(getOrderDetailRoute(orderId));
    };

    const handleCreateOrder = () => {
        navigate(ROUTES.ORDER_CREATE);
    };

    const handleResetFilters = () => {
        setStatusFilter("ALL");
        setTypeFilter("ALL");
    };

    // ============ LOADING STATE ===========
    if (isLoading) {
        return (
            <>
                {/* Header Skeleton */}
                <div className="mb-8">
                    <Skeleton variant="text" width={256} height={40} className="mb-2" />
                    <Skeleton variant="text" width={384} height={24} />
                </div>

                {/* Stats Skeleton  */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} variant="stat" />
                    ))}
                </div>
            </>
        );
    }

    // ========== ERROR STATE =============
    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Card>
                    <div className="text-center p-8">
                        <div className="text-4xl mb-4">⚠️</div>
                        <h2 className="text-2xl font-semibold text-carbon-900 mb-2">
                            Error al cargar los pedidos
                        </h2>
                        <p className="text-carbon-600 mb-4">{error.message}</p>
                        <Button onClick={() => window.location.reload()}>Reintentar</Button>
                    </div>
                </Card>
            </div>
        );
    }

    // =============== MAIN RENDER =================
    return (
        <>
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
                <Button variant="primary" size="lg" onClick={handleCreateOrder}>
                    <Plus className="w-5 h-5 mr-2" />
                    Nuevo Pedido
                </Button>
            </div>
            {/* ================ STATS CARD ================== */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {/* Total Orders */}
                <StatCard
                    title="Total Pedidos"
                    value={counts.all}
                    icon={<ShoppingCart />}
                    iconBgColor="bg-sage-green-100"
                    iconColor="text-sage-green-600"
                />

                {/* Pending */}
                <StatCard
                    title="Pendientes"
                    value={counts.pending}
                    icon={<Clock />}
                    iconBgColor="bg-yellow-100"
                    iconColor="text-yellow-600"
                />

                {/* Ready */}
                <StatCard
                    title="Listos"
                    value={counts.ready}
                    icon={<CheckCircle />}
                    iconBgColor="bg-green-100"
                    iconColor="text-green-600"
                />

                {/* Today's sales */}
                <StatCard
                    title="Ventas hoy"
                    value={`$${todayTotal.toLocaleString("es-CO")}`}
                    icon={<TrendingUp />}
                    iconBgColor="bg-emerald-100"
                    iconColor="text-emerald-600"
                />
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
                            onViewDetail={(orderId) => handleViewDetail(orderId)}
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
                            ? handleCreateOrder
                            : undefined
                    }
                />
            )}
        </>
    );
}
