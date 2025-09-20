"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { DateTime } from "luxon";
import Marker from "./Marker";
import NowIndicator from "./NowIndicator";
import CityRow from "./CityRow";
import TimeScale from "./TimeScale";
import type { City, Preferences } from "../(lib)/cities";
import { countryCodeToFlagEmoji, hourFromClientX, roundToNearestHour } from "../(lib)/time";
import Toggle from "./Toggle";
import { Plus, Target, Trash, List } from "@phosphor-icons/react";
import { useBreakpoint } from "../(lib)/useBreakpoint";

type Props = {
  cities: City[];
  setCities: (cs: City[]) => void;
  prefs: Preferences;
  setPrefs: (p: Preferences) => void;
  referenceCity: City;
  onOpenAddCity: () => void;
  onOpenSidebarMobile?: () => void;
};

export default function Timeline({
  cities, setCities, prefs, setPrefs, referenceCity, onOpenAddCity, onOpenSidebarMobile
}: Props) {
  const bp = useBreakpoint();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [selectedTime, setSelectedTime] = useState<DateTime>(() => DateTime.now().setZone(referenceCity.tz));
  const [now, setNow] = useState<DateTime>(() => DateTime.now().setZone(referenceCity.tz));
  const [isDragging, setIsDragging] = useState(false);

  // Responsive hours width
  const PX_PER_HOUR = bp === "mobile" ? 28 : bp === "tablet" ? 36 : 44;
  const labelStep = bp === "mobile" ? 2 : 1;

  // Keep "now" moving
  useEffect(() => {
    const id = setInterval(() => setNow(DateTime.now().setZone(referenceCity.tz)), 30_000);
    return () => clearInterval(id);
  }, [referenceCity.tz]);

  // Keep wall-clock when reference changes
  useEffect(() => {
    setSelectedTime((prev) => prev.setZone(referenceCity.tz));
  }, [referenceCity.tz]);

  // Start of reference day
  const referenceDayStart = useMemo(
    () => now.setZone(referenceCity.tz).startOf("day"),
    [now, referenceCity.tz]
  );

  // Position helpers
  const selectedHour = useMemo(() => {
    const diff = selectedTime.diff(referenceDayStart, "hours").hours;
    return Math.max(0, Math.min(24, diff));
  }, [selectedTime, referenceDayStart]);

  const nowHour = useMemo(() => {
    const diff = now.diff(referenceDayStart, "hours").hours;
    return Math.max(0, Math.min(24, diff));
  }, [now, referenceDayStart]);

  // Drag handlers
  function onPointerDown(e: React.PointerEvent) {
    setIsDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    updateFromClientX(e.clientX);
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!isDragging) return;
    updateFromClientX(e.clientX);
  }
  function onPointerUp() {
    setIsDragging(false);
    setSelectedTime((t) => roundToNearestHour(t));
  }
  function updateFromClientX(clientX: number) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const h = hourFromClientX(clientX, rect.left, PX_PER_HOUR);
    const t = referenceDayStart.plus({ hours: h });
    setSelectedTime(t);
  }
  function jumpToNow() {
    const n = DateTime.now().setZone(referenceCity.tz);
    setSelectedTime(n);
  }

  const isMobile = bp === "mobile";

  return (
    <div className="flex-1 min-w-0 space-y-5">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isMobile && (
            <button
              onClick={onOpenSidebarMobile}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 focus-ring"
              aria-label="Open cities"
              title="Open cities"
            >
              <List size={16} /> Cities
            </button>
          )}
          <Toggle
            checked={prefs.timeFormat === "24h"}
            onChange={(b) => setPrefs({ ...prefs, timeFormat: b ? "24h" : "12h" })}
            labels={["12h", "24h"]}
            ariaLabel="Toggle 12/24 hour format"
          />
          <button
            onClick={onOpenAddCity}
            className="ml-1 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition focus-ring"
            aria-label="Add city"
          >
            <Plus size={16} /> Add City
          </button>
          <button
            onClick={jumpToNow}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition focus-ring"
            aria-label="Jump to now"
          >
            <Target size={16} /> Now
          </button>
        </div>

        <div className="text-xs sm:text-sm text-slate-600">
          Reference:&nbsp;
          <span className="font-medium">
            {countryCodeToFlagEmoji(referenceCity.countryCode)} {referenceCity.label}
          </span>
        </div>
      </div>

      {/* Global scale (horizontally scrollable on narrow screens) */}
      <div className="space-y-1">
        <div className="text-xs sm:text-sm text-slate-600">Global 24h timeline</div>
        <div className="relative -mx-2 sm:mx-0 overflow-x-auto">
          <div
            className="relative select-none min-w-[calc(24*var(--pxh,40px))] px-2 sm:px-0"
            style={{ ["--pxh" as any]: `${PX_PER_HOUR}px` }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            ref={containerRef}
            role="slider"
            aria-valuemin={0}
            aria-valuemax={24}
            aria-valuenow={selectedHour}
            aria-label="Selected hour marker"
            tabIndex={0}
          >
            <TimeScale pxPerHour={PX_PER_HOUR} timeFormat={prefs.timeFormat} labelStep={labelStep} />
            <Marker hour={selectedHour} pxPerHour={PX_PER_HOUR} />
            <NowIndicator hour={nowHour} pxPerHour={PX_PER_HOUR} />
          </div>
        </div>
      </div>

      {/* City rows */}
      <div className="space-y-4">
        {cities.map((c) => (
          <div key={c.id} className="panel p-3 sm:p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="text-base sm:text-lg leading-none">{countryCodeToFlagEmoji(c.countryCode)}</div>
                <div className="font-medium text-sm sm:text-base">{c.label}</div>
                <div className="text-[10px] sm:text-xs text-slate-500">{c.tz}</div>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  className="text-[11px] sm:text-xs text-slate-700 hover:text-black focus-ring px-2 py-1 rounded border border-slate-200 bg-white"
                  onClick={() => setPrefs({ ...prefs, referenceCityId: c.id })}
                  disabled={c.id === referenceCity.id}
                  title={c.id === referenceCity.id ? "Reference city" : "Make reference"}
                >
                  Make ref
                </button>
                <button
                  className="text-[11px] sm:text-xs text-slate-700 hover:text-black focus-ring px-2 py-1 rounded border border-slate-200 bg-white"
                  onClick={() => setCities(cities.filter((x) => x.id !== c.id))}
                  title="Remove city"
                >
                  <Trash size={14} className="inline-block mr-1" />
                  Remove
                </button>
              </div>
            </div>

            <div className="relative -mx-2 sm:mx-0 overflow-x-auto">
              <div className="min-w-[calc(24*var(--pxh,40px))] px-2 sm:px-0" style={{ ["--pxh" as any]: `${PX_PER_HOUR}px` }}>
                <CityRow
                  city={c}
                  referenceDayStart={referenceDayStart}
                  selectedTime={selectedTime}
                  timeFormat={prefs.timeFormat}
                  pxPerHour={PX_PER_HOUR}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected time view: cards on mobile, table on larger screens */}
      <div className="panel p-3 sm:p-4">
        <div className="mb-3 text-xs sm:text-sm text-slate-600">
          Selected Time:{" "}
          <span className="font-medium">
            {selectedTime.toFormat(prefs.timeFormat === "12h" ? "EEE d LLL yyyy • h:mm a" : "EEE d LLL yyyy • HH:mm")}{" "}
            ({referenceCity.label})
          </span>
        </div>

        {/* Mobile cards */}
        {isMobile ? (
          <div className="space-y-2">
            {cities.map((c) => {
              const local = selectedTime.setZone(c.tz);
              return (
                <div key={c.id} className="border border-slate-200 rounded-lg p-2">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">
                      <span className="mr-2">{countryCodeToFlagEmoji(c.countryCode)}</span>
                      {c.label}
                    </div>
                    <div className="text-xs text-slate-500">{c.tz}</div>
                  </div>
                  <div className="mt-1 text-sm">{local.toFormat("EEE d LLL yyyy")}</div>
                  <div className="text-base font-semibold">
                    {local.toFormat(prefs.timeFormat === "12h" ? "h:mm a" : "HH:mm")}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // Desktop table
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-600 border-b border-slate-200">
                  <th className="py-2 pr-4">City</th>
                  <th className="py-2 pr-4">Local Date</th>
                  <th className="py-2 pr-4">Local Time</th>
                  <th className="py-2 pr-4">TZ</th>
                </tr>
              </thead>
              <tbody>
                {cities.map((c) => {
                  const local = selectedTime.setZone(c.tz);
                  return (
                    <tr key={c.id} className="border-b border-slate-100">
                      <td className="py-2 pr-4">
                        <span className="mr-2">{countryCodeToFlagEmoji(c.countryCode)}</span>
                        {c.label}
                      </td>
                      <td className="py-2 pr-4">{local.toFormat("EEE d LLL yyyy")}</td>
                      <td className="py-2 pr-4">
                        {local.toFormat(prefs.timeFormat === "12h" ? "h:mm a" : "HH:mm")}
                      </td>
                      <td className="py-2 pr-4 text-slate-500">{c.tz}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
