import Link from "next/link";
import { logoutAction } from "@/app/admin/actions";
import { ScrapeStatusDetail } from "@/components/admin/ScrapeStatusDetail";
import {
  formatTouringVenueSummary,
  formatTouringVenueSummaryFromRuns,
  listAllVenueRuns,
  listProductions,
  listTouringVenueStats,
  parseScrapeFilter,
  type CatalogListingKind,
  type CatalogScrapeFilter,
  type CatalogVenueRun,
  type TouringVenueStats,
} from "@/lib/admin/catalog";
import { formatAdminDate } from "@/lib/admin/london";

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

export async function CatalogShowsList({
  kind,
  status,
  email,
}: {
  kind: CatalogListingKind;
  status?: string;
  email: string;
}) {
  const filter = parseScrapeFilter(status);
  const productions = await listProductions();
  const kindShows = productions.filter((show) => show.listing_kind === kind);
  const [venueRuns, performanceStats] = await Promise.all([
    kind === "touring" ? listAllVenueRuns() : Promise.resolve([] as CatalogVenueRun[]),
    kind === "touring"
      ? listTouringVenueStats(kindShows.map((show) => show.id))
      : Promise.resolve(new Map<string, TouringVenueStats>()),
  ]);
  const runsByProduction = new Map<string, CatalogVenueRun[]>();
  for (const run of venueRuns) {
    const list = runsByProduction.get(run.production_id) ?? [];
    list.push(run);
    runsByProduction.set(run.production_id, list);
  }
  const visible =
    filter === "all"
      ? kindShows
      : kindShows.filter((show) => show.scrape_status === filter);
  const copy = KIND_COPY[kind];
  const basePath = kind === "resident" ? "/admin/resident" : "/admin/touring";

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

      <nav className="admin-kind-tabs" aria-label="Show kind">
        <Link
          href="/admin/resident"
          className={
            kind === "resident" ? "admin-kind-tab active" : "admin-kind-tab"
          }
        >
          Resident
        </Link>
        <Link
          href="/admin/touring"
          className={
            kind === "touring" ? "admin-kind-tab active" : "admin-kind-tab"
          }
        >
          Touring
        </Link>
      </nav>

      <nav className="admin-filters" aria-label="Filter by scrape status">
        {FILTERS.map((item) => {
          const count =
            item.id === "all"
              ? kindShows.length
              : kindShows.filter((show) => show.scrape_status === item.id)
                  .length;
          const href =
            item.id === "all" ? basePath : `${basePath}?status=${item.id}`;
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
                </td>
                <td>{venueSummaryForShow(kind, show, runsByProduction, performanceStats)}</td>
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
        {visible.length} of {kindShows.length} {kind} shows
        {filter === "all" ? "" : ` with status “${filter}”`}.{" "}
        <Link href={copy.otherHref}>Switch to {copy.otherLabel}</Link>.
      </p>
    </main>
  );
}
