import type { CatalogProduction } from "./catalog";
import { scrapeStatusLabel } from "./catalog";

export type ScrapeExplanation = {
  headline: string;
  summary: string;
  noteLabel: string | null;
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
  if (lower.includes("cloudflare") || lower.includes("403") || lower.includes("401")) {
    return "A listings site refused the request, so the schedule could not be read.";
  }
  if (lower.includes("404") || lower.includes("not found")) {
    return "The page we tried to read was not there. The ticket or venue link may have moved.";
  }
  if (lower.includes("timeout") || lower.includes("timed out") || lower.includes("aborted")) {
    return "A listings site took too long to answer, so the schedule could not be read.";
  }
  if (
    lower.includes("enotfound") ||
    lower.includes("fetch failed") ||
    lower.includes("network") ||
    lower.includes("econnreset")
  ) {
    return "The scraper could not reach a listings site.";
  }
  if (lower.includes("openai") || lower.includes("anthropic")) {
    return "The step that reads the listing page failed before any dates could be taken from it.";
  }
  return raw;
}

export function explainScrape(
  production: CatalogProduction,
): ScrapeExplanation {
  const touring = production.listing_kind === "touring";
  const technicalNote = translateTechnicalNote(production);
  const lastScrapedLabel = formatWhen(production.last_scraped_at);
  const refreshQueuedLabel = formatWhen(production.refresh_enqueued_at);
  const sourceLabel = production.source_provider?.trim() || null;
  const shared = {
    technicalNote,
    lastScrapedLabel,
    sourceLabel,
    refreshQueuedLabel,
  };

  switch (production.scrape_status) {
    case "ok":
      if (technicalNote) {
        return {
          ...shared,
          headline: "Earlier dates are still saved.",
          summary:
            "The latest scrape did not finish. Nights already in the catalog were left as they were, and nothing new was added from this attempt.",
          noteLabel: "What the last attempt reported",
        };
      }
      return {
        ...shared,
        headline: "The last scrape worked.",
        summary: touring
          ? "Published tour nights were found and saved. Those dates can be loaded into a player's diary."
          : "Published West End curtain times were found and saved. Those dates can be loaded into a player's diary.",
        noteLabel: null,
      };
    case "empty":
      return {
        ...shared,
        headline: touring ? "No published dates were found." : "No curtain times were found.",
        summary: touring
          ? "The tour sources were checked and none of them listed performances or venue stops on sale. The title stays in the catalog so it can be scraped again when booking opens, or nights can be added by hand."
          : "The West End sources were checked, but this title had no published performances. It may be closed, not on sale yet, or listed under a different name.",
        noteLabel: "Why there are no dates",
      };
    case "error":
      return {
        ...shared,
        headline: "The scrape did not finish.",
        summary:
          "No dates were saved from this attempt, and there were no earlier nights to keep. Try again from the show page once the source is reachable.",
        noteLabel: "What went wrong",
        technicalNote: technicalNote ?? "No further detail was stored for this failure.",
      };
    case "pending":
      return {
        ...shared,
        headline: "This show is waiting to be scraped.",
        summary: refreshQueuedLabel
          ? "A refresh has been queued and has not finished yet."
          : "It is in the catalog, but a scrape has not completed. The regular refresh, or Refresh on the show page, will try it.",
        noteLabel: technicalNote ? "Note" : null,
      };
    case "ignored":
      return {
        ...shared,
        headline: "Automatic scrapes skip this show.",
        summary:
          "Ignored titles are left out of the weekly job. Nights already stored stay as they are until someone edits them or scrapes the show by hand.",
        noteLabel: technicalNote ? "Note" : null,
      };
    default:
      return {
        ...shared,
        headline: `Scrape status is “${scrapeStatusLabel(production)}”.`,
        summary: "There is no plain-English reading for this status yet.",
        noteLabel: technicalNote ? "Note" : null,
      };
  }
}
