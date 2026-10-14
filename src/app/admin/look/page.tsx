import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { logoutAction } from "../actions";
import { AdminKindTabs } from "@/components/admin/AdminKindTabs";
import { FlaggedNightRow } from "@/components/admin/FlaggedNightRow";
import { loadCatalogReview } from "@/lib/admin/catalog-review";
import { loadFlaggedNights, type FlaggedNight } from "@/lib/admin/coverage";
import { adminCookieName, readAdminEmail } from "@/lib/admin/session";

function groupNights(nights: FlaggedNight[]): Array<{
  productionId: string;
  productionName: string;
  nights: FlaggedNight[];
}> {
  const groups = new Map<string, { productionId: string; productionName: string; nights: FlaggedNight[] }>();
  for (const night of nights) {
    const group = groups.get(night.productionId) ?? {
      productionId: night.productionId,
      productionName: night.productionName,
      nights: [],
    };
    group.nights.push(night);
    groups.set(night.productionId, group);
  }
  return [...groups.values()].sort(
    (a, b) =>
      a.nights[0].startsAt.localeCompare(b.nights[0].startsAt) ||
      a.productionName.localeCompare(b.productionName),
  );
}

export default async function NeedsALookPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const jar = await cookies();
  const email = await readAdminEmail(jar.get(adminCookieName)?.value);
  if (!email) redirect("/admin/login");

  const query = await searchParams;
  let snapshot: Awaited<ReturnType<typeof loadFlaggedNights>>;
  let failed = false;
  try {
    snapshot = await loadFlaggedNights();
  } catch {
    failed = true;
    snapshot = { available: false, nights: [] };
  }
  const groups = groupNights(snapshot.nights);
  const review = await loadCatalogReview().catch(() => null);
  const reviewCount = review && review.available && review.rpc ? review.queue.length : null;

  return (
    <main>
      <header className="admin-top">
        <div>
          <p className="admin-kicker">ShowBuz Admin</p>
          <h1>Needs a look</h1>
          <p className="admin-lead">
            Flagged nights, grouped by tour. Keep leaves the night visible. Hide marks it
            superseded. Nothing on this page is deleted.
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
          active="look"
          reviewCount={reviewCount}
          residentHref="/admin/resident"
          touringHref="/admin/touring"
        />
      </div>

      {query.ok === "keep" ? (
        <p className="admin-banner ok" role="status">
          Night kept.
        </p>
      ) : null}
      {query.ok === "hide" ? (
        <p className="admin-banner ok" role="status">
          Night hidden. The row is still stored.
        </p>
      ) : null}
      {query.error === "keep" ? (
        <p className="admin-banner error" role="alert">
          Could not keep that night.
        </p>
      ) : null}
      {query.error === "hide" ? (
        <p className="admin-banner error" role="alert">
          Could not hide that night.
        </p>
      ) : null}

      {failed ? (
        <p className="admin-banner error" role="alert">
          Could not load flagged nights.
        </p>
      ) : null}
      {!failed && !snapshot.available ? (
        <p className="admin-footnote">Flagged nights are not available on this server yet.</p>
      ) : null}
      {!failed && snapshot.available && groups.length === 0 ? (
        <p className="admin-footnote">No nights need a look.</p>
      ) : null}

      <div className="admin-look-list">
        {groups.map((group) => (
          <section key={group.productionId} className="admin-look-group">
            <h2>
              <Link href={`/admin/shows/${group.productionId}`}>{group.productionName}</Link>
            </h2>
            <ul>
              {group.nights.map((night) => (
                <FlaggedNightRow
                  key={night.id}
                  id={night.id}
                  productionId={night.productionId}
                  startsAt={night.startsAt}
                  venueName={night.venueName}
                  venueCity={night.venueCity}
                  reviewReason={night.reviewReason}
                  venueRunId={night.venueRunId}
                  venueId={night.venueId}
                  stopStart={night.stopStart}
                  stopEnd={night.stopEnd}
                />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
