import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_DB_URL;
const supabaseAnonKey = import.meta.env.VITE_DB_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export const FUNCTIONS_BASE = `${supabaseUrl}/functions/v1`;

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem("token");
  } catch {
    return null;
  }
}
