"use client";

import { useMemo, useState } from "react";
import type { City } from "../(lib)/cities";
import { countryCodeToFlagEmoji } from "../(lib)/time";
import { DateTime, Duration, Interval } from "luxon";
import { PlusCircle } from "@phosphor-icons/react";

export default function Sidebar({
  cities,
  onRemove,
  onMakeReference,
  referenceCityId,
  onOpenAddCity
}: {
  cities: City[];
  onRemove: (id: string) => void;
  onMakeReference: (id: string) => void;
  referenceCityId: string;
  onOpenAddCity: () => void;
}) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s
      ? cities.filter((c) => c.label.toLowerCase().includes(s) || c.tz.toLowerCase().includes(s))
      : cities;
  }, [q, cities]);

  return (
    <aside className="w-[320px] shrink-0 space-y-4">
      <div className="panel p-3">
        <div className="flex items-center gap-2">
          <input
            className="w-full bg-transparent border border-white/10 rounded-md px-3 py-2 text-sm focus-ring"
            placeholder="Search cities…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Search cities"
          />
          <button
            onClick={onOpenAddCity}
            className="px-2 py-2 rounded-md bg-white/5 border border-white/10 hover:bg-white/10 focus-ring"
            title="Add city"
            aria-label="Add city"
          >
            <PlusCircle size={18} />
          </button>
        </div>
      </div>

      <div className="panel p-3">
        <div className="text-sm text-slate-300 mb-2">Your Cities</div>
        <ul className="space-y-2">
          {filtered.map((c) => {
            const local = DateTime.now().setZone(c.tz);
            return (
              <li key={c.id} className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-medium truncate">
                    <span className="mr-2">{countryCodeToFlagEmoji(c.countryCode)}</span>
                    {c.label}
                    {c.id === referenceCityId && <span className="ml-2 text-[10px] text-accent-400">(ref)</span>}
                  </div>
                  <div className="text-xs text-slate-400 truncate">{c.tz}</div>
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

      <div className="panel p-3 text-xs text-slate-400">
        Click “Add city” to search & insert more locations. Set a city as reference from the main view.
      </div>
    </aside>
  );
}
