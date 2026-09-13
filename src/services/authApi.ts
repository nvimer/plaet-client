/**
 * AUTH API SERVICE - Supabase Edge Functions
 *
 * Authentication services using Supabase Edge Functions.
 * Endpoints: https://<project>.supabase.co/functions/v1/auth-*
 */

import { FUNCTIONS_BASE } from "@/lib/supabase";
import type {
  LoginInput,
  RegisterInput,
  AuthResponse,
  ApiResponse,
  User,
} from "@/types";

const FUNCTION_HEADERS = {
  "Content-Type": "application/json",
  apikey: import.meta.env.VITE_DB_ANON_KEY,
};

/**
 * POST /functions/v1/auth-login
 */
export const login = async (credentials: LoginInput): Promise<AuthResponse> => {
  const res = await fetch(`${FUNCTIONS_BASE}/auth-login`, {
    method: "POST",
    headers: FUNCTION_HEADERS,
    credentials: "include",
    body: JSON.stringify(credentials),
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw { response: { status: res.status, data } };
  }

  return {
    success: true,
    message: data.message,
    data: {
      user: data.data.user as User,
    },
  };
};

/**
 * POST /functions/v1/auth-register
 */
export const register = async (userData: RegisterInput): Promise<ApiResponse<User>> => {
  const res = await fetch(`${FUNCTIONS_BASE}/auth-register`, {
    method: "POST",
    headers: FUNCTION_HEADERS,
    credentials: "include",
    body: JSON.stringify(userData),
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw { response: { status: res.status, data } };
  }

  return {
    success: true,
    message: data.message,
    data: data.data as User,
  };
};

/**
 * POST /functions/v1/auth-login (logout clears cookies server-side)
 */
export const logout = async (): Promise<ApiResponse<null>> => {
  // Cookies are httpOnly, cleared by the server on next request
  // or we can call a logout function if needed
  return { success: true, message: "Logged out", data: null };
};

/**
 * POST /functions/v1/auth-refresh-token
 * TODO: Implement refresh token Edge Function
 */
export const refreshToken = async (): Promise<AuthResponse> => {
  // For now, refresh is handled by the server via cookie
  const res = await fetch(`${FUNCTIONS_BASE}/auth-login`, {
    method: "POST",
    headers: FUNCTION_HEADERS,
    credentials: "include",
  });

  if (!res.ok) {
    throw { response: { status: res.status } };
  }

  return { success: true, message: "Refreshed", data: { user: {} as User } };
};

/**
 * POST /functions/v1/auth-change-password
 */
export const changePassword = async (
  currentPassword: string,
  newPassword: string,
): Promise<ApiResponse<{ message: string }>> => {
  const res = await fetch(`${FUNCTIONS_BASE}/auth-change-password`, {
    method: "POST",
    headers: FUNCTION_HEADERS,
    credentials: "include",
    body: JSON.stringify({ currentPassword, newPassword }),
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw { response: { status: res.status, data } };
  }

  return {
    success: true,
    message: data.message,
    data: { message: data.message },
  };
};

/**
 * POST /functions/v1/auth-forgot-password
 * TODO: Implement forgot-password Edge Function
 */
export const forgotPassword = async (_email: string): Promise<ApiResponse<{ message: string }>> => {
  return { success: true, message: "Not implemented yet", data: { message: "Not implemented" } };
};

/**
 * POST /functions/v1/auth-reset-password
 * TODO: Implement reset-password Edge Function
 */
export const resetPassword = async (_token: string, _newPassword: string): Promise<ApiResponse<{ message: string }>> => {
  return { success: true, message: "Not implemented yet", data: { message: "Not implemented" } };
};

/**
 * POST /functions/v1/auth-verify-email
 * TODO: Implement verify-email Edge Function
 */
export const verifyEmail = async (_token: string): Promise<ApiResponse<{ message: string }>> => {
  return { success: true, message: "Not implemented yet", data: { message: "Not implemented" } };
};

/**
 * POST /functions/v1/auth-resend-verification
 * TODO: Implement resend-verification Edge Function
 */
export const resendVerification = async (_email: string): Promise<ApiResponse<{ message: string }>> => {
  return { success: true, message: "Not implemented yet", data: { message: "Not implemented" } };
};
