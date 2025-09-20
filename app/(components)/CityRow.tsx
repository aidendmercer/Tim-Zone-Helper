"use client";

import { DateTime } from "luxon";
import { dayPeriodColor, computeDateBreakHour, labelForDateRelation, localDateRelation } from "../(lib)/time";
import type { City } from "../(lib)/cities";

function Segment({ startHour, endHour, pxPerHour, period }: { startHour: number; endHour: number; pxPerHour: number; period: "night"|"dawn"|"day"|"dusk" }) {
  const left = startHour * pxPerHour;
  const width = (endHour - startHour) * pxPerHour;
  const map: Record<typeof period, string> = {
    night: "bg-dayperiod-night/60",
    dawn: "bg-dayperiod-dawn/60",
    day: "bg-dayperiod-day/60",
    dusk: "bg-dayperiod-dusk/60"
  } as const;
  return <div className={`absolute top-0 h-full ${map[period]} border-y border-white/5`} style={{ left, width }} />;
}

export default function CityRow({
  city,
  referenceDayStart,
  selectedTime,
  timeFormat,
  pxPerHour
}: {
  city: City;
  referenceDayStart: DateTime;
  selectedTime: DateTime; // in reference tz
  timeFormat: "12h" | "24h";
  pxPerHour: number;
}) {
  // Build 24 hour segments colored by day-period in the CITY's local hours
  const segments = Array.from({ length: 24 }).map((_, i) => {
    const localHour = referenceDayStart.plus({ hours: i }).setZone(city.tz).hour;
    return { start: i, end: i + 1, period: dayPeriodColor(localHour) as ReturnType<typeof dayPeriodColor> };
  });

  const dateBreakHour = computeDateBreakHour(referenceDayStart, city); // in reference scale
  const relation = localDateRelation(selectedTime, city);
  const selectedLocal = selectedTime.setZone(city.tz);

  return (
    <div className="relative">
      <div
        className="relative h-10 rounded-md border border-white/10 overflow-hidden"
        role="img"
        aria-label={`${city.label} 24-hour timeline`}
      >
        {/* grid lines */}
        <div
          className="absolute inset-0 timeline-grid"
          style={{ backgroundSize: `${pxPerHour}px 100%` }}
          aria-hidden
        />
        {/* colored segments */}
        {segments.map((s, idx) => (
          <Segment key={idx} startHour={s.start} endHour={s.end} pxPerHour={pxPerHour} period={s.period} />
        ))}

        {/* Date break line and pill if applicable */}
        {dateBreakHour !== null && (
          <div className="absolute inset-y-0" style={{ left: `${dateBreakHour * pxPerHour}px` }}>
            <div className="w-px h-full bg-white/20" />
          </div>
        )}
      </div>

      {/* Date relation pill */}
      {relation !== "same" && (
        <div className="mt-1">
          <span className="date-pill">{labelForDateRelation(relation)}</span>
        </div>
      )}

      {/* Selected time label */}
      <div className="mt-1 text-xs text-slate-300">
        Local: {selectedLocal.toFormat(timeFormat === "12h" ? "EEE d LLL • h:mm a" : "EEE d LLL • HH:mm")}
      </div>
    </div>
  );
}
