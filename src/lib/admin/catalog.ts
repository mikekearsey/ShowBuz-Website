import { ADMIN_SOURCE, ADMIN_SUPPRESSED_SOURCE, LONDON_TZ } from "./constants";
import { londonWallTimeToIso } from "./london";

type RestError = { message?: string; error?: string };

export type CatalogListingKind = "resident" | "touring";

export type CatalogProduction = {
  id: string;
  name: string;
  listing_kind: CatalogListingKind;
  venue_summary: string | null;
  run_start_date: string | null;
  run_end_date: string | null;
  scrape_status: string;
  scrape_error: string | null;
  last_scraped_at: string | null;
  refresh_enqueued_at: string | null;
  admin_locked_months: string[];
  source_provider: string | null;
};

export type RefreshShowResult = {
  ok: boolean;
  error?: string;
  nights?: number;
  scrapeStatus?: string;
  scrapeError?: string | null;
  fromCache?: boolean;
  sourceProvider?: string | null;
  venueRuns?: number;
};

export type CatalogScrapeFilter =
  | "all"
  | "ok"
  | "empty"
  | "error"
  | "pending"
  | "ignored";

export function scrapeStatusLabel(
  production: Pick<CatalogProduction, "scrape_status" | "listing_kind">,
): string {
  if (production.scrape_status === "empty" && production.listing_kind === "touring") {
    return "No published dates";
  }
  if (production.scrape_status === "empty") return "No dates found";
  if (production.scrape_status === "pending") return "Not scraped yet";
  if (production.scrape_status === "error") return "Error";
  if (production.scrape_status === "ignored") return "Ignored";
  if (production.scrape_status === "ok") return "OK";
  return production.scrape_status;
}

export function parseScrapeFilter(value: string | undefined): CatalogScrapeFilter {
  if (
    value === "ok" ||
    value === "empty" ||
    value === "error" ||
    value === "pending" ||
    value === "ignored"
  ) {
    return value;
  }
  return "all";
}

export type CatalogPerformance = {
  id: string;
  production_id: string;
  starts_at: string;
  venue_name: string;
  venue_address: string | null;
  venue_city: string | null;
  source: string;
};

export type CatalogVenueRun = {
  id: string;
  production_id: string;
  city: string | null;
  venue_name: string;
  start_date: string;
  end_date: string;
  ticket_url: string | null;
  source: string;
  sort_index: number;
};

/** Inclusive calendar-month span between two YYYY-MM-DD dates. */
export function monthSpanInclusive(startDate: string, endDate: string): number {
  const a = new Date(`${startDate}T12:00:00Z`);
  const b = new Date(`${endDate}T12:00:00Z`);
  if (!Number.isFinite(a.getTime()) || !Number.isFinite(b.getTime())) return 1;
  return Math.max(
    1,
    (b.getUTCFullYear() - a.getUTCFullYear()) * 12 + (b.getUTCMonth() - a.getUTCMonth()) + 1,
  );
}

/** Touring list cell — never a single theatre name. Example: "12 venues over 6 months". */
export function formatTouringVenueSummary(input: {
  venueCount: number;
  startDate: string | null;
  endDate: string | null;
}): string | null {
  const venues = input.venueCount;
  if (venues <= 0) {
    if (input.startDate && input.endDate) {
      const months = monthSpanInclusive(input.startDate, input.endDate);
      const monthWord = months === 1 ? "month" : "months";
      return `Tour dates over ${months} ${monthWord}`;
    }
    return null;
  }
  const months =
    input.startDate && input.endDate
      ? monthSpanInclusive(input.startDate, input.endDate)
      : 1;
  const venueWord = venues === 1 ? "venue" : "venues";
  const monthWord = months === 1 ? "month" : "months";
  return `${venues} ${venueWord} over ${months} ${monthWord}`;
}

export function formatTouringVenueSummaryFromRuns(
  runs: Array<Pick<CatalogVenueRun, "start_date" | "end_date">>,
  fallback?: { start: string | null; end: string | null },
): string | null {
  if (runs.length > 0) {
    const starts = runs.map((r) => r.start_date).filter(Boolean).sort();
    const ends = runs.map((r) => r.end_date).filter(Boolean).sort();
    return formatTouringVenueSummary({
      venueCount: runs.length,
      startDate: starts[0] ?? null,
      endDate: ends[ends.length - 1] ?? null,
    });
  }
  return formatTouringVenueSummary({
    venueCount: 0,
    startDate: fallback?.start ?? null,
    endDate: fallback?.end ?? null,
  });
}

export type TouringVenueStats = {
  productionId: string;
  venueCount: number;
  startDate: string | null;
  endDate: string | null;
};

function venueKey(venueName: string | null | undefined, venueCity: string | null | undefined): string {
  const venue = (venueName ?? "").trim().toLowerCase();
  const city = (venueCity ?? "").trim().toLowerCase();
  return `${venue}|${city}`;
}

/** Build stand list from published curtains when catalog_venue_runs is empty. */
export function venueRunsFromPerformances(
  productionId: string,
  performances: CatalogPerformance[],
): CatalogVenueRun[] {
  type Acc = {
    city: string | null;
    venue_name: string;
    start_date: string;
    end_date: string;
  };
  const byKey = new Map<string, Acc>();
  for (const row of performances) {
    if (row.source === ADMIN_SUPPRESSED_SOURCE) continue;
    const name = (row.venue_name ?? "").trim();
    if (!name) continue;
    const ymd = new Intl.DateTimeFormat("en-CA", {
      timeZone: LONDON_TZ,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(row.starts_at));
    const key = venueKey(name, row.venue_city);
    const existing = byKey.get(key);
    if (!existing) {
      byKey.set(key, {
        city: row.venue_city?.trim() || null,
        venue_name: name,
        start_date: ymd,
        end_date: ymd,
      });
      continue;
    }
    if (ymd < existing.start_date) existing.start_date = ymd;
    if (ymd > existing.end_date) existing.end_date = ymd;
  }
  return [...byKey.values()]
    .sort((a, b) => a.start_date.localeCompare(b.start_date) || a.venue_name.localeCompare(b.venue_name))
    .map((run, index) => ({
      id: `perf:${productionId}:${venueKey(run.venue_name, run.city)}`,
      production_id: productionId,
      city: run.city,
      venue_name: run.venue_name,
      start_date: run.start_date,
      end_date: run.end_date,
      ticket_url: null,
      source: "catalog_performances",
      sort_index: index,
    }));
}

export function venueRunTitle(run: Pick<CatalogVenueRun, "city" | "venue_name">): string {
  const venue = (run.venue_name ?? "").trim();
  const city = (run.city ?? "").trim();
  if (!city) return venue || "Venue";
  if (!venue) return city;
  const foldedVenue = venue.toLowerCase();
  const foldedCity = city.toLowerCase();
  if (foldedVenue.includes(foldedCity)) return venue;
  return `${venue}, ${city}`;
}


function supabaseUrl(): string {
  return (
    process.env.SUPABASE_URL ??
    process.env.NEXT_PUBLIC_SUPABASE_URL ??
    ""
  ).replace(/\/$/, "");
}

function anonKey(): string {
  return (
    process.env.SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    ""
  );
}

function serviceKey(): string {
  return process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? "";
}

function restHeaders(write: boolean): HeadersInit {
  const key = write ? serviceKey() : anonKey();
  if (!key) {
    throw new Error(
      write
        ? "SUPABASE_SERVICE_ROLE_KEY is not set on the server."
        : "Supabase anon key is not set.",
    );
  }
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  };
}

async function rest<T>(
  path: string,
  init: RequestInit & { write?: boolean } = {},
): Promise<T> {
  const { write = false, ...request } = init;
  const response = await fetch(`${supabaseUrl()}/rest/v1/${path}`, {
    ...request,
    headers: { ...restHeaders(write), ...(request.headers ?? {}) },
    cache: "no-store",
  });
  const text = await response.text();
  if (!response.ok) {
    let message = text;
    try {
      const parsed = JSON.parse(text) as RestError;
      message = parsed.message ?? parsed.error ?? text;
    } catch {
      /* keep text */
    }
    throw new Error(message || `Request failed (${response.status})`);
  }
  if (!text) return [] as T;
  return JSON.parse(text) as T;
}

export function isSuppressed(performance: Pick<CatalogPerformance, "source">): boolean {
  return performance.source === ADMIN_SUPPRESSED_SOURCE;
}

export function isAdminLocked(performance: Pick<CatalogPerformance, "source">): boolean {
  return (
    performance.source === ADMIN_SOURCE ||
    performance.source === ADMIN_SUPPRESSED_SOURCE
  );
}

const PRODUCTION_FIELDS =
  "id,name,listing_kind,venue_summary,run_start_date,run_end_date,scrape_status,scrape_error,last_scraped_at,refresh_enqueued_at,admin_locked_months,source_provider";
const PRODUCTION_FIELDS_LEGACY =
  "id,name,listing_kind,venue_summary,run_start_date,run_end_date,scrape_status,last_scraped_at,refresh_enqueued_at,source_provider";
const PRODUCTION_FIELDS_NO_LOCKED =
  "id,name,listing_kind,venue_summary,run_start_date,run_end_date,scrape_status,scrape_error,last_scraped_at,refresh_enqueued_at,source_provider";

function withNullScrapeError<T extends {
  scrape_error?: string | null;
  admin_locked_months?: string[] | null;
}>(
  rows: T[],
): Array<T & { scrape_error: string | null; admin_locked_months: string[] }> {
  return rows.map((row) => ({
    ...row,
    scrape_error: row.scrape_error ?? null,
    admin_locked_months: Array.isArray(row.admin_locked_months)
      ? row.admin_locked_months
      : [],
  }));
}

export async function listProductions(): Promise<CatalogProduction[]> {
  try {
    const rows = await rest<CatalogProduction[]>(
      `catalog_productions?select=${PRODUCTION_FIELDS}&order=name.asc`,
    );
    return withNullScrapeError(rows);
  } catch (error) {
    const message = String(error);
    if (message.includes("admin_locked_months")) {
      const rows = await rest<CatalogProduction[]>(
        `catalog_productions?select=${PRODUCTION_FIELDS_NO_LOCKED}&order=name.asc`,
      );
      return withNullScrapeError(rows);
    }
    if (!message.includes("scrape_error")) throw error;
    const rows = await rest<CatalogProduction[]>(
      `catalog_productions?select=${PRODUCTION_FIELDS_LEGACY}&order=name.asc`,
    );
    return withNullScrapeError(rows);
  }
}

export async function getProduction(
  id: string,
): Promise<CatalogProduction | null> {
  try {
    const rows = await rest<CatalogProduction[]>(
      `catalog_productions?id=eq.${encodeURIComponent(id)}&select=${PRODUCTION_FIELDS}`,
    );
    return withNullScrapeError(rows)[0] ?? null;
  } catch (error) {
    const message = String(error);
    if (message.includes("admin_locked_months")) {
      const rows = await rest<CatalogProduction[]>(
        `catalog_productions?id=eq.${encodeURIComponent(id)}&select=${PRODUCTION_FIELDS_NO_LOCKED}`,
      );
      return withNullScrapeError(rows)[0] ?? null;
    }
    if (!message.includes("scrape_error")) throw error;
    const rows = await rest<CatalogProduction[]>(
      `catalog_productions?id=eq.${encodeURIComponent(id)}&select=${PRODUCTION_FIELDS_LEGACY}`,
    );
    return withNullScrapeError(rows)[0] ?? null;
  }
}

export async function listPerformances(
  productionId: string,
): Promise<CatalogPerformance[]> {
  return rest<CatalogPerformance[]>(
    `catalog_performances?production_id=eq.${encodeURIComponent(productionId)}&select=id,production_id,starts_at,venue_name,venue_address,venue_city,source&order=starts_at.asc&limit=10000`,
  );
}

export async function addCurtain(input: {
  productionId: string;
  date: string;
  time: string;
  venueName: string;
  venueCity: string;
  venueAddress: string;
}): Promise<CatalogPerformance> {
  const startsAt = londonWallTimeToIso(input.date, input.time);
  const rows = await rest<CatalogPerformance[]>("catalog_performances", {
    write: true,
    method: "POST",
    body: JSON.stringify({
      production_id: input.productionId,
      starts_at: startsAt,
      venue_name: input.venueName.trim(),
      venue_address: input.venueAddress.trim() || null,
      venue_city: input.venueCity.trim() || null,
      source: ADMIN_SOURCE,
    }),
  });
  if (!rows[0]) throw new Error("Curtain was not saved.");
  return rows[0];
}

export async function suppressCurtain(id: string): Promise<void> {
  await rest<CatalogPerformance[]>(
    `catalog_performances?id=eq.${encodeURIComponent(id)}`,
    {
      write: true,
      method: "PATCH",
      body: JSON.stringify({ source: ADMIN_SUPPRESSED_SOURCE }),
    },
  );
}

export async function restoreCurtain(id: string): Promise<void> {
  await rest<CatalogPerformance[]>(
    `catalog_performances?id=eq.${encodeURIComponent(id)}`,
    {
      write: true,
      method: "PATCH",
      body: JSON.stringify({ source: ADMIN_SOURCE }),
    },
  );
}


export async function confirmCatalogMonth(
  productionId: string,
  yearMonth: string,
  performances: CatalogPerformance[],
): Promise<{ lockedCurtains: number }> {
  if (!/^\d{4}-\d{2}$/.test(yearMonth)) {
    throw new Error("Month must be YYYY-MM.");
  }
  const inMonth = performances.filter((row) => {
    if (isSuppressed(row)) return false;
    const ymd = new Intl.DateTimeFormat("en-CA", {
      timeZone: LONDON_TZ,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(row.starts_at));
    return ymd.startsWith(yearMonth);
  });

  for (const row of inMonth) {
    if (row.source === ADMIN_SOURCE) continue;
    await rest<CatalogPerformance[]>(
      `catalog_performances?id=eq.${encodeURIComponent(row.id)}`,
      {
        write: true,
        method: "PATCH",
        body: JSON.stringify({ source: ADMIN_SOURCE }),
      },
    );
  }

  const production = await getProduction(productionId);
  if (!production) throw new Error("Production not found.");
  const locked = new Set(production.admin_locked_months ?? []);
  locked.add(yearMonth);
  const months = [...locked].sort();
  await rest<CatalogProduction[]>(
    `catalog_productions?id=eq.${encodeURIComponent(productionId)}`,
    {
      write: true,
      method: "PATCH",
      body: JSON.stringify({ admin_locked_months: months }),
    },
  );
  return { lockedCurtains: inMonth.length };
}


export async function listVenueRuns(
  productionId: string,
): Promise<CatalogVenueRun[]> {
  return rest<CatalogVenueRun[]>(
    `catalog_venue_runs?production_id=eq.${encodeURIComponent(productionId)}&select=id,production_id,city,venue_name,start_date,end_date,ticket_url,source,sort_index&order=start_date.asc&limit=500`,
  );
}

/** All touring stands — used to render count summaries on the catalog list. */
export async function listAllVenueRuns(): Promise<CatalogVenueRun[]> {
  return rest<CatalogVenueRun[]>(
    `catalog_venue_runs?select=id,production_id,city,venue_name,start_date,end_date,ticket_url,source,sort_index&order=start_date.asc&limit=20000`,
  );
}


/** Distinct touring venues per production from published curtains (fallback when MOT runs missing). */
export async function listTouringVenueStats(
  productionIds: string[],
): Promise<Map<string, TouringVenueStats>> {
  const stats = new Map<string, TouringVenueStats>();
  for (const id of productionIds) {
    stats.set(id, { productionId: id, venueCount: 0, startDate: null, endDate: null });
  }
  if (productionIds.length === 0) return stats;

  // Chunk IN filters — PostgREST URL length limits.
  const chunkSize = 40;
  for (let i = 0; i < productionIds.length; i += chunkSize) {
    const chunk = productionIds.slice(i, i + chunkSize);
    const filter = chunk.map(encodeURIComponent).join(",");
    const rows = await rest<
      Array<{
        production_id: string;
        venue_name: string | null;
        venue_city: string | null;
        starts_at: string;
        source: string;
      }>
    >(
      `catalog_performances?production_id=in.(${filter})&select=production_id,venue_name,venue_city,starts_at,source&limit=50000`,
    );
    const venuesByProd = new Map<string, Set<string>>();
    for (const row of rows) {
      if (row.source === ADMIN_SUPPRESSED_SOURCE) continue;
      const name = (row.venue_name ?? "").trim();
      if (!name) continue;
      const set = venuesByProd.get(row.production_id) ?? new Set<string>();
      set.add(venueKey(name, row.venue_city));
      venuesByProd.set(row.production_id, set);

      const ymd = new Intl.DateTimeFormat("en-CA", {
        timeZone: LONDON_TZ,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date(row.starts_at));
      const current = stats.get(row.production_id) ?? {
        productionId: row.production_id,
        venueCount: 0,
        startDate: null,
        endDate: null,
      };
      if (!current.startDate || ymd < current.startDate) current.startDate = ymd;
      if (!current.endDate || ymd > current.endDate) current.endDate = ymd;
      stats.set(row.production_id, current);
    }
    for (const [id, set] of venuesByProd) {
      const current = stats.get(id);
      if (!current) continue;
      current.venueCount = set.size;
      stats.set(id, current);
    }
  }
  return stats;
}


export async function refreshProduction(production: CatalogProduction): Promise<unknown> {
  const key = serviceKey();
  if (!key) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set on the server.");
  }
  const response = await fetch(
    `${supabaseUrl()}/functions/v1/catalog-schedule-refresh`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        name: production.name,
        listingKind: production.listing_kind,
      }),
      cache: "no-store",
    },
  );
  const text = await response.text();
  if (!response.ok) {
    throw new Error(text || `Refresh failed (${response.status})`);
  }
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return { ok: true };
  }
}

export async function signInWithPassword(
  email: string,
  password: string,
): Promise<{ email: string }> {
  const response = await fetch(
    `${supabaseUrl()}/auth/v1/token?grant_type=password`,
    {
      method: "POST",
      headers: {
        apikey: anonKey(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    },
  );
  const data = (await response.json()) as {
    user?: { email?: string };
    error_description?: string;
    msg?: string;
    error?: string;
  };
  if (!response.ok) {
    throw new Error(
      data.error_description ?? data.msg ?? data.error ?? "Could not sign in.",
    );
  }
  const signedEmail = data.user?.email;
  if (!signedEmail) throw new Error("Sign-in did not return an email.");
  return { email: signedEmail };
}
