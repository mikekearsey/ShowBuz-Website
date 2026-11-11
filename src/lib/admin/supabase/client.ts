"use client";

import { createBrowserClient } from "@supabase/ssr";

function supabaseUrl(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || "";
}

function anonKey(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || "";
}

export function createAdminSupabaseBrowserClient() {
  const url = supabaseUrl();
  const key = anonKey();
  if (!url || !key) {
    throw new Error("Supabase URL and anon key are not configured.");
  }
  return createBrowserClient(url, key);
}
