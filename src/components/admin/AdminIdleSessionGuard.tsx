"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isAdminIdlePublicPath } from "@/lib/admin/admin-idle";
import {
  ADMIN_IDLE_PING_INTERVAL_MS,
  ADMIN_IDLE_STORAGE_KEY,
  ADMIN_IDLE_TIMEOUT_MS,
} from "@/lib/admin/admin-mfa-policy";
import { createAdminSupabaseBrowserClient } from "@/lib/admin/supabase/client";

function readSharedActivity(): number {
  try {
    const raw = localStorage.getItem(ADMIN_IDLE_STORAGE_KEY);
    const n = raw ? Number(raw) : 0;
    return Number.isFinite(n) && n > 0 ? n : 0;
  } catch {
    return 0;
  }
}

function writeSharedActivity(atMs: number) {
  try {
    localStorage.setItem(ADMIN_IDLE_STORAGE_KEY, String(atMs));
  } catch {
    // ignore quota / private mode
  }
}

function sessionStartedMs(session: {
  user: { last_sign_in_at?: string | null };
}): number {
  const raw = session.user.last_sign_in_at;
  if (!raw) return 0;
  const t = Date.parse(raw);
  return Number.isFinite(t) && t > 0 ? t : 0;
}

function stampIsFromEarlierSession(
  shared: number,
  session: { user: { last_sign_in_at?: string | null } },
): boolean {
  const started = sessionStartedMs(session);
  return shared > 0 && started > 0 && shared < started;
}

/**
 * Client idle timer for signed-in admins. Tracks pointer/key/scroll/visibility,
 * shares last activity across tabs, signs out at ADMIN_IDLE_TIMEOUT_MS, and
 * pings the server at most every ~5 min while active.
 */
export function AdminIdleSessionGuard() {
  const router = useRouter();
  const pathname = usePathname() ?? "/";
  const lastActivityRef = useRef(0);
  const lastWriteRef = useRef(0);
  const lastPingRef = useRef(0);
  const signedInRef = useRef(false);
  const signingOutRef = useRef(false);

  useEffect(() => {
    if (!pathname.startsWith("/admin")) return;

    const needsGuard =
      pathname.startsWith("/admin/login/verify") ||
      pathname.startsWith("/admin/two-step") ||
      !isAdminIdlePublicPath(pathname);

    if (!needsGuard) return;

    let cancelled = false;
    const supabase = createAdminSupabaseBrowserClient();

    async function signOutIdle() {
      if (signingOutRef.current || cancelled) return;
      signingOutRef.current = true;
      try {
        try {
          localStorage.removeItem(ADMIN_IDLE_STORAGE_KEY);
        } catch {
          // ignore
        }
        await supabase.auth.signOut({ scope: "local" });
        router.replace("/admin/login?reason=idle");
        router.refresh();
      } finally {
        signingOutRef.current = false;
      }
    }

    function isExpired(now: number) {
      const last = Math.max(lastActivityRef.current, readSharedActivity());
      return last > 0 && now - last > ADMIN_IDLE_TIMEOUT_MS;
    }

    function markActivity() {
      if (!signedInRef.current || cancelled) return;
      const now = Date.now();
      if (isExpired(now)) {
        void signOutIdle();
        return;
      }
      lastActivityRef.current = now;
      if (now - lastWriteRef.current < 1000) return;
      lastWriteRef.current = now;
      writeSharedActivity(now);

      if (now - lastPingRef.current >= ADMIN_IDLE_PING_INTERVAL_MS) {
        lastPingRef.current = now;
        void fetch("/admin/api/session/ping", {
          method: "POST",
          credentials: "same-origin",
        }).catch(() => {
          // Network blip — client timer and proxy still apply.
        });
      }
    }

    function onStorage(e: StorageEvent) {
      if (e.key !== ADMIN_IDLE_STORAGE_KEY || e.newValue == null) return;
      const n = Number(e.newValue);
      if (Number.isFinite(n) && n > lastActivityRef.current) {
        lastActivityRef.current = n;
      }
    }

    function onVisibility() {
      if (document.visibilityState === "visible") {
        markActivity();
      }
    }

    const activityEvents: Array<keyof WindowEventMap> = [
      "pointerdown",
      "keydown",
      "scroll",
      "mousemove",
      "touchstart",
    ];

    async function boot() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (cancelled) return;
      signedInRef.current = !!session;
      if (!session) return;

      const shared = readSharedActivity();
      const now = Date.now();
      const stampFromThisSession =
        shared > 0 && !stampIsFromEarlierSession(shared, session);
      if (stampFromThisSession && now - shared > ADMIN_IDLE_TIMEOUT_MS) {
        void signOutIdle();
        return;
      }
      lastActivityRef.current = stampFromThisSession ? shared : now;
      writeSharedActivity(lastActivityRef.current);
      lastPingRef.current = 0;
      markActivity();

      for (const evt of activityEvents) {
        window.addEventListener(evt, markActivity, { passive: true });
      }
      document.addEventListener("visibilitychange", onVisibility);
      window.addEventListener("storage", onStorage);
    }

    void boot();

    const tick = window.setInterval(() => {
      if (!signedInRef.current || cancelled) return;
      if (isExpired(Date.now())) {
        void signOutIdle();
      }
    }, 15_000);

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      signedInRef.current = !!session;
      if (event === "SIGNED_OUT") {
        try {
          localStorage.removeItem(ADMIN_IDLE_STORAGE_KEY);
        } catch {
          // ignore
        }
      }
      if (session && (event === "SIGNED_IN" || event === "PASSWORD_RECOVERY")) {
        const shared = readSharedActivity();
        if (shared === 0 || stampIsFromEarlierSession(shared, session)) {
          const now = Date.now();
          lastActivityRef.current = now;
          lastWriteRef.current = now;
          writeSharedActivity(now);
        }
        lastPingRef.current = 0;
        markActivity();
      }
    });

    return () => {
      cancelled = true;
      window.clearInterval(tick);
      for (const evt of activityEvents) {
        window.removeEventListener(evt, markActivity);
      }
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("storage", onStorage);
      sub.subscription.unsubscribe();
    };
  }, [pathname, router]);

  return null;
}
