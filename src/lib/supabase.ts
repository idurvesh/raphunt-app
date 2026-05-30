import { createClient, SupabaseClient } from "@supabase/supabase-js";

function isValidUrl(s: string): boolean {
  try {
    new URL(s);
    return true;
  } catch {
    return false;
  }
}

/**
 * Returns a real Supabase client when valid env vars are present,
 * or a safe no-op stub during local dev with placeholder .env values.
 * This prevents the app from crashing before Supabase is wired up.
 */
function buildClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

  if (isValidUrl(url) && key && key !== "your_supabase_anon_key_here") {
    return createClient(url, key);
  }

  // Stub client: every method returns empty data so pages render cleanly
  // without a real Supabase project connected.
  const queryBuilder: Record<string, unknown> = new Proxy({}, {
    get() {
      return () => queryBuilder;
    },
  });

  // Override terminal methods to return real Promises
  const terminalResult = { data: null, error: null, count: 0 };
  const terminals = ["then", "single", "maybeSingle"];
  terminals.forEach((t) => {
    queryBuilder[t] = (cb?: (v: unknown) => unknown) => {
      const p = Promise.resolve(terminalResult);
      return cb ? p.then(cb) : p;
    };
  });

  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    from: () => queryBuilder as any,
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
      signUp: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
      signInWithOAuth: () => Promise.resolve({ data: null, error: null }),
      signOut: () => Promise.resolve({ error: null }),
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;
}

let _client: SupabaseClient | null = null;

export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_t, prop) {
    if (!_client) _client = buildClient();
    return (_client as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export function createServerClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  if (isValidUrl(url) && key) return createClient(url, key);
  return supabase; // fall back to stub in dev
}
