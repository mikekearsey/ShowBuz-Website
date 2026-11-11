import { isMissingSchema, plainAdminError } from "@/lib/admin/schema";

type RestErrorBody = { message?: string; error?: string; code?: string; hint?: string };

export type TourCurtainStamp = { date: string; time: string };

export type TourTimesNeedStop = {
  runId: string;
  productionId: string;
  productionName: string;
  venueName: string;
  city: string;
  startDate: string;
  endDate: string;
  boxOfficeUrl: string | null;
  reason: string;
  nights: TourCurtainStamp[];
  /** IANA zone for the stop; times are wall-clock in this zone. */
  timeZone: string;
};

export type TourTimesDisagree = {
  runId: string;
  productionId: string;
  productionName: string;
  venueName: string;
  city: string;
  startDate: string;
  endDate: string;
  boxOfficeUrl: string | null;
  adminTimes: TourCurtainStamp[];
  scrapedTimes: TourCurtainStamp[];
  sourceUrl: string | null;
};

export type TourTimesSnapshot =
  | { available: false }
  | {
      available: true;
      needsTimes: TourTimesNeedStop[];
      robotDisagrees: TourTimesDisagree[];
      laterCount: number;
      filledToday: number;
    };

type RpcRow = {
  group: string;
  run_id: string | null;
  production_id: string | null;
  production_name: string | null;
  venue_name: string | null;
  city: string | null;
  start_date: string | null;
  end_date: string | null;
  box_office_url: string | null;
  reason: string | null;
  nights: unknown;
  admin_times: unknown;
  scraped_times: unknown;
  source_url: string | null;
  later_count: number | null;
  filled_today: number | null;
  time_zone: string | null;
};

/** London (and blank) need no label; anything else is shown on the card. */
export function formatStopTimeZoneLabel(timeZone: string | null | undefined): string | null {
  const tz = (timeZone ?? "").trim() || "Europe/London";
  if (tz === "Europe/London") return null;
  return `Times in ${tz} (local)`;
}

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

function asStamps(value: unknown): TourCurtainStamp[] {
  if (!Array.isArray(value)) return [];
  const out: TourCurtainStamp[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const row = item as Record<string, unknown>;
    const date = String(row.date ?? "").trim();
    const time = String(row.time ?? "").trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) continue;
    out.push({ date, time });
  }
  return out;
}

function asCount(value: number | null | undefined): number {
  if (value == null || !Number.isFinite(value)) return 0;
  return Math.max(0, Math.trunc(value));
}

/** Calendar days from start to end inclusive (YYYY-MM-DD). No clock conversion. */
export function eachRunDay(startDate: string, endDate: string): string[] {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate) || !/^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
    return [];
  }
  if (endDate < startDate) return [];
  const days: string[] = [];
  let cursor = startDate;
  while (cursor <= endDate) {
    days.push(cursor);
    const [y, m, d] = cursor.split("-").map(Number);
    const next = new Date(Date.UTC(y, m - 1, d + 1));
    cursor = next.toISOString().slice(0, 10);
    if (days.length > 120) break;
  }
  return days;
}

/** "Tue 24 Nov" from a calendar YYYY-MM-DD (noon UTC, no zone convert of times). */
export function formatRunDayLabel(ymd: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd);
  if (!match) return ymd;
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 12));
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(date);
}

export function formatStopDateRange(start: string, end: string): string {
  const a = formatRunDayLabel(start);
  const b = formatRunDayLabel(end);
  if (start === end) return a;
  return `${a} – ${b}`;
}

export function formatCurtainPreview(stamps: TourCurtainStamp[]): string {
  if (stamps.length === 0) return "0 curtains";
  const byDay = new Map<string, string[]>();
  for (const stamp of [...stamps].sort((x, y) =>
    x.date === y.date ? x.time.localeCompare(y.time) : x.date.localeCompare(y.date),
  )) {
    const times = byDay.get(stamp.date) ?? [];
    times.push(stamp.time);
    byDay.set(stamp.date, times);
  }
  const parts: string[] = [];
  for (const [date, times] of byDay) {
    const weekday = formatRunDayLabel(date).split(" ")[0] ?? date;
    parts.push(`${weekday} ${times.join(", ")}`);
  }
  const noun = stamps.length === 1 ? "curtain" : "curtains";
  return `${stamps.length} ${noun}: ${parts.join(" · ")}`;
}

export async function loadTourTimesAttention(
  weeks = 8,
): Promise<TourTimesSnapshot> {
  let rows: RpcRow[];
  try {
    const raw = await serviceRest<RpcRow[]>("rpc/admin_tour_stops_needing_attention", {
      method: "POST",
      body: JSON.stringify({ p_weeks: weeks }),
    });
    rows = Array.isArray(raw) ? raw : [];
  } catch (error) {
    if (isMissingSchema(error)) return { available: false };
    throw error;
  }

  const needsTimes: TourTimesNeedStop[] = [];
  const robotDisagrees: TourTimesDisagree[] = [];
  let laterCount = 0;
  let filledToday = 0;

  for (const row of rows) {
    if (row.group === "summary") {
      laterCount = asCount(row.later_count);
      filledToday = asCount(row.filled_today);
      continue;
    }
    if (!row.run_id || !row.production_id) continue;
    if (row.group === "needs_times") {
      needsTimes.push({
        runId: row.run_id,
        productionId: row.production_id,
        productionName: row.production_name?.trim() || "Tour",
        venueName: row.venue_name?.trim() || "",
        city: row.city?.trim() || "",
        startDate: row.start_date ?? "",
        endDate: row.end_date ?? "",
        boxOfficeUrl: row.box_office_url,
        reason: row.reason?.trim() || "times TBC",
        nights: asStamps(row.nights),
        timeZone: row.time_zone?.trim() || "Europe/London",
      });
      continue;
    }
    if (row.group === "robot_disagrees") {
      robotDisagrees.push({
        runId: row.run_id,
        productionId: row.production_id,
        productionName: row.production_name?.trim() || "Tour",
        venueName: row.venue_name?.trim() || "",
        city: row.city?.trim() || "",
        startDate: row.start_date ?? "",
        endDate: row.end_date ?? "",
        boxOfficeUrl: row.box_office_url,
        adminTimes: asStamps(row.admin_times),
        scrapedTimes: asStamps(row.scraped_times),
        sourceUrl: row.source_url,
      });
    }
  }

  return {
    available: true,
    needsTimes,
    robotDisagrees,
    laterCount,
    filledToday,
  };
}

/** Tab badge; null when the RPC is not on this database yet. */
export async function loadTourTimesTabCount(weeks = 8): Promise<number | null> {
  try {
    const snap = await loadTourTimesAttention(weeks);
    if (!snap.available) return null;
    return snap.needsTimes.length;
  } catch {
    return null;
  }
}

export async function setTourStopTimes(input: {
  runId: string;
  datesTimes: TourCurtainStamp[];
  setBy: string;
}): Promise<void> {
  await serviceRest<unknown>("rpc/admin_set_tour_stop_times", {
    method: "POST",
    body: JSON.stringify({
      p_run_id: input.runId,
      p_dates_times: input.datesTimes,
      p_new_start: null,
      p_new_end: null,
      p_set_by: input.setBy,
    }),
  });
}

export function tourTimesActionError(error: unknown): string {
  return plainAdminError(error);
}
