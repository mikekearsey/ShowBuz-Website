"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveTourStopTimesAction } from "@/app/admin/actions";
import {
  eachRunDay,
  formatCurtainPreview,
  formatRunDayLabel,
  formatStopDateRange,
  formatStopTimeZoneLabel,
  isMatineeTime,
  type TourCurtainStamp,
  type TourTimesNeedStop,
} from "@/lib/admin/tour-times";

type DayDraft = {
  date: string;
  /** Matinee box (usually before 17:00). */
  time1: string;
  /** Evening box (usually 17:00 or later). */
  time2: string;
  noShow: boolean;
};

/** Distinct times on one day, earliest first. */
function timesForDay(nights: TourCurtainStamp[], date: string): string[] {
  return [
    ...new Set(nights.filter((night) => night.date === date).map((night) => night.time)),
  ].sort();
}

function stampKey(stamp: TourCurtainStamp): string {
  return `${stamp.date}T${stamp.time}`;
}

/** "Tue 17 Nov 20:00" */
function stampLabel(stamp: TourCurtainStamp): string {
  return `${formatRunDayLabel(stamp.date)} ${stamp.time}`;
}

/** Days holding more curtains than the two boxes can show: date → how many. */
function overfullDays(nights: TourCurtainStamp[]): Map<string, number> {
  const out = new Map<string, number>();
  for (const date of new Set(nights.map((night) => night.date))) {
    const count = timesForDay(nights, date).length;
    if (count > 2) out.set(date, count);
  }
  return out;
}

/** Changes when the stop's stored curtains (or its dates) change. */
function stopDataKey(stop: TourTimesNeedStop): string {
  return [stop.startDate, stop.endDate, ...stop.nights.map(stampKey).sort()].join("|");
}

/** How many removed curtains the "Save anyway?" question names before "and N more". */
const CONFIRM_LIST_MAX = 12;

/** Place times into matinee / evening boxes by clock, not by list order. */
function assignBoxes(times: string[]): { time1: string; time2: string } {
  // A day with more than two is flagged on its row and Save is blocked (see overfullDays).
  const a = times[0];
  const b = times[1];
  if (!a) return { time1: "", time2: "" };
  if (!b) {
    return isMatineeTime(a) ? { time1: a, time2: "" } : { time1: "", time2: a };
  }
  const aMat = isMatineeTime(a);
  const bMat = isMatineeTime(b);
  if (aMat && !bMat) return { time1: a, time2: b };
  if (!aMat && bMat) return { time1: b, time2: a };
  // Two afternoon or two evening: earlier → matinee box, later → evening box.
  return { time1: a, time2: b };
}

function buildInitialDays(stop: TourTimesNeedStop): DayDraft[] {
  return eachRunDay(stop.startDate, stop.endDate).map((date) => {
    const { time1, time2 } = assignBoxes(timesForDay(stop.nights, date));
    return { date, time1, time2, noShow: false };
  });
}

/** Muted row note when both filled boxes fall on the same side of 17:00. */
function sameSlotNote(time1: string, time2: string): string | null {
  const a = normalizeTime(time1);
  const b = normalizeTime(time2);
  if (!a || !b) return null;
  const aMat = isMatineeTime(a);
  const bMat = isMatineeTime(b);
  if (aMat && bMat) return "Two afternoon times";
  if (!aMat && !bMat) return "Two evening times";
  return null;
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

export function TourTimesStopCard({
  stop,
  calendarMonth,
}: {
  stop: TourTimesNeedStop;
  /**
   * Show page only: the YYYY-MM its calendar is showing. After a save the page
   * stays on this stop, and on this month unless only another month's days changed.
   */
  calendarMonth?: string;
}) {
  const router = useRouter();
  const [days, setDays] = useState<DayDraft[]>(() => buildInitialDays(stop));
  // The server sent different curtains for this stop (a save, or Remove / Restore
  // on the calendar underneath): show those, never stale boxes that Save would write back.
  const dataKey = useMemo(() => stopDataKey(stop), [stop]);
  const [loadedKey, setLoadedKey] = useState(dataKey);
  if (loadedKey !== dataKey) {
    setLoadedKey(dataKey);
    setDays(buildInitialDays(stop));
  }
  const overfull = useMemo(() => overfullDays(stop.nights), [stop.nights]);
  const blockedReason = useMemo(() => {
    const first = [...overfull.keys()].sort()[0];
    if (!first) return null;
    const others = overfull.size - 1;
    const also =
      others > 0 ? ` (and ${others} more ${others === 1 ? "day" : "days"})` : "";
    return `Save is off for this stop: ${formatRunDayLabel(first)} has ${overfull.get(first)} curtains${also}. The boxes hold two a day, so saving here would drop one.`;
  }, [overfull]);
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
    // Never silently drop a curtain the two boxes cannot show.
    if (blockedReason) {
      setError(blockedReason);
      return;
    }
    const { stamps, error: checkError } = collectStamps(days);
    if (checkError) {
      setError(checkError);
      return;
    }

    // Saving replaces every curtain at this stop, so anything stored that is not
    // in the boxes now is deleted. A changed time removes the old one. Ask first.
    const keeping = new Set(stamps.map(stampKey));
    const stored = new Map(stop.nights.map((night) => [stampKey(night), night]));
    const removed = [...stored.keys()]
      .filter((key) => !keeping.has(key))
      .sort()
      .map((key) => stored.get(key)!);
    if (removed.length > 0) {
      const listed = removed.slice(0, CONFIRM_LIST_MAX).map(stampLabel).join(", ");
      const more =
        removed.length > CONFIRM_LIST_MAX
          ? `, and ${removed.length - CONFIRM_LIST_MAX} more`
          : "";
      const noun = removed.length === 1 ? "curtain" : "curtains";
      const question = `This will remove ${removed.length} ${noun}: ${listed}${more}. Save anyway?`;
      if (!window.confirm(question)) return;
    }
    const changedDates = [
      ...removed,
      ...stamps.filter((stamp) => !stored.has(stampKey(stamp))),
    ]
      .map((stamp) => stamp.date)
      .sort();

    setError(null);
    startTransition(async () => {
      const result = await saveTourStopTimesAction({
        runId: stop.runId,
        productionId: stop.productionId,
        datesTimes: stamps,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setSaved(true);
      if (!calendarMonth) {
        router.refresh();
        return;
      }
      // Show page: keep this stop selected and the calendar on a month where the
      // change is visible. Also drops any old ?ok= banner from the address.
      const inView =
        changedDates.length === 0 ||
        changedDates.some((date) => date.startsWith(calendarMonth));
      const month = inView ? calendarMonth : changedDates[0].slice(0, 7);
      const href = `/admin/shows/${stop.productionId}?month=${month}&venue=${encodeURIComponent(stop.runId)}`;
      if (`${window.location.pathname}${window.location.search}` === href) {
        router.refresh();
      } else {
        router.replace(href, { scroll: false });
      }
    });
  }

  const venueLine = [stop.venueName, stop.city].filter(Boolean).join(", ");
  const zoneLabel = formatStopTimeZoneLabel(stop.timeZone);

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
          {stop.reason ? <p className="admin-reason">{stop.reason}</p> : null}
          {zoneLabel ? (
            <p className="admin-tour-times-zone">{zoneLabel}</p>
          ) : null}
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

      <div className="admin-tour-times-day head" aria-hidden="true">
        <span />
        <span className="admin-tour-times-compare-label">Matinee</span>
        <span className="admin-tour-times-compare-label">Evening</span>
        <span />
      </div>

      <ul ref={listRef} className="admin-tour-times-days">
        {days.map((day, index) => {
          const tooMany = overfull.get(day.date);
          const note = tooMany
            ? `${tooMany} curtains on this day — can't edit here`
            : day.noShow
              ? null
              : sameSlotNote(day.time1, day.time2);
          return (
            <li key={day.date}>
              <div className="admin-tour-times-day">
                <span className="admin-tour-times-day-label">{formatRunDayLabel(day.date)}</span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder={hint1}
                  aria-label={`${formatRunDayLabel(day.date)} matinee`}
                  data-time-col="1"
                  className="admin-tour-times-time"
                  value={day.time1}
                  disabled={day.noShow || pending || Boolean(tooMany)}
                  onChange={(event) => changeTime(day.date, 1, event.target.value)}
                  onKeyDown={(event) => onTimeKeyDown(event, index, 1)}
                />
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder={hint2}
                  aria-label={`${formatRunDayLabel(day.date)} evening`}
                  data-time-col="2"
                  className="admin-tour-times-time"
                  value={day.time2}
                  disabled={day.noShow || pending || Boolean(tooMany)}
                  onChange={(event) => changeTime(day.date, 2, event.target.value)}
                  onKeyDown={(event) => onTimeKeyDown(event, index, 2)}
                />
                <label className="admin-tour-times-noshow">
                  <input
                    type="checkbox"
                    checked={day.noShow}
                    disabled={pending || Boolean(tooMany)}
                    onChange={(event) =>
                      updateDay(day.date, {
                        noShow: event.target.checked,
                        ...(event.target.checked ? { time1: "", time2: "" } : {}),
                      })
                    }
                  />
                  No show
                </label>
              </div>
              {note ? (
                <p className="admin-muted" style={{ margin: "2px 0 0", fontSize: 12 }}>
                  {note}
                </p>
              ) : null}
            </li>
          );
        })}
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
          disabled={pending || Boolean(blockedReason)}
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
        <p className="admin-tour-times-save-note">
          {blockedReason ??
            "Saving replaces all times for this stop. Empty boxes and No show remove curtains."}
        </p>
      </div>
    </article>
  );
}
