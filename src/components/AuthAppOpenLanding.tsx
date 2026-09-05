"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Logo } from "@/components/Logo";
import {
  SHOWBUZ_APP_CALLBACK,
  hrefHasAuthToken,
  showbuzAppHref,
} from "@/lib/showbuzAppCallback";

type AuthAppOpenLandingProps = {
  title: string;
  body: string;
  primaryLabel: string;
  /** Marks the deep link as a password reset so ShowBuz shows the new-password screen. */
  primaryIsRecovery?: boolean;
  secondaryLabel?: string;
  secondaryIsRecovery?: boolean;
  autoOpenPrimary?: boolean;
};

export function AuthAppOpenLanding({
  title,
  body,
  primaryLabel,
  primaryIsRecovery = false,
  secondaryLabel,
  secondaryIsRecovery = false,
  autoOpenPrimary = false,
}: AuthAppOpenLandingProps) {
  const [primaryHref, setPrimaryHref] = useState(SHOWBUZ_APP_CALLBACK);
  const [secondaryHref, setSecondaryHref] = useState(SHOWBUZ_APP_CALLBACK);

  useEffect(() => {
    setPrimaryHref(
      showbuzAppHref(
        primaryIsRecovery ? { flow: "recovery", type: "recovery" } : undefined,
      ),
    );
    setSecondaryHref(
      showbuzAppHref(
        secondaryIsRecovery ? { flow: "recovery", type: "recovery" } : undefined,
      ),
    );
  }, [primaryIsRecovery, secondaryIsRecovery]);

  useEffect(() => {
    if (!autoOpenPrimary || !hrefHasAuthToken(primaryHref)) return;
    window.location.assign(primaryHref);
  }, [autoOpenPrimary, primaryHref]);

  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        <Logo size={88} className="h-[88px] w-[88px]" priority />
        <h1 className="mt-6 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          {title}
        </h1>
        <p className="mt-4 max-w-md text-lg leading-relaxed text-muted">
          {body}
        </p>
        <a
          href={primaryHref}
          className="mt-8 rounded-full bg-linear-to-r from-buzz to-buzz-bright px-6 py-3 text-sm font-semibold text-black shadow-[0_0_24px_rgb(255_140_26_/_0.28)] transition hover:brightness-110"
        >
          {primaryLabel}
        </a>
        {secondaryLabel ? (
          <a
            href={secondaryHref}
            className="mt-4 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-foreground transition hover:border-white/30"
          >
            {secondaryLabel}
          </a>
        ) : null}
      </main>
    </div>
  );
}
