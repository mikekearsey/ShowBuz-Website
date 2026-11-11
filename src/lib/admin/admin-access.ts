import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { ENFORCE_ADMIN_MFA } from "@/lib/admin/admin-mfa-policy";
import { isAllowedAdminEmail } from "@/lib/admin/session";
import { createAdminSupabaseServerClient } from "@/lib/admin/supabase/server";

export { ENFORCE_ADMIN_MFA } from "@/lib/admin/admin-mfa-policy";

export type AdminAccess = {
  supabase: Awaited<ReturnType<typeof createAdminSupabaseServerClient>>;
  user: User;
  email: string;
};

export type AdminMfaRedirect = "/admin/login/verify" | "/admin/two-step";

export type AdminAccessOptions = {
  /**
   * When ENFORCE_ADMIN_MFA is on, allow this request through without a factor
   * so the admin can reach the setup page. Still requires aal2 if a factor exists.
   */
  allowMfaEnrollment?: boolean;
};

type MfaGateResult =
  | { ok: true }
  | { ok: false; redirectTo: AdminMfaRedirect };

export type AdminMfaLevel = {
  currentLevel: string | null;
  nextLevel: string | null;
};

/**
 * AAL from server-checked data only. The no-argument
 * getAuthenticatorAssuranceLevel() reads factors from the session cookie,
 * which the browser can edit, so it must not decide whether a code is needed.
 * Factors come from the getUser() result; aal from verified JWT claims.
 * Returns null if the claims check fails.
 */
export async function getAdminMfaLevel(
  supabase: Awaited<ReturnType<typeof createAdminSupabaseServerClient>>,
  user: User,
): Promise<AdminMfaLevel | null> {
  const hasVerifiedFactor = adminHasVerifiedFactor(user);
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data) return null;
  const aal = data.claims.aal;
  const currentLevel = typeof aal === "string" ? aal : null;
  return {
    currentLevel,
    nextLevel: hasVerifiedFactor ? "aal2" : currentLevel,
  };
}

/** Server-verified user (from getUser) has at least one verified factor. */
export function adminHasVerifiedFactor(user: User): boolean {
  return (user.factors ?? []).some((factor) => factor.status === "verified");
}

/**
 * Soft (ENFORCE_ADMIN_MFA=false): verified factor + aal1 → verify; no factor → pass.
 * Enforce (true): no aal2 → verify if a factor exists, else setup (unless allowMfaEnrollment).
 * AAL lookup failure: soft-pass only when not enforcing and the user has no
 * verified factor; otherwise fail closed to verify.
 */
async function checkAdminMfaGate(
  supabase: Awaited<ReturnType<typeof createAdminSupabaseServerClient>>,
  user: User,
  options?: AdminAccessOptions,
): Promise<MfaGateResult> {
  const data = await getAdminMfaLevel(supabase, user);
  if (!data) {
    if (!ENFORCE_ADMIN_MFA && !adminHasVerifiedFactor(user)) {
      return { ok: true };
    }
    return { ok: false, redirectTo: "/admin/login/verify" };
  }

  const needsCode =
    data.nextLevel === "aal2" && data.currentLevel !== "aal2";

  if (needsCode) {
    return { ok: false, redirectTo: "/admin/login/verify" };
  }

  if (
    ENFORCE_ADMIN_MFA &&
    data.currentLevel !== "aal2" &&
    !options?.allowMfaEnrollment
  ) {
    return { ok: false, redirectTo: "/admin/two-step" };
  }

  return { ok: true };
}

/**
 * Server gate for admin pages and mutations.
 * Signed-in + allow-listed email + MFA rules. Soft: verified factor at aal1 → verify.
 */
export async function requireAdminAccess(
  options?: AdminAccessOptions,
): Promise<AdminAccess> {
  const supabase = await createAdminSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    redirect("/admin/login");
  }

  const email = user.email.trim().toLowerCase();
  if (!isAllowedAdminEmail(email)) {
    await supabase.auth.signOut({ scope: "local" });
    redirect("/admin/login");
  }

  const mfa = await checkAdminMfaGate(supabase, user, options);
  if (!mfa.ok) {
    redirect(mfa.redirectTo);
  }

  return { supabase, user, email };
}

/**
 * Same rules as requireAdminAccess, but returns a result for login flows
 * that need to choose the next URL without throwing a redirect mid-handler.
 */
export async function checkAdminAccess(
  options?: AdminAccessOptions,
): Promise<
  | { ok: true; user: User; email: string }
  | {
      ok: false;
      redirectTo: "/admin/login" | AdminMfaRedirect;
    }
> {
  const supabase = await createAdminSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return { ok: false, redirectTo: "/admin/login" };
  }

  const email = user.email.trim().toLowerCase();
  if (!isAllowedAdminEmail(email)) {
    await supabase.auth.signOut({ scope: "local" });
    return { ok: false, redirectTo: "/admin/login" };
  }

  const mfa = await checkAdminMfaGate(supabase, user, options);
  if (!mfa.ok) {
    return { ok: false, redirectTo: mfa.redirectTo };
  }

  return { ok: true, user, email };
}

/** True when a Next.js redirect() was thrown (do not swallow in action catch). */
export function isNextRedirectError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    typeof (error as { digest?: unknown }).digest === "string" &&
    String((error as { digest: string }).digest).startsWith("NEXT_REDIRECT")
  );
}
