/**
 * ENUMS - Estados y Tipos
 *
 * Estos enums coinciden EXACTAMENTE con tu backend Prisma.
 * Mantén sincronizados estos valores con tu servidor.
 */

/**
 * Roles de usuario en el sistema
 * Sincronizado con: enum RoleName en Prisma
 */
export enum RoleName {
  ADMIN = "ADMIN",
  CASHIER = "CASHIER",
  WAITER = "WAITER",
  KITCHEN_MANAGER = "KITCHEN_MANAGER",
}

/**
 * Estados de una mesa
 * Sincronizado con: enum TableStatus en Prisma
 */
export enum TableStatus {
  AVAILABLE = "AVAILABLE",
  OCCUPIED = "OCCUPIED",
  NEEDS_CLEANING = "NEEDS_CLEANING",
}

/**
 * Estados de un pedido
 * Sincronizado con: enum OrderStatus en Prisma
 */
export enum OrderStatus {
  PENDING = "PENDING",
  SENT_TO_CASHIER = "SENT_TO_CASHIER",
  PAID = "PAID",
  CANCELLED = "CANCELLED",
  IN_KITCHEN = "IN_KITCHEN",
  READY = "READY",
  DELIVERED = "DELIVERED",
}

/**
 * Tipos de pedido
 * Sincronizado con: enum OrderType en Prisma
 */
export enum OrderType {
  DINE_IN = "DINE_IN",
  TAKE_OUT = "TAKE_OUT",
  DELIVERY = "DELIVERY",
  WHATSAPP = "WHATSAPP",
}

/**
 * Métodos de pago
 * Sincronizado con: enum PaymentMethod en Prisma
 */
export enum PaymentMethod {
  CASH = "CASH",
  NEQUI = "NEQUI",
  TICKET_BOOK = "TICKET_BOOK",
}

/**
 * Tipos de token
 * Sincronizado con: enum TokenType en Prisma
 */
export enum TokenType {
  ACCESS = "ACCESS",
  REFRESH = "REFRESH",
  RESET_PASSWORD = "RESET_PASSWORD",
  VERIFY_EMAIL = "VERIFY_EMAIL",
  IS_USER_UPDATE_DATA = "IS_USER_UPDATE_DATA",
}
