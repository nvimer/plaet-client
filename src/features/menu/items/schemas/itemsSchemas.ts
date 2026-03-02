import z from "zod";
import { InventoryType } from "@/types";

export const createItemSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(50, "El nombre no puede exceder 50 caracteres"),

  description: z.string().max(500, "La descripción no puede exceder los 500 caracteres.").optional(),

  categoryId: z.number({ invalid_type_error: "Debes seleccionar una categoría" }).min(1, "Selecciona una categoría"),

  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Debe ser un precio válido (ej: 1250 o 12.50)").refine(
    (val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    },
    { message: "El precio debe ser mayor a 0" },
  ),

  isAvailable: z.boolean(),

  imageUrl: z.string().url("Debe ser una URL válida").optional().or(z.literal("")),

  inventoryType: z.nativeEnum(InventoryType),

  stockQuantity: z.number({ invalid_type_error: "Ingresa una cantidad válida" }).int("Debe ser un número entero").min(0, "El stock no puede ser negativo").optional(),

  lowStockAlert: z.number({ invalid_type_error: "Ingresa una alerta válida" }).int("Debe ser un número entero").min(0, "La alerta de stock bajo no puede ser negativa").optional(),

  autoMarkUnavailable: z.boolean(),
}).refine(
  (data) => {
    if (data.inventoryType === InventoryType.TRACKED) {
      return data.stockQuantity !== undefined && data.stockQuantity >= 0;
    }
    return true;
  },
  { message: "El stock es requerido cuando el inventario es rastreado", path: ["stockQuantity"] },
);

export const updateItemSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(50, "El nombre no puede exceder 50 caracteres").optional(),

  description: z.string().max(500, "La descripción no puede exceder los 500 caracteres.").optional().or(z.literal("")),

  categoryId: z.number({ invalid_type_error: "Debes seleccionar una categoría" }).min(1, "Selecciona una categoría").optional(),

  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Debe ser un precio válido (ej: 1250 o 12.50)").refine(
    (val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    },
    { message: "El precio debe ser mayor a 0" },
  ).optional(),

  isAvailable: z.boolean().optional(),

  imageUrl: z.string().url("Debe ser una URL válida").optional().or(z.literal("")),

  inventoryType: z.nativeEnum(InventoryType).optional(),

  stockQuantity: z.number({ invalid_type_error: "Ingresa una cantidad válida" }).int("Debe ser un número entero").min(0, "El stock no puede ser negativo").optional(),

  lowStockAlert: z.number({ invalid_type_error: "Ingresa una alerta válida" }).int("Debe ser un número entero").min(0, "La alerta de stock bajo no puede ser negativa").optional(),

  autoMarkUnavailable: z.boolean().optional(),
}).refine(
  (data) => {
    if (data.inventoryType === InventoryType.TRACKED) {
      return data.stockQuantity !== undefined && data.stockQuantity >= 0;
    }
    return true;
  },
  { message: "El stock es requerido cuando el inventario es rastreado", path: ["stockQuantity"] },
);

export type CreateItemInput = z.infer<typeof createItemSchema>;
export type UpdateItemInput = z.infer<typeof updateItemSchema>;
