/**
 * TIPOS DE PEDIDO (ORDER)
 * Basados en los modelos Order y OrderItem de Prisma
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
 * Item de un pedido
 * Sincronizado con: model OrderItem en Prisma
 */
export interface OrderItem {
  id: number;
  orderId: string;
  menuItemId?: number;
  menuItem?: MenuItem; // Puede venir poblado o no
  quantity: number;
  priceAtOrder: number; // Price at order time (Decimal → number)
  notes?: string; // Special notes (e.g., "no onion")
  isFreeSubstitution: boolean; // Whether it's a free substitution
  createdAt: string;
  updatedAt: string;
}

/**
 * Pago de un pedido
 * Sincronizado con: model Payment en Prisma
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
 * Pedido completo
 * Sincronizado con: model Order en Prisma
 */
export interface Order {
  id: string;
  tableId?: number;
  table?: Table; // Puede venir poblada o no
  waiterId: string;
  waiter?: User; // User (waiter) who took the order
  customerId?: string;
  customer?: Customer; // Cliente (si aplica)
  status: OrderStatus;
  type: OrderType;
  totalAmount: number; // Decimal → number
  notes?: string;
  whatsappOrderId?: string; // ID de pedido de WhatsApp (si aplica)
  items?: OrderItem[]; // Items del pedido
  payments?: Payment[]; // Pagos del pedido
  createdAt: string;
  updatedAt: string;
}

/**
 * Datos para crear un item de pedido
 */
export interface CreateOrderItemInput {
  menuItemId?: number;
  quantity: number;
  priceAtOrder: number;
  notes?: string;
  isFreeSubstitution?: boolean;
}

/**
 * Datos para crear un pedido
 * Usado en POST /orders (cuando se implemente)
 */
export interface CreateOrderInput {
  tableId?: number;
  customerId?: string;
  type: OrderType;
  notes?: string;
  items: CreateOrderItemInput[];
}

/**
 * Datos para actualizar un pedido
 * Usado en PATCH /orders/:id (cuando se implemente)
 */
export interface UpdateOrderInput {
  tableId?: number;
  customerId?: string;
  status?: OrderStatus;
  type?: OrderType;
  notes?: string;
}

/**
 * Datos para actualizar solo el estado de un pedido
 */
export interface UpdateOrderStatusInput {
  status: OrderStatus;
}

/**
 * Datos para agregar un pago
 */
export interface CreatePaymentInput {
  orderId: string;
  method: PaymentMethod;
  amount: number;
  transactionRef?: string;
}
