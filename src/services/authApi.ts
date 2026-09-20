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

const TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function storeTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function clearTokens(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function getAuthHeaders(): Record<string, string> {
  const token = getStoredToken();
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}

/**
 * POST /functions/v1/auth-login
 */
export const login = async (credentials: LoginInput): Promise<AuthResponse> => {
  const res = await fetch(`${FUNCTIONS_BASE}/auth-login`, {
    method: "POST",
    headers: FUNCTION_HEADERS,
    body: JSON.stringify(credentials),
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw { response: { status: res.status, data } };
  }

  if (data.data.accessToken) {
    storeTokens(data.data.accessToken, data.data.refreshToken);
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
    // Only an authenticated ADMIN/SUPERADMIN can create users.
    headers: { ...FUNCTION_HEADERS, ...getAuthHeaders() },

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
 * POST /functions/v1/auth-logout
 *
 * Burns the tokens server-side so a stolen refresh token dies with the session,
 * then clears local storage. Failing to reach the server still logs out locally.
 */
export const logout = async (allDevices = false): Promise<ApiResponse<null>> => {
  const refresh = getStoredRefreshToken();

  try {
    await fetch(`${FUNCTIONS_BASE}/auth-logout`, {
      method: "POST",
      headers: { ...FUNCTION_HEADERS, ...getAuthHeaders() },
      body: JSON.stringify({ refreshToken: refresh, allDevices }),
    });
  } catch {
    // The session ends locally either way.
  }

  clearTokens();
  return { success: true, message: "Logged out", data: null };
};

/**
 * POST /functions/v1/auth-refresh-token
 *
 * Trades the refresh token for a new pair. Rotation is enforced server-side:
 * the old token is burned, and presenting it twice ends every session.
 *
 * Single-flight: concurrent 401s share one refresh instead of racing, which
 * would burn the token more than once and close the session.
 */
let refreshInFlight: Promise<AuthResponse> | null = null;

export const refreshToken = async (): Promise<AuthResponse> => {
  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = (async () => {
    const refresh = getStoredRefreshToken();
    if (!refresh) {
      clearTokens();
      throw { response: { status: 401, data: { message: "No refresh token" } } };
    }

    const res = await fetch(`${FUNCTIONS_BASE}/auth-refresh-token`, {
      method: "POST",
      headers: FUNCTION_HEADERS,
      body: JSON.stringify({ refreshToken: refresh }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok || !data.success) {
      // The refresh token is gone or was reused: the session is over.
      clearTokens();
      throw { response: { status: res.status, data } };
    }

    storeTokens(data.data.accessToken, data.data.refreshToken);

    return {
      success: true,
      message: data.message,
      data: { user: data.data.user as User },
    };
  })();

  try {
    return await refreshInFlight;
  } finally {
    refreshInFlight = null;
  }
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
    headers: { ...FUNCTION_HEADERS, ...getAuthHeaders() },
    body: JSON.stringify({ currentPassword, newPassword }),
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw { response: { status: res.status, data } };
  }

  clearTokens();

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
