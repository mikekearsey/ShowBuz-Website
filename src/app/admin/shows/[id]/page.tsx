import Link from "next/link";
import { notFound } from "next/navigation";
import {
  addCurtainAction,
  confirmMonthAction,
  logoutAction,
  restoreCurtainAction,
} from "../../actions";
import { CurtainRow } from "@/components/admin/CurtainRow";
import { OfficialTourLink } from "@/components/admin/OfficialTourLink";
import { RefreshScrapeDialog } from "@/components/admin/RefreshScrapeDialog";
import { TourStops } from "@/components/admin/TourStops";
import { TourTimesStopCard } from "@/components/admin/TourTimesStopCard";
import { requireAdminAccess } from "@/lib/admin/admin-access";
import {
  formatTouringVenueSummaryFromRuns,
  getProduction,
  isAdminLocked,
  isSuppressed,
  listPerformances,
  listVenueRuns,
  scrapeStatusLabel,
  tourTimesStopFromRun,
  venueRunTitle,
  venueRunsFromPerformances,
  type CatalogPerformance,
  type CatalogVenueRun,
} from "@/lib/admin/catalog";
import {
  isUuid,
  loadTourCoverage,
  tourIsRechecking,
  type TourCoverage,
} from "@/lib/admin/coverage";
import { formatStopCoverage } from "@/lib/admin/labels";
import { formatAdminDate, formatAdminDateTime, formatLondonTime, londonYmd, londonYearMonth } from "@/lib/admin/london";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function monthLabel(year: number, month: number): string {
  return new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
  }).format(new Date(Date.UTC(year, month - 1, 1)));
}

function shiftMonth(year: number, month: number, delta: number): { year: number; month: number } {
  const date = new Date(Date.UTC(year, month - 1 + delta, 1));
  return { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1 };
}

function calendarCells(year: number, month: number): Array<{ day: number | null; ymd: string | null }> {
  const first = new Date(Date.UTC(year, month - 1, 1));
  const startWeekday = (first.getUTCDay() + 6) % 7;
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const cells: Array<{ day: number | null; ymd: string | null }> = [];
  for (let i = 0; i < startWeekday; i += 1) {
    cells.push({ day: null, ymd: null });
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    const ymd = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    cells.push({ day, ymd });
  }
  while (cells.length % 7 !== 0) {
    cells.push({ day: null, ymd: null });
  }
  return cells;
}

function notice(value: string | undefined): string | null {
  switch (value) {
    case "refresh":
      return "Refresh requested. New published curtains will be added; curtains you locked stay as you set them.";
    case "add":
      return "Curtain added. Further refreshes will not remove it.";
    case "delete":
      return "Curtain removed. Further refreshes will not put this curtain back.";
    case "restore":
      return "Curtain restored and locked.";
    case "confirm":
      return "This month is confirmed. Future scrapes will not change these curtains or add more in this month.";
    default:
      return null;
  }
}

function errorNotice(value: string | undefined): string | null {
  switch (value) {
    case "refresh":
      return "Could not refresh. Check SUPABASE_SERVICE_ROLE_KEY on the server.";
    case "curtain":
      return "Could not add that curtain. Check the date, time and venue.";
    case "delete":
      return "Could not remove that curtain.";
    case "restore":
      return "Could not restore that curtain.";
    case "confirm":
      return "Could not confirm this month.";
    default:
      return null;
  }
}

function standMonthHref(productionId: string, run: CatalogVenueRun): string {
  const month = run.start_date.slice(0, 7);
  return `/admin/shows/${productionId}?month=${month}&venue=${encodeURIComponent(run.id)}`;
}

function CalendarGrid({
  cells,
  byDay,
  productionId,
  monthConfirmed,
  yearMonth,
  venueId,
}: {
  cells: Array<{ day: number | null; ymd: string | null }>;
  byDay: Map<string, CatalogPerformance[]>;
  productionId: string;
  monthConfirmed: boolean;
  /** Month in view and picked stop, so Remove comes back to the same place. */
  yearMonth: string;
  venueId: string | null;
}) {
  return (
    <div className={`admin-cal fit-page${monthConfirmed ? " confirmed" : ""}`}>
      {WEEKDAYS.map((label) => (
        <div key={label} className="admin-cal-head">
          {label}
        </div>
      ))}
      {cells.map((cell, index) => {
        const curtains = cell.ymd ? (byDay.get(cell.ymd) ?? []) : [];
        const multi = curtains.length >= 2;
        const dayVenue = (() => {
          const first = curtains[0];
          if (!first?.venue_name?.trim()) return null;
          return [first.venue_name.trim(), first.venue_city?.trim() || null]
            .filter(Boolean)
            .join(", ");
        })();
        return (
          <div
            key={`${cell.ymd ?? "empty"}-${index}`}
            className={`admin-cal-day${cell.day ? "" : " empty"}${multi ? " multi" : ""}`}
          >
            {cell.day ? <span className="admin-cal-num">{cell.day}</span> : null}
            <div className="admin-cal-curtains">
              {curtains.map((curtain) => (
                <CurtainRow
                  key={curtain.id}
                  productionId={productionId}
                  curtainId={curtain.id}
                  startsAt={curtain.starts_at}
                  locked={isAdminLocked(curtain)}
                  returnMonth={yearMonth}
                  returnVenue={venueId}
                />
              ))}
            </div>
            {dayVenue ? (
              <span className="admin-cal-day-venue" title={dayVenue}>
                {dayVenue}
              </span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export default async function AdminShowPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ month?: string; venue?: string; ok?: string; error?: string }>;
}) {
  await requireAdminAccess();

  const { id } = await params;
  const query = await searchParams;
  const production = await getProduction(id);
  if (!production) notFound();

  const [performances, storedVenueRuns, coverageSnap] = await Promise.all([
    listPerformances(id),
    production.listing_kind === "touring" ? listVenueRuns(id) : Promise.resolve([] as CatalogVenueRun[]),
    production.listing_kind === "touring"
      ? loadTourCoverage(id).catch(() => ({
          available: false,
          byId: new Map<string, TourCoverage>(),
        }))
      : Promise.resolve({ available: true, byId: new Map<string, TourCoverage>() }),
  ]);
  const coverage = coverageSnap.byId.get(id) ?? null;
  const visible = performances.filter((row) => !isSuppressed(row));
  const suppressed = performances.filter((row) => isSuppressed(row));
  const touring = production.listing_kind === "touring";
  const venueRuns =
    storedVenueRuns.length > 0
      ? storedVenueRuns
      : touring
        ? venueRunsFromPerformances(id, performances)
        : [];
  const touringSummary = touring
    ? formatTouringVenueSummaryFromRuns(venueRuns, {
        start: production.run_start_date,
        end: production.run_end_date,
      })
    : null;

  // LHS venue click jumps the calendar to that stand's month and highlights the
  // row. Month prev/next never keeps a venue filter — always show every curtain
  // in the month in view.
  const selectedVenue = touring && query.venue
    ? venueRuns.find((run) => run.id === query.venue) ?? null
    : null;

  const fallback =
    selectedVenue?.start_date
      ? `${selectedVenue.start_date}T12:00:00Z`
      : visible[0]?.starts_at ??
        (production.run_start_date
          ? `${production.run_start_date}T12:00:00Z`
          : new Date().toISOString());
  const fallbackYm = londonYearMonth(fallback);
  let year = fallbackYm.year;
  let month = fallbackYm.month;
  if (query.month && /^\d{4}-\d{2}$/.test(query.month)) {
    year = Number(query.month.slice(0, 4));
    month = Number(query.month.slice(5, 7));
  } else if (selectedVenue?.start_date) {
    year = Number(selectedVenue.start_date.slice(0, 4));
    month = Number(selectedVenue.start_date.slice(5, 7));
  }

  const byDay = new Map<string, CatalogPerformance[]>();
  for (const row of visible) {
    const ymd = londonYmd(row.starts_at);
    const list = byDay.get(ymd) ?? [];
    list.push(row);
    byDay.set(ymd, list);
  }
  for (const list of byDay.values()) {
    list.sort((a, b) => a.starts_at.localeCompare(b.starts_at));
  }

  const prev = shiftMonth(year, month, -1);
  const next = shiftMonth(year, month, 1);
  const cells = calendarCells(year, month);
  const yearMonth = `${year}-${String(month).padStart(2, "0")}`;
  const monthConfirmed = (production.admin_locked_months ?? []).includes(yearMonth);
  const finish = production.run_end_date;

  // Touring: the Tour Times boxes for the picked stop sit above the calendar,
  // so a save shows up underneath. Prefill = the curtains on the calendar that
  // Save would replace (removed ones are not times to keep).
  const editorStop =
    selectedVenue && isUuid(selectedVenue.id)
      ? tourTimesStopFromRun(production, selectedVenue, visible)
      : null;
  const stopEditor = !touring ? null : editorStop ? (
    <div className="admin-tour-stop-editor">
      <TourTimesStopCard key={editorStop.runId} stop={editorStop} calendarMonth={yearMonth} />
    </div>
  ) : (
    <p className="admin-footnote admin-tour-stop-editor">
      {selectedVenue
        ? "This stop's times can't be edited on this page."
        : venueRuns.length > 0
          ? "Pick a stop on the left to edit its times."
          : "This tour has no stops listed yet, so there are no times to edit here."}
    </p>
  );

  const calendarPane = (
    <div className="admin-tour-calendar">
      {stopEditor}
      <section className="admin-toolbar compact">
        <div className="admin-toolbar-actions">
          <RefreshScrapeDialog
            productionId={production.id}
            listingKind={production.listing_kind}
            showName={production.name}
          />
          <form action={confirmMonthAction}>
            <input type="hidden" name="productionId" value={production.id} />
            <input type="hidden" name="yearMonth" value={yearMonth} />
            <button type="submit" className="admin-ghost" disabled={monthConfirmed}>
              {monthConfirmed ? "Month confirmed" : "Confirm month"}
            </button>
          </form>
        </div>
      </section>

      <nav className="admin-month-nav">
        <Link
          href={`/admin/shows/${id}?month=${prev.year}-${String(prev.month).padStart(2, "0")}`}
        >
          Previous
        </Link>
        <h2>{monthLabel(year, month)}</h2>
        <Link
          href={`/admin/shows/${id}?month=${next.year}-${String(next.month).padStart(2, "0")}`}
        >
          Next
        </Link>
      </nav>
      <p className="admin-footnote">
        {monthConfirmed
          ? `Confirmed — scrapes will not change this month. `
          : ""}
        {finish ? `Run until ${formatAdminDate(finish)}. ` : ""}
        {visible.length} curtains
        {suppressed.length ? `, ${suppressed.length} removed` : ""}.
      </p>

      <CalendarGrid
        cells={cells}
        byDay={byDay}
        productionId={production.id}
        monthConfirmed={monthConfirmed}
        yearMonth={yearMonth}
        venueId={selectedVenue?.id ?? null}
      />
    </div>
  );

  return (
    <main className={touring ? "admin-show-touring" : "admin-show-calendar-page"}>
      <header className="admin-top">
        <div>
          <p className="admin-kicker">
            <Link href={touring ? "/admin/touring" : "/admin/resident"}>
              {touring ? "Touring shows" : "Resident shows"}
            </Link>
            {" / "}
            Show
          </p>
          <h1>{production.name}</h1>
          <p className="admin-lead">
            {touring
              ? touringSummary
                ? `${touringSummary}. `
                : null
              : production.venue_summary
                ? `${production.venue_summary}. `
                : null}
            Catalog run {formatAdminDate(production.run_start_date)} to{" "}
            {formatAdminDate(production.run_end_date)}.{" "}
            {coverage &&
            coverage.tourStopsTimed != null &&
            coverage.tourStopsFuture != null
              ? `${formatStopCoverage(coverage.tourStopsTimed, coverage.tourStopsFuture)}. `
              : ""}
            {touring && production.scrape_status === "empty"
              ? "No published tour dates"
              : `Scrape ${scrapeStatusLabel(production)}`}
            {production.last_scraped_at
              ? `, last ${formatAdminDateTime(production.last_scraped_at)}`
              : ""}
            .
          </p>
          {production.scrape_error ? (
            <p className="admin-footnote">Last scrape note: {production.scrape_error}</p>
          ) : null}
          {touring ? (
            <OfficialTourLink
              productionId={production.id}
              url={coverage?.officialTourUrl ?? null}
              source={coverage?.officialTourUrlSource ?? null}
              rechecking={coverage ? tourIsRechecking(coverage) : false}
            />
          ) : null}
          {touring && !coverageSnap.available ? (
            <p className="admin-footnote">
              The official tour page is not available on this server yet.
            </p>
          ) : null}
        </div>
        <div className="admin-top-actions">
          <Link href="/admin/two-step" className="admin-ghost">
            Two-step
          </Link>
          <form action={logoutAction}>
            <button type="submit" className="admin-ghost">
              Sign out
            </button>
          </form>
        </div>
      </header>

      {notice(query.ok) ? (
        <p className="admin-banner ok" role="status">
          {notice(query.ok)}
        </p>
      ) : null}
      {errorNotice(query.error) ? (
        <p className="admin-banner error" role="alert">
          {errorNotice(query.error)}
        </p>
      ) : null}

      {touring ? <TourStops productionId={production.id} runs={venueRuns} /> : null}

      {touring && venueRuns.length > 0 ? (
        <div className="admin-tour-split">
          <aside className="admin-itinerary sidebar">
            <h2>Venues</h2>
            <p className="admin-footnote">{touringSummary ?? "Tour itinerary"}</p>
            <ul className="admin-itinerary-list">
              {venueRuns.map((run) => {
                const active = selectedVenue?.id === run.id;
                return (
                  <li key={run.id}>
                    <Link
                      href={standMonthHref(production.id, run)}
                      scroll={false}
                      className={active ? "admin-itinerary-row active" : "admin-itinerary-row"}
                    >
                      <span className="admin-itinerary-venue">{venueRunTitle(run)}</span>
                      <span className="admin-itinerary-dates">
                        {formatAdminDate(run.start_date)}–{formatAdminDate(run.end_date)}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </aside>
          {calendarPane}
        </div>
      ) : (
        calendarPane
      )}

      {/* Resident only. Touring uses the stop editor above the calendar: a typed
          venue name here could miss the stop and make duplicates. */}
      {!touring ? (
        <section className="admin-add">
          <h2>Add a curtain</h2>
          <p>
            Saved as definite. A later refresh will not delete it. Times are
            Europe/London.
          </p>
          <form action={addCurtainAction} className="admin-form row">
            <input type="hidden" name="productionId" value={production.id} />
            <label>
              Date
              <input type="date" name="date" required />
            </label>
            <label>
              Time
              <input type="time" name="time" required />
            </label>
            <label>
              Venue (optional)
              <input
                type="text"
                name="venueName"
                defaultValue={production.venue_summary ?? ""}
              />
            </label>
            <label>
              City
              <input type="text" name="venueCity" defaultValue="" />
            </label>
            <label className="wide">
              Address
              <input type="text" name="venueAddress" />
            </label>
            <button type="submit">Add curtain</button>
          </form>
        </section>
      ) : null}

      {suppressed.length > 0 ? (
        <section className="admin-removed">
          <h2>Removed, locked against refresh</h2>
          <ul>
            {suppressed.map((curtain) => (
              <li key={curtain.id}>
                {formatAdminDate(londonYmd(curtain.starts_at))} {formatLondonTime(curtain.starts_at)}
                {curtain.venue_name ? ` · ${curtain.venue_name}` : ""}
                <form action={restoreCurtainAction}>
                  <input type="hidden" name="productionId" value={production.id} />
                  <input type="hidden" name="curtainId" value={curtain.id} />
                  {/* Come back on the restored curtain's own month. */}
                  <input
                    type="hidden"
                    name="month"
                    value={londonYmd(curtain.starts_at).slice(0, 7)}
                  />
                  {selectedVenue ? (
                    <input type="hidden" name="venue" value={selectedVenue.id} />
                  ) : null}
                  <button type="submit" className="admin-tiny">
                    Restore
                  </button>
                </form>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}
