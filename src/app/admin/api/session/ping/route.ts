import { NextResponse } from "next/server";
import {
  ADMIN_IDLE_COOKIE,
  ADMIN_IDLE_COOKIE_MAX_AGE_SEC,
} from "@/lib/admin/admin-mfa-policy";
import { isAllowedAdminEmail } from "@/lib/admin/session";
import { createAdminSupabaseServerClient } from "@/lib/admin/supabase/server";

/**
 * Lightweight activity ping for the idle timer.
 * Signed-in allow-listed admin only (works at aal1 on verify / setup).
 */
export async function POST() {
  const supabase = await createAdminSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const email = user?.email?.trim().toLowerCase() ?? "";
  if (!user || !email || !isAllowedAdminEmail(email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = Date.now();
  const response = NextResponse.json({ ok: true, at: now });
  response.cookies.set(ADMIN_IDLE_COOKIE, String(now), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_IDLE_COOKIE_MAX_AGE_SEC,
  });
  return response;
}
