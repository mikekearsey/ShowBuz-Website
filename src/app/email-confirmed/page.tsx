"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Logo } from "@/components/Logo";

const APP_CALLBACK = "depbookv3://auth/callback";

export default function EmailConfirmedPage() {
  const [appHref, setAppHref] = useState(APP_CALLBACK);

  useEffect(() => {
    setAppHref(`${APP_CALLBACK}${window.location.search}${window.location.hash}`);
  }, []);

  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        <Logo size={88} className="h-[88px] w-[88px]" priority />
        <h1 className="mt-6 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Thank you
        </h1>
        <p className="mt-4 max-w-md text-lg leading-relaxed text-muted">
          Email verified. Please return to the ShowBuz app.
        </p>
        <a
          href={appHref}
          className="mt-8 rounded-full bg-linear-to-r from-buzz to-buzz-bright px-6 py-3 text-sm font-semibold text-black shadow-[0_0_24px_rgb(255_140_26_/_0.28)] transition hover:brightness-110"
        >
          Open ShowBuz
        </a>
      </main>
    </div>
  );
}
