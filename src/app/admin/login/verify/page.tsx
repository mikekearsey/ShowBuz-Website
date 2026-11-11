import { redirect } from "next/navigation";
import {
  adminHasVerifiedFactor,
  getAdminMfaLevel,
} from "@/lib/admin/admin-access";
import { ENFORCE_ADMIN_MFA } from "@/lib/admin/admin-mfa-policy";
import { safeAdminPath } from "@/lib/admin/safe-path";
import { createAdminSupabaseServerClient } from "@/lib/admin/supabase/server";
import { isAllowedAdminEmail } from "@/lib/admin/session";
import { LoginVerifyClient } from "./LoginVerifyClient";

/**
 * Signed-in admin at aal1 with a verified TOTP factor enters their code.
 * Not gated by requireAdminAccess (that would redirect here forever).
 */
export default async function AdminLoginVerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  const destination = safeAdminPath(params.next ?? null);

  const supabase = await createAdminSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email || !isAllowedAdminEmail(user.email)) {
    if (user) await supabase.auth.signOut({ scope: "local" });
    redirect("/admin/login");
  }

  const aal = await getAdminMfaLevel(supabase, user);

  if (!aal) {
    if (ENFORCE_ADMIN_MFA || adminHasVerifiedFactor(user)) {
      return <LoginVerifyClient nextPath={destination} aalCheckFailed />;
    }
    redirect(destination);
  }

  if (aal.currentLevel === "aal2") {
    redirect(destination);
  }

  // No verified factor → setup when enforcing; otherwise admin (soft mode).
  if (aal.nextLevel !== "aal2") {
    redirect(ENFORCE_ADMIN_MFA ? "/admin/two-step" : destination);
  }

  return <LoginVerifyClient nextPath={destination} />;
}
