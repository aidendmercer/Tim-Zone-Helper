"use client";

import { useMemo, useState } from "react";
import type { City } from "../(lib)/cities";
import { countryCodeToFlagEmoji } from "../(lib)/time";
import { DateTime } from "luxon";
import { PlusCircle, X } from "@phosphor-icons/react";

export default function Sidebar({
  cities,
  onRemove,
  onMakeReference,
  referenceCityId,
  onOpenAddCity,
  mobileOpen = false,
  onMobileClose
}: {
  cities: City[];
  onRemove: (id: string) => void;
  onMakeReference: (id: string) => void;
  referenceCityId: string;
  onOpenAddCity: () => void;
  /** Mobile drawer controls */
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s
      ? cities.filter((c) => c.label.toLowerCase().includes(s) || c.tz.toLowerCase().includes(s))
      : cities;
  }, [q, cities]);

  // Desktop sidebar
  const content = (
    <div className="w-[320px] shrink-0 space-y-4 p-3">
      <div className="panel p-3">
        <div className="flex items-center gap-2">
          <input
            className="w-full bg-transparent border border-slate-200 rounded-md px-3 py-2 text-sm focus-ring"
            placeholder="Search cities…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Search cities"
          />
          <button
            onClick={onOpenAddCity}
            className="px-2 py-2 rounded-md bg-white border border-slate-200 hover:bg-slate-50 focus-ring"
            title="Add city"
            aria-label="Add city"
          >
            <PlusCircle size={18} />
          </button>
        </div>
      </div>

      <div className="panel p-3">
        <div className="text-sm text-slate-600 mb-2">Your Cities</div>
        <ul className="space-y-2">
          {filtered.map((c) => {
            const local = DateTime.now().setZone(c.tz);
            return (
              <li key={c.id} className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-medium truncate">
                    <span className="mr-2">{countryCodeToFlagEmoji(c.countryCode)}</span>
                    {c.label}
                    {c.id === referenceCityId && <span className="ml-2 text-[10px] text-blue-600">(ref)</span>}
                  </div>
                  <div className="text-xs text-slate-500 truncate">{c.tz}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm">{local.toFormat("HH:mm")}</div>
                  <div className="text-xs text-slate-500">{local.toFormat("EEE d LLL")}</div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="panel p-3 text-xs text-slate-500">
        Tap “Add city” for more locations. Tap a row in main view to make it reference.
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden md:block">{content}</aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/30" onClick={onMobileClose} />
          <div className="absolute left-0 top-0 bottom-0 w-[85vw] max-w-[360px] bg-white shadow-xl">
            <div className="flex items-center justify-between p-3 border-b">
              <div className="font-medium">Cities</div>
              <button
                onClick={onMobileClose}
                className="p-2 rounded hover:bg-slate-100 focus-ring"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            <div className="overflow-y-auto h-[calc(100%-48px)]">{content}</div>
          </div>
        </div>
      )}
    </>
  );
}
