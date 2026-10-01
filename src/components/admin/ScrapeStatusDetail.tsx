"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import type { CatalogProduction } from "@/lib/admin/catalog";
import { scrapeStatusLabel } from "@/lib/admin/catalog";
import { explainScrape } from "@/lib/admin/scrape-explain";
import { formatAdminDate } from "@/lib/admin/london";

export function ScrapeStatusDetail({
  production,
}: {
  production: CatalogProduction;
}) {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const explanation = explainScrape(production);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="admin-scrape-trigger"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span className={`admin-status ${production.scrape_status}`}>
          {scrapeStatusLabel(production)}
        </span>
        <span className="admin-scrape-hint">Details</span>
      </button>

      {open
        ? createPortal(
            <div
              className="admin-sheet-backdrop"
              role="presentation"
              onClick={() => setOpen(false)}
            >
              <div
                className="admin-sheet"
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                onClick={(event) => event.stopPropagation()}
              >
                <div className="admin-sheet-head">
                  <div>
                    <p className="admin-kicker">
                      {scrapeStatusLabel(production)}
                    </p>
                    <h2 id={titleId}>{production.name}</h2>
                  </div>
                  <button
                    ref={closeRef}
                    type="button"
                    className="admin-ghost"
                    onClick={() => setOpen(false)}
                  >
                    Close
                  </button>
                </div>

                <p className={`admin-status ${production.scrape_status}`}>
                  {explanation.headline}
                </p>
                <p className="admin-lead">{explanation.summary}</p>

                <dl className="admin-sheet-meta">
                  <dt>Venue</dt>
                  <dd>{production.venue_summary ?? "Not set"}</dd>
                  <dt>Run</dt>
                  <dd>
                    {formatAdminDate(production.run_start_date)} to{" "}
                    {formatAdminDate(production.run_end_date)}
                  </dd>
                  {explanation.lastScrapedLabel ? (
                    <>
                      <dt>Last scraped</dt>
                      <dd>{explanation.lastScrapedLabel}</dd>
                    </>
                  ) : null}
                  {explanation.refreshQueuedLabel ? (
                    <>
                      <dt>Refresh queued</dt>
                      <dd>{explanation.refreshQueuedLabel}</dd>
                    </>
                  ) : null}
                  {explanation.sourceLabel ? (
                    <>
                      <dt>Source</dt>
                      <dd>{explanation.sourceLabel}</dd>
                    </>
                  ) : null}
                  {explanation.noteLabel && explanation.technicalNote ? (
                    <>
                      <dt>{explanation.noteLabel}</dt>
                      <dd>{explanation.technicalNote}</dd>
                    </>
                  ) : null}
                </dl>

                <p className="admin-footnote">
                  <Link href={`/admin/shows/${production.id}`}>Open this show</Link>{" "}
                  to refresh published dates or edit individual curtains.
                </p>
              </div>
            </div>,
            document.querySelector(".admin-app") ?? document.body,
          )
        : null}
    </>
  );
}
