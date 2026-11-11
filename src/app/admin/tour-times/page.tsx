import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { logoutAction } from "../actions";
import { AdminKindTabs } from "@/components/admin/AdminKindTabs";
import { TourTimesStopCard } from "@/components/admin/TourTimesStopCard";
import { loadCatalogReview } from "@/lib/admin/catalog-review";
import {
  formatCurtainPreview,
  formatStopDateRange,
  loadTourTimesAttention,
} from "@/lib/admin/tour-times";
import { adminCookieName, readAdminEmail } from "@/lib/admin/session";

function venueLine(venueName: string, city: string): string {
  return [venueName, city].filter(Boolean).join(", ");
}

export default async function AdminTourTimesPage() {
  const jar = await cookies();
  const email = await readAdminEmail(jar.get(adminCookieName)?.value);
  if (!email) redirect("/admin/login");

  let failed = false;
  let snapshot: Awaited<ReturnType<typeof loadTourTimesAttention>>;
  try {
    snapshot = await loadTourTimesAttention(8);
  } catch {
    failed = true;
    snapshot = { available: false };
  }

  const review = await loadCatalogReview().catch(() => null);
  const reviewCount = review && review.available && review.rpc ? review.queue.length : null;
  const tourTimesCount =
    snapshot.available ? snapshot.needsTimes.length : null;

  const needs = snapshot.available ? snapshot.needsTimes : [];
  const disagrees = snapshot.available ? snapshot.robotDisagrees : [];
  const laterCount = snapshot.available ? snapshot.laterCount : 0;
  const filledToday = snapshot.available ? snapshot.filledToday : 0;

  return (
    <main>
      <header className="admin-top">
        <div>
          <p className="admin-kicker">ShowBuz Admin</p>
          <h1>Tour times</h1>
          <p className="admin-lead">
            Type in curtain times for tour stops the robot cannot read. Use the
            stop&apos;s local time (labelled when it is not London). Never guess —
            only what the box office shows.
          </p>
        </div>
        <form action={logoutAction}>
          <button type="submit" className="admin-ghost">
            Sign out {email}
          </button>
        </form>
      </header>

      <div className="admin-list-nav">
        <AdminKindTabs
          active="tour-times"
          reviewCount={reviewCount}
          tourTimesCount={tourTimesCount}
          residentHref="/admin/resident"
          touringHref="/admin/touring"
        />
      </div>

      {failed ? (
        <p className="admin-banner error" role="alert">
          Could not load stops that need times.
        </p>
      ) : null}
      {!failed && !snapshot.available ? (
        <p className="admin-footnote">
          Tour times is not available on this server yet. Apply the R2a migration
          on the test copy first.
        </p>
      ) : null}

      {snapshot.available ? (
        <>
          <section className="admin-tour-times-section" aria-labelledby="tour-times-needs">
            <h2 id="tour-times-needs">Please type in times</h2>
            {needs.length === 0 ? (
              <p className="admin-footnote">Nothing needs times in the next 8 weeks.</p>
            ) : (
              <div className="admin-tour-times-list">
                {needs.map((stop) => (
                  <TourTimesStopCard key={stop.runId} stop={stop} />
                ))}
              </div>
            )}
          </section>

          <section
            className="admin-tour-times-section"
            aria-labelledby="tour-times-disagree"
          >
            <h2 id="tour-times-disagree">Robot sees different times</h2>
            {disagrees.length === 0 ? (
              <p className="admin-footnote">No open disagreements.</p>
            ) : (
              <div className="admin-tour-times-list">
                {disagrees.map((row) => (
                  <article key={row.runId} className="admin-tour-times-card readonly">
                    <header className="admin-tour-times-card-head">
                      <div>
                        <h3>{row.productionName}</h3>
                        <p className="admin-tour-times-meta">
                          {venueLine(row.venueName, row.city)}
                          {venueLine(row.venueName, row.city) ? " · " : ""}
                          {formatStopDateRange(row.startDate, row.endDate)}
                        </p>
                      </div>
                      {row.sourceUrl ? (
                        <a
                          href={row.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="admin-tour-times-pill"
                        >
                          Open source
                        </a>
                      ) : row.boxOfficeUrl ? (
                        <a
                          href={row.boxOfficeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="admin-tour-times-pill"
                        >
                          Open box office
                        </a>
                      ) : null}
                    </header>
                    <div className="admin-tour-times-compare">
                      <div>
                        <p className="admin-tour-times-compare-label">Admin times</p>
                        <p>{formatCurtainPreview(row.adminTimes)}</p>
                      </div>
                      <div>
                        <p className="admin-tour-times-compare-label">Robot times</p>
                        <p>{formatCurtainPreview(row.scrapedTimes)}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <p className="admin-footnote admin-tour-times-footer">
            {filledToday} {filledToday === 1 ? "stop" : "stops"} filled automatically
            today · {laterCount} further-out{" "}
            {laterCount === 1 ? "stop" : "stops"} not on sale yet (no action).
          </p>
        </>
      ) : null}
    </main>
  );
}
