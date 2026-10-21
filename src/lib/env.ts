export interface AppEnv {
  supabaseUrl: string | null;
  supabaseAnonKey: string | null;
  appEnv: "development" | "test" | "production";
  persistence: "local" | "supabase";
}

function readEnv(): AppEnv {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() || null;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || null;
  const raw = import.meta.env.VITE_APP_ENV ?? "development";
  const appEnv =
    raw === "production" || raw === "test" || raw === "development"
      ? raw
      : "development";

  const persistence =
    appEnv !== "test" &&
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith("https://") &&
    supabaseAnonKey.length > 20
      ? "supabase"
      : "local";

  return { supabaseUrl, supabaseAnonKey, appEnv, persistence };
}

export const env = readEnv();

export function isSupabaseConfigured(): boolean {
  return env.persistence === "supabase";
}
