/**
 * AUTH VALIDATION SCHEMAS
 *
 * Validation schemas for authentication forms
 * Based on backend validation requirements
 */

import { z } from "zod";

/**
 * Password validation schema
 * Backend requirements: 12+ chars, complexity rules
 */
export const passwordSchema = z
  .string()
  .min(12, "La contraseña debe tener al menos 12 caracteres")
  .max(128, "La contraseña no puede exceder 128 caracteres")
  .regex(/[A-Z]/, "La contraseña debe tener al menos una letra mayúscula")
  .regex(/[a-z]/, "La contraseña debe tener al menos una letra minúscula")
  .regex(/[0-9]/, "La contraseña debe tener al menos un número")
  .regex(
    /[^A-Za-z0-9]/,
    "La contraseña debe tener al menos un carácter especial",
  )
  .refine(
    (password) => !/^(?=.*password|.*123456|.*qwerty)/i.test(password),
    "La contraseña no puede contener patrones comunes como 'password' o '123456'",
  );

/**
 * Email validation schema
 */
export const emailSchema = z
  .string()
  .min(1, "El correo electrónico es requerido")
  .email("Ingrese un correo electrónico válido")
  .max(255, "El correo electrónico no puede exceder 255 caracteres");

/**
 * Name validation schema (first/last name)
 */
export const nameSchema = z
  .string()
  .min(3, "El nombre debe tener al menos 3 caracteres")
  .max(50, "El nombre no puede exceder 50 caracteres")
  .regex(
    /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/,
    "El nombre solo puede contener letras, espacios y caracteres básicos",
  );

/**
 * Phone validation schema (optional, 10 digits)
 */
export const phoneSchema = z
  .string()
  .regex(/^\d{10}$/, "El teléfono debe tener exactamente 10 dígitos")
  .optional()
  .or(z.literal(""));

/**
 * Login form validation schema
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(1, "La contraseña es requerida")
    .max(255, "La contraseña no puede exceder 255 caracteres"),
});

/**
 * Register form validation schema
 */
export const registerSchema = z
  .object({
    firstName: nameSchema,
    lastName: nameSchema,
    email: emailSchema,
    phone: phoneSchema,
    password: passwordSchema,
    confirmPassword: z
      .string()
      .min(1, "La confirmación de contraseña es requerida"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

/**
 * Forgot password form validation schema
 */
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

/**
 * Reset password form validation schema
 */
export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "El token de recuperación es requerido"),
    password: passwordSchema,
    confirmPassword: z
      .string()
      .min(1, "La confirmación de contraseña es requerida"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

/**
 * Email verification form validation schema
 */
export const verifyEmailSchema = z.object({
  token: z.string().min(1, "El token de verificación es requerido"),
});

/**
 * Resend verification form validation schema
 */
export const resendVerificationSchema = z.object({
  email: emailSchema,
});

/**
 * Change password form validation schema
 */
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "La contraseña actual es requerida"),
    password: passwordSchema,
    confirmPassword: z
      .string()
      .min(1, "La confirmación de nueva contraseña es requerida"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.password, {
    message: "La nueva contraseña debe ser diferente a la actual",
    path: ["password"],
  });

/**
 * Type exports
 */
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type VerifyEmailFormData = z.infer<typeof verifyEmailSchema>;
export type ResendVerificationFormData = z.infer<
  typeof resendVerificationSchema
>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
