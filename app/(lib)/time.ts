import { DateTime, Duration, Interval } from "luxon";
import type { City } from "./cities";

export type TimeFormat = "12h" | "24h";

export function formatTime(dt: DateTime, tf: TimeFormat) {
  return dt.toFormat(tf === "12h" ? "h:mm a" : "HH:mm");
}

export function formatHourLabel(hour: number, tf: TimeFormat) {
  const dt = DateTime.fromObject({ hour }).set({ minute: 0 });
  return dt.toFormat(tf === "12h" ? "ha" : "HH");
}

export function countryCodeToFlagEmoji(cc: string) {
  // A-Z to regional indicator symbols
  return cc
    .toUpperCase()
    .split("")
    .map((c) => String.fromCodePoint(127397 + c.charCodeAt(0)))
    .join("");
}

export function dayPeriodColor(hour: number): "night" | "dawn" | "day" | "dusk" {
  if (hour >= 6 && hour < 8) return "dawn";
  if (hour >= 8 && hour < 18) return "day";
  if (hour >= 18 && hour < 20) return "dusk";
  return "night";
}

export function getReferenceDayStart(referenceTz: string, base?: Date) {
  const now = base ? DateTime.fromJSDate(base) : DateTime.now();
  return now.setZone(referenceTz).startOf("day");
}

export function roundToNearestHour(dt: DateTime) {
  const plus30 = dt.plus({ minutes: 30 });
  return plus30.startOf("hour");
}

export function computeDateBreakHour(referenceDayStart: DateTime, city: City): number | null {
  // Scan each hour; note when local date changes across h -> h+1
  let prevLocalDate = referenceDayStart.setZone(city.tz).toISODate();
  for (let h = 1; h <= 24; h++) {
    const t = referenceDayStart.plus({ hours: h }).setZone(city.tz);
    const d = t.toISODate();
    if (d !== prevLocalDate) {
      return h;
    }
    prevLocalDate = d;
  }
  return null;
}

export function localDateRelation(reference: DateTime, city: City) {
  const refLocal = reference.setZone(city.tz);

  // Compare by ISO date strings (YYYY-MM-DD). These compare lexicographically.
  const refDateStr = reference.startOf("day").toISODate();
  const localDateStr = refLocal.startOf("day").toISODate();

  if (localDateStr === refDateStr) return "same";
  if (localDateStr && refDateStr && localDateStr > refDateStr) return "next";
  return "prev";
}

export function hourRangeArray() {
  return Array.from({ length: 25 }).map((_, i) => i); // 0..24
}

export function pxFromHour(hour: number, pxPerHour: number) {
  return Math.max(0, Math.min(24 * pxPerHour, hour * pxPerHour));
}

export function hourFromClientX(clientX: number, rectLeft: number, pxPerHour: number) {
  const x = clientX - rectLeft;
  const h = x / pxPerHour;
  return Math.max(0, Math.min(24, h));
}

export function labelForDateRelation(rel: "same" | "prev" | "next") {
  if (rel === "next") return "Next day";
  if (rel === "prev") return "Previous day";
  return "Same day";
}
