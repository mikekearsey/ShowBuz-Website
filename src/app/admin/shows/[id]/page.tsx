import Link from "next/link";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import {
  addCurtainAction,
  confirmMonthAction,
  deleteCurtainAction,
  logoutAction,
  restoreCurtainAction,
} from "../../actions";
import { RefreshScrapeDialog } from "@/components/admin/RefreshScrapeDialog";
import {
  getProduction,
  isAdminLocked,
  isSuppressed,
  listPerformances,
  scrapeStatusLabel,
  type CatalogPerformance,
} from "@/lib/admin/catalog";
import { formatAdminDate, formatAdminDateTime, formatLondonTime, londonYmd, londonYearMonth } from "@/lib/admin/london";
import { adminCookieName, readAdminEmail } from "@/lib/admin/session";

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
      return "Refresh requested. New published nights will be added; nights you locked stay as you set them.";
    case "add":
      return "Curtain added. Further refreshes will not remove it.";
    case "delete":
      return "Curtain removed. Further refreshes will not put this night back.";
    case "restore":
      return "Curtain restored and locked.";
    case "confirm":
      return "This month is confirmed. Future scrapes will not change these curtains or add nights in this month.";
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

export default async function AdminShowPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ month?: string; ok?: string; error?: string }>;
}) {
  const jar = await cookies();
  const email = await readAdminEmail(jar.get(adminCookieName)?.value);
  if (!email) redirect("/admin/login");

  const { id } = await params;
  const query = await searchParams;
  const production = await getProduction(id);
  if (!production) notFound();

  const performances = await listPerformances(id);
  const visible = performances.filter((row) => !isSuppressed(row));
  const suppressed = performances.filter((row) => isSuppressed(row));
  const touring = production.listing_kind === "touring";

  const fallback =
    visible[0]?.starts_at ??
    (production.run_start_date
      ? `${production.run_start_date}T12:00:00Z`
      : new Date().toISOString());
  const fallbackYm = londonYearMonth(fallback);
  let year = fallbackYm.year;
  let month = fallbackYm.month;
  if (query.month && /^\d{4}-\d{2}$/.test(query.month)) {
    year = Number(query.month.slice(0, 4));
    month = Number(query.month.slice(5, 7));
  }

  const byDay = new Map<string, CatalogPerformance[]>();
  for (const row of visible) {
    const ymd = londonYmd(row.starts_at);
    const list = byDay.get(ymd) ?? [];
    list.push(row);
    byDay.set(ymd, list);
  }

  const prev = shiftMonth(year, month, -1);
  const next = shiftMonth(year, month, 1);
  const cells = calendarCells(year, month);
  const yearMonth = `${year}-${String(month).padStart(2, "0")}`;
  const monthConfirmed = (production.admin_locked_months ?? []).includes(yearMonth);
  const finish = production.run_end_date;

  return (
    <main>
      <header className="admin-top">
        <div>
          <p className="admin-kicker">
            <Link href={production.listing_kind === "touring" ? "/admin/touring" : "/admin/resident"}>
              {production.listing_kind === "touring" ? "Touring shows" : "Resident shows"}
            </Link>
            {" / "}
            Show
          </p>
          <h1>{production.name}</h1>
          <p className="admin-lead">
            {production.venue_summary ? `${production.venue_summary}. ` : null}
            Catalog run {formatAdminDate(production.run_start_date)} to{" "}
            {formatAdminDate(production.run_end_date)}.{" "}
            {production.listing_kind === "touring" &&
            production.scrape_status === "empty"
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
        </div>
        <form action={logoutAction}>
          <button type="submit" className="admin-ghost">
            Sign out
          </button>
        </form>
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

      <section className="admin-toolbar">
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
              {monthConfirmed
                ? "This month confirmed"
                : "Confirm this month is correct"}
            </button>
          </form>
        </div>
        <p>
          Refresh looks up newly published nights. Confirm locks only the month
          you are viewing — later months can still gain dates if the run
          extends. Nights you add or remove here stay as you set them.
        </p>
      </section>

      <nav className="admin-month-nav">
        <Link href={`/admin/shows/${id}?month=${prev.year}-${String(prev.month).padStart(2, "0")}`}>
          Previous
        </Link>
        <h2>{monthLabel(year, month)}</h2>
        <Link href={`/admin/shows/${id}?month=${next.year}-${String(next.month).padStart(2, "0")}`}>
          Next
        </Link>
      </nav>
      <p className="admin-footnote">
        {monthConfirmed
          ? `Showing ${monthLabel(year, month)} — confirmed. Scrapes will not change this month. `
          : `Showing ${monthLabel(year, month)}. `}
        {finish ? `Run continues until ${formatAdminDate(finish)}. ` : ""}
        {visible.length} published curtains in the catalog
        {suppressed.length ? `, ${suppressed.length} removed and locked` : ""}.
      </p>

      <div className={`admin-cal${monthConfirmed ? " confirmed" : ""}`}>
        {WEEKDAYS.map((label) => (
          <div key={label} className="admin-cal-head">
            {label}
          </div>
        ))}
        {cells.map((cell, index) => {
          const curtains = cell.ymd ? (byDay.get(cell.ymd) ?? []) : [];
          return (
            <div
              key={`${cell.ymd ?? "empty"}-${index}`}
              className={`admin-cal-day${cell.day ? "" : " empty"}`}
            >
              {cell.day ? <span className="admin-cal-num">{cell.day}</span> : null}
              {curtains.map((curtain) => (
                <div
                  key={curtain.id}
                  className={`admin-curtain${isAdminLocked(curtain) ? " locked" : ""}`}
                >
                  <span className="admin-curtain-time">
                    {formatLondonTime(curtain.starts_at)}
                  </span>
                  {touring || curtain.venue_name ? (
                    <span className="admin-curtain-venue">
                      {curtain.venue_name}
                      {curtain.venue_city ? `, ${curtain.venue_city}` : ""}
                    </span>
                  ) : null}
                  <form action={deleteCurtainAction}>
                    <input type="hidden" name="productionId" value={production.id} />
                    <input type="hidden" name="curtainId" value={curtain.id} />
                    <button type="submit" className="admin-tiny">
                      Remove
                    </button>
                  </form>
                </div>
              ))}
            </div>
          );
        })}
      </div>

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
            Venue{touring ? "" : " (optional)"}
            <input
              type="text"
              name="venueName"
              required={touring}
              defaultValue={touring ? "" : (production.venue_summary ?? "")}
            />
          </label>
          <label>
            City
            <input type="text" name="venueCity" />
          </label>
          <label className="wide">
            Address
            <input type="text" name="venueAddress" />
          </label>
          <button type="submit">Add curtain</button>
        </form>
      </section>

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
