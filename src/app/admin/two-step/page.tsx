import Link from "next/link";
import { logoutAction } from "../actions";
import { requireAdminAccess } from "@/lib/admin/admin-access";
import { ENFORCE_ADMIN_MFA } from "@/lib/admin/admin-mfa-policy";
import {
  TwoStepSettingsClient,
  type TwoStepFactor,
} from "./TwoStepSettingsClient";

export default async function AdminTwoStepPage() {
  // allowMfaEnrollment: when ENFORCE_ADMIN_MFA, this page must still load
  // for admins who have not enrolled yet. Once a factor exists, aal2 is still required.
  const { supabase, email } = await requireAdminAccess({
    allowMfaEnrollment: true,
  });

  const { data: factorsData, error } = await supabase.auth.mfa.listFactors();
  const factors: TwoStepFactor[] = (factorsData?.totp ?? []).map((f) => ({
    id: f.id,
    friendlyName: f.friendly_name || "Authenticator",
    createdAt: f.created_at,
  }));

  return (
    <main>
      <header className="admin-top">
        <div>
          <p className="admin-kicker">
            <Link href="/admin/resident">ShowBuz Admin</Link>
          </p>
          <h1>Two-step sign-in</h1>
          <p className="admin-lead">
            Add an authenticator app so Admin asks for a code after your
            password. Signed in as {email}.
          </p>
        </div>
        <form action={logoutAction}>
          <button type="submit" className="admin-ghost">
            Sign out {email}
          </button>
        </form>
      </header>

      {error ? (
        <p className="admin-banner error" role="alert">
          Could not load two-step status. Try again in a moment.
        </p>
      ) : (
        <TwoStepSettingsClient
          initialFactors={factors}
          enforceMfa={ENFORCE_ADMIN_MFA}
        />
      )}

      <p className="admin-footnote">
        <Link href="/admin/resident">← Back to Admin</Link>
      </p>
    </main>
  );
}
