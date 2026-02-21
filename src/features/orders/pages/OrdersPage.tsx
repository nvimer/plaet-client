import { OrderStatus, OrderType } from "@/types";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useOrders } from "../hooks";
import { Button, Skeleton, EmptyState, Card } from "@/components";
import type { DateFilterType, DateRange } from "@/components";
import {
  CheckCircle,
  Clock,
  Plus,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import { OrderCard, OrderFilters, OrderGroupCard } from "../components";
import { ROUTES, getOrderDetailRoute } from "@/app/routes";
import type { Order } from "@/types";

interface OrderGroup {
  type: "group";
  id: string; // "table-X"
  title: string;
  totalAmount: number;
  orders: Order[];
}

interface SingleOrderWrapper {
  type: "single";
  order: Order;
}

type OrderDisplayItem = OrderGroup | SingleOrderWrapper;

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

  // Group orders by Table for DINE_IN
  const groupedItems = useMemo(() => {
    const items: OrderDisplayItem[] = [];
    // Key: tableId-YYYY-MM-DD
    const tableGroups = new Map<string, Order[]>();

    // First pass: Group DINE_IN orders by table and date
    filteredOrders.forEach((order) => {
      // We only group DINE_IN orders that have a table
      // AND we only group orders that are NOT Paid or Cancelled (active session)
      // Actually, user wants to see grouped orders even if they are in history? 
      // Usually "orders" in a POS refers to a single bill/ticket.
      // Since we don't have a ticketId yet, we group by table + date.
      
      const isActiveSession = order.status !== OrderStatus.PAID && order.status !== OrderStatus.CANCELLED;
      
      if (order.type === OrderType.DINE_IN && order.table) {
        const dateKey = new Date(order.createdAt).toISOString().split('T')[0];
        // If it's a paid order, we don't group it with active orders
        const sessionKey = isActiveSession ? 'active' : `closed-${order.id.slice(0, 8)}`;
        const groupKey = `table-${order.table.id}-${dateKey}-${sessionKey}`;
        
        if (isActiveSession) {
            const tableDateKey = `table-${order.table.id}-${dateKey}`;
            if (!tableGroups.has(tableDateKey)) {
              tableGroups.set(tableDateKey, []);
            }
            tableGroups.get(tableDateKey)?.push(order);
        } else {
            // Closed orders are shown individually or grouped by something else?
            // For now, keep closed orders separate
            items.push({ type: "single", order });
        }
      } else {
        // Non-DINE_IN or no table -> Single item
        items.push({ type: "single", order });
      }
    });

    // Process table groups
    tableGroups.forEach((groupOrders, key) => {
      if (groupOrders.length === 1) {
        // If only 1 order for table, show as single
        items.push({ type: "single", order: groupOrders[0] });
      } else {
        // Multiple orders -> Group
        const tableNumber = groupOrders[0].table?.number;
        const totalAmount = groupOrders.reduce((sum, o) => sum + o.totalAmount, 0);
        
        items.push({
          type: "group",
          id: key,
          title: `Mesa ${tableNumber}`,
          totalAmount,
          orders: groupOrders,
        });
      }
    });

    // Sort items by date (newest first)
    // For groups, use the newest order in the group
    return items.sort((a, b) => {
      const dateA = a.type === "single" 
        ? new Date(a.order.createdAt).getTime()
        : Math.max(...a.orders.map(o => new Date(o.createdAt).getTime()));
      
      const dateB = b.type === "single"
        ? new Date(b.order.createdAt).getTime()
        : Math.max(...b.orders.map(o => new Date(o.createdAt).getTime()));
        
      return dateB - dateA;
    });
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

      {/* Result count */}
      <p className="text-sm font-medium text-carbon-600 mb-5">
        {filteredOrders.length}{" "}
        {filteredOrders.length === 1 ? "pedido" : "pedidos"}
        {hasActiveFilters && " encontrados"}
      </p>

      {/* ============ ORDERS GRID ============= */}
      {groupedItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {groupedItems.map((item) => (
            item.type === "group" ? (
              <OrderGroupCard
                key={item.id}
                groupId={item.id}
                title={item.title}
                orders={item.orders}
                totalAmount={item.totalAmount}
                onViewDetail={handleViewDetail}
              />
            ) : (
              <OrderCard
                key={item.order.id}
                order={item.order}
                onViewDetail={handleViewDetail}
              />
            )
          ))}
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
