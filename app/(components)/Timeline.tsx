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
import { Plus, Target, Trash } from "@phosphor-icons/react";

const PX_PER_HOUR = 40; // 24 * 40 = 960px wide timelines

type Props = {
  cities: City[];
  setCities: (cs: City[]) => void;
  prefs: Preferences;
  setPrefs: (p: Preferences) => void;
  referenceCity: City;
  onOpenAddCity: () => void;
};

export default function Timeline({ cities, setCities, prefs, setPrefs, referenceCity, onOpenAddCity }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [selectedTime, setSelectedTime] = useState<DateTime>(() =>
    DateTime.now().setZone(referenceCity.tz)
  );
  const [now, setNow] = useState<DateTime>(() => DateTime.now().setZone(referenceCity.tz));
  const [isDragging, setIsDragging] = useState(false);

  // Keep "now" moving
  useEffect(() => {
    const id = setInterval(() => {
      setNow(DateTime.now().setZone(referenceCity.tz));
    }, 30_000);
    return () => clearInterval(id);
  }, [referenceCity.tz]);

  // When reference city changes, keep the same wall-clock time in the new zone
  useEffect(() => {
    setSelectedTime((prev) => prev.setZone(referenceCity.tz));
  }, [referenceCity.tz]);

  // Start of the reference day (used as the 0..24h scale)
  const referenceDayStart = useMemo(
    () => now.setZone(referenceCity.tz).startOf("day"),
    [now, referenceCity.tz]
  );

  // Map DateTime -> hour offsets on the 0..24 scale
  const selectedHour = useMemo(() => {
    const diff = selectedTime.diff(referenceDayStart, "hours").hours;
    return Math.max(0, Math.min(24, diff));
  }, [selectedTime, referenceDayStart]);

  const nowHour = useMemo(() => {
    const diff = now.diff(referenceDayStart, "hours").hours;
    return Math.max(0, Math.min(24, diff));
  }, [now, referenceDayStart]);

  // Drag handlers for the global timeline
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
    // Snap to nearest hour on release
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

  return (
    <div className="flex-1 min-w-0 space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Toggle
            checked={prefs.timeFormat === "24h"}
            onChange={(b) => setPrefs({ ...prefs, timeFormat: b ? "24h" : "12h" })}
            labels={["12h", "24h"]}
            ariaLabel="Toggle 12/24 hour format"
          />
          <button
            onClick={onOpenAddCity}
            className="ml-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition focus-ring"
            aria-label="Add city"
          >
            <Plus size={16} /> Add City
          </button>
          <button
            onClick={jumpToNow}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition focus-ring"
            aria-label="Jump to now"
          >
            <Target size={16} /> Now
          </button>
        </div>

        <div className="text-sm text-slate-300">
          Reference:&nbsp;
          <span className="font-medium">
            {countryCodeToFlagEmoji(referenceCity.countryCode)} {referenceCity.label}
          </span>
        </div>
      </div>

      {/* Global 24h scale with draggable marker */}
      <div className="space-y-2">
        <div className="text-sm text-slate-300">Global 24h timeline</div>
        <div
          className="relative select-none"
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
          <TimeScale pxPerHour={PX_PER_HOUR} timeFormat={prefs.timeFormat} />
          <Marker hour={selectedHour} pxPerHour={PX_PER_HOUR} />
          <NowIndicator hour={nowHour} pxPerHour={PX_PER_HOUR} />
        </div>
      </div>

      {/* City rows */}
      <div className="space-y-6">
        {cities.map((c) => (
          <div key={c.id} className="panel p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="text-lg leading-none">{countryCodeToFlagEmoji(c.countryCode)}</div>
                <div className="font-medium">{c.label}</div>
                <div className="text-xs text-slate-400">{c.tz}</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="text-xs text-slate-300 hover:text-white focus-ring px-2 py-1 rounded border border-white/10 bg-white/5"
                  onClick={() => setPrefs({ ...prefs, referenceCityId: c.id })}
                  disabled={c.id === referenceCity.id}
                  title={c.id === referenceCity.id ? "Reference city" : "Make reference"}
                >
                  Make reference
                </button>
                <button
                  className="text-xs text-slate-300 hover:text-white focus-ring px-2 py-1 rounded border border-white/10 bg-white/5"
                  onClick={() => {
                    if (confirm(`Remove ${c.label}?`)) {
                      setCities(cities.filter((x) => x.id !== c.id));
                    }
                  }}
                  title="Remove city"
                >
                  <Trash size={16} className="inline-block mr-1" />
                  Remove
                </button>
              </div>
            </div>

            <CityRow
              city={c}
              referenceDayStart={referenceDayStart}
              selectedTime={selectedTime}
              timeFormat={prefs.timeFormat}
              pxPerHour={PX_PER_HOUR}
            />
          </div>
        ))}
      </div>

      {/* Selected time table */}
      <div className="panel p-4">
        <div className="mb-3 text-sm text-slate-300">
          Selected Time:{" "}
          <span className="font-medium">
            {selectedTime.toFormat(prefs.timeFormat === "12h" ? "EEE d LLL yyyy • h:mm a" : "EEE d LLL yyyy • HH:mm")}{" "}
            ({referenceCity.label})
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-300 border-b border-white/10">
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
                  <tr key={c.id} className="border-b border-white/5">
                    <td className="py-2 pr-4">
                      <span className="mr-2">{countryCodeToFlagEmoji(c.countryCode)}</span>
                      {c.label}
                    </td>
                    <td className="py-2 pr-4">{local.toFormat("EEE d LLL yyyy")}</td>
                    <td className="py-2 pr-4">
                      {local.toFormat(prefs.timeFormat === "12h" ? "h:mm a" : "HH:mm")}
                    </td>
                    <td className="py-2 pr-4 text-slate-400">{c.tz}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer tip */}
      <div className="text-xs text-slate-500">
        Tip: drag anywhere on the global timeline; release to snap to the nearest hour.
      </div>
    </div>
  );
}
