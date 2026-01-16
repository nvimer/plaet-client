import { z } from "zod";

/**
 * Schema for creating a new user
 */
export const createUserSchema = z.object({
  firstName: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede exceder 50 caracteres"),
  lastName: z
    .string()
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .max(50, "El apellido no puede exceder 50 caracteres"),
  email: z.string().email("Email inválido"),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(100, "La contraseña no puede exceder 100 caracteres"),
  phone: z.string().optional(),
  roleIds: z.array(z.number()).optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

/**
 * Schema for updating a user
 */
export const updateUserSchema = z.object({
  firstName: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede exceder 50 caracteres")
    .optional(),
  lastName: z
    .string()
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .max(50, "El apellido no puede exceder 50 caracteres")
    .optional(),
  email: z.string().email("Email inválido").optional(),
  phone: z.string().optional(),
  roleIds: z.array(z.number()).optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

/**
 * Schema for updating own profile (no roles)
 */
export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede exceder 50 caracteres")
    .optional(),
  lastName: z
    .string()
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .max(50, "El apellido no puede exceder 50 caracteres")
    .optional(),
  email: z.string().email("Email inválido").optional(),
  phone: z.string().optional(),
  // No incluir roleIds - usuarios no pueden cambiar sus propios roles
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
