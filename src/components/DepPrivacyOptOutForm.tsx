"use client";

import { useState } from "react";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "ok"; message: string }
  | { kind: "error"; message: string };

export function DepPrivacyOptOutForm() {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedPhone = phone.trim();
    const trimmedEmail = email.trim();
    if (!trimmedPhone && !trimmedEmail) {
      setStatus({
        kind: "error",
        message: "Enter the mobile number or email your chair uses for you.",
      });
      return;
    }

    setStatus({ kind: "submitting" });
    try {
      const response = await fetch("/api/dep-privacy-opt-out", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: trimmedPhone,
          email: trimmedEmail,
        }),
      });
      const data = (await response.json()) as {
        ok?: boolean;
        message?: string;
        error?: string;
      };
      if (!response.ok || data.error) {
        setStatus({
          kind: "error",
          message:
            data.error ??
            "Could not complete the request. Email admin@showbuz.app.",
        });
        return;
      }
      setStatus({
        kind: "ok",
        message:
          data.message ??
          "Your contact details have been removed from ShowBuz address books.",
      });
      setPhone("");
      setEmail("");
    } catch {
      setStatus({
        kind: "error",
        message:
          "Could not reach ShowBuz. Try again, or email admin@showbuz.app.",
      });
    }
  }

  return (
    <form className="opt-out-form" onSubmit={onSubmit} noValidate>
      <label>
        <span>Mobile number</span>
        <input
          type="tel"
          name="phone"
          autoComplete="tel"
          inputMode="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="07… or +44…"
        />
      </label>
      <label>
        <span>Email (optional if you give a number)</span>
        <input
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
        />
      </label>
      <button type="submit" disabled={status.kind === "submitting"}>
        {status.kind === "submitting" ? "Removing…" : "Remove my details"}
      </button>
      {status.kind === "ok" ? (
        <p className="opt-out-status ok" role="status">
          {status.message}
        </p>
      ) : null}
      {status.kind === "error" ? (
        <p className="opt-out-status error" role="alert">
          {status.message}
        </p>
      ) : null}
    </form>
  );
}
