"use client";

import { useMemo, useState } from "react";
import { popularCities } from "../(lib)/cities";
import type { City } from "../(lib)/cities";
import { countryCodeToFlagEmoji } from "../(lib)/time";

export default function AddCityDialog({
  isOpen,
  onClose,
  onAdd,
  existing
}: {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (c: City) => void;
  existing: City[];
}) {
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    const filtered = s
      ? popularCities.filter(
          (c) =>
            c.label.toLowerCase().includes(s) ||
            c.tz.toLowerCase().includes(s) ||
            c.countryCode.toLowerCase() === s
        )
      : popularCities;
    const existingIds = new Set(existing.map((e) => e.id));
    return filtered.filter((c) => !existingIds.has(c.id));
  }, [q, existing]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Add City"
        className="absolute left-1/2 top-1/2 w-[520px] max-w-[95vw] -translate-x-1/2 -translate-y-1/2 panel p-4"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm text-slate-300">Add City</div>
          <button className="text-slate-300 hover:text-white focus-ring px-2 py-1 rounded" onClick={onClose}>
            Close
          </button>
        </div>

        <input
          className="w-full bg-transparent border border-white/10 rounded-md px-3 py-2 text-sm focus-ring"
          placeholder="Search popular cities by name, TZ, or country code…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        <div className="mt-3 max-h-[50vh] overflow-auto divide-y divide-white/5">
          {list.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                onAdd(c);
                onClose();
              }}
              className="w-full text-left px-2 py-2 hover:bg-white/5 focus-ring rounded flex items-center justify-between"
            >
              <div>
                <div className="font-medium">
                  <span className="mr-2">{countryCodeToFlagEmoji(c.countryCode)}</span>
                  {c.label}
                </div>
                <div className="text-xs text-slate-400">{c.tz}</div>
              </div>
              <div className="text-xs text-slate-400">Add</div>
            </button>
          ))}
          {list.length === 0 && <div className="p-3 text-sm text-slate-400">No matches.</div>}
        </div>
      </div>
    </div>
  );
}
