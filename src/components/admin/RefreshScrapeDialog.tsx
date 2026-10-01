"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState, useTransition } from "react";
import { refreshShowWithProgress } from "@/app/admin/actions";
import type { CatalogListingKind, RefreshShowResult } from "@/lib/admin/catalog";

type Step = { id: string; label: string; detail: string };

function stepsFor(kind: CatalogListingKind): Step[] {
  if (kind === "touring") {
    return [
      {
        id: "start",
        label: "Starting refresh",
        detail: "Asking the catalog scraper to look up this tour again.",
      },
      {
        id: "feeds",
        label: "Checking national ticketing feeds",
        detail: "Ticketmaster, SeatGeek, and ATG Tickets.",
      },
      {
        id: "mot",
        label: "Reading the official tour itinerary",
        detail: "musicalsontour.co.uk for city, venue, and date ranges.",
      },
      {
        id: "houses",
        label: "Checking local theatre calendars",
        detail: "House what’s-on pages and box-office listings for matinées.",
      },
      {
        id: "save",
        label: "Saving newly published nights",
        detail: "Only adds nights outside months you have already confirmed.",
      },
    ];
  }
  return [
    {
      id: "start",
      label: "Starting refresh",
      detail: "Asking the catalog scraper to look up this West End title again.",
    },
    {
      id: "datathistle",
      label: "Checking DataThistle",
      detail: "Primary West End listings feed.",
    },
    {
      id: "olt",
      label: "Checking Official London Theatre",
      detail: "Used when DataThistle is thin or empty.",
    },
    {
      id: "producers",
      label: "Checking producer calendars",
      detail: "LTD, ATG, Feast, LW Theatres, TodayTix, and curated title pages.",
    },
    {
      id: "save",
      label: "Saving newly published nights",
      detail: "Only adds nights outside months you have already confirmed.",
    },
  ];
}

function resultSummary(result: RefreshShowResult): string {
  if (!result.ok) {
    return result.error?.trim() || "The scrape failed.";
  }
  if (result.fromCache) {
    return "A recent scrape was still fresh, so the catalog reused the last result without hitting every site again.";
  }
  const nights =
    typeof result.nights === "number"
      ? `${result.nights} published night${result.nights === 1 ? "" : "s"} in the catalog`
      : "Published nights updated";
  const status = result.scrapeStatus ? ` Status: ${result.scrapeStatus}.` : "";
  const source = result.sourceProvider
    ? ` Main source noted as ${result.sourceProvider}.`
    : "";
  const note = result.scrapeError ? ` Note: ${result.scrapeError}.` : "";
  return `${nights}.${status}${source}${note}`.replace(/\s+/g, " ").trim();
}

export function RefreshScrapeDialog({
  productionId,
  listingKind,
  showName,
}: {
  productionId: string;
  listingKind: CatalogListingKind;
  showName: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [result, setResult] = useState<RefreshShowResult | null>(null);
  const [pending, startTransition] = useTransition();
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const steps = useMemo(() => stepsFor(listingKind), [listingKind]);

  useEffect(() => {
    if (!open || result) return;
    const timer = window.setInterval(() => {
      setActiveIndex((index) => Math.min(index + 1, steps.length - 1));
    }, 1400);
    return () => window.clearInterval(timer);
  }, [open, result, steps.length]);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && result) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, result]);

  function startRefresh() {
    setOpen(true);
    setActiveIndex(0);
    setResult(null);
    startTransition(async () => {
      const next = await refreshShowWithProgress(productionId);
      setResult(next);
      setActiveIndex(steps.length - 1);
      if (next.ok) router.refresh();
    });
  }

  function close() {
    if (pending && !result) return;
    setOpen(false);
  }

  return (
    <>
      <button type="button" onClick={startRefresh}>
        Refresh published dates
      </button>

      {open ? (
        <div
          className="admin-sheet-backdrop"
          role="presentation"
          onClick={() => {
            if (result) close();
          }}
        >
          <div
            className="admin-sheet admin-scrape-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="admin-sheet-head">
              <div>
                <p className="admin-kicker">Catalog scrape</p>
                <h2 id={titleId}>{showName}</h2>
              </div>
              <button
                ref={closeRef}
                type="button"
                className="admin-ghost"
                onClick={close}
                disabled={pending && !result}
              >
                {result ? "Close" : "Working…"}
              </button>
            </div>

            <p className="admin-lead">
              {listingKind === "touring"
                ? "Looking for published tour nights across ticketing feeds and theatre sites."
                : "Looking for published West End curtain times across the usual listings sources."}
            </p>

            <ol className="admin-scrape-steps">
              {steps.map((step, index) => {
                const done = Boolean(result) || index < activeIndex;
                const current = !result && index === activeIndex;
                return (
                  <li
                    key={step.id}
                    className={
                      done
                        ? "admin-scrape-step done"
                        : current
                          ? "admin-scrape-step current"
                          : "admin-scrape-step"
                    }
                  >
                    <strong>{step.label}</strong>
                    <span>{step.detail}</span>
                  </li>
                );
              })}
            </ol>

            {result ? (
              <p
                className={
                  result.ok ? "admin-banner ok" : "admin-banner error"
                }
                role="status"
              >
                {resultSummary(result)}
              </p>
            ) : (
              <p className="admin-footnote">
                This can take a minute. Confirmed months stay locked; later
                months can still gain new nights.
              </p>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
