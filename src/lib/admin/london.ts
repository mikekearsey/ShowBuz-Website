import { LONDON_TZ } from "./constants";

export function londonWallTimeToIso(date: string, time: string): string {
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  const noonUtc = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  const zoneName =
    new Intl.DateTimeFormat("en-GB", {
      timeZone: LONDON_TZ,
      timeZoneName: "longOffset",
    })
      .formatToParts(noonUtc)
      .find((part) => part.type === "timeZoneName")?.value ?? "GMT";
  const match = zoneName.match(/GMT([+-])(\d{2}):?(\d{2})?/);
  const sign = match?.[1] === "-" ? -1 : 1;
  const offsetMinutes = match
    ? sign * (Number(match[2]) * 60 + Number(match[3] ?? 0))
    : 0;
  const asUtc = Date.UTC(y, m - 1, d, hh, mm, 0) - offsetMinutes * 60_000;
  return new Date(asUtc).toISOString();
}

export function formatLondonDate(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: LONDON_TZ,
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

export function formatLondonTime(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: LONDON_TZ,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(new Date(iso));
}

/** "7:30pm" and "Sat 14 Nov" for the curtain remove control. */
export function formatCurtainRemoveWhen(iso: string): { time: string; date: string } {
  const date = new Date(iso);
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: LONDON_TZ,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).formatToParts(date);
  const hour = parts.find((part) => part.type === "hour")?.value ?? "";
  const minute = parts.find((part) => part.type === "minute")?.value ?? "00";
  const period = (parts.find((part) => part.type === "dayPeriod")?.value ?? "")
    .replace(/\s+/g, "")
    .toLowerCase();
  const weekday = new Intl.DateTimeFormat("en-GB", {
    timeZone: LONDON_TZ,
    weekday: "short",
  }).format(date);
  const day = new Intl.DateTimeFormat("en-GB", {
    timeZone: LONDON_TZ,
    day: "numeric",
  }).format(date);
  const month = new Intl.DateTimeFormat("en-GB", {
    timeZone: LONDON_TZ,
    month: "short",
  }).format(date);
  return {
    time: `${hour}:${minute}${period}`,
    date: `${weekday} ${day} ${month}`,
  };
}

export function londonTodayYmd(): string {
  return londonYmd(new Date().toISOString());
}

export function londonYmd(iso: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: LONDON_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(iso));
}

export function londonYearMonth(iso: string): { year: number; month: number } {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: LONDON_TZ,
    year: "numeric",
    month: "numeric",
  }).formatToParts(new Date(iso));
  const year = Number(parts.find((part) => part.type === "year")?.value);
  const month = Number(parts.find((part) => part.type === "month")?.value);
  return { year, month };
}

/** Catalog calendar day or ISO instant → dd/mm/yy (London for instants). */
export function formatAdminDate(value: string | null | undefined): string {
  if (!value) return "—";
  const trimmed = value.trim();
  const ymd = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (ymd) {
    return `${ymd[3]}/${ymd[2]}/${ymd[1].slice(2)}`;
  }
  const date = new Date(trimmed);
  if (!Number.isFinite(date.getTime())) return trimmed;
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: LONDON_TZ,
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  }).format(date);
}

/** ISO instant → dd/mm/yy, HH:mm (London). */
export function formatAdminDateTime(value: string | null | undefined): string {
  if (!value) return "—";
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return value;
  const day = formatAdminDate(value);
  const time = new Intl.DateTimeFormat("en-GB", {
    timeZone: LONDON_TZ,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(date);
  return `${day}, ${time}`;
}
