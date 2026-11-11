/**
 * Same-origin relative path for post-login redirects.
 * Rejects protocol-relative URLs, backslashes, and decoded off-site targets.
 * Copied from Fixer shared helper — do not import across repos.
 */
export function safeInternalPath(
  raw: string | null | undefined,
  fallback: string,
): string {
  if (!raw) return fallback;
  const trimmed = raw.trim();
  if (
    !trimmed.startsWith("/") ||
    trimmed.startsWith("//") ||
    trimmed.startsWith("/\\")
  ) {
    return fallback;
  }
  if (trimmed.includes("\\") || /[\r\n]/.test(trimmed)) {
    return fallback;
  }

  let decoded = trimmed;
  try {
    decoded = decodeURIComponent(trimmed);
  } catch {
    return fallback;
  }

  if (
    decoded.startsWith("//") ||
    decoded.includes("\\") ||
    /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(decoded)
  ) {
    return fallback;
  }

  return trimmed;
}

/** Admin-only internal path (falls back to /admin). */
export function safeAdminPath(raw: string | null | undefined): string {
  const path = safeInternalPath(raw, "/admin");
  if (!path.startsWith("/admin")) return "/admin";
  if (path === "/admin/login" || path.startsWith("/admin/login/")) {
    return "/admin";
  }
  return path;
}
