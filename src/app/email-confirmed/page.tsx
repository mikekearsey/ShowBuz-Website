"use client";

import { AuthAppOpenLanding } from "@/components/AuthAppOpenLanding";

export default function EmailConfirmedPage() {
  return (
    <AuthAppOpenLanding
      title="Thank you"
      body="Email verified. Please return to the ShowBuz app."
      primaryLabel="Open ShowBuz"
      secondaryLabel="Reset your password"
      secondaryIsRecovery
    />
  );
}
