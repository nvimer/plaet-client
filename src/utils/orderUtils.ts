import { OrderType, OrderStatus, type OrderItem, OrderItemStatus } from "@/types";
import type { Order } from "@/types";
import { isToday as checkIsToday, isYesterday as checkIsYesterday, getLocalDateString } from "./dateUtils";
import type { DateRange } from "@/components";

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


export function isKitchenBoundItem(item: OrderItem): boolean {
  return item.menuItemId !== null && !item.notes?.toLowerCase().includes("portacomida");
}

export function hasActiveKitchenItems(orders: Order[]): boolean {
  return orders.some((o) =>
    o.items?.some(
      (i) =>
        isKitchenBoundItem(i) &&
        [OrderItemStatus.PENDING, OrderItemStatus.IN_KITCHEN, OrderItemStatus.READY].includes(i.status)
    )
  );
}

export function hasPendingKitchenItems(orders: Order[]): boolean {
  return orders.some((o) =>
    o.items?.some(
      (i) =>
        isKitchenBoundItem(i) &&
        [OrderItemStatus.PENDING, OrderItemStatus.IN_KITCHEN].includes(i.status)
    )
  );
}

export function hasReadyKitchenItems(orders: Order[]): boolean {
  const allItems = orders.flatMap((o) => o.items || []);
  const kitchenItems = allItems.filter(isKitchenBoundItem);
  return kitchenItems.some((i) => i.status === OrderItemStatus.READY);
}

export function hasCookingKitchenItems(orders: Order[]): boolean {
  const allItems = orders.flatMap((o) => o.items || []);
  const kitchenItems = allItems.filter(isKitchenBoundItem);
  return kitchenItems.some((i) =>
    [OrderItemStatus.PENDING, OrderItemStatus.IN_KITCHEN].includes(i.status)
  );
}

export function isFullyDelivered(orders: Order[]): boolean {
  return orders.every((o) => {
    if (o.status === OrderStatus.CANCELLED) return true;
    if (o.status === OrderStatus.PAID) {
      return !hasActiveKitchenItems([o]);
    }
    return false;
  });
}

const GROUP_TIME_WINDOW_MS = 2 * 60 * 1000;

export function groupOrders(orders: Order[]): GroupedOrder[] {
  if (!orders || orders.length === 0) return [];

  // 1. First Pass: Grouping into buckets O(N)
  const groupMap = new Map<string, Order[]>();
  
  orders.forEach(order => {
    const timeValue = new Date(order.createdAt).getTime();
    // Bucket key: window based on window size
    // DINE_IN orders are grouped by table, others stay individual (unique id in key)
    const isDineIn = order.type === OrderType.DINE_IN && order.tableId;
    const timeBucket = Math.floor(timeValue / GROUP_TIME_WINDOW_MS);
    
    const key = isDineIn 
      ? `${order.type}-${order.tableId}-${timeBucket}` 
      : `individual-${order.id}`;
    
    if (!groupMap.has(key)) groupMap.set(key, []);
    groupMap.get(key)!.push(order);
  });

  // 2. Second Pass: Mapping to GroupedOrder O(N)
  const grouped = Array.from(groupMap.values()).map(members => {
    // Sort members within group by time (usually already sorted but to be safe)
    const sortedMembers = members.sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    
    const primary = sortedMembers[0];
    return {
      id: primary.id,
      tableId: primary.tableId,
      table: primary.table,
      createdAt: primary.createdAt,
      status: primary.status,
      type: primary.type,
      orders: sortedMembers,
      totalAmount: sortedMembers.reduce((sum, o) => sum + Number(o.totalAmount), 0),
    };
  });

  // Final Sort: Newest groups first
  return grouped.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export const isToday = (dateString: string): boolean => {
  return checkIsToday(dateString);
};

export const isYesterday = (dateString: string): boolean => {
  return checkIsYesterday(dateString);
};

export const isWithinLastWeek = (dateString: string): boolean => {
  const datePart = dateString.split("T")[0];
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  return datePart >= getLocalDateString(weekAgo);
};

export const isWithinDateRange = (dateString: string, range: DateRange): boolean => {
  const datePart = dateString.split("T")[0];
  return datePart >= range.fromDate && datePart <= range.toDate;
};

export type { Order };
