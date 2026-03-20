import { Button, Card, EmptyState, Skeleton } from "@/components";
import { OrderType, PaymentMethod, type GroupedOrder } from "@/types";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useOrders, useAddPayment } from "../hooks"; 
import { variants, transitions } from "@/utils/motion";
import type { DateFilterType, DateRange } from "@/components";
import {
  Plus,
  ShoppingCart,
  TrendingUp,
  History,
  Wallet,
  Smartphone,
  Ticket
} from "lucide-react";
import { cn } from "@/utils/cn";
import { OrderFilters, GroupedOrderCard, PaymentModal, type PaymentEntry } from "../components"; 
import { ROUTES, getOrderDetailRoute } from "@/app/routes";
import type { Order } from "@/types";
import { SidebarLayout } from "@/layouts/SidebarLayout";
import { toast } from "sonner";
import { groupOrders } from "@/utils/orderUtils";
import { ORDER_TABS, calculateOrderCounts, calculateFinancialSummary, filterOrdersByTab, filterOrdersByTypeAndSearch } from "../utils/orderFilters";

export function OrdersPage() {
  const navigate = useNavigate();

  // ============ STATE =============
  const [activeTab, setActiveTab] = useState<"BILLING" | "PREPARATION" | "READY" | "HISTORY">("BILLING");
  const [typeFilter, setTypeFilter] = useState<OrderType | "ALL">("ALL");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<PaymentMethod | "ALL">("ALL");
  const [dateFilter, setDateFilter] = useState<DateFilterType>("TODAY");
  const [customDateRange, setCustomDateRange] = useState<DateRange | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: orders, isLoading, error: _error, refetch: _refetch } = useOrders({ limit: 100 });
  const { mutateAsync: addPaymentAsync } = useAddPayment();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

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

  const handleConfirmPayment = async (payments: PaymentEntry[], orderIds: string[]) => {
    setIsProcessingPayment(true);
    try {
      // 1. Determine orders with remaining balance
      const ordersToPay = currentOrdersToPay.filter(o => orderIds.includes(o.id));
      
      const ordersWithBalance = ordersToPay.map(order => {
        const paid = order.payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;
        return {
          id: order.id,
          remaining: Math.max(0, Number(order.totalAmount) - paid)
        };
      }).filter(o => o.remaining > 0);

      // 2. Distribute each payment fragment across orders
      for (const payment of payments) {
        let amountToDistribute = payment.amount;

        for (const orderBalance of ordersWithBalance) {
          if (amountToDistribute <= 0) break;
          if (orderBalance.remaining <= 0) continue;

          const amountForThisOrder = Math.min(amountToDistribute, orderBalance.remaining);
          
          await addPaymentAsync({
            orderId: orderBalance.id,
            paymentData: {
              method: payment.method,
              amount: amountForThisOrder,
              transactionRef: payment.reference,
              phone: payment.phone
            }
          });

          amountToDistribute -= amountForThisOrder;
          orderBalance.remaining -= amountForThisOrder;
        }
      }

      toast.success("Pagos registrados correctamente");
      
      // Close modal and switch tab immediately
      setIsPaymentModalOpen(false);
      setActiveTab("PREPARATION");
      
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      toast.error("Error al registrar pagos", {
        description: err.response?.data?.message || err.message
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

      // ================ COMPUTED VALUES =================
      
      const baseFilteredOrders = useMemo(() => {
        return filterOrdersByTypeAndSearch(orders, typeFilter, searchTerm);
      }, [orders, typeFilter, searchTerm]);

      const allGroupedOrders = useMemo(() => {
        return groupOrders(baseFilteredOrders);
      }, [baseFilteredOrders]);

      const groupedOrders = useMemo(() => {
        return filterOrdersByTab(allGroupedOrders, activeTab, dateFilter, customDateRange, paymentMethodFilter);
      }, [allGroupedOrders, activeTab, dateFilter, customDateRange, paymentMethodFilter]);

      const counts = useMemo(() => {
        return calculateOrderCounts(allGroupedOrders, dateFilter, customDateRange, paymentMethodFilter);
      }, [allGroupedOrders, dateFilter, customDateRange, paymentMethodFilter]);

      const financialSummary = useMemo(() => {
        return calculateFinancialSummary(orders ?? [], dateFilter, customDateRange, groupedOrders.length);
      }, [orders, dateFilter, customDateRange, groupedOrders.length]);
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
              <span className="text-[10px] font-semibold tracking-[0.2em]">Registro de Ventas</span>
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
          {ORDER_TABS.map((tab) => {
            const tabCounts = {
              BILLING: counts.billing,
              PREPARATION: counts.inKitchen,
              READY: counts.ready,
              HISTORY: counts.history,
            };
            const count = tabCounts[tab.id];
            const alert = tab.id === "READY" && count > 0;
            return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 min-w-[130px] flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs font-semibold tracking-wide transition-all relative overflow-hidden",
                activeTab === tab.id ? "bg-carbon-900 text-white shadow-soft-lg" : "text-carbon-400 hover:text-carbon-600",
                alert && "ring-2 ring-success-500 ring-inset"
              )}
            >
              {alert && (
                <span className="absolute inset-0 bg-success-500/10 animate-pulse" />
              )}
              <tab.icon className={cn("w-4 h-4 z-10", alert && "text-success-500 animate-bounce")} />
              <span className="z-10">{tab.label}</span>
              <span className={cn("px-2 py-0.5 rounded-lg text-[10px] z-10", 
                activeTab === tab.id ? "bg-white/20" : 
                alert ? "bg-success-500 text-white" : "bg-sage-100 text-sage-600"
              )}>
                {count}
              </span>
            </button>
          );})}
        </div>

        {/* Financial Summary Card (Only in History) */}
        {activeTab === "HISTORY" && (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
            <Card className="bg-carbon-900 text-white p-6 rounded-3xl border-none relative overflow-hidden">
              <p className="text-[10px] font-bold text-carbon-400 tracking-wide mb-1">Total Ventas</p>
              <p className="text-3xl font-black tracking-tighter">${financialSummary.total.toLocaleString("es-CO")}</p>
              <TrendingUp className="absolute bottom-4 right-6 w-10 h-10 text-white/5" />
            </Card>
            <Card className="bg-white p-6 rounded-3xl border-2 border-success-100 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-success-50 flex items-center justify-center text-success-600"><Wallet className="w-5 h-5" /></div>
              <div>
                <p className="text-[10px] font-bold text-carbon-400 tracking-wide">Efectivo</p>
                <p className="text-lg font-black text-carbon-900">${financialSummary.cash.toLocaleString("es-CO")}</p>
              </div>
            </Card>
            <Card className="bg-white p-6 rounded-3xl border-2 border-info-100 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-info-50 flex items-center justify-center text-info-600"><Smartphone className="w-5 h-5" /></div>
              <div>
                <p className="text-[10px] font-bold text-carbon-400 tracking-wide">Nequi</p>
                <p className="text-lg font-black text-carbon-900">${financialSummary.nequi.toLocaleString("es-CO")}</p>
              </div>
            </Card>
            <Card className="bg-white p-6 rounded-3xl border-2 border-blue-100 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600"><Ticket className="w-5 h-5" /></div>
              <div>
                <p className="text-[10px] font-bold text-carbon-400 tracking-wide">Tiquetera</p>
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
            resultCount={groupedOrders.length}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </div>


        {/* Orders Grid */}
        {groupedOrders.length > 0 ? (
          <motion.div 
            variants={transitions.stagger(0.03)}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {groupedOrders.map((item: GroupedOrder) => (
                <motion.div
                  key={item.id}
                  variants={variants.fadeInUp}
                  layout
                >
                  <GroupedOrderCard 
                    groupedOrder={item} 
                    onViewDetail={(id) => navigate(getOrderDetailRoute(id))} 
                    onPayTable={handleOpenPaymentModal}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <EmptyState icon={<History className="w-12 h-12" />} title="Sin registros" description="No hay pedidos que coincidan con los filtros aplicados." onAction={handleClearAll} actionLabel="Limpiar Filtros" />
        )}
      </div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        orders={currentOrdersToPay}
        onConfirm={handleConfirmPayment}
        isPending={isProcessingPayment}
      />
    </SidebarLayout>
  );
}
