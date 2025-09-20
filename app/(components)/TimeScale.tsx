"use client";

import { hourRangeArray, formatHourLabel } from "../(lib)/time";
import type { TimeFormat } from "../(lib)/time";

export default function TimeScale({
  pxPerHour,
  timeFormat,
  labelStep = 1
}: {
  pxPerHour: number;
  timeFormat: TimeFormat;
  /** show a label every N hours (mobile: 2) */
  labelStep?: 1 | 2 | 3 | 4;
}) {
  return (
    <div className="relative w-full">
      <div
        className="timeline-grid h-8 rounded-lg border border-slate-200 bg-white"
        style={{ backgroundSize: `${pxPerHour}px 100%` }}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 flex">
        {hourRangeArray().slice(0, 24).map((h) => (
          <div key={h} className="flex-1 relative">
            {h % labelStep === 0 && (
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 hour-labels">
                {formatHourLabel(h, timeFormat)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
