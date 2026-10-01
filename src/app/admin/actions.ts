"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  addCurtain,
  confirmCatalogMonth,
  getProduction,
  listPerformances,
  refreshProduction,
  restoreCurtain,
  signInWithPassword,
  suppressCurtain,
  type RefreshShowResult,
} from "@/lib/admin/catalog";
import { adminCookieName, createAdminToken, isAllowedAdminEmail } from "@/lib/admin/session";

async function requireConfiguredAdmin(email: string) {
  if (!isAllowedAdminEmail(email)) {
    throw new Error("This account is not allowed to use Admin.");
  }
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) {
    redirect("/admin/login?error=missing");
  }
  try {
    const session = await signInWithPassword(email, password);
    await requireConfiguredAdmin(session.email);
    const token = await createAdminToken(session.email);
    const jar = await cookies();
    jar.set(adminCookieName, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
  } catch {
    redirect("/admin/login?error=auth");
  }
  redirect("/admin");
}

export async function logoutAction() {
  const jar = await cookies();
  jar.delete(adminCookieName);
  redirect("/admin/login");
}

export async function refreshShowAction(formData: FormData) {
  const id = String(formData.get("productionId") ?? "");
  const production = await getProduction(id);
  if (!production) redirect("/admin");
  try {
    await refreshProduction(production);
  } catch {
    redirect(`/admin/shows/${id}?error=refresh`);
  }
  redirect(`/admin/shows/${id}?ok=refresh`);
}

export async function addCurtainAction(formData: FormData) {
  const productionId = String(formData.get("productionId") ?? "");
  const date = String(formData.get("date") ?? "");
  const time = String(formData.get("time") ?? "");
  const venueName = String(formData.get("venueName") ?? "");
  const venueCity = String(formData.get("venueCity") ?? "");
  const venueAddress = String(formData.get("venueAddress") ?? "");
  if (!productionId || !date || !time) {
    redirect(`/admin/shows/${productionId}?error=curtain`);
  }
  try {
    await addCurtain({
      productionId,
      date,
      time,
      venueName,
      venueCity,
      venueAddress,
    });
  } catch {
    redirect(`/admin/shows/${productionId}?error=curtain`);
  }
  redirect(`/admin/shows/${productionId}?ok=add`);
}

export async function deleteCurtainAction(formData: FormData) {
  const productionId = String(formData.get("productionId") ?? "");
  const curtainId = String(formData.get("curtainId") ?? "");
  if (!productionId || !curtainId) {
    redirect("/admin");
  }
  try {
    await suppressCurtain(curtainId);
  } catch {
    redirect(`/admin/shows/${productionId}?error=delete`);
  }
  redirect(`/admin/shows/${productionId}?ok=delete`);
}

export async function restoreCurtainAction(formData: FormData) {
  const productionId = String(formData.get("productionId") ?? "");
  const curtainId = String(formData.get("curtainId") ?? "");
  if (!productionId || !curtainId) {
    redirect("/admin");
  }
  try {
    await restoreCurtain(curtainId);
  } catch {
    redirect(`/admin/shows/${productionId}?error=restore`);
  }
  redirect(`/admin/shows/${productionId}?ok=restore`);
}

export async function confirmMonthAction(formData: FormData) {
  const productionId = String(formData.get("productionId") ?? "");
  const yearMonth = String(formData.get("yearMonth") ?? "");
  if (!productionId || !/^\d{4}-\d{2}$/.test(yearMonth)) {
    redirect("/admin");
  }
  try {
    const performances = await listPerformances(productionId);
    await confirmCatalogMonth(productionId, yearMonth, performances);
  } catch {
    redirect(`/admin/shows/${productionId}?month=${yearMonth}&error=confirm`);
  }
  redirect(`/admin/shows/${productionId}?month=${yearMonth}&ok=confirm`);
}

export async function refreshShowWithProgress(
  productionId: string,
): Promise<RefreshShowResult> {
  const production = await getProduction(productionId);
  if (!production) return { ok: false, error: "Show not found." };
  try {
    const raw = await refreshProduction(production);
    const result = (raw ?? {}) as Record<string, unknown>;
    return {
      ok: true,
      nights: typeof result.nights === "number" ? result.nights : undefined,
      scrapeStatus:
        typeof result.scrapeStatus === "string" ? result.scrapeStatus : undefined,
      scrapeError:
        typeof result.scrapeError === "string" || result.scrapeError === null
          ? (result.scrapeError as string | null)
          : null,
      fromCache: typeof result.fromCache === "boolean" ? result.fromCache : undefined,
      sourceProvider:
        typeof result.sourceProvider === "string" ? result.sourceProvider : null,
      venueRuns: typeof result.venueRuns === "number" ? result.venueRuns : undefined,
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Refresh failed.",
    };
  }
}
