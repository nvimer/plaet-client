import type { User } from "@/types";
import { logger } from "@/utils";

export interface AuthError {
  type?: "AUTH" | "NETWORK" | "TIMEOUT" | null;
  message: string;
  code?: string;
  field?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: AuthError | null;
  lastActivity: Date | null;
}

export const TOKEN_REFRESH_INTERVAL = 14 * 60 * 1000;
export const AUTH_CHECK_TIMEOUT = 10000;

export function getUserFromStorage(): User | null {
  try {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
}

export function saveUserToStorage(user: User): void {
  try {
    localStorage.setItem("user", JSON.stringify(user));
  } catch {
    logger.error("Failed to save user to localStorage");
  }
}

export function removeUserFromStorage(): void {
  localStorage.removeItem("user");
}

export function createTimeoutPromise(ms: number): Promise<never> {
  return new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Timeout")), ms),
  );
}

export function parseAuthError(error: unknown): string {
  return error instanceof Error && "response" in error
    ? (error as { response?: { data?: { message?: string } } }).response
        ?.data?.message || error.message
    : "Error de autenticación. Inténtalo nuevamente.";
}

export function getAuthErrorType(
  error: unknown,
  storedUser: User | null,
): "AUTH" | "NETWORK" {
  const axiosError = error as { response?: { status?: number }; code?: string };
  
  if (
    axiosError.response?.status === 401 ||
    axiosError.code === "AUTH_REFRESH_FAILED"
  ) {
    return "AUTH";
  }
  
  if (storedUser) {
    return "AUTH";
  }
  
  return "NETWORK";
}
