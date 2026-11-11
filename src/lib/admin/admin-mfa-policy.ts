/**
 * Soft MFA (default): only admins who already have a verified factor must enter a code.
 * Enforce: every allow-listed admin needs aal2 (no factor → /admin/two-step).
 *
 * Read on the server. Pass into client components as a prop — do not rely on
 * this env name being available in the browser bundle.
 */
export const ENFORCE_ADMIN_MFA =
  process.env.ENFORCE_ADMIN_MFA === "1" ||
  process.env.ENFORCE_ADMIN_MFA === "true";

/** Sign out after this long with no activity (matches Fixer). */
export const ADMIN_IDLE_TIMEOUT_MS = 30 * 60 * 1000;

/** How often an active tab may refresh the server idle cookie. */
export const ADMIN_IDLE_PING_INTERVAL_MS = 5 * 60 * 1000;

/** httpOnly cookie written by proxy / activity ping. */
export const ADMIN_IDLE_COOKIE = "sbz_admin_last_activity";

/**
 * Keep the stamp long after the idle window so a long gap (laptop asleep, tab
 * closed) still reads as expired. Cleared on sign-out by the proxy.
 */
export const ADMIN_IDLE_COOKIE_MAX_AGE_SEC = 30 * 24 * 60 * 60;

/** localStorage key so tabs share last-activity time. */
export const ADMIN_IDLE_STORAGE_KEY = "sbz_admin_last_activity_ms";
