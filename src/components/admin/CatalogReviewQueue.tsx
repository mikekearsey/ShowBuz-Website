import { logoutAction, setCatalogReviewAction } from "@/app/admin/actions";
import { AdminKindTabs } from "@/components/admin/AdminKindTabs";
import styles from "@/components/admin/catalog-review.module.css";
import type {
  CatalogRejectedRow,
  CatalogReviewQueueRow,
} from "@/lib/admin/catalog-review";
import { formatAdminDate } from "@/lib/admin/london";

function listingKindLabel(kind: string): string {
  if (kind === "resident") return "Resident";
  if (kind === "touring") return "Touring";
  return kind;
}

function nightCount(count: number): string {
  return count === 1 ? "1 night" : `${count} nights`;
}

export function CatalogReviewQueue({
  email,
  queue,
  rejected,
  notice,
}: {
  email: string;
  queue: CatalogReviewQueueRow[];
  rejected: CatalogRejectedRow[];
  notice?: "saved" | "failed";
}) {
  return (
    <main>
      <header className="admin-top">
        <div>
          <p className="admin-kicker">ShowBuz Admin</p>
          <h1>Catalogue review</h1>
          <p className="admin-lead">
            Possible titles waiting for a yes or no. Approved shows stay in the
            catalogue. Rejected shows stay hidden and are not added again.
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
          active="review"
          reviewCount={queue.length}
          residentHref="/admin/resident"
          touringHref="/admin/touring"
        />
      </div>

      {notice === "saved" ? (
        <p className="admin-banner ok">Review saved.</p>
      ) : null}
      {notice === "failed" ? (
        <p className="admin-banner error">Could not update that title. Try again.</p>
      ) : null}

      <div className="admin-table-wrap">
        <table className={`admin-table ${styles.table}`}>
          <thead>
            <tr>
              <th>Show</th>
              <th>Kind</th>
              <th>Venue</th>
              <th>Genres</th>
              <th>First night</th>
              <th>Last night</th>
              <th>Future nights</th>
              <th>Source</th>
              <th>Review</th>
            </tr>
          </thead>
          <tbody>
            {queue.length === 0 ? (
              <tr>
                <td colSpan={9}>No titles waiting for review</td>
              </tr>
            ) : (
              queue.map((row) => (
                <tr key={row.id}>
                  <td className={styles.show}>
                    {row.name}
                    {row.review_reason ? (
                      <span className={styles.reason}>{row.review_reason}</span>
                    ) : null}
                  </td>
                  <td>{listingKindLabel(row.listing_kind)}</td>
                  <td>{row.venue_summary?.trim() || "—"}</td>
                  <td>{row.genres}</td>
                  <td>{formatAdminDate(row.run_start_date)}</td>
                  <td>{formatAdminDate(row.run_end_date)}</td>
                  <td>{nightCount(row.future_night_count)}</td>
                  <td>
                    {row.source_url ? (
                      <a href={row.source_url} target="_blank" rel="noreferrer">
                        Source
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>
                    <form action={setCatalogReviewAction} className={styles.actions}>
                      <input type="hidden" name="productionId" value={row.id} />
                      <input
                        className={styles.note}
                        name="reason"
                        type="text"
                        placeholder="Optional reason"
                        aria-label={`Optional reason for ${row.name}`}
                        maxLength={500}
                      />
                      <button
                        className={styles.yes}
                        type="submit"
                        name="status"
                        value="approved"
                      >
                        Yes
                      </button>
                      <button
                        className={styles.no}
                        type="submit"
                        name="status"
                        value="rejected"
                      >
                        No
                      </button>
                    </form>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <section className={styles.section} aria-label="Rejected">
        <h2>Rejected</h2>
        {rejected.length === 0 ? (
          <p className={styles.empty}>No rejected titles.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className={`admin-table ${styles.table}`}>
              <thead>
                <tr>
                  <th>Show</th>
                  <th>Kind</th>
                  <th>Venue</th>
                  <th>Reason</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {rejected.map((row) => (
                  <tr key={row.id}>
                    <td>{row.name}</td>
                    <td>{listingKindLabel(row.listing_kind)}</td>
                    <td>{row.venue_summary?.trim() || "—"}</td>
                    <td>{row.review_reason?.trim() || "—"}</td>
                    <td>
                      <form action={setCatalogReviewAction}>
                        <input type="hidden" name="productionId" value={row.id} />
                        <input type="hidden" name="status" value="approved" />
                        <button className={styles.undo} type="submit">
                          Undo
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
