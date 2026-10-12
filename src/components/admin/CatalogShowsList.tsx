import Link from "next/link";
import { logoutAction } from "@/app/admin/actions";
import { AdminKindTabs } from "@/components/admin/AdminKindTabs";
import styles from "@/components/admin/catalog-review.module.css";
import { ScrapeStatusDetail } from "@/components/admin/ScrapeStatusDetail";
import {
  catalogHasFutureDates,
  formatTouringVenueSummary,
  formatTouringVenueSummaryFromRuns,
  listAllVenueRuns,
  listProductions,
  listTouringVenueStats,
  parseScrapeFilter,
  type CatalogListingKind,
  type CatalogProduction,
  type CatalogScrapeFilter,
  type CatalogVenueRun,
  type TouringVenueStats,
} from "@/lib/admin/catalog";
import {
  loadCatalogReview,
  rejectedAsProduction,
  type CatalogReviewSnapshot,
} from "@/lib/admin/catalog-review";
import { formatAdminDate, londonTodayYmd } from "@/lib/admin/london";

function listHref(
  path: string,
  opts: { status?: string; rejected?: boolean },
): string {
  const params = new URLSearchParams();
  if (opts.status) params.set("status", opts.status);
  if (opts.rejected) params.set("rejected", "show");
  const query = params.toString();
  return query ? `${path}?${query}` : path;
}

const FILTERS: Array<{ id: CatalogScrapeFilter; label: string }> = [
  { id: "all", label: "All" },
  { id: "ok", label: "OK" },
  { id: "empty", label: "No dates" },
  { id: "error", label: "Error" },
  { id: "pending", label: "Not scraped" },
  { id: "ignored", label: "Ignored" },
];
const KIND_COPY: Record<
  CatalogListingKind,
  { title: string; lead: string; otherHref: string; otherLabel: string }
> = {
  resident: {
    title: "Resident shows",
    lead: "West End sit-down productions in the shared schedule catalog.",
    otherHref: "/admin/touring",
    otherLabel: "Touring",
  },
  touring: {
    title: "Touring shows",
    lead: "UK touring productions in the shared schedule catalog.",
    otherHref: "/admin/resident",
    otherLabel: "Resident",
  },
};

function venueSummaryForShow(
  kind: CatalogListingKind,
  show: {
    id: string;
    venue_summary: string | null;
    run_start_date: string | null;
    run_end_date: string | null;
  },
  runsByProduction: Map<string, CatalogVenueRun[]>,
  statsByProduction: Map<string, TouringVenueStats>,
): string {
  if (kind !== "touring") {
    return show.venue_summary ?? "—";
  }
  const runs = runsByProduction.get(show.id) ?? [];
  if (runs.length > 0) {
    return (
      formatTouringVenueSummaryFromRuns(runs, {
        start: show.run_start_date,
        end: show.run_end_date,
      }) ?? "—"
    );
  }
  const stats = statsByProduction.get(show.id);
  if (stats && stats.venueCount > 0) {
    return (
      formatTouringVenueSummary({
        venueCount: stats.venueCount,
        startDate: stats.startDate ?? show.run_start_date,
        endDate: stats.endDate ?? show.run_end_date,
      }) ?? "—"
    );
  }
  if (show.venue_summary && /\d+\s+venues?\s+over\s+\d+\s+months?/i.test(show.venue_summary)) {
    return show.venue_summary;
  }
  return (
    formatTouringVenueSummary({
      venueCount: 0,
      startDate: show.run_start_date,
      endDate: show.run_end_date,
    }) ?? "—"
  );
}

function isArchivedShow(
  show: CatalogProduction,
  todayYmd: string,
  runsByProduction: Map<string, CatalogVenueRun[]>,
  statsByProduction: Map<string, TouringVenueStats>,
): boolean {
  if (show.scrape_status === "ignored") return false;
  const runs = runsByProduction.get(show.id) ?? [];
  const stats = statsByProduction.get(show.id);
  // Prefer diary evidence over a stale empty flag (thin re-scrapes used to
  // flip status to empty while leaving catalog_performances intact).
  if (
    show.scrape_status === "empty" &&
    !(stats?.endDate || runs.length > 0)
  ) {
    return true;
  }
  return !catalogHasFutureDates(show, {
    todayYmd,
    venueRunEndDates: runs.map((run) => run.end_date),
    performanceEndDate: stats?.endDate ?? null,
  });
}

export async function CatalogShowsList({
  kind,
  status,
  showRejected = false,
  email,
}: {
  kind: CatalogListingKind;
  status?: string;
  showRejected?: boolean;
  email: string;
}) {
  const filter = parseScrapeFilter(status);
  const todayYmd = londonTodayYmd();
  const [listed, review] = await Promise.all([
    listProductions(),
    loadCatalogReview().catch(() => ({ available: false }) as CatalogReviewSnapshot),
  ]);
  let productions = listed;
  const needsReviewIds = new Set(review.available ? review.needsReviewIds : []);
  const rejectedIds = new Set<string>();
  if (review.available) {
    for (const row of review.rejected) {
      if (row.listing_kind === kind) rejectedIds.add(row.id);
    }
    if (!showRejected) {
      productions = productions.filter((show) => !rejectedIds.has(show.id));
    } else {
      const have = new Set(productions.map((show) => show.id));
      for (const row of review.rejected) {
        if (have.has(row.id)) continue;
        const production = rejectedAsProduction(row);
        if (production) productions.push(production);
      }
    }
  }
  const kindShows = productions.filter((show) => show.listing_kind === kind);
  const [venueRuns, performanceStats] = await Promise.all([
    kind === "touring" ? listAllVenueRuns() : Promise.resolve([] as CatalogVenueRun[]),
    // Need end dates for archive detection on both kinds when possible.
    listTouringVenueStats(kindShows.map((show) => show.id)),
  ]);
  const runsByProduction = new Map<string, CatalogVenueRun[]>();
  for (const run of venueRuns) {
    const list = runsByProduction.get(run.production_id) ?? [];
    list.push(run);
    runsByProduction.set(run.production_id, list);
  }

  const archivedShows = kindShows.filter((show) =>
    isArchivedShow(show, todayYmd, runsByProduction, performanceStats),
  );
  const activeShows = kindShows.filter(
    (show) => !isArchivedShow(show, todayYmd, runsByProduction, performanceStats),
  );

  const visible =
    filter === "archived"
      ? archivedShows
      : filter === "all"
        ? activeShows
        : activeShows.filter((show) => show.scrape_status === filter);

  const copy = KIND_COPY[kind];
  const basePath = kind === "resident" ? "/admin/resident" : "/admin/touring";
  const reviewCount = review.available && review.rpc ? review.queue.length : null;
  const statusForLinks = filter === "all" ? undefined : filter;
  const rejectedCount = rejectedIds.size;

  return (
    <main>
      <header className="admin-top">
        <div>
          <p className="admin-kicker">ShowBuz Admin</p>
          <h1>{copy.title}</h1>
          <p className="admin-lead">{copy.lead}</p>
        </div>
        <form action={logoutAction}>
          <button type="submit" className="admin-ghost">
            Sign out {email}
          </button>
        </form>
      </header>

      <div className="admin-list-nav">
        <AdminKindTabs
          active={kind}
          reviewCount={reviewCount}
          residentHref={listHref("/admin/resident", {
            status: filter === "archived" ? "archived" : undefined,
            rejected: showRejected,
          })}
          touringHref={listHref("/admin/touring", {
            status: filter === "archived" ? "archived" : undefined,
            rejected: showRejected,
          })}
        />

        <nav className="admin-kind-tabs" aria-label="Active or archived">
          <Link
            href={listHref(basePath, { rejected: showRejected })}
            className={
              filter !== "archived" ? "admin-kind-tab active" : "admin-kind-tab"
            }
          >
            Active
            <span className="admin-kind-tab-count">{activeShows.length}</span>
          </Link>
          <Link
            href={listHref(basePath, { status: "archived", rejected: showRejected })}
            className={
              filter === "archived" ? "admin-kind-tab active" : "admin-kind-tab"
            }
          >
            Archived
            <span className="admin-kind-tab-count">{archivedShows.length}</span>
          </Link>
        </nav>
      </div>

      {review.available && (rejectedCount > 0 || showRejected) ? (
        <p className="admin-filters">
          <Link
            href={listHref(basePath, {
              status: statusForLinks,
              rejected: !showRejected,
            })}
            className={showRejected ? "admin-filter active" : "admin-filter"}
          >
            {showRejected ? "Hide rejected" : "Show rejected"}
            <span>{rejectedCount}</span>
          </Link>
        </p>
      ) : null}

      {filter === "archived" ? null : (
        <nav className="admin-filters" aria-label="Filter by scrape status">
          {FILTERS.map((item) => {
            const count =
              item.id === "all"
                ? activeShows.length
                : activeShows.filter((show) => show.scrape_status === item.id)
                    .length;
            const href = listHref(basePath, {
              status: item.id === "all" ? undefined : item.id,
              rejected: showRejected,
            });
            const active = filter === item.id;
            return (
              <Link
                key={item.id}
                href={href}
                className={active ? "admin-filter active" : "admin-filter"}
              >
                {item.label}
                <span>{count}</span>
              </Link>
            );
          })}
        </nav>
      )}
      {filter === "archived" ? (
        <p className="admin-footnote">
          Shows with no nights on or after today. They return to the main list
          automatically when a scrape adds future dates.
        </p>
      ) : null}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Show</th>
              <th>Venue / summary</th>
              <th>Start</th>
              <th>Finish</th>
              <th>Scrape</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((show) => (
              <tr key={show.id}>
                <td>
                  <Link href={`/admin/shows/${show.id}`}>{show.name}</Link>
                  {needsReviewIds.has(show.id) ? (
                    <span className={styles.badge}>Needs review</span>
                  ) : null}
                </td>
                <td>
                  {venueSummaryForShow(
                    kind,
                    show,
                    runsByProduction,
                    performanceStats,
                  )}
                </td>
                <td>{formatAdminDate(show.run_start_date)}</td>
                <td>{formatAdminDate(show.run_end_date)}</td>
                <td>
                  <ScrapeStatusDetail production={show} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="admin-footnote">
        {visible.length} of{" "}
        {filter === "archived" ? archivedShows.length : activeShows.length}{" "}
        {filter === "archived" ? "archived" : "active"} {kind} shows
        {filter === "all" || filter === "archived"
          ? ""
          : ` with status “${filter}”`}
        {filter !== "archived" && archivedShows.length
          ? ` · ${archivedShows.length} archived`
          : ""}
        {!showRejected && rejectedCount
          ? ` · ${rejectedCount} rejected hidden`
          : ""}
        . <Link href={copy.otherHref}>Switch to {copy.otherLabel}</Link>.
      </p>
    </main>
  );
}
