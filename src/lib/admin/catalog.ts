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
