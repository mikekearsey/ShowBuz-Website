"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { applySourceOverrideAction, previewSourceAction } from "@/app/admin/actions";
import { formatAdminDate } from "@/lib/admin/london";
import { previewSourceLabel } from "@/lib/admin/labels";

export type PasteStop = {
  city: string;
  venueName: string;
  startDate: string;
  endDate: string;
};

type PreviewState = {
  url: string;
  source: string | null;
  curtains: Array<{ date: string; time: string }>;
};

export function PasteSource({
  scope,
  venueRunId = null,
  productionId = null,
  venueId = null,
  stop,
  collapsed = false,
  initialPreview = null,
}: {
  scope: "venue_run" | "venue" | "production";
  venueRunId?: string | null;
  productionId?: string | null;
  venueId?: string | null;
  stop: PasteStop;
  collapsed?: boolean;
  initialPreview?: PreviewState | null;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(!collapsed || Boolean(initialPreview));
  const [url, setUrl] = useState(initialPreview?.url ?? "");
  const [note, setNote] = useState("");
  const [preview, setPreview] = useState<PreviewState | null>(initialPreview);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  function check() {
    setError(null);
    setSaved(false);
    startTransition(async () => {
      const result = await previewSourceAction({ url, stop });
      if (!result.ok) {
        setPreview(null);
        setError(result.error);
        return;
      }
      setPreview({ url: url.trim(), source: result.source, curtains: result.curtains });
    });
  }

  function useThis() {
    if (!preview) return;
    setError(null);
    startTransition(async () => {
      const result = await applySourceOverrideAction({
        url: preview.url,
        note,
        scope,
        venueRunId,
        productionId,
        venueId,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setSaved(true);
      router.refresh();
    });
  }

  const shown = preview?.curtains.slice(0, 12) ?? [];
  const extra = preview ? preview.curtains.length - shown.length : 0;
  const previewMatches = preview != null && preview.url === url.trim();

  if (!open) {
    return (
      <button type="button" className="admin-tiny" onClick={() => setOpen(true)}>
        Paste source
      </button>
    );
  }

  return (
    <div className="admin-paste">
      <p className="admin-paste-label">Paste correct source</p>
      <input
        type="url"
        className="admin-inline-input"
        value={url}
        placeholder="https://"
        aria-label="Paste correct source"
        onChange={(event) => {
          setUrl(event.target.value);
          setSaved(false);
        }}
      />
      <input
        type="text"
        className="admin-inline-input"
        value={note}
        maxLength={500}
        placeholder="Optional note"
        aria-label="Optional note"
        onChange={(event) => setNote(event.target.value)}
      />
      <div className="admin-inline-actions">
        <button type="button" className="admin-tiny" onClick={check} disabled={pending || !url.trim()}>
          {pending && !previewMatches ? "Checking…" : "Check"}
        </button>
        <button
          type="button"
          className="admin-compact"
          onClick={useThis}
          disabled={pending || !previewMatches}
        >
          {pending && previewMatches ? "Saving…" : "Use this"}
        </button>
        {collapsed ? (
          <button type="button" className="admin-tiny" onClick={() => setOpen(false)}>
            Cancel
          </button>
        ) : null}
      </div>
      {error ? <p className="admin-field-error">{error}</p> : null}
      {saved ? (
        <p className="admin-recheck">
          {scope === "venue"
            ? "Saved. This theatre is confirmed."
            : "Saved. The tour will be checked again."}
        </p>
      ) : null}
      {previewMatches ? (
        <div className="admin-preview">
          {preview.curtains.length === 0 ? (
            <p>That page listed no curtains for this stop. Nothing was saved.</p>
          ) : (
            <>
              <p>
                Found by {previewSourceLabel(preview.source)}. Nothing is saved until you press Use
                this.
              </p>
              <ul>
                {shown.map((curtain) => (
                  <li key={`${curtain.date}-${curtain.time}`}>
                    {formatAdminDate(curtain.date)} {curtain.time}
                  </li>
                ))}
              </ul>
              {extra > 0 ? <p>and {extra} more</p> : null}
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}
