"use client";

import { pxFromHour } from "../(lib)/time";

export default function Marker({
  hour,
  pxPerHour,
  color = "bg-marker-selected"
}: {
  hour: number;
  pxPerHour: number;
  color?: string;
}) {
  const x = pxFromHour(hour, pxPerHour);
  return (
    <div
      className={`pointer-events-none absolute top-0 bottom-0 ${color} w-[2px]`}
      style={{ left: `${x}px`, boxShadow: "0 0 0 1px rgba(0,0,0,0.2)" }}
      aria-hidden
    />
  );
}
