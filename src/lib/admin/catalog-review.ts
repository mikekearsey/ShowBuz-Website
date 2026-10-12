import type { CatalogListingKind, CatalogProduction } from "@/lib/admin/catalog";

/**
 * Catalogue review queue. RPCs are service_role only
 * (migration 20261012123000_catalog_review_status.sql).
 * If the column or functions are not deployed yet, callers get
 * `{ available: false }` and should render nothing.
 */

export type CatalogReviewStatus = "approved" | "needs_review" | "rejected";

export type CatalogReviewQueueRow = {
  id: string;
  name: string;
  listing_kind: string;
  venue_summary: string | null;
  genres: string;
  review_reason: string | null;
  run_start_date: string | null;
  run_end_date: string | null;
  future_night_count: number;
  source_url: string | null;
};

export type CatalogRejectedRow = {
  id: string;
  name: string;
  listing_kind: string;
  venue_summary: string | null;
  review_reason: string | null;
  run_start_date: string | null;
  run_end_date: string | null;
  scrape_status: string;
  scrape_error: string | null;
  last_scraped_at: string | null;
  refresh_enqueued_at: string | null;
  source_provider: string | null;
  source_url: string | null;
};

export type CatalogReviewSnapshot =
  | { available: false }
  | {
      /** review_status column is present. */
      available: true;
      /** list/set RPCs are present. When false, hide the review tab. */
      rpc: boolean;
      queue: CatalogReviewQueueRow[];
      rejected: CatalogRejectedRow[];
      needsReviewIds: string[];
    };

type RpcQueueRow = {
  id: string;
  name: string;
  listing_kind: string;
  venue_summary: string | null;
  scrape_status: string;
  last_scraped_at: string | null;
  review_status: string;
  review_reason: string | null;
  reviewed_at: string | null;
  future_night_count: number | string | null;
};

type ProductionExtra = {
  id: string;
  run_start_date: string | null;
  run_end_date: string | null;
  source_url: string | null;
};

type RestErrorBody = { message?: string; error?: string; code?: string };

const REJECTED_FIELDS =
  "id,name,listing_kind,venue_summary,review_reason,run_start_date,run_end_date,scrape_status,scrape_error,last_scraped_at,refresh_enqueued_at,source_provider,source_url";

function supabaseUrl(): string {
  return (
    process.env.SUPABASE_URL ??
    process.env.NEXT_PUBLIC_SUPABASE_URL ??
    ""
  ).replace(/\/$/, "");
}

function serviceKey(): string {
  return process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? "";
}

export function isReviewSchemaMissing(error: unknown): boolean {
  const message = (error instanceof Error ? error.message : String(error)).toLowerCase();
  const code =
    error instanceof Error && "code" in error
      ? String((error as Error & { code?: string }).code ?? "").toLowerCase()
      : "";
  if (code === "pgrst202" || message.includes("could not find the function")) {
    return (
      message.includes("list_catalog_review_queue") ||
      message.includes("set_catalog_review_status") ||
      message.includes("catalog_review")
    );
  }
  if (code === "42703" || message.includes("does not exist") || message.includes("schema cache")) {
    return message.includes("review_status") || message.includes("review_reason");
  }
  return false;
}

/** Genre labels stored in discovery's review_reason, e.g. "[Musical, Plays]". */
export function genresFromReviewReason(reason: string | null | undefined): string {
  if (!reason) return "—";
  const match = reason.match(/\[([^[\]]+)\]\s*$/);
  const genres = match?.[1]?.trim();
  return genres ? genres : "—";
}

export function safeSourceUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

function asCount(value: number | string | null | undefined): number {
  const count = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(count) || count < 0) return 0;
  return Math.trunc(count);
}

async function serviceRest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const key = serviceKey();
  if (!key) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set on the server.");
  }
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
      message = parsed.message ?? parsed.error ?? text;
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

async function loadProductionExtras(ids: string[]): Promise<Map<string, ProductionExtra>> {
  const extras = new Map<string, ProductionExtra>();
  const chunkSize = 40;
  for (let i = 0; i < ids.length; i += chunkSize) {
    const filter = ids
      .slice(i, i + chunkSize)
      .map((id) => encodeURIComponent(id))
      .join(",");
    const rows = await serviceRest<ProductionExtra[]>(
      `catalog_productions?id=in.(${filter})&select=id,run_start_date,run_end_date,source_url`,
    );
    for (const row of rows) extras.set(row.id, row);
  }
  return extras;
}

function toQueueRow(row: RpcQueueRow, extra: ProductionExtra | undefined): CatalogReviewQueueRow {
  return {
    id: row.id,
    name: row.name,
    listing_kind: row.listing_kind,
    venue_summary: row.venue_summary,
    genres: genresFromReviewReason(row.review_reason),
    review_reason: row.review_reason,
    run_start_date: extra?.run_start_date ?? null,
    run_end_date: extra?.run_end_date ?? null,
    future_night_count: asCount(row.future_night_count),
    source_url: safeSourceUrl(extra?.source_url),
  };
}

export async function loadCatalogReview(): Promise<CatalogReviewSnapshot> {
  let flags: Array<{ id: string; review_status: string }>;
  try {
    flags = await serviceRestAll<{ id: string; review_status: string }>(
      "catalog_productions?select=id,review_status",
    );
  } catch (error) {
    if (isReviewSchemaMissing(error)) return { available: false };
    throw error;
  }

  const needsReviewIds = flags
    .filter((row) => row.review_status === "needs_review")
    .map((row) => row.id);

  let rpc = true;
  let queueRows: RpcQueueRow[] = [];
  try {
    const queueRaw = await serviceRest<RpcQueueRow[]>("rpc/list_catalog_review_queue", {
      method: "POST",
      body: "{}",
    });
    queueRows = Array.isArray(queueRaw) ? queueRaw : [];
  } catch (error) {
    if (!isReviewSchemaMissing(error)) throw error;
    rpc = false;
  }

  let rejected: CatalogRejectedRow[];
  try {
    rejected = await serviceRestAll<CatalogRejectedRow>(
      `catalog_productions?review_status=eq.rejected&select=${REJECTED_FIELDS}&order=name.asc`,
    );
  } catch (error) {
    if (isReviewSchemaMissing(error)) return { available: false };
    throw error;
  }

  let extras = new Map<string, ProductionExtra>();
  if (rpc && queueRows.length > 0) {
    try {
      extras = await loadProductionExtras(queueRows.map((row) => row.id));
    } catch (error) {
      if (isReviewSchemaMissing(error)) return { available: false };
      // Dates and the source link are extra; the queue itself still stands.
    }
  }

  return {
    available: true,
    rpc,
    queue: rpc ? queueRows.map((row) => toQueueRow(row, extras.get(row.id))) : [],
    rejected,
    needsReviewIds,
  };
}

export async function setCatalogReviewStatus(
  id: string,
  status: CatalogReviewStatus,
  reason: string | null,
): Promise<void> {
  await serviceRest<unknown>("rpc/set_catalog_review_status", {
    method: "POST",
    body: JSON.stringify({
      p_id: id,
      p_status: status,
      p_reason: reason,
    }),
  });
}

export function rejectedAsProduction(row: CatalogRejectedRow): CatalogProduction | null {
  if (row.listing_kind !== "resident" && row.listing_kind !== "touring") return null;
  const listingKind: CatalogListingKind = row.listing_kind;
  return {
    id: row.id,
    name: row.name,
    listing_kind: listingKind,
    venue_summary: row.venue_summary,
    run_start_date: row.run_start_date,
    run_end_date: row.run_end_date,
    scrape_status: row.scrape_status || "pending",
    scrape_error: row.scrape_error ?? null,
    last_scraped_at: row.last_scraped_at,
    refresh_enqueued_at: row.refresh_enqueued_at,
    admin_locked_months: [],
    source_provider: row.source_provider,
  };
}
