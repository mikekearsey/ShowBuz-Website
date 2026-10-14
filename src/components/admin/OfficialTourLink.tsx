"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  setOfficialTourUrlAction,
  tourRecheckStatusAction,
} from "@/app/admin/actions";
import { httpsUrl, officialSourceLabel } from "@/lib/admin/labels";

function shortUrl(value: string): string {
  try {
    const url = new URL(value);
    const path = `${url.hostname}${url.pathname}`.replace(/\/$/, "");
    return path.length > 48 ? `${path.slice(0, 46)}…` : path;
  } catch {
    return value;
  }
}

export function OfficialTourLink({
  productionId,
  url,
  source,
  rechecking,
  startEditing = false,
  poll = true,
}: {
  productionId: string;
  url: string | null;
  source: "scrape" | "admin" | null;
  rechecking: boolean;
  startEditing?: boolean;
  poll?: boolean;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(startEditing);
  const [draft, setDraft] = useState(url ?? "");
  const [override, setOverride] = useState<{
    url: string | null;
    source: "admin";
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [localWaiting, setLocalWaiting] = useState(false);
  const [pending, startTransition] = useTransition();
  const waiting = rechecking || localWaiting;
  const shownUrl = override && override.url !== url ? override.url : url;
  const shownSource = override && override.url !== url ? override.source : source;
  const label = officialSourceLabel(shownSource);
  const safe = shownUrl ? httpsUrl(shownUrl) : null;

  useEffect(() => {
    if (!waiting || !poll) return;
    let stopped = false;
    const started = Date.now();
    const timer = setInterval(() => {
      void (async () => {
        if (stopped) return;
        if (Date.now() - started > 90_000) {
          setLocalWaiting(false);
          return;
        }
        try {
          const status = await tourRecheckStatusAction(productionId);
          if (stopped) return;
          if (status.done) {
            setLocalWaiting(false);
            router.refresh();
          }
        } catch {
          if (!stopped) setLocalWaiting(false);
        }
      })();
    }, 8000);
    return () => {
      stopped = true;
      clearInterval(timer);
    };
  }, [waiting, poll, productionId, router]);

  function save() {
    setError(null);
    startTransition(async () => {
      const result = await setOfficialTourUrlAction(productionId, draft);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      const next = httpsUrl(draft);
      setOverride({ url: next, source: "admin" });
      setEditing(false);
      setLocalWaiting(true);
      router.refresh();
    });
  }

  return (
    <div className="admin-official">
      {editing ? (
        <form
          className="admin-official-edit"
          onSubmit={(event) => {
            event.preventDefault();
            save();
          }}
        >
          <input
            type="url"
            name="officialTourUrl"
            className="admin-inline-input"
            value={draft}
            placeholder="https://"
            aria-label="Official tour page"
            onChange={(event) => setDraft(event.target.value)}
            required
          />
          <div className="admin-inline-actions">
            <button type="submit" className="admin-compact" disabled={pending}>
              {pending ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              className="admin-tiny"
              onClick={() => {
                setDraft(shownUrl ?? "");
                setError(null);
                setEditing(false);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          {safe ? (
            <a href={safe} target="_blank" rel="noreferrer">
              {shortUrl(safe)}
            </a>
          ) : (
            <span className="admin-muted">No official page</span>
          )}
          {label ? <span className="admin-source-label">{label}</span> : null}
          {waiting ? <span className="admin-recheck">Re-checking…</span> : null}
            <button
              type="button"
              className="admin-tiny"
              onClick={() => {
                setDraft(shownUrl ?? "");
                setEditing(true);
              }}
            >
              Edit
            </button>
        </>
      )}
      {error ? <span className="admin-field-error">{error}</span> : null}
    </div>
  );
}
