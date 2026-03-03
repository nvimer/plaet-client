import { OrderStatus, OrderType, PaymentMethod, OrderItemStatus } from "@/types";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useOrders, useAddPayment } from "../hooks"; 
import { Button, Skeleton, EmptyState, Card } from "@/components";
import type { DateFilterType, DateRange } from "@/components";
import {
  CheckCircle,
  Plus,
  ShoppingCart,
  TrendingUp,
  DollarSign,
  ChefHat,
  History,
  Wallet,
  Smartphone,
  Ticket
} from "lucide-react";
import { cn } from "@/utils/cn";
import { OrderCard, OrderFilters, GroupedOrderCard, PaymentModal } from "../components"; 
import { ROUTES, getOrderDetailRoute } from "@/app/routes";
import type { Order } from "@/types";
import { SidebarLayout } from "@/layouts/SidebarLayout";
import { 
  isToday as checkIsToday, 
  isYesterday as checkIsYesterday, 
  getLocalDateString 
} from "@/utils/dateUtils";
import { toast } from "sonner";
import type { AxiosErrorWithResponse } from "@/types/common";

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
  // Sort by arrival (FIFO): Oldest first for operational tabs
  const sorted = [...orders].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

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
  const [isGrouped, _setIsGrouped] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: orders, isLoading, error: _error, refetch: _refetch } = useOrders({ limit: 100 });
  const { mutate: addPayment, isPending: isAddingPayment } = useAddPayment();

  // Payment Modal State - Storing IDs for dynamic sync with React Query
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [payingOrderIds, setPayingOrderIds] = useState<string[]>([]);

  // Derived orders from the main list to keep them "alive" (refetched after payment)
  const currentOrdersToPay = useMemo(() => {
    if (!orders) return [];
    return orders.filter(o => payingOrderIds.includes(o.id));
  }, [orders, payingOrderIds]);

  const handleOpenPaymentModal = (ordersInGroup: Order[]) => {
    setPayingOrderIds(ordersInGroup.map(o => o.id));
    setIsPaymentModalOpen(true);
  };

  const handleConfirmPayment = (method: PaymentMethod, _totalAmount: number, orderIds: string[], options?: { reference?: string; phone?: string }) => {
    let processedCount = 0;
    const totalToProcess = orderIds.length;
    
    // We'll track if after this batch there are still pending orders in the group
    const remainingInGroup = currentOrdersToPay.filter(o => !orderIds.includes(o.id));

    orderIds.forEach(orderId => {
      const order = currentOrdersToPay.find(o => o.id === orderId);
      if (!order) return;

      const paid = order.payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;
      const remaining = Math.max(0, Number(order.totalAmount) - paid);

      if (remaining <= 0) {
        processedCount++;
        return;
      }

      addPayment({
        orderId,
        paymentData: {
          method,
          amount: remaining,
          transactionRef: options?.reference,
          phone: options?.phone
        }
      }, {
        onSuccess: () => {
          processedCount++;
          if (processedCount === totalToProcess) {
            toast.success("Pago registrado correctamente");
            
            // Check if there's any order left in the group with pending balance
            // We use status as the primary source of truth if payments array is missing
            const anyBalanceLeft = remainingInGroup.some(o => {
              const isPaid = [
                OrderStatus.PAID, 
                OrderStatus.CANCELLED
              ].includes(o.status);

              if (isPaid) return false;

              const p = o.payments?.reduce((s, pay) => s + Number(pay.amount), 0) || 0;
              return Number(o.totalAmount) - p > 0;
            });

            if (!anyBalanceLeft) {
              setIsPaymentModalOpen(false);
              // Cambiar a la pestaña "En Cocina" para ver los pedidos pagados
              setActiveTab("PREPARATION");
            }
          }
        },
        onError: (error: AxiosErrorWithResponse) => {
          toast.error(`Error en pedido #${orderId.slice(-4)}`, {
            description: error.response?.data?.message || error.message
          });
        }
      });
    });
  };

  // ================ COMPUTED VALUES =================
  // Base filtered list that all tabs and counts should respect (excluding date)
  const baseFilteredOrders = useMemo(() => {
    if (!orders) return [];
    
    return orders.filter((order) => {
      // 1. Regular Filters (Type, Payment, Search)
      const matchesType = typeFilter === "ALL" || order.type === typeFilter;
      const matchesPayment = paymentMethodFilter === "ALL" || (order.payments && order.payments.some(p => p.method === paymentMethodFilter));
      if (!matchesPayment) return false;

      const matchesSearch = searchTerm === "" || order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.user && `${order.user.firstName} ${order.user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()));

      return matchesType && matchesSearch;
    });
  }, [orders, typeFilter, paymentMethodFilter, searchTerm]);

  const filteredOrders = useMemo(() => {
    // Apply Tab Filtering and Date Filtering
    const filtered = baseFilteredOrders.filter((order) => {
      // 1. Date Filter: Only apply to HISTORY tab. 
      // Operational tabs show all active orders regardless of date.
      if (activeTab === "HISTORY") {
        let matchesDate = true;
        switch (dateFilter) {
          case "TODAY": matchesDate = isToday(order.createdAt); break;
          case "YESTERDAY": matchesDate = isYesterday(order.createdAt); break;
          case "WEEK": matchesDate = isWithinLastWeek(order.createdAt); break;
          case "CUSTOM": matchesDate = customDateRange ? isWithinDateRange(order.createdAt, customDateRange) : true; break;
        }
        if (!matchesDate) return false;
      }

      // 2. Tab Lifecycle Filter
      if (activeTab === "BILLING") return order.status === OrderStatus.OPEN || order.status === OrderStatus.SENT_TO_CASHIER;
      
      if (activeTab === "PREPARATION") {
        // MUST be paid to be in preparation tab
        if (order.status !== OrderStatus.PAID) return false;
        return order.items?.some(item => 
          item.status === OrderItemStatus.PENDING || 
          item.status === OrderItemStatus.IN_KITCHEN
        );
      }
      
      if (activeTab === "READY") {
        // MUST be paid to be in ready tab
        if (order.status !== OrderStatus.PAID) return false;
        return order.items?.some(item => item.status === OrderItemStatus.READY);
      }
      
      if (activeTab === "HISTORY") {
        if (order.status === OrderStatus.CANCELLED) return true;
        if (order.status === OrderStatus.PAID) {
          // Only show in history if ALL items are delivered
          return order.items?.every(item => item.status === OrderItemStatus.DELIVERED);
        }
        return false;
      }
      
      return true;
    });

    // Apply sorting
    return filtered.sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      return activeTab === "HISTORY" ? timeB - timeA : timeA - timeB;
    });
  }, [baseFilteredOrders, activeTab, dateFilter, customDateRange]);

  const counts = useMemo(() => {
    // For counts, we apply the date filter to ALL categories to keep numbers consistent with selected date
    const dateFiltered = baseFilteredOrders.filter(order => {
      switch (dateFilter) {
        case "TODAY": return isToday(order.createdAt);
        case "YESTERDAY": return isYesterday(order.createdAt);
        case "WEEK": return isWithinLastWeek(order.createdAt);
        case "CUSTOM": return customDateRange ? isWithinDateRange(order.createdAt, customDateRange) : true;
        default: return true;
      }
    });

    return {
      all: orders?.length || 0,
      billing: baseFilteredOrders?.filter(o => o.status === OrderStatus.OPEN || o.status === OrderStatus.SENT_TO_CASHIER).length || 0,
      inKitchen: baseFilteredOrders?.filter(o => 
        o.status === OrderStatus.PAID && 
        o.items?.some(i => i.status === OrderItemStatus.PENDING || i.status === OrderItemStatus.IN_KITCHEN)
      ).length || 0,
      ready: baseFilteredOrders?.filter(o => 
        o.status === OrderStatus.PAID && 
        o.items?.some(i => i.status === OrderItemStatus.READY)
      ).length || 0,
      history: dateFiltered?.filter(o => 
        o.status === OrderStatus.CANCELLED || 
        (o.status === OrderStatus.PAID && o.items?.every(i => i.status === OrderItemStatus.DELIVERED))
      ).length || 0,
    };
  }, [baseFilteredOrders, orders?.length, dateFilter, customDateRange]);

  const groupedOrders = useMemo(() => {
    // History should show individual records for auditing, but still needs GroupedOrder structure for the UI
    if (activeTab === "HISTORY") {
      return filteredOrders.map(order => ({
        id: order.id,
        tableId: order.tableId,
        table: order.table,
        createdAt: order.createdAt,
        status: order.status,
        type: order.type,
        orders: [order], // Wrap single order in array
        totalAmount: Number(order.totalAmount),
      }));
    }
    return isGrouped ? groupOrders(filteredOrders) : filteredOrders;
  }, [filteredOrders, isGrouped, activeTab]);

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
            { id: "BILLING", label: "Por Cobrar", icon: DollarSign, count: counts.billing },
            { id: "PREPARATION", label: "En Cocina", icon: ChefHat, count: counts.inKitchen },
            { 
              id: "READY", 
              label: "Listos", 
              icon: CheckCircle, 
              count: counts.ready,
              alert: counts.ready > 0
            },
            { id: "HISTORY", label: "Historial", icon: History, count: counts.history }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex-1 min-w-[130px] flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all relative overflow-hidden",
                activeTab === tab.id ? "bg-carbon-900 text-white shadow-soft-lg" : "text-carbon-400 hover:text-carbon-600",
                tab.alert && "ring-2 ring-emerald-500 ring-inset"
              )}
            >
              {tab.alert && (
                <span className="absolute inset-0 bg-emerald-500/10 animate-pulse" />
              )}
              <tab.icon className={cn("w-4 h-4 z-10", tab.alert && "text-emerald-500 animate-bounce")} />
              <span className="z-10">{tab.label}</span>
              <span className={cn("px-2 py-0.5 rounded-lg text-[10px] z-10", 
                activeTab === tab.id ? "bg-white/20" : 
                tab.alert ? "bg-emerald-500 text-white" : "bg-sage-100 text-sage-600"
              )}>
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
                <GroupedOrderCard 
                  key={item.id} 
                  groupedOrder={item} 
                  onViewDetail={(id) => navigate(getOrderDetailRoute(id))} 
                  onPayTable={handleOpenPaymentModal}
                />
              ) : (
                <OrderCard key={item.id} order={item} onViewDetail={(id) => navigate(getOrderDetailRoute(id))} />
              )
            ))}
          </div>
        ) : (
          <EmptyState icon={<History className="w-12 h-12" />} title="Sin registros" description="No hay pedidos que coincidan con los filtros aplicados." onAction={handleClearAll} actionLabel="Limpiar Filtros" />
        )}
      </div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        orders={currentOrdersToPay}
        onConfirm={handleConfirmPayment}
        isPending={isAddingPayment}
      />
    </SidebarLayout>
  );
}
