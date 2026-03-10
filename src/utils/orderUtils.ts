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

  const grouped: GroupedOrder[] = [];
  const processedIds = new Set<string>();

  const sorted = [...orders].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  for (const order of sorted) {
    if (processedIds.has(order.id)) continue;

    const groupMembers: Order[] = [];
    
    for (const other of sorted) {
      if (processedIds.has(other.id)) continue;
      if (other.type !== order.type) continue;

      if (order.type !== OrderType.DINE_IN || !order.tableId) {
        if (other.id === order.id) {
          groupMembers.push(other);
          processedIds.add(other.id);
        }
        continue;
      }

      if (other.tableId !== order.tableId) continue;
      
      const timeDiff = Math.abs(
        new Date(order.createdAt).getTime() - new Date(other.createdAt).getTime()
      );
      
      if (timeDiff <= GROUP_TIME_WINDOW_MS) {
        groupMembers.push(other);
        processedIds.add(other.id);
      }
    }

    if (groupMembers.length > 0) {
      grouped.push({
        id: order.id,
        tableId: order.tableId,
        table: order.table,
        createdAt: order.createdAt,
        status: order.status,
        type: order.type,
        orders: groupMembers,
        totalAmount: groupMembers.reduce(
          (sum, o) => sum + Number(o.totalAmount),
          0
        ),
      });
    }
  }

  return grouped;
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
