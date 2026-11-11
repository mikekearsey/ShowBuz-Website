"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ADMIN_IDLE_STORAGE_KEY } from "@/lib/admin/admin-mfa-policy";
import { createAdminSupabaseBrowserClient } from "@/lib/admin/supabase/client";

const WRONG_CODE =
  "That code didn't work. Check the time on your phone and try the newest code.";

const AAL_FAILED = "We couldn't check your sign-in. Try again, or sign out.";

export function LoginVerifyClient({
  nextPath,
  aalCheckFailed = false,
}: {
  nextPath: string;
  aalCheckFailed?: boolean;
}) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(
    aalCheckFailed ? AAL_FAILED : null,
  );
  const [loading, setLoading] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createAdminSupabaseBrowserClient();
    const factors = await supabase.auth.mfa.listFactors();
    if (factors.error) {
      setError(WRONG_CODE);
      setLoading(false);
      return;
    }

    const totpFactors = factors.data.totp;
    if (totpFactors.length === 0) {
      router.replace("/admin/two-step");
      router.refresh();
      return;
    }

    // Each device has its own secret, so try the code against every verified factor.
    let verified = false;
    for (const factor of totpFactors) {
      const { error: verifyError } = await supabase.auth.mfa.challengeAndVerify({
        factorId: factor.id,
        code: code.trim(),
      });
      if (!verifyError) {
        verified = true;
        break;
      }
    }

    setLoading(false);

    if (!verified) {
      setError(WRONG_CODE);
      setCode("");
      return;
    }

    router.replace(nextPath);
    router.refresh();
  }

  async function handleSignOut() {
    setSigningOut(true);
    try {
      localStorage.removeItem(ADMIN_IDLE_STORAGE_KEY);
    } catch {
      // ignore
    }
    const supabase = createAdminSupabaseBrowserClient();
    await supabase.auth.signOut({ scope: "local" });
    router.replace("/admin/login");
    router.refresh();
  }

  if (aalCheckFailed) {
    return (
      <main className="admin-login">
        <p className="admin-kicker">ShowBuz</p>
        <h1>Enter your code</h1>
        <p className="admin-banner error" role="alert">
          {AAL_FAILED}
        </p>
        <div className="admin-form" style={{ display: "flex", gap: 13 }}>
          <button
            type="button"
            onClick={() => {
              router.refresh();
            }}
          >
            Try again
          </button>
          <button
            type="button"
            className="admin-ghost"
            disabled={signingOut}
            onClick={() => void handleSignOut()}
          >
            {signingOut ? "Signing out…" : "Sign out"}
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-login">
      <p className="admin-kicker">ShowBuz</p>
      <h1>Enter your code</h1>
      <p className="admin-lead">
        Open your authenticator app and enter the 6-digit code for ShowBuz Admin.
      </p>
      <form onSubmit={handleVerify} className="admin-form">
        <label>
          Authentication code
          <input
            type="text"
            name="totp"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="one-time-code"
            autoFocus
            required
            maxLength={6}
            minLength={6}
            value={code}
            onChange={(e) =>
              setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            style={{ letterSpacing: "0.2em", fontVariantNumeric: "tabular-nums" }}
          />
        </label>
        {error ? (
          <p className="admin-banner error" role="alert">
            {error}
          </p>
        ) : null}
        <button type="submit" disabled={loading || code.length !== 6}>
          {loading ? "Checking…" : "Verify"}
        </button>
      </form>
      <p className="admin-footnote" style={{ textAlign: "center" }}>
        <button
          type="button"
          className="admin-ghost"
          onClick={() => void handleSignOut()}
          disabled={signingOut}
        >
          {signingOut ? "Signing out…" : "Sign out"}
        </button>
      </p>
    </main>
  );
}
