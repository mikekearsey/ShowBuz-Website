"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAdminSupabaseBrowserClient } from "@/lib/admin/supabase/client";

export type TwoStepFactor = {
  id: string;
  friendlyName: string;
  createdAt: string;
};

const VERIFY_THEN_BACK = `/admin/login/verify?next=${encodeURIComponent("/admin/two-step")}`;

const WRONG_CODE =
  "That code didn't work. Check the time on your phone and try the newest code.";

function formatCreatedAt(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

async function unenrollUnverifiedTotp(): Promise<void> {
  const supabase = createAdminSupabaseBrowserClient();
  const { data, error } = await supabase.auth.mfa.listFactors();
  if (error || !data) return;

  const abandoned = data.all.filter(
    (f) => f.factor_type === "totp" && f.status === "unverified",
  );
  for (const factor of abandoned) {
    await supabase.auth.mfa.unenroll({ factorId: factor.id });
  }
}

export function TwoStepSettingsClient({
  initialFactors,
  enforceMfa,
}: {
  initialFactors: TwoStepFactor[];
  enforceMfa: boolean;
}) {
  const router = useRouter();
  const [factors, setFactors] = useState(initialFactors);
  const [mode, setMode] = useState<"idle" | "enrolling">("idle");
  const [factorId, setFactorId] = useState<string | null>(null);
  const [qr, setQr] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [pendingRemoveId, setPendingRemoveId] = useState<string | null>(null);
  const [confirmLastRemove, setConfirmLastRemove] = useState(false);

  async function refreshFactors() {
    const supabase = createAdminSupabaseBrowserClient();
    const { data } = await supabase.auth.mfa.listFactors();
    const next = (data?.totp ?? []).map((f) => ({
      id: f.id,
      friendlyName: f.friendly_name || "Authenticator",
      createdAt: f.created_at,
    }));
    setFactors(next);
    router.refresh();
  }

  async function startEnroll() {
    setError(null);
    setBusy(true);
    setCode("");
    try {
      await unenrollUnverifiedTotp();
      const supabase = createAdminSupabaseBrowserClient();
      const usedNames = new Set(factors.map((f) => f.friendlyName));
      let friendlyName = "Authenticator";
      for (let n = 2; usedNames.has(friendlyName); n += 1) {
        friendlyName = `Authenticator ${n}`;
      }
      // Secret and QR stay in this browser only — never log them.
      const { data, error: enrollError } = await supabase.auth.mfa.enroll({
        factorType: "totp",
        friendlyName,
      });
      if (enrollError || !data) {
        setError(enrollError?.message ?? "Could not start two-step setup.");
        setBusy(false);
        return;
      }
      setFactorId(data.id);
      setQr(data.totp.qr_code);
      setSecret(data.totp.secret);
      setMode("enrolling");
    } finally {
      setBusy(false);
    }
  }

  async function confirmEnroll(e: React.FormEvent) {
    e.preventDefault();
    if (!factorId) return;
    setError(null);
    setBusy(true);

    const supabase = createAdminSupabaseBrowserClient();
    const { error: verifyError } = await supabase.auth.mfa.challengeAndVerify({
      factorId,
      code: code.trim(),
    });

    setBusy(false);

    if (verifyError) {
      setError(WRONG_CODE);
      setCode("");
      return;
    }

    setMode("idle");
    setFactorId(null);
    setQr(null);
    setSecret(null);
    setCode("");
    await refreshFactors();
  }

  async function cancelEnroll() {
    setError(null);
    if (factorId) {
      const supabase = createAdminSupabaseBrowserClient();
      await supabase.auth.mfa.unenroll({ factorId });
    }
    setMode("idle");
    setFactorId(null);
    setQr(null);
    setSecret(null);
    setCode("");
  }

  async function removeFactor(id: string) {
    setError(null);
    const isLast = factors.length === 1 && factors[0]?.id === id;

    if (enforceMfa && isLast) {
      setError(
        "You need at least one device. Add another before removing this one.",
      );
      setPendingRemoveId(null);
      setConfirmLastRemove(false);
      return;
    }

    if (isLast && !confirmLastRemove) {
      setPendingRemoveId(id);
      setConfirmLastRemove(true);
      return;
    }

    setBusy(true);
    const supabase = createAdminSupabaseBrowserClient();
    const { error: unenrollError } = await supabase.auth.mfa.unenroll({
      factorId: id,
    });
    setBusy(false);

    if (unenrollError) {
      if (unenrollError.message.toLowerCase().includes("aal")) {
        router.replace(VERIFY_THEN_BACK);
        return;
      }
      setError(unenrollError.message);
      setPendingRemoveId(null);
      setConfirmLastRemove(false);
      return;
    }

    setPendingRemoveId(null);
    setConfirmLastRemove(false);

    await supabase.auth.refreshSession();
    const { data: aal } =
      await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (aal?.nextLevel === "aal2" && aal.currentLevel !== "aal2") {
      router.replace(VERIFY_THEN_BACK);
      return;
    }

    await refreshFactors();
  }

  const isOn = factors.length > 0;

  if (mode === "enrolling" && qr) {
    return (
      <section className="admin-two-step-panel">
        <p className="admin-lead">
          Scan this QR code with Google Authenticator, 1Password, or a similar
          app. Or type the secret by hand.
        </p>
        {/* eslint-disable-next-line @next/next/no-img-element -- Supabase returns an SVG data URL */}
        <img
          src={qr}
          alt="QR code for authenticator app"
          className="admin-two-step-qr"
        />
        {secret ? <p className="admin-two-step-secret">{secret}</p> : null}
        <form
          onSubmit={(e) => void confirmEnroll(e)}
          className="admin-form"
        >
          <label>
            Enter the 6-digit code to confirm
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="one-time-code"
              required
              maxLength={6}
              minLength={6}
              value={code}
              onChange={(e) =>
                setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              style={{
                letterSpacing: "0.2em",
                fontVariantNumeric: "tabular-nums",
              }}
            />
          </label>
          {error ? (
            <p className="admin-banner error" role="alert">
              {error}
            </p>
          ) : null}
          <div className="admin-two-step-actions">
            <button
              type="submit"
              className="admin-archive-pill"
              disabled={busy || code.length !== 6}
            >
              {busy ? "Checking…" : "Confirm"}
            </button>
            <button
              type="button"
              className="admin-archive-pill"
              disabled={busy}
              onClick={() => void cancelEnroll()}
            >
              Cancel
            </button>
          </div>
        </form>
      </section>
    );
  }

  return (
    <section className="admin-two-step-panel">
      {!isOn ? (
        <>
          <p className="admin-lead">
            Two-step sign-in is off. After you set it up, signing in will ask for
            a 6-digit code from an authenticator app on your phone — even if
            someone knows your password.
          </p>
          {error ? (
            <p className="admin-banner error" role="alert">
              {error}
            </p>
          ) : null}
          <div className="admin-two-step-actions">
            <button
              type="button"
              className="admin-archive-pill"
              disabled={busy}
              onClick={() => void startEnroll()}
            >
              {busy ? "Starting…" : "Set up"}
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="admin-status ok">Two-step sign-in is on</p>
          <ul className="admin-two-step-list">
            {factors.map((factor) => {
              const isOnlyDevice = enforceMfa && factors.length === 1;
              return (
                <li key={factor.id} className="admin-two-step-row">
                  <div>
                    <p className="admin-two-step-name">{factor.friendlyName}</p>
                    <p className="admin-footnote">
                      Added {formatCreatedAt(factor.createdAt)}
                    </p>
                    {isOnlyDevice ? (
                      <p className="admin-footnote">
                        You need at least one device. Add another before
                        removing this one.
                      </p>
                    ) : null}
                  </div>
                  {isOnlyDevice ? null : (
                    <button
                      type="button"
                      className="admin-archive-pill"
                      disabled={busy}
                      onClick={() => void removeFactor(factor.id)}
                    >
                      Remove
                    </button>
                  )}
                </li>
              );
            })}
          </ul>

          {confirmLastRemove && pendingRemoveId && !enforceMfa ? (
            <div className="admin-banner">
              <p>You&apos;ll sign in with just your password.</p>
              <div className="admin-two-step-actions" style={{ marginTop: 13 }}>
                <button
                  type="button"
                  className="admin-archive-pill"
                  disabled={busy}
                  onClick={() => void removeFactor(pendingRemoveId)}
                >
                  {busy ? "Removing…" : "Remove anyway"}
                </button>
                <button
                  type="button"
                  className="admin-archive-pill"
                  disabled={busy}
                  onClick={() => {
                    setConfirmLastRemove(false);
                    setPendingRemoveId(null);
                  }}
                >
                  Keep two-step
                </button>
              </div>
            </div>
          ) : null}

          {error ? (
            <p className="admin-banner error" role="alert">
              {error}
            </p>
          ) : null}

          <div className="admin-two-step-actions">
            <button
              type="button"
              className="admin-archive-pill"
              disabled={busy}
              onClick={() => void startEnroll()}
            >
              {busy ? "Starting…" : "Add another device"}
            </button>
          </div>
        </>
      )}
    </section>
  );
}
