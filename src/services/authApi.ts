/**
 * AUTH API SERVICE
 *
 * Servicios relacionados con autenticación.
 * Endpoints base: /auth/*
 */

import { axiosClient } from "./axiosClient";
import type {
  LoginInput,
  RegisterInput,
  AuthResponse,
  ApiResponse,
  User,
} from "@/types";

/**
 * POST /auth/login
 *
 * Inicia sesión y obtiene un token JWT
 *
 * @param credentials - Email y contraseña
 * @returns Token de autenticación
 */
export const login = async (credentials: LoginInput) => {
  const { data } = await axiosClient.post<AuthResponse>(
    "/auth/login",
    credentials,
  );
  return data;
};

/**
 * POST /auth/register
 *
 * Registra un nuevo usuario
 *
 * @param userData - Datos del nuevo usuario
 * @returns Usuario creado
 */
export const register = async (userData: RegisterInput) => {
  const { data } = await axiosClient.post<ApiResponse<User>>(
    "/auth/register",
    userData,
  );
  return data;
};

/**
 * POST /auth/logout
 *
 * Cierra la sesión actual
 */
export const logout = async () => {
  const { data } = await axiosClient.post<ApiResponse<null>>("/auth/logout");
  return data;
};

/**
 * POST /auth/refresh
 *
 * Refresca el token de autenticación
 */
export const refreshToken = async () => {
  const { data } = await axiosClient.post<AuthResponse>("/auth/refresh");
  return data;
};

/**
 * POST /auth/forgot-password
 *
 * Solicita recuperación de contraseña
 *
 * @param email - Email del usuario
 */
export const forgotPassword = async (email: string) => {
  const { data } = await axiosClient.post<ApiResponse<{ message: string }>>(
    "/auth/forgot-password",
    { email },
  );
  return data;
};

/**
 * POST /auth/reset-password
 *
 * Resetea la contraseña con un token
 *
 * @param token - Token de reseteo
 * @param newPassword - Nueva contraseña
 */
export const resetPassword = async (token: string, newPassword: string) => {
  const { data } = await axiosClient.post<ApiResponse<{ message: string }>>(
    "/auth/reset-password",
    { token, password: newPassword },
  );
  return data;
};

/**
 * POST /auth/verify-email
 *
 * Verifica el email del usuario con un token
 *
 * @param token - Token de verificación
 */
export const verifyEmail = async (token: string) => {
  const { data } = await axiosClient.post<ApiResponse<{ message: string }>>(
    "/auth/verify-email",
    { token },
  );
  return data;
};

/**
 * POST /auth/resend-verification
 *
 * Reenvía el email de verificación
 *
 * @param email - Email del usuario
 */
export const resendVerification = async (email: string) => {
  const { data } = await axiosClient.post<ApiResponse<{ message: string }>>(
    "/auth/resend-verification",
    { email },
  );
  return data;
};

/**
 * POST /auth/change-password
 *
 * Cambia la contraseña del usuario autenticado
 *
 * @param currentPassword - Contraseña actual
 * @param newPassword - Nueva contraseña
 */
export const changePassword = async (
  currentPassword: string,
  newPassword: string,
) => {
  const { data } = await axiosClient.post<ApiResponse<{ message: string }>>(
    "/auth/change-password",
    { currentPassword, newPassword },
  );
  return data;
};
