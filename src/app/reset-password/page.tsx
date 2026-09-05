"use client";

import { AuthAppOpenLanding } from "@/components/AuthAppOpenLanding";

export default function ResetPasswordPage() {
  return (
    <AuthAppOpenLanding
      title="Reset your password"
      body="Choose a new password in the ShowBuz app. You will be signed in after you save it."
      primaryLabel="Open ShowBuz"
      primaryIsRecovery
      autoOpenPrimary
    />
  );
}
