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
export * from "./analytics";
export * from "./cash-closure";
export * from "./expense";
