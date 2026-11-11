import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function supabaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
    process.env.SUPABASE_URL?.trim() ||
    ""
  );
}

function anonKey(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    process.env.SUPABASE_ANON_KEY?.trim() ||
    ""
  );
}

export async function createAdminSupabaseServerClient() {
  const cookieStore = await cookies();
  const url = supabaseUrl();
  const key = anonKey();
  if (!url || !key) {
    throw new Error("Supabase URL and anon key are not configured.");
  }

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Called from a Server Component — proxy refreshes the session.
        }
      },
    },
  });
}
