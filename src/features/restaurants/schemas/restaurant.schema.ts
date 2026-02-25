import { z } from "zod";
import { RestaurantStatus } from "@/types";

/**
 * RESTAURANT VALIDATION SCHEMAS
 */

export const restaurantFormSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre del restaurante debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder los 100 caracteres"),
  address: z.string().max(255).optional(),
  phone: z.string().max(20).optional(),
  nit: z.string().max(20).optional(),
  currency: z.string().default("COP"),
  timezone: z.string().default("America/Bogota"),
  // Admin User Data
  adminFirstName: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres"),
  adminLastName: z
    .string()
    .min(2, "El apellido debe tener al menos 2 caracteres"),
  adminEmail: z.string().email("Correo electrónico inválido"),
  adminPassword: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export type RestaurantFormValues = z.infer<typeof restaurantFormSchema>;

export const updateRestaurantSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  status: z.nativeEnum(RestaurantStatus).optional(),
  address: z.string().max(255).optional().nullable(),
  phone: z.string().max(20).optional().nullable(),
  nit: z.string().max(20).optional().nullable(),
  currency: z.string().optional(),
  timezone: z.string().optional(),
});

export type UpdateRestaurantValues = z.infer<typeof updateRestaurantSchema>;
