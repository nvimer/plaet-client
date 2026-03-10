import { OrderStatus, OrderType, PaymentMethod, OrderItemStatus, type GroupedOrder } from "@/types";
import type { DateFilterType, DateRange } from "@/components";
import { 
  isToday, 
  isYesterday, 
  isWithinLastWeek, 
  isWithinDateRange,
  isKitchenBoundItem,
  isFullyDelivered
} from "@/utils/orderUtils";

export type OrderTab = "BILLING" | "PREPARATION" | "READY" | "HISTORY";

export interface TabConfig {
  id: OrderTab;
  label: string;
  icon: typeof import("lucide-react").DollarSign;
}

export const ORDER_TABS: TabConfig[] = [
  { id: "BILLING", label: "Por Cobrar", icon: import("lucide-react").DollarSign as never },
  { id: "PREPARATION", label: "En Cocina", icon: import("lucide-react").ChefHat as never },
  { id: "READY", label: "Listos", icon: import("lucide-react").CheckCircle as never },
  { id: "HISTORY", label: "Historial", icon: import("lucide-react").History as never },
];

export interface OrderCounts {
  all: number;
  billing: number;
  inKitchen: number;
  ready: number;
  history: number;
}

export interface FinancialSummary {
  total: number;
  cash: number;
  nequi: number;
  ticket: number;
  count: number;
}

function hasPendingKitchenItems(orders: import("@/types").Order[]): boolean {
  return orders.some((o) =>
    o.items?.some(
      (i) =>
        isKitchenBoundItem(i) &&
        [OrderItemStatus.PENDING, OrderItemStatus.IN_KITCHEN].includes(i.status)
    )
  );
}

function hasReadyKitchenItems(orders: import("@/types").Order[]): boolean {
  const allItems = orders.flatMap((o) => o.items || []);
  const kitchenItems = allItems.filter(isKitchenBoundItem);
  return kitchenItems.some((i) => i.status === OrderItemStatus.READY);
}

function hasCookingKitchenItems(orders: import("@/types").Order[]): boolean {
  const allItems = orders.flatMap((o) => o.items || []);
  const kitchenItems = allItems.filter(isKitchenBoundItem);
  return kitchenItems.some((i) =>
    [OrderItemStatus.PENDING, OrderItemStatus.IN_KITCHEN].includes(i.status)
  );
}

export function calculateOrderCounts(
  groupedOrders: GroupedOrder[],
  dateFilter: DateFilterType,
  customDateRange: DateRange | undefined,
  paymentMethodFilter: PaymentMethod | "ALL"
): OrderCounts {
  let billing = 0;
  let inKitchen = 0;
  let ready = 0;
  let history = 0;

  for (const group of groupedOrders) {
    const anyUnpaid = group.orders.some(o => o.status !== OrderStatus.PAID);
    const allPaid = !anyUnpaid;

    if (group.orders.some(o => o.status === OrderStatus.OPEN || o.status === OrderStatus.SENT_TO_CASHIER)) {
      billing++;
    }

    if (allPaid && hasPendingKitchenItems(group.orders)) {
      inKitchen++;
    }

    if (allPaid && hasReadyKitchenItems(group.orders) && !hasCookingKitchenItems(group.orders)) {
      const allItems = group.orders.flatMap(o => o.items || []);
      const kitchenItems = allItems.filter(isKitchenBoundItem);
      if (kitchenItems.length > 0) {
        ready++;
      }
    }

    let matchesDate = true;
    switch (dateFilter) {
      case "TODAY": matchesDate = isToday(group.createdAt); break;
      case "YESTERDAY": matchesDate = isYesterday(group.createdAt); break;
      case "WEEK": matchesDate = isWithinLastWeek(group.createdAt); break;
      case "CUSTOM": matchesDate = customDateRange ? isWithinDateRange(group.createdAt, customDateRange) : true; break;
    }

    if (matchesDate) {
      if (paymentMethodFilter !== "ALL") {
        const hasMethod = group.orders.some(o => o.payments?.some(p => p.method === paymentMethodFilter));
        if (!hasMethod) continue;
      }

      if (isFullyDelivered(group.orders)) {
        history++;
      }
    }
  }

  return {
    all: groupedOrders.length,
    billing,
    inKitchen,
    ready,
    history,
  };
}

export function calculateFinancialSummary(
  orders: import("@/types").Order[],
  dateFilter: DateFilterType,
  customDateRange: DateRange | undefined,
  groupedCount: number
): FinancialSummary {
  const summary = { total: 0, cash: 0, nequi: 0, ticket: 0, count: groupedCount };
  
  for (const order of orders) {
    if (order.status === OrderStatus.CANCELLED) continue;

    let matchesDate = true;
    switch (dateFilter) {
      case "TODAY": matchesDate = isToday(order.createdAt); break;
      case "YESTERDAY": matchesDate = isYesterday(order.createdAt); break;
      case "WEEK": matchesDate = isWithinLastWeek(order.createdAt); break;
      case "CUSTOM": matchesDate = customDateRange ? isWithinDateRange(order.createdAt, customDateRange) : true; break;
    }
    if (!matchesDate) continue;

    summary.total += Number(order.totalAmount);
    order.payments?.forEach(p => {
      if (p.method === PaymentMethod.CASH) summary.cash += Number(p.amount);
      if (p.method === PaymentMethod.NEQUI) summary.nequi += Number(p.amount);
      if (p.method === PaymentMethod.TICKET_BOOK) summary.ticket += Number(p.amount);
    });
  }

  return summary;
}

export function filterOrdersByTab(
  groupedOrders: GroupedOrder[],
  activeTab: OrderTab,
  dateFilter: DateFilterType,
  customDateRange: DateRange | undefined,
  paymentMethodFilter: PaymentMethod | "ALL"
): GroupedOrder[] {
  return groupedOrders.filter((group) => {
    if (activeTab === "BILLING") {
      return group.orders.some(o => o.status === OrderStatus.OPEN || o.status === OrderStatus.SENT_TO_CASHIER);
    }

    if (activeTab === "PREPARATION") {
      const anyUnpaid = group.orders.some(o => o.status !== OrderStatus.PAID);
      if (anyUnpaid) return false;
      return group.orders.some(o => 
        o.items?.some(i => isKitchenBoundItem(i) && [OrderItemStatus.PENDING, OrderItemStatus.IN_KITCHEN].includes(i.status))
      );
    }

    if (activeTab === "READY") {
      const anyUnpaid = group.orders.some(o => o.status !== OrderStatus.PAID);
      if (anyUnpaid) return false;
      const allItems = group.orders.flatMap(o => o.items || []);
      const kitchenItems = allItems.filter(isKitchenBoundItem);
      if (kitchenItems.length === 0) return false;
      const hasCooking = kitchenItems.some(i => [OrderItemStatus.PENDING, OrderItemStatus.IN_KITCHEN].includes(i.status));
      const hasReady = kitchenItems.some(i => i.status === OrderItemStatus.READY);
      return !hasCooking && hasReady;
    }

    if (activeTab === "HISTORY") {
      let matchesDate = true;
      switch (dateFilter) {
        case "TODAY": matchesDate = isToday(group.createdAt); break;
        case "YESTERDAY": matchesDate = isYesterday(group.createdAt); break;
        case "WEEK": matchesDate = isWithinLastWeek(group.createdAt); break;
        case "CUSTOM": matchesDate = customDateRange ? isWithinDateRange(group.createdAt, customDateRange) : true; break;
      }
      if (!matchesDate) return false;

      if (paymentMethodFilter !== "ALL") {
        const hasMethod = group.orders.some(o => o.payments?.some(p => p.method === paymentMethodFilter));
        if (!hasMethod) return false;
      }

      return isFullyDelivered(group.orders);
    }

    return true;
  });
}

export function filterOrdersByTypeAndSearch(
  orders: import("@/types").Order[] | undefined,
  typeFilter: OrderType | "ALL",
  searchTerm: string
): import("@/types").Order[] {
  if (!orders) return [];
  
  return orders.filter((order) => {
    const matchesType = typeFilter === "ALL" || order.type === typeFilter;
    if (!matchesType) return false;

    const matchesSearch = searchTerm === "" || 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.waiter && `${order.waiter.firstName} ${order.waiter.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.notes && order.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesSearch;
  });
}
