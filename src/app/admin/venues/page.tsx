import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { logoutAction } from "../actions";
import { AdminKindTabs } from "@/components/admin/AdminKindTabs";
import { VenueRow } from "@/components/admin/VenueRow";
import { loadCatalogReview } from "@/lib/admin/catalog-review";
import { loadVenues } from "@/lib/admin/coverage";
import { adminCookieName, readAdminEmail } from "@/lib/admin/session";

export default async function VenuesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; ok?: string; error?: string }>;
}) {
  const jar = await cookies();
  const email = await readAdminEmail(jar.get(adminCookieName)?.value);
  if (!email) redirect("/admin/login");

  const query = await searchParams;
  const status = query.status === "confirmed" || query.status === "unsure" ? query.status : "all";
  let snapshot: Awaited<ReturnType<typeof loadVenues>>;
  let failed = false;
  try {
    snapshot = await loadVenues();
  } catch {
    failed = true;
    snapshot = { available: false, venues: [] };
  }

  const confirmed = snapshot.venues.filter((venue) => venue.directoryStatus === "confirmed");
  const unsure = snapshot.venues.filter((venue) => venue.directoryStatus !== "confirmed");
  const visible =
    status === "confirmed" ? confirmed : status === "unsure" ? unsure : snapshot.venues;
  const review = await loadCatalogReview().catch(() => null);
  const reviewCount = review && review.available && review.rpc ? review.queue.length : null;

  return (
    <main>
      <header className="admin-top">
        <div>
          <p className="admin-kicker">ShowBuz Admin</p>
          <h1>Venues</h1>
          <p className="admin-lead">
            Where each touring theatre publishes its diary. Unsure theatres are not fetched
            until you confirm them.
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
          active="venues"
          reviewCount={reviewCount}
          residentHref="/admin/resident"
          touringHref="/admin/touring"
        />
      </div>

      {query.ok === "confirm" ? (
        <p className="admin-banner ok" role="status">
          Theatre confirmed.
        </p>
      ) : null}
      {query.error === "confirm" ? (
        <p className="admin-banner error" role="alert">
          Could not confirm that theatre.
        </p>
      ) : null}
      {failed ? (
        <p className="admin-banner error" role="alert">
          Could not load theatres.
        </p>
      ) : null}
      {!failed && !snapshot.available ? (
        <p className="admin-footnote">The theatre directory is not available on this server yet.</p>
      ) : null}

      {snapshot.available ? (
        <nav className="admin-filters" aria-label="Filter by directory status">
          <Link
            href="/admin/venues"
            className={status === "all" ? "admin-filter active" : "admin-filter"}
          >
            All
            <span>{snapshot.venues.length}</span>
          </Link>
          <Link
            href="/admin/venues?status=confirmed"
            className={status === "confirmed" ? "admin-filter active" : "admin-filter"}
          >
            Confirmed
            <span>{confirmed.length}</span>
          </Link>
          <Link
            href="/admin/venues?status=unsure"
            className={status === "unsure" ? "admin-filter active" : "admin-filter"}
          >
            Unsure
            <span>{unsure.length}</span>
          </Link>
        </nav>
      ) : null}

      {snapshot.available ? (
        <div className="admin-table-wrap">
          <table className="admin-table compact">
            <thead>
              <tr>
                <th>Theatre</th>
                <th>Website / what&apos;s on</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {visible.map((venue) => (
                <VenueRow
                  key={venue.id}
                  id={venue.id}
                  venueName={venue.venueName}
                  city={venue.city}
                  siteDomain={venue.siteDomain}
                  whatsOnUrl={venue.whatsOnUrl}
                  platform={venue.platform}
                  directoryStatus={venue.directoryStatus}
                  learnedWhatsOnUrl={venue.learnedWhatsOnUrl}
                />
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      {snapshot.available && visible.length === 0 ? (
        <p className="admin-footnote">No theatres in this list.</p>
      ) : null}
    </main>
  );
}
