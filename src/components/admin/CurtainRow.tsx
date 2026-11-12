"use client";

import { useState } from "react";
import { deleteCurtainAction } from "@/app/admin/actions";
import { CircleX } from "@/components/icons/CircleX";
import { formatCurtainRemoveWhen, formatLondonTime } from "@/lib/admin/london";

export function CurtainRow({
  productionId,
  curtainId,
  startsAt,
  locked,
  returnMonth,
  returnVenue,
}: {
  productionId: string;
  curtainId: string;
  startsAt: string;
  locked: boolean;
  /** Month (YYYY-MM) and picked stop to come back to after Remove. */
  returnMonth?: string;
  returnVenue?: string | null;
}) {
  const [confirming, setConfirming] = useState(false);
  const clock = formatLondonTime(startsAt);
  const when = formatCurtainRemoveWhen(startsAt);
  const phrase = `Remove ${when.time} on ${when.date}`;

  return (
    <div className={`admin-curtain${locked ? " locked" : ""}${confirming ? " confirming" : ""}`}>
      <div className="admin-curtain-row">
        <span className="admin-curtain-time">{clock}</span>
        {confirming ? null : (
          <button
            type="button"
            className="admin-curtain-x"
            aria-label={phrase}
            onClick={() => setConfirming(true)}
          >
            <CircleX />
          </button>
        )}
      </div>
      {confirming ? (
        <div className="admin-curtain-confirm" role="group" aria-label={phrase}>
          <p className="admin-curtain-confirm-q">{phrase}?</p>
          <div className="admin-curtain-confirm-actions">
            <form action={deleteCurtainAction} className="admin-curtain-confirm-form">
              <input type="hidden" name="productionId" value={productionId} />
              <input type="hidden" name="curtainId" value={curtainId} />
              {returnMonth ? <input type="hidden" name="month" value={returnMonth} /> : null}
              {returnVenue ? <input type="hidden" name="venue" value={returnVenue} /> : null}
              <button type="submit" className="admin-curtain-remove-pill">
                Remove
              </button>
            </form>
            <button
              type="button"
              className="admin-curtain-cancel"
              onClick={() => setConfirming(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
