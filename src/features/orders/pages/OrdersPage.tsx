import { OrderStatus, OrderType, PaymentMethod } from "@/types";
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
  Calendar,
  DollarSign,
  ChefHat,
  History,
  Wallet,
  Smartphone,
  Ticket
} from "lucide-react";
import { cn } from "@/utils/cn";
import { OrderCard, OrderFilters, GroupedOrderCard } from "../components";
import { ROUTES, getOrderDetailRoute } from "@/app/routes";
import type { Order } from "@/types";
import { SidebarLayout } from "@/layouts/SidebarLayout";
import { 
  isToday as checkIsToday, 
  isYesterday as checkIsYesterday, 
  getLocalDateString 
} from "@/utils/dateUtils";

/**
 * Grouped Order Interface
 */
export interface GroupedOrder {
  id: string; 
  tableId?: number;
  table?: { number: number };
  createdAt: string;
  status: OrderStatus;
  type: OrderType;
  orders: Order[];
  totalAmount: number;
}

/**
 * Group orders by table and time
 */
const groupOrders = (orders: Order[]): GroupedOrder[] => {
  const grouped: GroupedOrder[] = [];
  const processedIds = new Set<string>();
  const sorted = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  sorted.forEach((order) => {
    if (processedIds.has(order.id)) return;
    const groupMembers = sorted.filter((other) => {
      if (processedIds.has(other.id)) return false;
      if (other.type !== order.type) return false;
      if (other.tableId !== order.tableId) return false;
      if (order.type === OrderType.DINE_IN && !order.tableId) return false;
      const timeDiff = Math.abs(new Date(order.createdAt).getTime() - new Date(other.createdAt).getTime());
      return timeDiff <= 2 * 60 * 1000;
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
      totalAmount: groupMembers.reduce((sum, o) => sum + Number(o.totalAmount), 0),
    });
  });
  return grouped;
};

const isToday = (dateString: string): boolean => {
  return checkIsToday(dateString);
};

const isYesterday = (dateString: string): boolean => {
  return checkIsYesterday(dateString);
};

const isWithinLastWeek = (dateString: string): boolean => {
  const datePart = dateString.split('T')[0];
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  return datePart >= getLocalDateString(weekAgo);
};

const isWithinDateRange = (dateString: string, range: DateRange): boolean => {
  const datePart = dateString.split('T')[0];
  return datePart >= range.start && datePart <= range.end;
};

export function OrdersPage() {
  const navigate = useNavigate();

  // ============ STATE =============
  const [activeTab, setActiveTab] = useState<"BILLING" | "PREPARATION" | "READY" | "HISTORY">("BILLING");
  const [typeFilter, setTypeFilter] = useState<OrderType | "ALL">("ALL");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<PaymentMethod | "ALL">("ALL");
  const [dateFilter, setDateFilter] = useState<DateFilterType>("TODAY");
  const [customDateRange, setCustomDateRange] = useState<DateRange | undefined>(undefined);
  const [isGrouped, setIsGrouped] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: orders, isLoading, error, refetch } = useOrders();

  // ================ COMPUTED VALUES =================
  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    return orders.filter((order) => {
      // 1. Tab Filtering (Operational Life Cycle)
      const matchesTab = (() => {
        if (activeTab === "BILLING") return order.status === OrderStatus.PENDING || order.status === OrderStatus.SENT_TO_CASHIER;
        if (activeTab === "PREPARATION") return order.status === OrderStatus.PAID || order.status === OrderStatus.IN_KITCHEN;
        if (activeTab === "READY") return order.status === OrderStatus.READY;
        if (activeTab === "HISTORY") return order.status === OrderStatus.PAID || order.status === OrderStatus.DELIVERED || order.status === OrderStatus.CANCELLED;
        return true;
      })();
      if (!matchesTab) return false;

      // 2. Regular Filters
      const matchesType = typeFilter === "ALL" || order.type === typeFilter;
      const matchesPayment = paymentMethodFilter === "ALL" || (order.payments && order.payments.some(p => p.method === paymentMethodFilter));
      if (!matchesPayment) return false;

      const matchesSearch = searchTerm === "" || order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.user && `${order.user.firstName} ${order.user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()));

      let matchesDate = true;
      switch (dateFilter) {
        case "TODAY": matchesDate = isToday(order.createdAt); break;
        case "YESTERDAY": matchesDate = isYesterday(order.createdAt); break;
        case "WEEK": matchesDate = isWithinLastWeek(order.createdAt); break;
        case "CUSTOM": matchesDate = customDateRange ? isWithinDateRange(order.createdAt, customDateRange) : true; break;
      }
      return matchesType && matchesDate && matchesSearch;
    });
  }, [orders, activeTab, typeFilter, paymentMethodFilter, dateFilter, customDateRange, searchTerm]);

  const groupedOrders = useMemo(() => groupOrders(filteredOrders), [filteredOrders]);

  const financialSummary = useMemo(() => {
    const summary = { total: 0, cash: 0, nequi: 0, ticket: 0, count: filteredOrders.length };
    filteredOrders.forEach(order => {
      if (order.status !== OrderStatus.CANCELLED) {
        summary.total += Number(order.totalAmount);
        order.payments?.forEach(p => {
          if (p.method === PaymentMethod.CASH) summary.cash += Number(p.amount);
          if (p.method === PaymentMethod.NEQUI) summary.nequi += Number(p.amount);
          if (p.method === PaymentMethod.TICKET_BOOK) summary.ticket += Number(p.amount);
        });
      }
    });
    return summary;
  }, [filteredOrders]);

  const counts = useMemo(() => ({
    all: orders?.length || 0,
    pending: orders?.filter(o => o.status === OrderStatus.PENDING).length || 0,
    inKitchen: orders?.filter(o => o.status === OrderStatus.IN_KITCHEN).length || 0,
    ready: orders?.filter(o => o.status === OrderStatus.READY).length || 0,
    delivered: orders?.filter(o => o.status === OrderStatus.DELIVERED).length || 0,
    paid: orders?.filter(o => o.status === OrderStatus.PAID).length || 0,
    sentToCashier: orders?.filter(o => o.status === OrderStatus.SENT_TO_CASHIER).length || 0,
    cancelled: orders?.filter(o => o.status === OrderStatus.CANCELLED).length || 0,
  }), [orders]);

  const handleClearAll = () => {
    setTypeFilter("ALL");
    setPaymentMethodFilter("ALL");
    setDateFilter("TODAY");
    setSearchTerm("");
    setCustomDateRange(undefined);
  };

  if (isLoading) return <SidebarLayout hideTitle fullWidth><div className="p-12 space-y-8"><Skeleton height={40} /><Skeleton variant="card" height={300} /></div></SidebarLayout>;

  return (
    <SidebarLayout hideTitle fullWidth>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sage-600">
              <ShoppingCart className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Registro de Ventas</span>
            </div>
            <h1 className="text-4xl font-bold text-carbon-900 tracking-tight">
              {activeTab === "HISTORY" ? "Historial de Ventas" : "Gestión de Pedidos"}
            </h1>
            <p className="text-lg text-carbon-500 font-medium">
              {activeTab === "HISTORY" ? "Consulta y audita las transacciones pasadas." : "Administra la operación en tiempo real."}
            </p>
          </div>
          <Button onClick={() => navigate(ROUTES.ORDER_CREATE)} className="rounded-2xl h-14 px-8 font-bold bg-carbon-900 text-white">
            <Plus className="w-5 h-5 mr-2 stroke-[3px]" /> Nuevo Pedido
          </Button>
        </header>

        {/* Operational Tabs */}
        <div className="flex items-center gap-2 p-1.5 bg-sage-50 rounded-2xl border border-sage-100 overflow-x-auto no-scrollbar">
          {[
            { id: "BILLING", label: "Por Cobrar", icon: DollarSign, count: counts.pending + counts.sentToCashier },
            { id: "PREPARATION", label: "En Cocina", icon: ChefHat, count: counts.paid + counts.inKitchen },
            { id: "READY", label: "Listos", icon: CheckCircle, count: counts.ready },
            { id: "HISTORY", label: "Historial", icon: History, count: counts.paid + counts.delivered + counts.cancelled }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex-1 min-w-[130px] flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                activeTab === tab.id ? "bg-carbon-900 text-white shadow-soft-lg" : "text-carbon-400 hover:text-carbon-600"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              <span className={cn("px-2 py-0.5 rounded-lg text-[10px]", activeTab === tab.id ? "bg-white/20" : "bg-sage-100 text-sage-600")}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Financial Summary Card (Only in History) */}
        {activeTab === "HISTORY" && (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
            <Card className="bg-carbon-900 text-white p-6 rounded-3xl border-none relative overflow-hidden">
              <p className="text-[10px] font-bold text-carbon-400 uppercase tracking-widest mb-1">Total Ventas</p>
              <p className="text-3xl font-black tracking-tighter">${financialSummary.total.toLocaleString("es-CO")}</p>
              <TrendingUp className="absolute bottom-4 right-6 w-10 h-10 text-white/5" />
            </Card>
            <Card className="bg-white p-6 rounded-3xl border-2 border-emerald-100 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600"><Wallet className="w-5 h-5" /></div>
              <div>
                <p className="text-[10px] font-bold text-carbon-400 uppercase tracking-widest">Efectivo</p>
                <p className="text-lg font-black text-carbon-900">${financialSummary.cash.toLocaleString("es-CO")}</p>
              </div>
            </Card>
            <Card className="bg-white p-6 rounded-3xl border-2 border-purple-100 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600"><Smartphone className="w-5 h-5" /></div>
              <div>
                <p className="text-[10px] font-bold text-carbon-400 uppercase tracking-widest">Nequi</p>
                <p className="text-lg font-black text-carbon-900">${financialSummary.nequi.toLocaleString("es-CO")}</p>
              </div>
            </Card>
            <Card className="bg-white p-6 rounded-3xl border-2 border-blue-100 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600"><Ticket className="w-5 h-5" /></div>
              <div>
                <p className="text-[10px] font-bold text-carbon-400 uppercase tracking-widest">Tiquetera</p>
                <p className="text-lg font-black text-carbon-900">${financialSummary.ticket.toLocaleString("es-CO")}</p>
              </div>
            </Card>
          </div>
        )}

        {/* Filters */}
        <div className="w-full">
          <OrderFilters
            typeFilter={typeFilter}
            paymentMethodFilter={paymentMethodFilter}
            dateFilter={dateFilter}
            customDateRange={customDateRange}
            onTypeChange={setTypeFilter}
            onPaymentMethodChange={setPaymentMethodFilter}
            onDateChange={setDateFilter}
            onCustomDateRangeChange={setCustomDateRange}
            onClearFilter={(key) => {
              if (key === "payment") setPaymentMethodFilter("ALL");
              if (key === "type") setTypeFilter("ALL");
              if (key === "date") setDateFilter("TODAY");
              if (key === "search") setSearchTerm("");
            }}
            onClearAll={handleClearAll}
            resultCount={filteredOrders.length}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </div>


        {/* Orders Grid */}
        {(isGrouped ? groupedOrders.length : filteredOrders.length) > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {(isGrouped ? groupedOrders : filteredOrders).map((item: any) => (
              isGrouped ? (
                <GroupedOrderCard key={item.id} groupedOrder={item} onViewDetail={(id) => navigate(getOrderDetailRoute(id))} />
              ) : (
                <OrderCard key={item.id} order={item} onViewDetail={(id) => navigate(getOrderDetailRoute(id))} />
              )
            ))}
          </div>
        ) : (
          <EmptyState icon={<History className="w-12 h-12" />} title="Sin registros" description="No hay pedidos que coincidan con los filtros aplicados." onAction={handleClearAll} actionLabel="Limpiar Filtros" />
        )}
      </div>
    </SidebarLayout>
  );
}