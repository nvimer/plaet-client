import z from "zod";

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

    categoryId: z.number(),

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
});

export const updateItemSchema = createItemSchema.partial();

export type CreateItemInput = z.infer<typeof createItemSchema>;
export type UpdateItemInput = z.infer<typeof updateItemSchema>;
