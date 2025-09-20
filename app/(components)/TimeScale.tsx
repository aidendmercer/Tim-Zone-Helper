"use client";

import { hourRangeArray, formatHourLabel } from "../(lib)/time";
import type { TimeFormat } from "../(lib)/time";

export default function TimeScale({ pxPerHour, timeFormat }: { pxPerHour: number; timeFormat: TimeFormat }) {
  return (
    <div className="relative w-full">
      <div
        className="timeline-grid h-8 rounded-lg border border-white/10 bg-dayperiod-day/20"
        style={{ backgroundSize: `${pxPerHour}px 100%` }}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 flex">
        {hourRangeArray().slice(0, 24).map((h) => (
          <div key={h} className="flex-1 relative">
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 hour-labels">
              {formatHourLabel(h, timeFormat)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
