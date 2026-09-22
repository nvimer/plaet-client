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
 * fetch against an Edge Function with the session token, retrying once after a refresh.
 * Returns the raw Response; use fetchFunction for the parsed { success, data } body.
 *
 * A 401 means the access token died (they last 30 minutes). We refresh once and replay
 * the request. If the refresh itself fails the session is over: the original 401 comes
 * back so each caller keeps its own error handling and the guards can send the user to
 * the login page.
 *
 * Every service must go through here. A service with its own fetch silently loses the
 * refresh, and the session dies at 30 minutes on that screen.
 */
export async function fetchWithRefresh(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const send = () =>
    fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        apikey: import.meta.env.VITE_DB_ANON_KEY,
        ...options.headers,
        // Last on purpose: after a refresh the replay must carry the NEW token, not one
        // the caller read before it. Some services still pass their own Authorization.
        ...getAuthHeaders(),
      },
    });

  const res = await send();

  if (res.status !== 401 || !getStoredRefreshToken()) return res;

  try {
    await refreshToken();      // single-flight: concurrent calls share one refresh
  } catch {
    return res;                // refresh failed and cleared the tokens: report the 401
  }
  return await send();
}

/** One request against an Edge Function, parsed as { success, message, data, meta? }. */
export async function fetchFunction<T>(
  url: string,
  options: RequestInit = {},
): Promise<FunctionResponse<T>> {
  const res = await fetchWithRefresh(url, options);
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
