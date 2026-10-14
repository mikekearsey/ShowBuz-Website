import type { CatalogVenueRun } from "@/lib/admin/catalog";
import { londonYmd } from "@/lib/admin/london";
import { httpsUrl, isKnownPlatform } from "@/lib/admin/labels";
import { isMissingSchema } from "@/lib/admin/schema";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const RECHECK_WINDOW_MS = 20 * 60 * 1000;

type RestErrorBody = { message?: string; error?: string; code?: string; hint?: string };

export type TourCoverage = {
  id: string;
  officialTourUrl: string | null;
  officialTourUrlSource: "scrape" | "admin" | null;
  officialTourUrlUpdatedAt: string | null;
  tourStopsTimed: number | null;
  tourStopsFuture: number | null;
  lastScrapedAt: string | null;
};

export type TourCoverageSnapshot = {
  available: boolean;
  byId: Map<string, TourCoverage>;
};

export type FlaggedNight = {
  id: string;
  productionId: string;
  productionName: string;
  startsAt: string;
  venueName: string;
  venueCity: string | null;
  reviewReason: string | null;
  venueRunId: string | null;
  venueId: string | null;
  stopStart: string;
  stopEnd: string;
};

export type FlaggedNightSnapshot = {
  available: boolean;
  nights: FlaggedNight[];
};

export type VenueDirectoryRow = {
  id: string;
  venueName: string;
  city: string;
  siteDomain: string | null;
  whatsOnUrl: string | null;
  platform: string;
  directoryStatus: string;
  learnedWhatsOnUrl: string | null;
};

export type VenueDirectorySnapshot = {
  available: boolean;
  venues: VenueDirectoryRow[];
};

export type PreviewCurtain = { date: string; time: string };

export type SourcePreview = {
  source: string | null;
  curtains: PreviewCurtain[];
};

function supabaseUrl(): string {
  return (
    process.env.SUPABASE_URL ??
    process.env.NEXT_PUBLIC_SUPABASE_URL ??
    ""
  ).replace(/\/$/, "");
}

function serviceKey(): string {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? "";
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set on the server.");
  return key;
}

export function isUuid(value: string): boolean {
  return UUID_RE.test(value);
}

function asCount(value: unknown): number | null {
  if (value == null || value === "") return null;
  const count = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(count) || count < 0) return null;
  return Math.trunc(count);
}

function fold(value: string | null | undefined): string {
  return (value ?? "").trim().toLowerCase().replaceAll("’", "'");
}

async function serviceRest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const key = serviceKey();
  const response = await fetch(`${supabaseUrl()}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });
  const text = await response.text();
  if (!response.ok) {
    let message = text;
    let code = "";
    try {
      const parsed = JSON.parse(text) as RestErrorBody;
      message = parsed.message ?? parsed.error ?? parsed.hint ?? text;
      code = parsed.code ?? "";
    } catch {
      /* keep text */
    }
    const error = new Error(message || `Request failed (${response.status})`) as Error & {
      code?: string;
    };
    error.code = code;
    throw error;
  }
  if (!text) return [] as T;
  return JSON.parse(text) as T;
}

async function serviceRestAll<T>(path: string, pageSize = 1000): Promise<T[]> {
  const out: T[] = [];
  let offset = 0;
  const join = path.includes("?") ? "&" : "?";
  for (;;) {
    const chunk = await serviceRest<T[]>(`${path}${join}limit=${pageSize}&offset=${offset}`);
    out.push(...chunk);
    if (chunk.length === 0 || chunk.length < pageSize) break;
    offset += pageSize;
    if (offset > 200_000) break;
  }
  return out;
}

type CoverageRow = {
  id: string;
  official_tour_url?: string | null;
  official_tour_url_source?: string | null;
  official_tour_url_updated_at?: string | null;
  tour_stops_timed?: number | string | null;
  tour_stops_future?: number | string | null;
  last_scraped_at?: string | null;
};

function asSource(value: string | null | undefined): "scrape" | "admin" | null {
  if (value === "scrape" || value === "admin") return value;
  return null;
}

function toCoverage(row: CoverageRow): TourCoverage {
  return {
    id: row.id,
    officialTourUrl: row.official_tour_url?.trim() || null,
    officialTourUrlSource: asSource(row.official_tour_url_source),
    officialTourUrlUpdatedAt: row.official_tour_url_updated_at ?? null,
    tourStopsTimed: asCount(row.tour_stops_timed),
    tourStopsFuture: asCount(row.tour_stops_future),
    lastScrapedAt: row.last_scraped_at ?? null,
  };
}

const COVERAGE_FIELDS =
  "id,official_tour_url,official_tour_url_source,official_tour_url_updated_at,tour_stops_timed,tour_stops_future,last_scraped_at";

export async function loadTourCoverage(productionId?: string): Promise<TourCoverageSnapshot> {
  const filter = productionId
    ? `id=eq.${encodeURIComponent(productionId)}&`
    : "listing_kind=eq.touring&";
  try {
    const rows = await serviceRestAll<CoverageRow>(
      `catalog_productions?${filter}select=${COVERAGE_FIELDS}`,
    );
    const byId = new Map<string, TourCoverage>();
    for (const row of rows) byId.set(row.id, toCoverage(row));
    return { available: true, byId };
  } catch (error) {
    if (!isMissingSchema(error)) throw error;
    return { available: false, byId: new Map() };
  }
}

export function tourIsRechecking(
  row: Pick<TourCoverage, "officialTourUrlUpdatedAt" | "lastScrapedAt">,
  now = Date.now(),
): boolean {
  if (!row.officialTourUrlUpdatedAt) return false;
  const updated = Date.parse(row.officialTourUrlUpdatedAt);
  if (!Number.isFinite(updated)) return false;
  if (now - updated > RECHECK_WINDOW_MS) return false;
  if (!row.lastScrapedAt) return true;
  const scraped = Date.parse(row.lastScrapedAt);
  return !Number.isFinite(scraped) || scraped < updated;
}

export function coverageFromRuns(
  runs: Array<Pick<CatalogVenueRun, "end_date" | "times_status" | "review_reason">>,
  todayYmd: string,
): { timed: number; future: number } | null {
  const futureRuns = runs.filter(
    (run) => run.review_reason !== "duplicate_of" && run.end_date >= todayYmd,
  );
  if (futureRuns.length === 0) return null;
  if (futureRuns.every((run) => !run.times_status)) return null;
  return {
    future: futureRuns.length,
    timed: futureRuns.filter((run) => run.times_status === "timed").length,
  };
}

export async function setOfficialTourUrl(productionId: string, url: string): Promise<void> {
  if (!isUuid(productionId)) throw new Error("That show was not found.");
  const safe = httpsUrl(url);
  if (!safe) throw new Error("official tour url must be https");
  await serviceRest<unknown>("rpc/set_official_tour_url", {
    method: "POST",
    body: JSON.stringify({ p_id: productionId, p_url: safe }),
  });
}

type NightRow = {
  id: string;
  production_id: string;
  starts_at: string;
  venue_name: string | null;
  venue_city: string | null;
  review_reason: string | null;
  duplicate_of?: string | null;
};

type RunMatch = {
  id: string;
  production_id: string;
  city: string | null;
  venue_name: string;
  start_date: string;
  end_date: string;
  review_reason?: string | null;
};

type VenueMatch = { id: string; city: string; venue_name: string };

function matchRun(night: NightRow, runs: RunMatch[]): RunMatch | null {
  const ymd = londonYmd(night.starts_at);
  const venue = fold(night.venue_name);
  const city = fold(night.venue_city);
  const sameShow = runs.filter((run) => run.production_id === night.production_id);
  const named = sameShow.filter((run) => fold(run.venue_name) === venue);
  const placed = city ? named.filter((run) => fold(run.city) === city) : named;
  const pool = placed.length > 0 ? placed : named;
  return (
    pool.find((run) => run.start_date <= ymd && run.end_date >= ymd) ??
    pool[0] ??
    null
  );
}

function matchVenue(night: NightRow, venues: VenueMatch[]): string | null {
  const venue = fold(night.venue_name);
  const city = fold(night.venue_city);
  const hit = venues.find(
    (row) => fold(row.venue_name) === venue && (!city || fold(row.city) === city),
  );
  return hit?.id ?? null;
}

export async function loadFlaggedNights(): Promise<FlaggedNightSnapshot> {
  let nights: NightRow[];
  try {
    nights = await serviceRestAll<NightRow>(
      "catalog_performances?needs_review=eq.true&select=id,production_id,starts_at,venue_name,venue_city,review_reason,duplicate_of&order=starts_at.asc",
    );
  } catch (error) {
    if (!isMissingSchema(error)) throw error;
    try {
      nights = await serviceRestAll<NightRow>(
        "catalog_performances?needs_review=eq.true&select=id,production_id,starts_at,venue_name,venue_city,review_reason&order=starts_at.asc",
      );
    } catch (retry) {
      if (!isMissingSchema(retry)) throw retry;
      return { available: false, nights: [] };
    }
  }

  const productionIds = [...new Set(nights.map((night) => night.production_id))];
  const names = new Map<string, string>();
  const runs: RunMatch[] = [];
  let venues: VenueMatch[] = [];

  if (productionIds.length > 0) {
    const chunkSize = 40;
    for (let i = 0; i < productionIds.length; i += chunkSize) {
      const filter = productionIds
        .slice(i, i + chunkSize)
        .map((id) => encodeURIComponent(id))
        .join(",");
      try {
        const rows = await serviceRest<{ id: string; name: string }[]>(
          `catalog_productions?id=in.(${filter})&select=id,name`,
        );
        for (const row of rows) names.set(row.id, row.name);
      } catch (error) {
        if (!isMissingSchema(error)) throw error;
      }
      try {
        const rows = await serviceRestAll<RunMatch>(
          `catalog_venue_runs?production_id=in.(${filter})&select=id,production_id,city,venue_name,start_date,end_date,review_reason&order=start_date.asc`,
        );
        runs.push(...rows.filter((run) => run.review_reason !== "duplicate_of"));
      } catch (error) {
        if (!isMissingSchema(error)) throw error;
      }
    }
  }

  try {
    venues = await serviceRestAll<VenueMatch>(
      "catalog_venues?select=id,city,venue_name",
    );
  } catch (error) {
    if (!isMissingSchema(error)) throw error;
  }

  return {
    available: true,
    nights: nights.map((night) => {
      const run = matchRun(night, runs);
      const ymd = londonYmd(night.starts_at);
      return {
        id: night.id,
        productionId: night.production_id,
        productionName: names.get(night.production_id) ?? "Untitled tour",
        startsAt: night.starts_at,
        venueName: (night.venue_name ?? "").trim() || "Venue",
        venueCity: night.venue_city?.trim() || null,
        reviewReason: night.review_reason,
        venueRunId: run?.id ?? null,
        venueId: matchVenue(night, venues),
        stopStart: run?.start_date ?? ymd,
        stopEnd: run?.end_date ?? ymd,
      };
    }),
  };
}

async function patchNight(id: string, body: Record<string, unknown>): Promise<void> {
  try {
    await serviceRest<unknown>(`catalog_performances?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  } catch (error) {
    if (!isMissingSchema(error) || !("duplicate_of" in body)) throw error;
    const rest = Object.fromEntries(
      Object.entries(body).filter(([key]) => key !== "duplicate_of"),
    );
    await serviceRest<unknown>(`catalog_performances?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(rest),
    });
  }
}

/** Clear the flag. The row stays, and chairs can see the night again. */
export async function keepFlaggedNight(id: string): Promise<void> {
  if (!isUuid(id)) throw new Error("That night was not found.");
  await patchNight(id, {
    needs_review: false,
    review_reason: null,
    duplicate_of: null,
  });
}

/**
 * Mark the night superseded. The row stays in the table.
 * Chairs hide review_reason = duplicate_of; nothing is deleted.
 */
export async function hideFlaggedNight(id: string): Promise<void> {
  if (!isUuid(id)) throw new Error("That night was not found.");
  await patchNight(id, {
    needs_review: false,
    review_reason: "duplicate_of",
  });
}

const VENUE_FIELDS =
  "id,venue_name,city,site_domain,whats_on_url,platform,directory_status,learned_whats_on_url";
const VENUE_FIELDS_BASE =
  "id,venue_name,city,site_domain,whats_on_url,platform,directory_status";

type VenueRow = {
  id: string;
  venue_name: string;
  city: string;
  site_domain: string | null;
  whats_on_url: string | null;
  platform: string | null;
  directory_status: string | null;
  learned_whats_on_url?: string | null;
};

function toVenue(row: VenueRow): VenueDirectoryRow {
  return {
    id: row.id,
    venueName: row.venue_name,
    city: row.city,
    siteDomain: row.site_domain,
    whatsOnUrl: row.whats_on_url,
    platform: row.platform || "unknown",
    directoryStatus: row.directory_status || "unsure",
    learnedWhatsOnUrl: row.learned_whats_on_url ?? null,
  };
}

export async function loadVenues(): Promise<VenueDirectorySnapshot> {
  try {
    const rows = await serviceRestAll<VenueRow>(
      `catalog_venues?select=${VENUE_FIELDS}&order=city.asc,venue_name.asc`,
    );
    return { available: true, venues: rows.map(toVenue) };
  } catch (error) {
    if (!isMissingSchema(error)) throw error;
    try {
      const rows = await serviceRestAll<VenueRow>(
        `catalog_venues?select=${VENUE_FIELDS_BASE}&order=city.asc,venue_name.asc`,
      );
      return { available: true, venues: rows.map(toVenue) };
    } catch (retry) {
      if (!isMissingSchema(retry)) throw retry;
      return { available: false, venues: [] };
    }
  }
}

export function normalizeSiteDomain(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  try {
    if (trimmed.includes("://")) {
      return new URL(trimmed).hostname.replace(/^www\./i, "");
    }
  } catch {
    return trimmed.replace(/^www\./i, "");
  }
  return trimmed.replace(/^www\./i, "");
}

export async function updateVenueDetails(
  id: string,
  input: { siteDomain: string; whatsOnUrl: string; platform: string },
): Promise<void> {
  if (!isUuid(id)) throw new Error("That theatre was not found.");
  if (!isKnownPlatform(input.platform)) throw new Error("Pick a platform from the list.");
  const whatsOn = input.whatsOnUrl.trim();
  if (whatsOn && !httpsUrl(whatsOn)) throw new Error("official tour url must be https");
  await serviceRest<unknown>(`catalog_venues?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify({
      site_domain: normalizeSiteDomain(input.siteDomain),
      whats_on_url: whatsOn ? httpsUrl(whatsOn) : null,
      platform: input.platform,
      updated_at: new Date().toISOString(),
    }),
  });
}

export async function confirmVenue(id: string): Promise<void> {
  if (!isUuid(id)) throw new Error("That theatre was not found.");
  await serviceRest<unknown>(`catalog_venues?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify({
      directory_status: "confirmed",
      updated_at: new Date().toISOString(),
    }),
  });
}

async function sourceOverride(body: Record<string, unknown>): Promise<unknown> {
  const key = serviceKey();
  const response = await fetch(`${supabaseUrl()}/functions/v1/source-override`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const text = await response.text();
  let payload: { error?: string; saved?: boolean; source?: string | null; curtains?: PreviewCurtain[]; id?: string } =
    {};
  try {
    payload = text ? (JSON.parse(text) as typeof payload) : {};
  } catch {
    payload = {};
  }
  if (!response.ok) {
    const missing =
      response.status === 404 ||
      text.toLowerCase().includes("not found") ||
      text.toLowerCase().includes("function");
    if (missing && response.status === 404) {
      const error = new Error("Could not find the function source-override") as Error & {
        code?: string;
      };
      error.code = "PGRST202";
      throw error;
    }
    throw new Error(payload.error || text || `Request failed (${response.status})`);
  }
  if (payload.error) throw new Error(payload.error);
  return payload;
}

export async function previewSourceUrl(input: {
  url: string;
  stop: { city: string; venueName: string; startDate: string; endDate: string };
}): Promise<SourcePreview> {
  const url = httpsUrl(input.url);
  if (!url) throw new Error("official tour url must be https");
  if (!input.stop.city.trim() || !input.stop.venueName.trim()) {
    throw new Error("That stop needs a city and a theatre before it can be checked.");
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.stop.startDate) || !/^\d{4}-\d{2}-\d{2}$/.test(input.stop.endDate)) {
    throw new Error("That stop needs dates before it can be checked.");
  }
  const payload = (await sourceOverride({
    action: "preview_source_url",
    url,
    stop: {
      city: input.stop.city.trim(),
      venueName: input.stop.venueName.trim(),
      startDate: input.stop.startDate,
      endDate: input.stop.endDate,
    },
  })) as { source?: string | null; curtains?: PreviewCurtain[] };
  const curtains = Array.isArray(payload.curtains)
    ? payload.curtains.filter(
        (row) => row && typeof row.date === "string" && typeof row.time === "string",
      )
    : [];
  return { source: payload.source ?? null, curtains };
}

export async function applySourceOverride(input: {
  url: string;
  note: string;
  scope: "venue_run" | "venue" | "production";
  venueRunId?: string | null;
  productionId?: string | null;
  venueId?: string | null;
}): Promise<void> {
  const url = httpsUrl(input.url);
  if (!url) throw new Error("official tour url must be https");
  const note = input.note.trim().slice(0, 500);
  const venueRunId = input.venueRunId && isUuid(input.venueRunId) ? input.venueRunId : null;
  const productionId = input.productionId && isUuid(input.productionId) ? input.productionId : null;
  const venueId = input.venueId && isUuid(input.venueId) ? input.venueId : null;
  if (input.scope === "venue_run" && !venueRunId) {
    throw new Error("This stop has no saved row to attach the page to.");
  }
  if (input.scope === "venue" && !venueId) {
    throw new Error("This theatre has no saved row to attach the page to.");
  }
  if (input.scope === "production" && !productionId) {
    throw new Error("This tour has no saved row to attach the page to.");
  }
  await sourceOverride({
    action: "apply_source_override",
    scope: input.scope,
    url,
    venue_run_id: venueRunId,
    production_id: productionId,
    venue_id: venueId,
    note: note || null,
    set_by: null,
  });
}
