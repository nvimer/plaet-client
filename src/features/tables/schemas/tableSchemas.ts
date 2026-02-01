import { TableStatus } from "@/types";
import { z } from "zod";

export const createTableSchema = z.object({
    number: z
        .string()
        .min(1, "El número es requerido")
        .regex(/^[a-zA-Z0-9]+$/, "Solo letras y números"),

    location: z
        .string()
        .max(100, "Máximo 100 caracteres")
        .optional()
        .or(z.literal("")),

    status: z.nativeEnum(TableStatus).default(TableStatus.AVAILABLE),
});

/**
 * Update Table Schema
 *
 * Same as create but all fields optional.
 */
export const updateTableSchema = createTableSchema.partial();

/**
 * Update Table Status Schema
 */
export const updateTableStatusSchema = z.object({
    status: z.nativeEnum(TableStatus),
});

/**
 * TypeScript Types from Zod Schemas
 *
 * Extract TypeScript types from Zod Schemas
 */
export type CreateTableInput = z.infer<typeof createTableSchema>;
export type UpdateTableInput = z.infer<typeof updateTableSchema>;
export type UpdateTableStatusInput = z.infer<typeof updateTableStatusSchema>;
