"use client";

import { DateTime } from "luxon";
import { dayPeriodColor, computeDateBreakHour } from "../(lib)/time";
import type { City } from "../(lib)/cities";

function Segment({
  startHour,
  endHour,
  pxPerHour,
  period
}: {
  startHour: number;
  endHour: number;
  pxPerHour: number;
  period: "night" | "dawn" | "day" | "dusk";
}) {
  const left = startHour * pxPerHour;
  const width = (endHour - startHour) * pxPerHour;
  const map: Record<typeof period, string> = {
    night: "bg-slate-200",
    dawn: "bg-blue-50",
    day: "bg-slate-100",
    dusk: "bg-blue-50"
  } as const;
  return (
    <div
      className={`absolute top-0 h-full ${map[period]} border-y border-white/0`}
      style={{ left, width }}
    />
  );
}

export default function CityRow({
  city,
  referenceDayStart,
  selectedTime,
  pxPerHour,
  onDragToHour,
  nowHour,
  showHourLabelsStep = 2
}: {
  city: City;
  referenceDayStart: DateTime; // scale anchor (user's zone)
  selectedTime: DateTime; // global selected time (in reference zone)
  pxPerHour: number;
  onDragToHour: (h: number) => void;
  nowHour: number;
  showHourLabelsStep?: 1 | 2 | 3 | 4;
}) {
  const segments = Array.from({ length: 24 }).map((_, i) => {
    const localHour = referenceDayStart.plus({ hours: i }).setZone(city.tz).hour;
    return { start: i, end: i + 1, period: dayPeriodColor(localHour) as ReturnType<typeof dayPeriodColor> };
  });

  const dateBreakHour = computeDateBreakHour(referenceDayStart, city);

  // Pointer positions
  const selectedHour = Math.max(0, Math.min(24, selectedTime.diff(referenceDayStart, "hours").hours));

  // Drag handlers (per row)
  function onPointerDown(e: React.PointerEvent) {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const h = Math.max(0, Math.min(24, x / pxPerHour));
    onDragToHour(h);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!(e.currentTarget as HTMLElement).hasPointerCapture?.(e.pointerId)) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const h = Math.max(0, Math.min(24, x / pxPerHour));
    onDragToHour(h);
  }
  function onPointerUp() {
    // snapping handled in parent (Timeline)
  }

  return (
    <div className="relative">
      <div
        className="relative h-12 rounded-none overflow-hidden cursor-ew-resize"
        role="img"
        aria-label={`${city.label} 24-hour timeline`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        {/* grid */}
        <div
          className="absolute inset-0 timeline-grid"
          style={{ backgroundSize: `${pxPerHour}px 100%` }}
          aria-hidden
        />
        {/* colored segments */}
        {segments.map((s, idx) => (
          <Segment key={idx} startHour={s.start} endHour={s.end} pxPerHour={pxPerHour} period={s.period} />
        ))}

        {/* hour labels inside the bar */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 25 }).map((_, i) =>
            i % showHourLabelsStep === 0 ? (
              <div
                key={i}
                className="absolute top-1 text-[10px] text-slate-600"
                style={{ left: i * pxPerHour + 4 }}
              >
                {DateTime.fromObject({ hour: i }).toFormat("HH")}
              </div>
            ) : null
          )}
        </div>

        {/* selected time marker */}
        <div className="pointer-events-none absolute inset-y-0" style={{ left: `${selectedHour * pxPerHour}px` }}>
          <div className="w-[2px] h-full bg-blue-600/70" />
        </div>

        {/* per-row NOW indicator (dimmed) */}
        <div className="pointer-events-none absolute inset-y-0" style={{ left: `${nowHour * pxPerHour}px` }}>
          <div className="w-px h-full bg-red-500/40" />
        </div>

        {/* date break */}
        {dateBreakHour !== null && (
          <div className="pointer-events-none absolute inset-y-0" style={{ left: `${dateBreakHour * pxPerHour}px` }}>
            <div className="w-px h-full bg-slate-400/50" />
          </div>
        )}
      </div>

      {/* compact caption: just city name and selected local time */}
      <div className="mt-1 text-xs text-slate-700 flex items-center justify-between">
        <span className="font-medium">{city.label}</span>
        <span>
          {selectedTime.setZone(city.tz).toFormat("EEE d LLL • HH:mm")}
        </span>
      </div>
    </div>
  );
}
