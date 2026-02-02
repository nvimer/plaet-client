import z from "zod";
import { InventoryType } from "@/types";

export const createItemSchema = z.object({
    name: z
        .string({
            error: (iss) =>
                iss.input === undefined ? "Campo Obligatorio" : "Entrada Invalida",
        })
        .min(1, "El nombre es requerido")
        .max(50, "El nombre no puede exceder 50 caracteres"),

    description: z
        .string()
        .max(500, "La descripción no puede exceder los 200 caracteres.")
        .or(z.literal(""))
        .optional(),

    categoryId: z.number({
        invalid_type_error: "Selecciona una categoría",
    }),

    price: z
        .string({
            error: (iss) =>
                iss.input === undefined
                    ? "El precio es requerido."
                    : "Debe ser un precio válido.",
        })
        .regex(/^\d+(\.\d{1,2})?$/, "Debe ser un precio válido (ej: 12.50)")
        .refine(
            (val) => {
                const num = parseFloat(val);
                return num > 0;
            },
            {
                message: "El precio debe ser mayor a 0",
            },
        ),

    isExtra: z.boolean().optional().default(false),
    isAvailable: z.boolean().optional().default(true),
    imageUrl: z.string().optional(),

    // Stock Management Fields
    inventoryType: z
        .nativeEnum(InventoryType)
        .optional()
        .default(InventoryType.NONE),
    
    initialStock: z
        .number()
        .int("El stock inicial debe ser un número entero")
        .min(0, "El stock inicial no puede ser negativo")
        .optional(),
    
    lowStockAlert: z
        .number()
        .int("La alerta de stock bajo debe ser un número entero")
        .min(0, "La alerta de stock bajo no puede ser negativa")
        .optional(),
    
    autoMarkUnavailable: z.boolean().optional().default(false),
})
.refine(
    (data) => {
        // If inventoryType is TRACKED, initialStock should be provided
        if (data.inventoryType === InventoryType.TRACKED) {
            return data.initialStock !== undefined && data.initialStock >= 0;
        }
        return true;
    },
    {
        message: "El stock inicial es requerido cuando el tipo de inventario es TRACKED",
        path: ["initialStock"],
    }
);

// Create update schema manually since partial() doesn't work with refinements
export const updateItemSchema = z.object({
    name: z
        .string()
        .min(1, "El nombre es requerido")
        .max(50, "El nombre no puede exceder 50 caracteres")
        .optional(),

    description: z
        .string()
        .max(500, "La descripción no puede exceder los 200 caracteres.")
        .or(z.literal(""))
        .optional(),

    categoryId: z.number().optional(),

    price: z
        .string()
        .regex(/^\d+(\.\d{1,2})?$/, "Debe ser un precio válido (ej: 12.50)")
        .refine(
            (val) => {
                const num = parseFloat(val);
                return num > 0;
            },
            {
                message: "El precio debe ser mayor a 0",
            },
        )
        .optional(),

    isExtra: z.boolean().optional(),
    isAvailable: z.boolean().optional(),
    imageUrl: z.string().optional(),

    // Stock Management Fields
    inventoryType: z
        .nativeEnum(InventoryType)
        .optional(),
    
    initialStock: z
        .number()
        .int("El stock inicial debe ser un número entero")
        .min(0, "El stock inicial no puede ser negativo")
        .optional(),
    
    lowStockAlert: z
        .number()
        .int("La alerta de stock bajo debe ser un número entero")
        .min(0, "La alerta de stock bajo no puede ser negativa")
        .optional(),
    
    autoMarkUnavailable: z.boolean().optional(),
}).refine(
    (data) => {
        // If inventoryType is TRACKED, initialStock should be provided
        if (data.inventoryType === InventoryType.TRACKED) {
            return data.initialStock !== undefined && data.initialStock >= 0;
        }
        return true;
    },
    {
        message: "El stock inicial es requerido cuando el tipo de inventario es TRACKED",
        path: ["initialStock"],
    }
);

export type CreateItemInput = z.infer<typeof createItemSchema>;
export type UpdateItemInput = z.infer<typeof updateItemSchema>;
