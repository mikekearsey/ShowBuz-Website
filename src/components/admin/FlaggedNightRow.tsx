"use client";

import { useState } from "react";
import { hideFlaggedNightAction, keepFlaggedNightAction } from "@/app/admin/actions";
import { PasteSource } from "@/components/admin/PasteSource";
import { formatAdminDate, formatLondonTime } from "@/lib/admin/london";
import { reviewReasonLabel } from "@/lib/admin/labels";

export function FlaggedNightRow({
  id,
  productionId,
  startsAt,
  venueName,
  venueCity,
  reviewReason,
  venueRunId,
  venueId,
  stopStart,
  stopEnd,
}: {
  id: string;
  productionId: string;
  startsAt: string;
  venueName: string;
  venueCity: string | null;
  reviewReason: string | null;
  venueRunId: string | null;
  venueId: string | null;
  stopStart: string;
  stopEnd: string;
}) {
  const [hiding, setHiding] = useState(false);
  const where = [venueName, venueCity].filter(Boolean).join(", ");
  const scope = venueRunId ? "venue_run" : "venue";

  return (
    <li className="admin-look-night">
      <div className="admin-look-night-main">
        <span>
          {formatAdminDate(startsAt)} {formatLondonTime(startsAt)} · {where}
        </span>
        <span className="admin-reason">{reviewReasonLabel(reviewReason)}</span>
      </div>
      <div className="admin-inline-actions">
        <form action={keepFlaggedNightAction}>
          <input type="hidden" name="nightId" value={id} />
          <input type="hidden" name="productionId" value={productionId} />
          <button type="submit" className="admin-tiny">
            Keep
          </button>
        </form>
        {hiding ? (
          <form action={hideFlaggedNightAction} className="admin-hide-confirm">
            <input type="hidden" name="nightId" value={id} />
            <input type="hidden" name="productionId" value={productionId} />
            <p>Hide this night? It stays stored and is marked superseded.</p>
            <button type="submit" className="admin-compact">
              Hide
            </button>
            <button type="button" className="admin-tiny" onClick={() => setHiding(false)}>
              Cancel
            </button>
          </form>
        ) : (
          <button type="button" className="admin-tiny" onClick={() => setHiding(true)}>
            Hide
          </button>
        )}
        <PasteSource
          collapsed
          scope={scope}
          venueRunId={venueRunId}
          venueId={venueId}
          stop={{
            city: venueCity ?? "",
            venueName,
            startDate: stopStart,
            endDate: stopEnd,
          }}
        />
      </div>
    </li>
  );
}
