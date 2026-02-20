/**
 * EXPORTACIÓN CENTRALIZADA DE TIPOS
 *
 * Este archivo permite importar todos los tipos desde un solo lugar:
 * import { Order, MenuItem, User } from '@/types'
 *
 * Todos estos tipos están sincronizados con tu backend de Prisma.
 */

// Common types
export * from "./common";

// Enums (se exportan con `export *` para poder usarlos como valores)
export * from "./enums";

// Domain types
export * from "./user";
export * from "./table";
export * from "./menu";
export * from "./order";

// Analytics types
export interface SalesSummary {
  totalSales: number;
  orderCount: number;
  byPaymentMethod: {
    method: import("./enums").PaymentMethod;
    amount: number;
    count: number;
  }[];
}

export interface TopProduct {
  id: string;
  name: string;
  quantity: number;
  totalRevenue: number;
}

export interface DailyAnalytics {
  salesSummary: SalesSummary;
  topProducts: TopProduct[];
  netBalance: number;
}

// Cash Closure types
export enum CashClosureStatus {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
}

export interface CashClosure {
  id: string;
  openedById: string;
  closedById?: string;
  openingDate: string;
  closingDate?: string;
  openingBalance: number;
  expectedBalance: number;
  actualBalance?: number;
  difference?: number;
  status: CashClosureStatus;
  notes?: string;
  openedBy?: { name: string };
  closedBy?: { name: string };
}

export interface CreateCashClosureDTO {
  openingBalance: number;
}

export interface CloseCashClosureDTO {
  actualBalance: number;
  notes?: string;
}

// Expense types
export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  registeredById: string;
  registeredBy?: { name: string };
}

export interface CreateExpenseDTO {
  amount: number;
  description: string;
  category: string;
}
