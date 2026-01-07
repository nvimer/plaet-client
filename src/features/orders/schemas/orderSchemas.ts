import { OrderStatus, OrderType, PaymentMethod } from "@/types";
import z from "zod";

/**
 * Order Item Schema
 */
export const orderItemSchema = z.object({
    menuItemId: z.number({
        error: (iss) =>
            iss.input === undefined
                ? "Producto es requerido"
                : "ID de producto inválido",
    }),
    quantity: z
        .number({
            error: (iss) =>
                iss.input === undefined ? "Cantidad es requerida" : "Valor inválido",
        })
        .int("Cantidad mínima")
        .min(1, "Cantidad mínima es 1")
        .max(99, "Cantidad máxima es 99"),
    priceAtOrder: z.number().positive("Precio debe ser un valor positivo"),
    notes: z
        .string()
        .max(200, "Notas no pueden exceder 200 caracteres")
        .optional(),
    isFreeSubstitution: z.boolean().optional().default(false),
});

/**
 * Create Order Schema
 */
export const createOrderSchema = z.object({
    tableId: z.number().int().positive("Mesa inválida").nullable(),
    costumerId: z.string().optional(),
    type: z.enum(OrderType, {
        error: (iss) =>
            iss.input === undefined
                ? "Tipo de pedido es requerido"
                : "Tipo de pedido inválido",
    }),
    notes: z
        .string()
        .max(500, "Notas no pueden exceder 500 caracteres")
        .optional(),
    items: z
        .array(orderItemSchema)
        .min(1, "El pedido debe tener al menos un producto"),
});

/**
 * Update Order Schema
 */
export const updateOrderSchema = z.object({
    table: z.number().int().positive().nullable(),
    costumerId: z.string().optional(),
    status: z.enum(OrderStatus).optional(),
    type: z.enum(OrderType).optional(),
    notes: z
        .string()
        .max(500, "Notas no pueden exceder 200 caracteres")
        .optional(),
});

/**
 * Payment Schema
 */
export const paymentSchema = z.object({
    method: z.enum(PaymentMethod, {
        error: (iss) =>
            iss.input === undefined
                ? "Método de Pago es requerido"
                : "Método de pago inválido",
    }),
    amount: z
        .number({
            error: "Monto es requerido",
        })
        .positive("Monto debe ser positivo"),
    transactionRef: z
        .string()
        .max(100, "Referncia no puede exceder 100 caracteres")
        .optional(),
});

export type OrderItemFormInput = z.infer<typeof orderItemSchema>;
export type CreateOrderFormInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderFomrInput = z.infer<typeof updateOrderSchema>;
export type PaymentFormInput = z.infer<typeof paymentSchema>;
