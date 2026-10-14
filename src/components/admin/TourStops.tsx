import { PasteSource } from "@/components/admin/PasteSource";
import type { CatalogVenueRun } from "@/lib/admin/catalog";
import { venueRunTitle } from "@/lib/admin/catalog";
import { formatAdminDate } from "@/lib/admin/london";
import {
  httpsUrl,
  reviewReasonLabel,
  stopNeedsSource,
  stopStatusLabel,
  timesSourceLabel,
} from "@/lib/admin/labels";

function linkOrDash(value: string | null | undefined, label: string) {
  const href = value ? httpsUrl(value) : null;
  if (!href) return "—";
  return (
    <a href={href} target="_blank" rel="noreferrer">
      {label}
    </a>
  );
}

export function TourStops({
  productionId,
  runs,
}: {
  productionId: string;
  runs: CatalogVenueRun[];
}) {
  if (runs.length === 0) {
    return (
      <section className="admin-stops">
        <h2>Stops</h2>
        <p className="admin-footnote">No stops stored for this tour yet.</p>
      </section>
    );
  }

  return (
    <section className="admin-stops">
      <h2>Stops</h2>
      <p className="admin-footnote">
        Timed means a curtain is published. TBC means the stop is announced and the time is not.
        Unsupported means the booking site cannot be read.
      </p>
      <div className="admin-table-wrap">
        <table className="admin-table compact">
          <thead>
            <tr>
              <th>Venue</th>
              <th>City</th>
              <th>Dates</th>
              <th>Status</th>
              <th>Times from</th>
              <th>Book</th>
              <th>Times</th>
            </tr>
          </thead>
          <tbody>
            {runs.map((run) => {
              const needsSource = stopNeedsSource(run);
              const book = run.book_url || run.ticket_url;
              return (
                <tr key={run.id}>
                  <td className="wrap">
                    <span className="admin-stop-venue">{venueRunTitle(run)}</span>
                    {run.review_reason && run.review_reason !== "duplicate_of" ? (
                      <span className="admin-source-label">
                        {reviewReasonLabel(run.review_reason)}
                      </span>
                    ) : null}
                    {needsSource && !run.id.startsWith("perf:") ? (
                      <PasteSource
                        scope="venue_run"
                        venueRunId={run.id}
                        productionId={productionId}
                        stop={{
                          city: run.city ?? "",
                          venueName: run.venue_name,
                          startDate: run.start_date,
                          endDate: run.end_date,
                        }}
                      />
                    ) : null}
                    {needsSource && run.id.startsWith("perf:") ? (
                      <p className="admin-source-label">
                        No saved stop row yet, so a source page cannot be attached.
                      </p>
                    ) : null}
                  </td>
                  <td>{run.city?.trim() || "—"}</td>
                  <td>
                    {formatAdminDate(run.start_date)}–{formatAdminDate(run.end_date)}
                  </td>
                  <td className="wrap">
                    <span className={statusClass(run.times_status)}>{stopStatusLabel(run)}</span>
                    {run.times_status === "unsupported" && run.booking_host ? (
                      <span className="admin-source-label">Booking site {run.booking_host}</span>
                    ) : null}
                  </td>
                  <td className="wrap">{timesSourceLabel(run.times_source)}</td>
                  <td>{linkOrDash(book, "Book")}</td>
                  <td>{linkOrDash(run.times_url, "Times")}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function statusClass(status: string | null | undefined): string {
  if (status === "timed") return "admin-status ok";
  if (status === "tbc" || status === "unsupported") return "admin-status pending";
  return "admin-status";
}
