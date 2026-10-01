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
