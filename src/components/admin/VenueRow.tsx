"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { confirmVenueAction, updateVenueAction } from "@/app/admin/actions";
import { PasteSource } from "@/components/admin/PasteSource";
import { londonTodayYmd } from "@/lib/admin/london";
import {
  VENUE_PLATFORMS,
  httpsUrl,
  isKnownPlatform,
  platformLabel,
} from "@/lib/admin/labels";

function plusMonths(ymd: string, months: number): string {
  const [year, month, day] = ymd.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1 + months, day));
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function VenueRow({
  id,
  venueName,
  city,
  siteDomain,
  whatsOnUrl,
  platform,
  directoryStatus,
  learnedWhatsOnUrl,
  startEditing = false,
}: {
  id: string;
  venueName: string;
  city: string;
  siteDomain: string | null;
  whatsOnUrl: string | null;
  platform: string;
  directoryStatus: string;
  learnedWhatsOnUrl: string | null;
  startEditing?: boolean;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(startEditing);
  const [domain, setDomain] = useState(siteDomain ?? "");
  const [whatsOn, setWhatsOn] = useState(whatsOnUrl ?? "");
  const [nextPlatform, setNextPlatform] = useState(
    isKnownPlatform(platform) ? platform : "unknown",
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const confirmed = directoryStatus === "confirmed";
  const siteHref = siteDomain ? `https://${siteDomain.replace(/^https?:\/\//, "")}` : null;
  const whatsHref = whatsOnUrl ? httpsUrl(whatsOnUrl) : null;
  const learned = learnedWhatsOnUrl ? httpsUrl(learnedWhatsOnUrl) : null;
  const today = londonTodayYmd();
  const platforms = VENUE_PLATFORMS.some((item) => item.id === platform)
    ? VENUE_PLATFORMS
    : [...VENUE_PLATFORMS, { id: platform, label: platformLabel(platform) }];

  function save() {
    setError(null);
    startTransition(async () => {
      const result = await updateVenueAction({
        id,
        siteDomain: domain,
        whatsOnUrl: whatsOn,
        platform: nextPlatform,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setEditing(false);
      router.refresh();
    });
  }

  return (
    <tr>
      <td className="wrap">
        <strong>{venueName}</strong>
        <span className="admin-source-label">{city}</span>
      </td>
      <td className="wrap">
        {editing ? (
          <form
            className="admin-official-edit"
            onSubmit={(event) => {
              event.preventDefault();
              save();
            }}
          >
            <label>
              Website
              <input
                className="admin-inline-input"
                value={domain}
                onChange={(event) => setDomain(event.target.value)}
                aria-label={`Website for ${venueName}`}
              />
            </label>
            <label>
              What&apos;s on
              <input
                type="url"
                className="admin-inline-input"
                value={whatsOn}
                placeholder="https://"
                onChange={(event) => setWhatsOn(event.target.value)}
                aria-label={`What's on for ${venueName}`}
              />
            </label>
            <label>
              Platform
              <select
                className="admin-inline-input"
                value={nextPlatform}
                onChange={(event) => setNextPlatform(event.target.value)}
                aria-label={`Platform for ${venueName}`}
              >
                {platforms.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
            <div className="admin-inline-actions">
              <button type="submit" className="admin-compact" disabled={pending}>
                {pending ? "Saving…" : "Save"}
              </button>
              <button
                type="button"
                className="admin-tiny"
                onClick={() => {
                  setDomain(siteDomain ?? "");
                  setWhatsOn(whatsOnUrl ?? "");
                  setNextPlatform(isKnownPlatform(platform) ? platform : "unknown");
                  setError(null);
                  setEditing(false);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="admin-venue-facts">
            {siteHref ? (
              <a href={siteHref} target="_blank" rel="noreferrer">
                {siteDomain}
              </a>
            ) : (
              <span className="admin-muted">No website</span>
            )}
            {whatsHref ? (
              <a href={whatsHref} target="_blank" rel="noreferrer">
                What&apos;s on
              </a>
            ) : (
              <span className="admin-muted">No what&apos;s-on page</span>
            )}
            <span className="admin-source-label">{platformLabel(platform)}</span>
            {learned ? (
              <a href={learned} target="_blank" rel="noreferrer">
                Learned page
              </a>
            ) : null}
            <button type="button" className="admin-tiny" onClick={() => setEditing(true)}>
              Edit
            </button>
          </div>
        )}
        {error ? <span className="admin-field-error">{error}</span> : null}
      </td>
      <td>
        {confirmed ? (
          <span className="admin-status ok">Confirmed</span>
        ) : (
          <span className="admin-status pending">Unsure</span>
        )}
      </td>
      <td className="wrap">
        {confirmed ? null : (
          <form action={confirmVenueAction}>
            <input type="hidden" name="venueId" value={id} />
            <button type="submit" className="admin-compact">
              Confirm
            </button>
          </form>
        )}
        <PasteSource
          collapsed
          scope="venue"
          venueId={id}
          stop={{
            city,
            venueName,
            startDate: today,
            endDate: plusMonths(today, 18),
          }}
        />
      </td>
    </tr>
  );
}
