/**
 * Shared fetch for Supabase Edge Functions.
 *
 * Every function answers { success, message, data, meta? } and expects the
 * anon key plus the user's access token.
 */

import { FUNCTIONS_BASE } from "@/lib/supabase";
import { getAuthHeaders } from "./authApi";

export interface FunctionResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: Record<string, unknown>;
}

export async function callFunction<T>(
  path: string,
  options: RequestInit = {},
): Promise<FunctionResponse<T>> {
  const res = await fetch(`${FUNCTIONS_BASE}/${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      apikey: import.meta.env.VITE_DB_ANON_KEY,
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  const body = await res.json().catch(() => ({}));

  if (!res.ok || !body.success) {
    throw { response: { status: res.status, data: body } };
  }

  return body as FunctionResponse<T>;
}

/** Builds a query string, skipping empty values. */
export function query(params: Record<string, string | number | boolean | undefined | null>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}
