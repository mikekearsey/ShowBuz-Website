import {
  ADMIN_IDLE_COOKIE,
  ADMIN_IDLE_TIMEOUT_MS,
} from "@/lib/admin/admin-mfa-policy";

export { ADMIN_IDLE_COOKIE, ADMIN_IDLE_TIMEOUT_MS };

/**
 * Admin paths where idle sign-out must not create a redirect loop, and where
 * aal1 is still allowed (login / code entry).
 */
export function isAdminIdlePublicPath(pathname: string): boolean {
  if (pathname === "/admin/login") return true;
  if (pathname.startsWith("/admin/login/")) return true;
  return false;
}

export function isIdleExpired(
  lastActivityMs: number,
  nowMs = Date.now(),
): boolean {
  if (!Number.isFinite(lastActivityMs) || lastActivityMs <= 0) return true;
  return nowMs - lastActivityMs > ADMIN_IDLE_TIMEOUT_MS;
}

export function parseIdleCookieValue(
  raw: string | undefined,
): number | null {
  if (!raw) return null;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : null;
}
