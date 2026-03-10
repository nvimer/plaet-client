import { describe, it, expect } from "vitest";
import { groupOrders } from "../utils/orderUtils";
import { OrderType, OrderStatus } from "@/types";
import type { Order } from "@/types";

describe("orderUtils - groupOrders", () => {
  it("should return an empty array if no orders are provided", () => {
    expect(groupOrders([])).toEqual([]);
  });

  it("should group orders of the same type and table within the time window", () => {
    const baseDate = new Date("2024-03-10T12:00:00.000Z");
    const orders: Order[] = [
      {
        id: "1",
        type: OrderType.DINE_IN,
        tableId: 5,
        status: OrderStatus.OPEN,
        totalAmount: "10000",
        createdAt: baseDate.toISOString(),
        items: [],
      } as unknown as Order,
      {
        id: "2",
        type: OrderType.DINE_IN,
        tableId: 5,
        status: OrderStatus.OPEN,
        totalAmount: "5000",
        createdAt: new Date(baseDate.getTime() + 60000).toISOString(), // 1 minute later
        items: [],
      } as unknown as Order,
    ];

    const grouped = groupOrders(orders);
    expect(grouped).toHaveLength(1);
    expect(grouped[0].orders).toHaveLength(2);
    expect(grouped[0].totalAmount).toBe(15000);
  });

  it("should not group orders of different types", () => {
    const baseDate = "2024-03-10T12:00:00.000Z";
    const orders: Order[] = [
      {
        id: "1",
        type: OrderType.DINE_IN,
        tableId: 5,
        status: OrderStatus.OPEN,
        totalAmount: "10000",
        createdAt: baseDate,
        items: [],
      } as unknown as Order,
      {
        id: "2",
        type: OrderType.TAKE_OUT,
        status: OrderStatus.OPEN,
        totalAmount: "5000",
        createdAt: baseDate,
        items: [],
      } as unknown as Order,
    ];

    const grouped = groupOrders(orders);
    expect(grouped).toHaveLength(2);
  });

  it("should not group orders outside the time window", () => {
    const baseDate = new Date("2024-03-10T12:00:00.000Z");
    const orders: Order[] = [
      {
        id: "1",
        type: OrderType.DINE_IN,
        tableId: 5,
        status: OrderStatus.OPEN,
        totalAmount: "10000",
        createdAt: baseDate.toISOString(),
        items: [],
      } as unknown as Order,
      {
        id: "2",
        type: OrderType.DINE_IN,
        tableId: 5,
        status: OrderStatus.OPEN,
        totalAmount: "5000",
        createdAt: new Date(baseDate.getTime() + 180000).toISOString(), // 3 minutes later
        items: [],
      } as unknown as Order,
    ];

    const grouped = groupOrders(orders);
    expect(grouped).toHaveLength(2);
  });
});
