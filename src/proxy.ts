import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  ADMIN_IDLE_COOKIE,
  ADMIN_IDLE_COOKIE_MAX_AGE_SEC,
} from "@/lib/admin/admin-mfa-policy";
import {
  isAdminIdlePublicPath,
  isIdleExpired,
  parseIdleCookieValue,
} from "@/lib/admin/admin-idle";
import { isAllowedAdminEmail, adminCookieName } from "@/lib/admin/session";

function supabaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
    process.env.SUPABASE_URL?.trim() ||
    ""
  );
}

function anonKey(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    process.env.SUPABASE_ANON_KEY?.trim() ||
    ""
  );
}

function idleCookieOptions(maxAgeSec: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: maxAgeSec,
  };
}

function clearIdleCookie(response: NextResponse) {
  response.cookies.set(ADMIN_IDLE_COOKIE, "", {
    ...idleCookieOptions(0),
    maxAge: 0,
  });
}

function setIdleCookie(response: NextResponse, atMs: number) {
  response.cookies.set(
    ADMIN_IDLE_COOKIE,
    String(atMs),
    idleCookieOptions(ADMIN_IDLE_COOKIE_MAX_AGE_SEC),
  );
}

function clearLegacyAdminCookie(response: NextResponse) {
  response.cookies.set(adminCookieName, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

function loginRedirect(request: NextRequest, reason?: "idle") {
  const login = new URL("/admin/login", request.url);
  login.searchParams.set("next", request.nextUrl.pathname);
  if (reason) login.searchParams.set("reason", reason);
  return login;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const url = supabaseUrl();
  const key = anonKey();
  if (!url || !key) {
    if (isAdminIdlePublicPath(pathname)) {
      return NextResponse.next();
    }
    return NextResponse.redirect(loginRedirect(request));
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Always drop the retired custom cookie if it is still present.
  if (request.cookies.get(adminCookieName)) {
    clearLegacyAdminCookie(response);
  }

  const isPublic = isAdminIdlePublicPath(pathname);
  const isSessionPing = pathname === "/admin/api/session/ping";

  if (!user) {
    if (request.cookies.get(ADMIN_IDLE_COOKIE)) {
      clearIdleCookie(response);
    }
    if (isPublic || isSessionPing) {
      return response;
    }
    return NextResponse.redirect(loginRedirect(request));
  }

  const email = user.email?.trim().toLowerCase() ?? "";
  if (!email || !isAllowedAdminEmail(email)) {
    const out = NextResponse.redirect(loginRedirect(request));
    const denySupabase = createServerClient(url, key, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            out.cookies.set(name, value, options),
          );
        },
      },
    });
    await denySupabase.auth.signOut({ scope: "local" });
    clearIdleCookie(out);
    clearLegacyAdminCookie(out);
    return out;
  }

  const now = Date.now();
  const last = parseIdleCookieValue(
    request.cookies.get(ADMIN_IDLE_COOKIE)?.value,
  );

  if (last == null) {
    setIdleCookie(response, now);
    return response;
  }

  if (isIdleExpired(last, now)) {
    let out: NextResponse;
    if (isSessionPing) {
      out = NextResponse.json(
        { error: "Signed out after inactivity" },
        { status: 401 },
      );
    } else if (pathname === "/admin/login") {
      if (request.nextUrl.searchParams.get("reason") === "idle") {
        out = NextResponse.next({ request });
      } else {
        const idleLogin = request.nextUrl.clone();
        idleLogin.searchParams.set("reason", "idle");
        out = NextResponse.redirect(idleLogin);
      }
    } else if (isPublic) {
      out = NextResponse.redirect(request.nextUrl.clone());
    } else {
      out = NextResponse.redirect(loginRedirect(request, "idle"));
    }

    const idleSupabase = createServerClient(url, key, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            out.cookies.set(name, value, options),
          );
        },
      },
    });
    await idleSupabase.auth.signOut({ scope: "local" });
    clearIdleCookie(out);
    clearLegacyAdminCookie(out);
    return out;
  }

  // Refresh the stamp on app pages and the activity ping. Public auth pages
  // keep the existing stamp so a parked login tab does not look "active".
  if (!isPublic || isSessionPing) {
    setIdleCookie(response, now);
  }

  return response;
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
