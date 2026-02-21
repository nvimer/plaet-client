import { OrderStatus, OrderType } from "@/types";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useOrders } from "../hooks";
import { Button, Skeleton, EmptyState, Card } from "@/components";
import type { DateFilterType, DateRange } from "@/components";
import {
  CheckCircle,
  Clock,
  LayoutGrid,
  List,
  Plus,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import { OrderCard, OrderFilters, GroupedOrderCard } from "../components";
import { ROUTES, getOrderDetailRoute } from "@/app/routes";
import type { Order } from "@/types";

/**
 * Grouped Order Interface
 * Groups multiple individual orders (usually for same table/time)
 */
export interface GroupedOrder {
  id: string; // ID of the first order in group
  tableId?: number;
  table?: { number: number };
  createdAt: string;
  status: OrderStatus;
  type: OrderType;
  orders: Order[];
  totalAmount: number;
}

/**
 * Group orders by table and time (within 2 minutes)
 */
const groupOrders = (orders: Order[]): GroupedOrder[] => {
  const grouped: GroupedOrder[] = [];
  const processedIds = new Set<string>();

  // Sort by date newest first
  const sorted = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  sorted.forEach((order) => {
    if (processedIds.has(order.id)) return;

    // Potential group members: same table, same type, within 2 minutes
    const groupMembers = sorted.filter((other) => {
      if (processedIds.has(other.id)) return false;
      if (other.type !== order.type) return false;
      if (other.tableId !== order.tableId) return false;

      // Only group DINE_IN with tableId
      if (order.type === OrderType.DINE_IN && !order.tableId) return false;

      const timeDiff = Math.abs(
        new Date(order.createdAt).getTime() -
          new Date(other.createdAt).getTime(),
      );
      return timeDiff <= 2 * 60 * 1000; // 2 minutes window
    });

    groupMembers.forEach((m) => processedIds.add(m.id));

    grouped.push({
      id: order.id,
      tableId: order.tableId,
      table: order.table,
      createdAt: order.createdAt,
      status: order.status,
      type: order.type,
      orders: groupMembers,
      totalAmount: groupMembers.reduce((sum, o) => sum + o.totalAmount, 0),
    });
  });

  return grouped;
};

/**
 * Helper: Check if order date is today
 */
const isToday = (dateString: string): boolean => {
  const date = new Date(dateString);
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

/**
 * Helper: Check if order date is yesterday
 */
const isYesterday = (dateString: string): boolean => {
  const date = new Date(dateString);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  );
};

/**
 * Helper: Check if order date is within last 7 days
 */
const isWithinLastWeek = (dateString: string): boolean => {
  const date = new Date(dateString);
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  return date >= weekAgo;
};

/**
 * Helper: Check if order is within custom date range
 */
const isWithinDateRange = (dateString: string, range: DateRange): boolean => {
  const date = new Date(dateString);
  const start = new Date(range.start);
  const end = new Date(range.end);
  end.setHours(23, 59, 59, 999); // Include the full end day
  return date >= start && date <= end;
};

/**
 * Helper: Check if order counts as a sale
 * Only PAID or DELIVERED orders count as sales
 */
const isSaleOrder = (order: Order): boolean => {
  return (
    order.status === OrderStatus.PAID || order.status === OrderStatus.DELIVERED
  );
};

/**
 * OrdersPage Component
 *
 * Gestión de pedidos con diseño actualizado: filtros unificados,
 * grid de tarjetas, y estados mejorados.
 * Enhanced with date filtering and wait time display.
 */
export function OrdersPage() {
  const navigate = useNavigate();

  // ============ STATE =============
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "ALL">("ALL");
  const [typeFilter, setTypeFilter] = useState<OrderType | "ALL">("ALL");
  const [dateFilter, setDateFilter] = useState<DateFilterType>("TODAY");
  const [customDateRange, setCustomDateRange] = useState<DateRange | undefined>(
    undefined,
  );
  const [isGrouped, setIsGrouped] = useState(true);

  // ============== QUERIES ===============
  const { data: orders, isLoading, error } = useOrders();

  // ================ COMPUTED VALUES =================
  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === "ALL" || order.status === statusFilter;
      const matchesType = typeFilter === "ALL" || order.type === typeFilter;

      // Date filtering
      let matchesDate = true;
      switch (dateFilter) {
        case "TODAY":
          matchesDate = isToday(order.createdAt);
          break;
        case "YESTERDAY":
          matchesDate = isYesterday(order.createdAt);
          break;
        case "WEEK":
          matchesDate = isWithinLastWeek(order.createdAt);
          break;
        case "CUSTOM":
          matchesDate = customDateRange
            ? isWithinDateRange(order.createdAt, customDateRange)
            : true;
          break;
      }

      return matchesStatus && matchesType && matchesDate;
    });
  }, [orders, statusFilter, typeFilter, dateFilter, customDateRange]);

  const groupedOrders = useMemo(() => {
    return groupOrders(filteredOrders);
  }, [filteredOrders]);

  const counts = useMemo(
    () => ({
      all: orders?.length || 0,
      pending:
        orders?.filter((o) => o.status === OrderStatus.PENDING).length || 0,
      inKitchen:
        orders?.filter((o) => o.status === OrderStatus.IN_KITCHEN).length || 0,
      ready: orders?.filter((o) => o.status === OrderStatus.READY).length || 0,
      delivered:
        orders?.filter((o) => o.status === OrderStatus.DELIVERED).length || 0,
      paid: orders?.filter((o) => o.status === OrderStatus.PAID).length || 0,
      sentToCashier:
        orders?.filter((o) => o.status === OrderStatus.SENT_TO_CASHIER)
          .length || 0,
      cancelled:
        orders?.filter((o) => o.status === OrderStatus.CANCELLED).length || 0,
    }),
    [orders],
  );

  const todayTotal = useMemo(() => {
    if (!orders) return 0;
    return orders
      .filter((o) => isToday(o.createdAt) && isSaleOrder(o))
      .reduce((sum, o) => sum + o.totalAmount, 0);
  }, [orders]);

  const hasActiveFilters =
    statusFilter !== "ALL" || typeFilter !== "ALL" || dateFilter !== "TODAY";

  // ============= HANDLERS ===============
  const handleViewDetail = (orderId: string) => {
    navigate(getOrderDetailRoute(orderId));
  };

  const handleCreateOrder = () => {
    navigate(ROUTES.ORDER_CREATE);
  };

  const handleClearFilter = (key: string) => {
    if (key === "status") setStatusFilter("ALL");
    if (key === "type") setTypeFilter("ALL");
    if (key === "date") setDateFilter("TODAY");
  };

  const handleClearAll = () => {
    setStatusFilter("ALL");
    setTypeFilter("ALL");
    setDateFilter("TODAY");
    setCustomDateRange(undefined);
  };

  // ============ LOADING STATE ===========
  if (isLoading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Skeleton variant="text" width={240} height={32} className="mb-2" />
          <Skeleton variant="text" width={320} height={20} />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} variant="card" height={80} />
          ))}
        </div>
        <Skeleton variant="card" height={80} className="mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} variant="card" />
          ))}
        </div>
      </div>
    );
  }

  // ========== ERROR STATE =============
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] px-4 sm:px-6 lg:px-8">
        <Card
          variant="elevated"
          padding="lg"
          className="max-w-md w-full border border-sage-200 shadow-sm rounded-2xl"
        >
          <div className="text-center">
            <div className="w-14 h-14 bg-rose-50 rounded-xl flex items-center justify-center mx-auto mb-4 text-rose-500">
              <ShoppingCart className="w-7 h-7" />
            </div>
            <h2 className="text-lg font-semibold text-carbon-900 mb-2">
              Error al cargar pedidos
            </h2>
            <p className="text-carbon-500 text-sm mb-6">{error.message}</p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => window.location.reload()}
              fullWidth
              className="min-h-[44px]"
            >
              Reintentar
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // =============== MAIN RENDER =================
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* ============ PAGE HEADER =============== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-carbon-900 tracking-tight">
            Gestión de Pedidos
          </h1>
          <p className="text-sm text-carbon-500 mt-1">
            Administra los pedidos del restaurante
          </p>
        </div>
        <Button
          size="lg"
          variant="primary"
          onClick={handleCreateOrder}
          className="w-full sm:w-auto min-h-[44px]"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nuevo Pedido
        </Button>
      </div>

      {/* ================ STATS CARDS ================== */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl border-2 border-sage-200 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sage-100 flex items-center justify-center text-sage-600">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-carbon-500">Total</p>
              <p className="text-xl font-bold text-carbon-900">{counts.all}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border-2 border-sage-200 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-carbon-500">Pendientes</p>
              <p className="text-xl font-bold text-carbon-900">
                {counts.pending}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border-2 border-sage-200 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-carbon-500">Listos</p>
              <p className="text-xl font-bold text-carbon-900">
                {counts.ready}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border-2 border-sage-200 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sage-100 flex items-center justify-center text-sage-600">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-carbon-500">Ventas hoy</p>
              <p className="text-xl font-bold text-sage-700">
                ${todayTotal.toLocaleString("es-CO")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================ FILTERS ================= */}
      <div className="mb-6">
        <OrderFilters
          statusFilter={statusFilter}
          typeFilter={typeFilter}
          dateFilter={dateFilter}
          customDateRange={customDateRange}
          onStatusChange={setStatusFilter}
          onTypeChange={setTypeFilter}
          onDateChange={setDateFilter}
          onCustomDateRangeChange={setCustomDateRange}
          onClearFilter={handleClearFilter}
          onClearAll={handleClearAll}
          counts={counts}
          resultCount={filteredOrders.length}
        />
      </div>

      {/* Result count and View Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <p className="text-sm font-medium text-carbon-600">
          {isGrouped ? groupedOrders.length : filteredOrders.length}{" "}
          { (isGrouped ? groupedOrders.length : filteredOrders.length) === 1 ? (isGrouped ? "mesa" : "pedido") : (isGrouped ? "mesas" : "pedidos")}
          {hasActiveFilters && " encontrados"}
        </p>

        <div className="flex items-center gap-1 bg-carbon-100 p-1 rounded-xl border border-carbon-200">
          <button
            onClick={() => setIsGrouped(true)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
              isGrouped 
                ? "bg-white text-sage-700 shadow-soft-sm" 
                : "text-carbon-500 hover:text-carbon-700"
            )}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            VISTA AGRUPADA
          </button>
          <button
            onClick={() => setIsGrouped(false)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
              !isGrouped 
                ? "bg-white text-sage-700 shadow-soft-sm" 
                : "text-carbon-500 hover:text-carbon-700"
            )}
          >
            <List className="w-3.5 h-3.5" />
            INDIVIDUAL
          </button>
        </div>
      </div>

      {/* ============ ORDERS GRID ============= */}
      {(isGrouped ? groupedOrders.length : filteredOrders.length) > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {isGrouped ? (
            groupedOrders.map((group) => (
              <GroupedOrderCard
                key={group.id}
                groupedOrder={group}
                onViewDetail={handleViewDetail}
              />
            ))
          ) : (
            filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onViewDetail={handleViewDetail}
              />
            ))
          )}
        </div>
      ) : (
        <EmptyState
          icon={<ShoppingCart />}
          title={
            hasActiveFilters
              ? "No hay pedidos con estos filtros"
              : "No hay pedidos"
          }
          description={
            hasActiveFilters
              ? "Ajusta los filtros para ver más resultados"
              : "Crea tu primer pedido para comenzar"
          }
          actionLabel={!hasActiveFilters ? "Crear primer pedido" : undefined}
          onAction={!hasActiveFilters ? handleCreateOrder : undefined}
        />
      )}
    </div>
  );
}
