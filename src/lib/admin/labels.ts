export const VENUE_PLATFORMS: Array<{ id: string; label: string }> = [
  { id: "atg", label: "ATG" },
  { id: "trafalgar", label: "Trafalgar" },
  { id: "own", label: "Own site" },
  { id: "spektrix_on_venue_domain", label: "Spektrix on the theatre site" },
  { id: "ticketmaster", label: "Ticketmaster" },
  { id: "unknown", label: "Unknown" },
];

const TIMES_SOURCE: Record<string, string> = {
  venue_page_jsonld: "Venue page, JSON-LD",
  venue_page_json: "Venue page, embedded JSON",
  venue_page_list: "Venue page list",
  atg_calendar: "ATG calendar",
  wmc_json: "Wales Millennium Centre feed",
  trafalgar_api: "Trafalgar",
};

const REVIEW_REASON: Record<string, string> = {
  possible_tz_ghost: "Possible timezone ghost",
  outside_itinerary: "Outside the itinerary",
  city_clash: "City clash",
  source_listed_unavailable: "Source listed unavailable",
  duplicate_of: "Duplicate",
  unusual_time: "Unusual time",
  same_week_venue: "Two theatres the same week",
};

export function httpsUrl(value: string): string | null {
  const trimmed = value.trim();
  if (!/^https:\/\//i.test(trimmed)) return null;
  try {
    const url = new URL(trimmed);
    if (url.protocol !== "https:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function officialSourceLabel(source: string | null | undefined): string | null {
  if (source === "scrape") return "found by scrape";
  if (source === "admin") return "set by admin";
  return null;
}

export function timesSourceLabel(value: string | null | undefined): string {
  if (!value) return "—";
  return TIMES_SOURCE[value] ?? value.replaceAll("_", " ");
}

export function reviewReasonLabel(value: string | null | undefined): string {
  if (!value) return "Needs a look";
  return REVIEW_REASON[value] ?? value.replaceAll("_", " ");
}

export function previewSourceLabel(source: string | null | undefined): string {
  if (!source) return "the page";
  if (source === "json_ld" || source === "venue_page_jsonld") return "JSON-LD";
  return timesSourceLabel(source) === "—" ? source.replaceAll("_", " ") : timesSourceLabel(source);
}

export function platformLabel(value: string | null | undefined): string {
  if (!value) return "Unknown";
  return VENUE_PLATFORMS.find((item) => item.id === value)?.label ?? value;
}

export function isKnownPlatform(value: string): boolean {
  return VENUE_PLATFORMS.some((item) => item.id === value);
}

export type StopTiming = {
  times_status?: string | null;
  needs_review?: boolean;
  review_reason?: string | null;
  booking_host?: string | null;
};

export function stopNeedsSource(stop: StopTiming): boolean {
  if (stop.review_reason === "duplicate_of") return false;
  if (stop.times_status === "tbc" || stop.times_status === "unsupported") return true;
  if (stop.needs_review) return true;
  if (stop.review_reason) return true;
  return false;
}

export function stopStatusLabel(stop: StopTiming): string {
  const parts: string[] = [];
  if (stop.times_status === "timed") parts.push("Timed");
  else if (stop.times_status === "tbc") parts.push("TBC");
  else if (stop.times_status === "unsupported") parts.push("Unsupported");
  if (stop.needs_review || (stop.review_reason && stop.review_reason !== "duplicate_of")) {
    parts.push("Needs review");
  }
  return parts.length > 0 ? parts.join(" · ") : "—";
}

export function formatStopCoverage(
  timed: number | null | undefined,
  future: number | null | undefined,
): string {
  if (timed == null || future == null) return "—";
  const safeTimed = Math.max(0, Math.trunc(timed));
  const safeFuture = Math.max(0, Math.trunc(future));
  const noun = safeFuture === 1 ? "stop" : "stops";
  return `${safeTimed}/${safeFuture} ${noun} timed`;
}
