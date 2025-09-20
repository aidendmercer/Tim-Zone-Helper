"use client";

import { useMemo, useState } from "react";
import type { City } from "../(lib)/cities";
import { DateTime } from "luxon";
import { PlusCircle, X } from "@phosphor-icons/react";

export default function Sidebar({
  cities,
  onRemove,
  onMakeReference, // kept for API compat; unused now
  referenceCityId,
  onOpenAddCity,
  mobileOpen = false,
  onMobileClose
}: {
  cities: City[];
  onRemove: (id: string) => void;
  onMakeReference: (id: string) => void; // eslint-disable-line
  referenceCityId: string;
  onOpenAddCity: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}) {
  // No search panel, no "Your Cities" title, no flags, no timezone lines
  const list = useMemo(() => cities, [cities]);

  const content = (
    <div className="w-[320px] shrink-0 p-3 space-y-3">
      <div className="panel p-3">
        <button
          onClick={onOpenAddCity}
          className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md border border-slate-200 bg-white hover:bg-slate-50 focus-ring"
          aria-label="Add city"
        >
          <PlusCircle size={18} /> Add City
        </button>
      </div>

      <div className="panel p-2">
        <ul className="divide-y divide-slate-200">
          {list.map((c) => {
            const local = DateTime.now().setZone(c.tz);
            const time = local.toFormat("HH:mm");
            return (
              <li key={c.id} className="flex items-center justify-between gap-2 py-2">
                <div className="min-w-0">
                  <div className="font-medium truncate">
                    {c.label}
                    {c.id === referenceCityId && <span className="ml-2 text-[10px] text-blue-600">(you)</span>}
                  </div>
                  {/* timezone string removed */}
                </div>
                <div className="text-right">
                  <div className="text-sm">{time}</div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden md:block">{content}</aside>

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
