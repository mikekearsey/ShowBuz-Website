"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveTourStopTimesAction } from "@/app/admin/actions";
import {
  eachRunDay,
  formatCurtainPreview,
  formatRunDayLabel,
  formatStopDateRange,
  type TourCurtainStamp,
  type TourTimesNeedStop,
} from "@/lib/admin/tour-times";

type DayDraft = {
  date: string;
  time1: string;
  time2: string;
  noShow: boolean;
};

function timesForDay(nights: TourCurtainStamp[], date: string): string[] {
  return nights
    .filter((night) => night.date === date)
    .map((night) => night.time)
    .sort();
}

function buildInitialDays(stop: TourTimesNeedStop): DayDraft[] {
  return eachRunDay(stop.startDate, stop.endDate).map((date) => {
    const times = timesForDay(stop.nights, date);
    return {
      date,
      time1: times[0] ?? "",
      time2: times[1] ?? "",
      noShow: false,
    };
  });
}

function normalizeTime(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (!/^\d{2}:\d{2}$/.test(trimmed)) return null;
  const hour = Number(trimmed.slice(0, 2));
  const minute = Number(trimmed.slice(3, 5));
  if (hour > 23 || minute > 59) return null;
  return trimmed;
}

function collectStamps(days: DayDraft[]): {
  stamps: TourCurtainStamp[];
  error: string | null;
} {
  const stamps: TourCurtainStamp[] = [];
  for (const day of days) {
    if (day.noShow) continue;
    const a = normalizeTime(day.time1);
    const b = normalizeTime(day.time2);
    if (day.time1.trim() && !a) {
      return { stamps: [], error: `Invalid time on ${formatRunDayLabel(day.date)}.` };
    }
    if (day.time2.trim() && !b) {
      return { stamps: [], error: `Invalid time on ${formatRunDayLabel(day.date)}.` };
    }
    if (a && b && a === b) {
      return {
        stamps: [],
        error: `Two identical times on ${formatRunDayLabel(day.date)}.`,
      };
    }
    if (a) stamps.push({ date: day.date, time: a });
    if (b) stamps.push({ date: day.date, time: b });
  }
  if (stamps.length === 0) {
    return { stamps: [], error: "Add at least one curtain time." };
  }
  return { stamps, error: null };
}

const DEFAULT_TIME1 = "14:30";
const DEFAULT_TIME2 = "19:30";

export function TourTimesStopCard({ stop }: { stop: TourTimesNeedStop }) {
  const router = useRouter();
  const initial = useMemo(() => buildInitialDays(stop), [stop]);
  const [days, setDays] = useState<DayDraft[]>(initial);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();
  // Faded hint in empty boxes; follows the last good time typed in that column.
  const [hint1, setHint1] = useState(DEFAULT_TIME1);
  const [hint2, setHint2] = useState(DEFAULT_TIME2);
  const listRef = useRef<HTMLUListElement>(null);

  const preview = useMemo(() => {
    const { stamps, error: previewError } = collectStamps(days);
    if (previewError && stamps.length === 0 && !days.some((d) => !d.noShow && (d.time1 || d.time2))) {
      return "0 curtains";
    }
    if (stamps.length === 0) return "0 curtains";
    return formatCurtainPreview(stamps);
  }, [days]);

  function updateDay(date: string, patch: Partial<DayDraft>) {
    setSaved(false);
    setError(null);
    setDays((prev) =>
      prev.map((day) => (day.date === date ? { ...day, ...patch } : day)),
    );
  }

  function changeTime(date: string, column: 1 | 2, value: string) {
    updateDay(date, column === 1 ? { time1: value } : { time2: value });
    const good = normalizeTime(value);
    if (good) (column === 1 ? setHint1 : setHint2)(good);
  }

  // Return: empty box takes the hint, then focus moves to the same box on the next open day.
  function onTimeKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number,
    column: 1 | 2,
  ) {
    if (event.key !== "Enter") return;
    event.preventDefault();
    const day = days[index];
    const current = column === 1 ? day.time1 : day.time2;
    if (!current.trim()) {
      updateDay(day.date, column === 1 ? { time1: hint1 } : { time2: hint2 });
    }
    const inputs = listRef.current?.querySelectorAll<HTMLInputElement>(
      `input[data-time-col="${column}"]`,
    );
    if (!inputs) return;
    for (let i = index + 1; i < inputs.length; i++) {
      if (!inputs[i].disabled) {
        inputs[i].focus();
        return;
      }
    }
  }

  function reset() {
    setDays(buildInitialDays(stop));
    setHint1(DEFAULT_TIME1);
    setHint2(DEFAULT_TIME2);
    setError(null);
    setSaved(false);
  }

  function save() {
    const { stamps, error: checkError } = collectStamps(days);
    if (checkError) {
      setError(checkError);
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await saveTourStopTimesAction({
        runId: stop.runId,
        datesTimes: stamps,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setSaved(true);
      router.refresh();
    });
  }

  const venueLine = [stop.venueName, stop.city].filter(Boolean).join(", ");

  return (
    <article className="admin-tour-times-card">
      <header className="admin-tour-times-card-head">
        <div>
          <h3>{stop.productionName}</h3>
          <p className="admin-tour-times-meta">
            {venueLine}
            {venueLine ? " · " : ""}
            {formatStopDateRange(stop.startDate, stop.endDate)}
          </p>
          <p className="admin-reason">{stop.reason}</p>
        </div>
        {stop.boxOfficeUrl ? (
          <a
            href={stop.boxOfficeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="admin-tour-times-pill"
          >
            Open box office
          </a>
        ) : null}
      </header>

      <ul ref={listRef} className="admin-tour-times-days">
        {days.map((day, index) => (
          <li key={day.date} className="admin-tour-times-day">
            <span className="admin-tour-times-day-label">{formatRunDayLabel(day.date)}</span>
            <input
              type="text"
              inputMode="numeric"
              placeholder={hint1}
              aria-label={`${formatRunDayLabel(day.date)} first time`}
              data-time-col="1"
              className="admin-tour-times-time"
              value={day.time1}
              disabled={day.noShow || pending}
              onChange={(event) => changeTime(day.date, 1, event.target.value)}
              onKeyDown={(event) => onTimeKeyDown(event, index, 1)}
            />
            <input
              type="text"
              inputMode="numeric"
              placeholder={hint2}
              aria-label={`${formatRunDayLabel(day.date)} second time`}
              data-time-col="2"
              className="admin-tour-times-time"
              value={day.time2}
              disabled={day.noShow || pending}
              onChange={(event) => changeTime(day.date, 2, event.target.value)}
              onKeyDown={(event) => onTimeKeyDown(event, index, 2)}
            />
            <label className="admin-tour-times-noshow">
              <input
                type="checkbox"
                checked={day.noShow}
                disabled={pending}
                onChange={(event) =>
                  updateDay(day.date, {
                    noShow: event.target.checked,
                    ...(event.target.checked ? { time1: "", time2: "" } : {}),
                  })
                }
              />
              No show
            </label>
          </li>
        ))}
      </ul>

      <p className="admin-tour-times-preview" aria-live="polite">
        {preview}
      </p>

      {error ? (
        <p className="admin-banner error" role="alert">
          {error}
        </p>
      ) : null}
      {saved ? (
        <p className="admin-banner ok" role="status">
          Saved ✓ — admin times
        </p>
      ) : null}

      <div className="admin-tour-times-actions">
        <button
          type="button"
          className="admin-tour-times-pill solid"
          onClick={save}
          disabled={pending}
        >
          {pending ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          className="admin-tour-times-cancel"
          onClick={reset}
          disabled={pending}
        >
          Cancel
        </button>
      </div>
    </article>
  );
}
