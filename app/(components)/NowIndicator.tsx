"use client";

import { pxFromHour } from "../(lib)/time";

export default function NowIndicator({
  hour,
  pxPerHour
}: {
  hour: number;
  pxPerHour: number;
}) {
  const x = pxFromHour(hour, pxPerHour);
  return (
    <div className="pointer-events-none absolute inset-y-0" style={{ left: `${x}px` }}>
      <div className="w-px h-full bg-marker-now/50" />
      <div className="absolute -top-5 -translate-x-1/2 text-[10px] text-marker-now/70">NOW</div>
    </div>
  );
}
