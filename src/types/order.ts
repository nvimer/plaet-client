/**
 * ORDER TYPES
 * Based on Prisma Order and OrderItem models
 */

/**
 * Customer
 * Synced with: model Customer in Prisma
 */

import { OrderStatus, OrderType, PaymentMethod } from "./enums";
import type { User } from "./user";
import type { Table } from "./table";
import type { MenuItem } from "./menu";

/**
 * Cliente (Customer)
 * Sincronizado con: model Customer en Prisma
 */
export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
  deletedAt?: string;
}

/**
 * Order item
 * Synced with: model OrderItem in Prisma
 */
export interface OrderItem {
  id: number;
  orderId: string;
  menuItemId?: number;
  menuItem?: MenuItem; // May or may not be populated
  quantity: number;
  priceAtOrder: number; // Price at order time (Decimal → number)
  notes?: string; // Special notes (e.g., "no onion")
  isFreeSubstitution: boolean; // Whether it's a free substitution
  createdAt: string;
  updatedAt: string;
}

/**
 * Payment
 * Synced with: model Payment in Prisma
 */
export interface Payment {
  id: string;
  orderId?: string;
  method: PaymentMethod;
  amount: number; // Decimal → number
  transactionRef?: string; // Transaction reference (for Nequi, etc.)
  createdAt: string;
}

/**
 * Complete order
 * Synced with: model Order in Prisma
 */
export interface Order {
  id: string;
  tableId?: number;
  table?: Table; // May or may not be populated
  waiterId: string;
  waiter?: User; // User (waiter) who took the order
  customerId?: string;
  customer?: Customer; // Customer (if applicable)
  status: OrderStatus;
  type: OrderType;
  totalAmount: number; // Decimal → number
  notes?: string;
  whatsappOrderId?: string; // WhatsApp order ID (if applicable)
  items?: OrderItem[]; // Order items
  payments?: Payment[]; // Order payments
  createdAt: string;
  updatedAt: string;
}

/**
 * Order item creation input
 */
export interface CreateOrderItemInput {
  menuItemId: number;
  quantity: number;
  priceAtOrder: number;
  notes?: string;
  isFreeSubstitution?: boolean;
}

/**
 * Order creation input
 * Used in POST /orders
 */
export interface CreateOrderInput {
  tableId?: number;
  customerId?: string;
  type: OrderType;
  notes?: string;
  items: CreateOrderItemInput[];
  createdAt?: string; // Support for historical data entry
}

/**
 * Order update input
 * Used in PATCH /orders/:id
 */
export interface UpdateOrderInput {
  tableId?: number;
  customerId?: string;
  status?: OrderStatus;
  type?: OrderType;
  notes?: string;
}

/**
 * Order status update input
 */
export interface UpdateOrderStatusInput {
  status: OrderStatus;
}

/**
 * Payment creation input
 */
export interface CreatePaymentInput {
  orderId: string;
  method: PaymentMethod;
  amount: number;
  transactionRef?: string;
}
