import type { CatalogProduction } from "./catalog";
import { scrapeStatusLabel } from "./catalog";

export type ScrapeExplanation = {
  headline: string;
  summary: string;
  technicalNote: string | null;
  lastScrapedLabel: string | null;
  sourceLabel: string | null;
  refreshQueuedLabel: string | null;
};

function formatWhen(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (!Number.isFinite(date.getTime())) return null;
  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function translateTechnicalNote(
  production: Pick<CatalogProduction, "listing_kind" | "scrape_error">,
): string | null {
  const raw = (production.scrape_error ?? "").trim();
  if (!raw) return null;

  const lower = raw.toLowerCase();
  if (lower === "no published tour dates") {
    return "No published tour curtain times were found across Ticketmaster, SeatGeek, ATG, musicalsontour.co.uk, or local theatre calendars.";
  }
  if (lower === "empty scrape") {
    return production.listing_kind === "touring"
      ? "The tour scrape finished without any usable curtain times."
      : "The West End scrape finished without any usable curtain times from DataThistle, Official London Theatre, or producer calendars.";
  }
  if (lower.includes("cloudflare") || lower.includes("403")) {
    return `A listings site blocked or challenged the scraper (HTTP access denied). Raw note: ${raw}`;
  }
  if (lower.includes("timeout") || lower.includes("timed out")) {
    return `A listings site took too long to respond. Raw note: ${raw}`;
  }
  if (lower.includes("enotfound") || lower.includes("fetch failed") || lower.includes("network")) {
    return `The scraper could not reach a listings site. Raw note: ${raw}`;
  }
  return raw;
}

export function explainScrape(
  production: CatalogProduction,
): ScrapeExplanation {
  const touring = production.listing_kind === "touring";
  const headline = scrapeStatusLabel(production);
  const technicalNote = translateTechnicalNote(production);
  const lastScrapedLabel = formatWhen(production.last_scraped_at);
  const refreshQueuedLabel = formatWhen(production.refresh_enqueued_at);
  const sourceLabel = production.source_provider?.trim() || null;

  switch (production.scrape_status) {
    case "ok":
      return {
        headline,
        summary: touring
          ? "The latest scrape found published tour nights and saved them to the catalog. Players can load these dates into their diary."
          : "The latest scrape found published West End curtain times and saved them to the catalog. Players can load these dates into their diary.",
        technicalNote,
        lastScrapedLabel,
        sourceLabel,
        refreshQueuedLabel,
      };
    case "empty":
      return {
        headline,
        summary: touring
          ? "The scrape ran, but no published tour nights were found. The catalog still lists the title so you can watch for on-sale dates or add curtains by hand."
          : "The scrape ran, but no published West End curtain times were found for this title. It may be closed, misnamed, or not yet listed on the usual sources.",
        technicalNote,
        lastScrapedLabel,
        sourceLabel,
        refreshQueuedLabel,
      };
    case "error":
      return {
        headline,
        summary:
          "The scrape failed part-way through. Existing catalog nights were kept where possible, but this title needs another refresh once the underlying problem is fixed.",
        technicalNote:
          technicalNote ??
          "No further detail was stored for this failure.",
        lastScrapedLabel,
        sourceLabel,
        refreshQueuedLabel,
      };
    case "pending":
      return {
        headline,
        summary:
          "This title is in the catalog but has not been scraped yet. The weekly refresh job, or a manual refresh on the show page, will pick it up.",
        technicalNote,
        lastScrapedLabel,
        sourceLabel,
        refreshQueuedLabel,
      };
    case "ignored":
      return {
        headline,
        summary:
          "This production is marked ignored, so automatic weekly scrapes skip it. Open the show if you still want to edit nights by hand.",
        technicalNote,
        lastScrapedLabel,
        sourceLabel,
        refreshQueuedLabel,
      };
    default:
      return {
        headline,
        summary: `Scrape status is “${production.scrape_status}”.`,
        technicalNote,
        lastScrapedLabel,
        sourceLabel,
        refreshQueuedLabel,
      };
  }
}
