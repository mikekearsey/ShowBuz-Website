import { ADMIN_COOKIE } from "./constants";

/**
 * Legacy HMAC cookie helpers (createAdminToken / readAdminEmail) are retired.
 * Auth is now a Supabase SSR cookie session. ADMIN_SESSION_SECRET may still be
 * set on Vercel — leave it; it is unused by the app after R3a.
 */

function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

export function isAllowedAdminEmail(email: string): boolean {
  const allowed = adminEmails();
  if (allowed.length === 0) return false;
  return allowed.includes(email.trim().toLowerCase());
}

/** Old custom admin cookie — delete on login/logout; never trust if present. */
export const adminCookieName = ADMIN_COOKIE;
