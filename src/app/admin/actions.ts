"use server";

import { revalidatePath } from "next/cache";
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
import {
  isReviewSchemaMissing,
  setCatalogArchived,
  setCatalogReviewStatus,
  type CatalogReviewStatus,
} from "@/lib/admin/catalog-review";
import {
  applySourceOverride,
  confirmVenue,
  hideFlaggedNight,
  isUuid,
  keepFlaggedNight,
  loadTourCoverage,
  previewSourceUrl,
  setOfficialTourUrl,
  tourIsRechecking,
  updateVenueDetails,
} from "@/lib/admin/coverage";
import { plainAdminError } from "@/lib/admin/schema";
import { adminCookieName, createAdminToken, isAllowedAdminEmail, readAdminEmail } from "@/lib/admin/session";
import {
  setTourStopTimes,
  tourTimesActionError,
  type TourCurtainStamp,
} from "@/lib/admin/tour-times";

async function requireAdminEmail(): Promise<string> {
  const jar = await cookies();
  const email = await readAdminEmail(jar.get(adminCookieName)?.value);
  if (!email) throw new Error("Sign in required.");
  return email;
}

async function requireConfiguredAdmin(email: string) {
  if (!isAllowedAdminEmail(email)) {
    throw new Error("This account is not allowed to use Admin.");
  }
}

// Every exported admin action must call requireAdminEmail() first,
// apart from loginAction and logoutAction.

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
  await requireAdminEmail();
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
  await requireAdminEmail();
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
  await requireAdminEmail();
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
  await requireAdminEmail();
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
  await requireAdminEmail();
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

const REVIEW_STATUSES = new Set<CatalogReviewStatus>([
  "approved",
  "needs_review",
  "rejected",
]);

export async function setCatalogReviewAction(formData: FormData) {
  await requireAdminEmail();
  const id = String(formData.get("productionId") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim();
  const reasonRaw = String(formData.get("reason") ?? "").trim();
  const reason = reasonRaw ? reasonRaw.slice(0, 500) : null;
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id) ||
    !REVIEW_STATUSES.has(status as CatalogReviewStatus)
  ) {
    redirect("/admin/review?error=review");
  }
  try {
    await setCatalogReviewStatus(id, status as CatalogReviewStatus, reason);
  } catch (error) {
    if (isReviewSchemaMissing(error)) redirect("/admin/resident");
    redirect("/admin/review?error=review");
  }
  revalidatePath("/admin/review");
  revalidatePath("/admin/resident");
  revalidatePath("/admin/touring");
  redirect("/admin/review?ok=review");
}

export async function setCatalogArchivedAction(formData: FormData) {
  await requireAdminEmail();
  const id = String(formData.get("productionId") ?? "").trim();
  const archivedRaw = String(formData.get("archived") ?? "").trim().toLowerCase();
  const archived = archivedRaw === "true" || archivedRaw === "1";
  const kindRaw = String(formData.get("listingKind") ?? "").trim();
  const listingKind = kindRaw === "resident" || kindRaw === "touring" ? kindRaw : null;
  const reasonRaw = String(formData.get("reason") ?? "").trim();
  const reason = reasonRaw ? reasonRaw.slice(0, 500) : null;
  const fallback = listingKind ? `/admin/${listingKind}` : "/admin";
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
  ) {
    redirect(`${fallback}?error=archive`);
  }
  try {
    await setCatalogArchived(id, archived, reason);
  } catch {
    redirect(`${fallback}?error=archive`);
  }
  revalidatePath("/admin/resident");
  revalidatePath("/admin/touring");
  revalidatePath(`/admin/shows/${id}`);
  const status = archived ? "archived" : undefined;
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  const q = params.toString();
  redirect(listingKind ? `/admin/${listingKind}${q ? `?${q}` : ""}` : "/admin");
}

export async function refreshShowWithProgress(
  productionId: string,
): Promise<RefreshShowResult> {
  try {
    await requireAdminEmail();
    const production = await getProduction(productionId);
    if (!production) return { ok: false, error: "Show not found." };
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

export async function setOfficialTourUrlAction(
  productionId: string,
  url: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await requireAdminEmail();
    await setOfficialTourUrl(productionId, url);
  } catch (error) {
    return { ok: false, error: plainAdminError(error) };
  }
  revalidatePath("/admin/touring");
  revalidatePath(`/admin/shows/${productionId}`);
  return { ok: true };
}

export async function tourRecheckStatusAction(
  productionId: string,
): Promise<{ done: boolean }> {
  try {
    await requireAdminEmail();
  } catch {
    return { done: false };
  }
  if (!isUuid(productionId)) return { done: true };
  try {
    const snap = await loadTourCoverage(productionId);
    const row = snap.byId.get(productionId);
    if (!snap.available || !row) return { done: true };
    return { done: !tourIsRechecking(row) };
  } catch {
    return { done: true };
  }
}

export async function previewSourceAction(input: {
  url: string;
  stop: { city: string; venueName: string; startDate: string; endDate: string };
}): Promise<
  | { ok: true; source: string | null; curtains: Array<{ date: string; time: string }> }
  | { ok: false; error: string }
> {
  try {
    await requireAdminEmail();
    const preview = await previewSourceUrl(input);
    return { ok: true, source: preview.source, curtains: preview.curtains };
  } catch (error) {
    return { ok: false, error: plainAdminError(error) };
  }
}

export async function applySourceOverrideAction(input: {
  url: string;
  note: string;
  scope: "venue_run" | "venue" | "production";
  venueRunId?: string | null;
  productionId?: string | null;
  venueId?: string | null;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await requireAdminEmail();
    await applySourceOverride(input);
  } catch (error) {
    return { ok: false, error: plainAdminError(error) };
  }
  if (input.productionId && isUuid(input.productionId)) {
    revalidatePath(`/admin/shows/${input.productionId}`);
  }
  revalidatePath("/admin/touring");
  revalidatePath("/admin/look");
  revalidatePath("/admin/venues");
  return { ok: true };
}

export async function keepFlaggedNightAction(formData: FormData) {
  const id = String(formData.get("nightId") ?? "");
  const productionId = String(formData.get("productionId") ?? "");
  if (!isUuid(id)) redirect("/admin/look?error=keep");
  try {
    await requireAdminEmail();
    await keepFlaggedNight(id);
  } catch {
    redirect("/admin/look?error=keep");
  }
  revalidatePath("/admin/look");
  if (isUuid(productionId)) revalidatePath(`/admin/shows/${productionId}`);
  redirect("/admin/look?ok=keep");
}

export async function hideFlaggedNightAction(formData: FormData) {
  const id = String(formData.get("nightId") ?? "");
  const productionId = String(formData.get("productionId") ?? "");
  if (!isUuid(id)) redirect("/admin/look?error=hide");
  try {
    await requireAdminEmail();
    await hideFlaggedNight(id);
  } catch {
    redirect("/admin/look?error=hide");
  }
  revalidatePath("/admin/look");
  if (isUuid(productionId)) revalidatePath(`/admin/shows/${productionId}`);
  redirect("/admin/look?ok=hide");
}

export async function updateVenueAction(input: {
  id: string;
  siteDomain: string;
  whatsOnUrl: string;
  platform: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await requireAdminEmail();
    await updateVenueDetails(input.id, input);
  } catch (error) {
    return { ok: false, error: plainAdminError(error) };
  }
  revalidatePath("/admin/venues");
  return { ok: true };
}

export async function confirmVenueAction(formData: FormData) {
  const id = String(formData.get("venueId") ?? "");
  if (!isUuid(id)) redirect("/admin/venues?error=confirm");
  try {
    await requireAdminEmail();
    await confirmVenue(id);
  } catch {
    redirect("/admin/venues?error=confirm");
  }
  revalidatePath("/admin/venues");
  redirect("/admin/venues?ok=confirm");
}

export async function saveTourStopTimesAction(input: {
  runId: string;
  datesTimes: TourCurtainStamp[];
}): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const email = await requireAdminEmail();
    if (!isUuid(input.runId)) {
      return { ok: false, error: "That stop could not be found." };
    }
    if (!Array.isArray(input.datesTimes) || input.datesTimes.length === 0) {
      return { ok: false, error: "Add at least one curtain time." };
    }
    for (const stamp of input.datesTimes) {
      const date = String(stamp.date ?? "").trim();
      const time = String(stamp.time ?? "").trim();
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) {
        return { ok: false, error: "Each curtain needs a date and HH:MM time." };
      }
    }
    await setTourStopTimes({
      runId: input.runId,
      datesTimes: input.datesTimes.map((stamp) => ({
        date: stamp.date.trim(),
        time: stamp.time.trim(),
      })),
      setBy: email,
    });
  } catch (error) {
    return { ok: false, error: tourTimesActionError(error) };
  }
  revalidatePath("/admin/tour-times");
  revalidatePath("/admin/touring");
  revalidatePath("/admin/look");
  return { ok: true };
}
