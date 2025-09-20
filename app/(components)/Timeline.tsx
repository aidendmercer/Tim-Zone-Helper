"use client";

import { useEffect, useMemo, useState } from "react";
import { DateTime } from "luxon";
import CityRow from "./CityRow";
import type { City, Preferences } from "../(lib)/cities";
import { roundToNearestHour } from "../(lib)/time";
import Toggle from "./Toggle";
import { Plus, Target, Calendar, X, List } from "@phosphor-icons/react";
import { useBreakpoint } from "../(lib)/useBreakpoint";

type Props = {
  cities: City[];
  setCities: (cs: City[]) => void;
  prefs: Preferences;
  setPrefs: (p: Preferences) => void;
  referenceCity: City; // user's location
  onOpenAddCity: () => void;
  onOpenSidebarMobile?: () => void;
};

export default function Timeline({
  cities, setCities, prefs, setPrefs, referenceCity, onOpenAddCity, onOpenSidebarMobile
}: Props) {
  const bp = useBreakpoint();

  // Selected date (for meeting planning); default = today in user's zone
  const [selectedDateISO, setSelectedDateISO] = useState<string>(() =>
    DateTime.now().setZone(referenceCity.tz).toISODate()!
  );

  // Selected time instant (in user's zone)
  const [selectedTime, setSelectedTime] = useState<DateTime>(() =>
    DateTime.now().setZone(referenceCity.tz)
  );
  const [now, setNow] = useState<DateTime>(() =>
    DateTime.now().setZone(referenceCity.tz)
  );

  // Keep "now" moving
  useEffect(() => {
    const id = setInterval(() => setNow(DateTime.now().setZone(referenceCity.tz)), 30_000);
    return () => clearInterval(id);
  }, [referenceCity.tz]);

  // When user's zone or selected date changes, anchor timelines to that day start
  const referenceDayStart = useMemo(() => {
    const [y, m, d] = selectedDateISO.split("-").map((n) => parseInt(n, 10));
    const base = DateTime.fromObject({
      year: y,
      month: m,
      day: d,
      hour: 0,
      minute: 0
    })
      .setZone(referenceCity.tz)
      .startOf("day");
    return base;
  }, [selectedDateISO, referenceCity.tz]);

  // Adjust selectedTime to live on the chosen date (preserve hour component)
  useEffect(() => {
    setSelectedTime((prev) => {
      const hour = prev.setZone(referenceCity.tz).hour;
      return referenceDayStart.plus({ hours: hour });
    });
  }, [referenceDayStart, referenceCity.tz]);

  // Responsive hours width / labels
  const PX_PER_HOUR = bp === "mobile" ? 28 : bp === "tablet" ? 36 : 44;

  // Current-time pointer position in reference scale
  const nowHour = useMemo(() => {
    const diff = now.diff(referenceDayStart, "hours").hours;
    return Math.max(0, Math.min(24, diff));
  }, [now, referenceDayStart]);

  function jumpToNow() {
    const n = DateTime.now().setZone(referenceCity.tz);
    setSelectedDateISO(n.toISODate()!);
    setSelectedTime(n);
  }

  // Drag on a row: updates shared selectedTime (snap after small delay)
  function handleDragToHour(h: number) {
    const t = referenceDayStart.plus({ hours: h });
    setSelectedTime(t);
    // Snap after tiny delay for smoothness
    window.clearTimeout((handleDragToHour as any)._snap);
    (handleDragToHour as any)._snap = window.setTimeout(() => {
      setSelectedTime((prev) => roundToNearestHour(prev));
    }, 120);
  }

  const isMobile = bp === "mobile";

  return (
    <div className="flex-1 min-w-0 space-y-4">
      {/* Controls bar */}
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
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition focus-ring"
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
          {/* Calendar (date selector) */}
          <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition focus-ring cursor-pointer">
            <Calendar size={16} />
            <span className="text-sm">Date</span>
            <input
              type="date"
              className="sr-only"
              value={selectedDateISO}
              onChange={(e) => setSelectedDateISO(e.target.value)}
              aria-label="Select date"
            />
          </label>
        </div>

        {/* Right side intentionally empty per facelift spec */}
        <div />
      </div>

      {/* City timelines grouped tightly */}
      <div className="row-wrap">
        {cities.map((c) => (
          <div key={c.id} className="row p-3 sm:p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="font-medium text-sm sm:text-base">{c.label}</div>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                {/* Single X remove button */}
                <button
                  className="text-slate-500 hover:text-black focus-ring p-2 rounded border border-slate-200 bg-white"
                  onClick={() => setCities(cities.filter((x) => x.id !== c.id))}
                  title="Remove city"
                  aria-label={`Remove ${c.label}`}
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Tight timeline (no gaps), draggable per-row */}
            <div className="relative -mx-2 sm:mx-0 overflow-x-auto">
              <div
                className="min-w-[calc(24*var(--pxh,40px))] px-2 sm:px-0"
                style={{ ["--pxh" as any]: `${PX_PER_HOUR}px` }}
              >
                <CityRow
                  city={c}
                  referenceDayStart={referenceDayStart}
                  selectedTime={selectedTime}
                  pxPerHour={PX_PER_HOUR}
                  onDragToHour={handleDragToHour}
                  nowHour={nowHour}
                  showHourLabelsStep={isMobile ? 2 : 1}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected time summary */}
      <div className="panel p-3 sm:p-4">
        <div className="mb-3 text-xs sm:text-sm text-slate-600">
          Selected:{" "}
          <span className="font-medium">
            {selectedTime
              .toFormat(prefs.timeFormat === "12h" ? "EEE d LLL yyyy • h:mm a" : "EEE d LLL yyyy • HH:mm")}
          </span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {cities.map((c) => {
            const local = selectedTime.setZone(c.tz);
            return (
              <div key={c.id} className="border border-slate-200 rounded-lg p-2">
                <div className="font-medium">{c.label}</div>
                <div className="text-sm">{local.toFormat("EEE d LLL yyyy")}</div>
                <div className="text-base font-semibold">
                  {local.toFormat(prefs.timeFormat === "12h" ? "h:mm a" : "HH:mm")}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
