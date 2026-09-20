/**
 * Shared fetch for Supabase Edge Functions.
 *
 * Every function answers { success, message, data, meta? } and expects the
 * anon key plus the user's access token.
 */

import { FUNCTIONS_BASE } from "@/lib/supabase";
import { getAuthHeaders, getStoredRefreshToken, refreshToken } from "./authApi";

export interface FunctionResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: Record<string, unknown>;
}

/**
 * One request against an Edge Function, retrying once after refreshing.
 *
 * A 401 means the access token died (they last 30 minutes). We refresh once and
 * replay the request; if the refresh fails, the session is over and the error
 * surfaces so the guards can send the user to the login page.
 */
export async function fetchFunction<T>(
  url: string,
  options: RequestInit = {},
): Promise<FunctionResponse<T>> {
  const send = () =>
    fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        apikey: import.meta.env.VITE_DB_ANON_KEY,
        ...getAuthHeaders(),
        ...options.headers,
      },
    });

  let res = await send();

  if (res.status === 401 && getStoredRefreshToken()) {
    await refreshToken();      // single-flight: concurrent calls share one refresh
    res = await send();
  }

  const body = await res.json().catch(() => ({}));

  if (!res.ok || !body.success) {
    throw { response: { status: res.status, data: body } };
  }

  return body as FunctionResponse<T>;
}

export async function callFunction<T>(
  path: string,
  options: RequestInit = {},
): Promise<FunctionResponse<T>> {
  return await fetchFunction<T>(`${FUNCTIONS_BASE}/${path}`, options);
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
