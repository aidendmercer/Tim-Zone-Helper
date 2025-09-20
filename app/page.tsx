"use client";

import { useEffect, useMemo, useState } from "react";
import Sidebar from "./(components)/Sidebar";
import Timeline from "./(components)/Timeline";
import AddCityDialog from "./(components)/AddCityDialog";
import type { City, Preferences } from "./(lib)/cities";
import { seedCities } from "./(lib)/cities";
import { loadCities, loadPrefs, saveCities, savePrefs } from "./(lib)/storage";

function detectUserTZ(): string | null {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || null;
  } catch {
    return null;
  }
}

// Absolute safe defaults if seeds are empty for any reason
const FALLBACK_CITY: City = {
  id: "UTC",
  label: "My Location",
  countryCode: "XX",
  tz: "UTC",
};

export default function Page() {
  // Build the initial city list: ensure user's location is first
  const userTz = detectUserTZ() ?? seedCities[0]?.tz ?? "UTC";

  const myLocation: City = {
    id: userTz,
    label: "My Location",
    countryCode: "XX",
    tz: userTz,
  };

  const initialCities: City[] = (() => {
    if (seedCities.length === 0) return [myLocation, FALLBACK_CITY];
    const existing = seedCities.find((c) => c.tz === userTz);
    if (existing) {
      const others = seedCities.filter((c) => c.tz !== userTz);
      return [existing, ...others];
    }
    return [myLocation, ...seedCities];
  })();

  const [cities, setCities] = useState<City[]>(initialCities);
  const [prefs, setPrefs] = useState<Preferences>({
    timeFormat: "24h",
    referenceCityId: userTz,
  });
  const [addOpen, setAddOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Load persisted (and keep user's tz first)
  useEffect(() => {
    (async () => {
      const [c, p] = await Promise.all([loadCities(), loadPrefs()]);
      if (c && Array.isArray(c) && c.length > 0) {
        const userIndex = c.findIndex((x) => x.tz === userTz);
        const ordered =
          userIndex > -1 ? [c[userIndex], ...c.filter((_, i) => i !== userIndex)] : [myLocation, ...c];
        setCities(ordered);
      }
      if (p) {
        setPrefs((prev) => ({
          timeFormat: p.timeFormat ?? prev.timeFormat,
          referenceCityId: userTz, // always anchor to user's tz
        }));
      }
    })();
  }, [userTz, myLocation]);

  useEffect(() => {
    saveCities(cities);
  }, [cities]);

  useEffect(() => {
    savePrefs(prefs);
  }, [prefs]);

  const referenceCity = useMemo(
    () =>
      cities.find((c) => c.tz === userTz) ??
      cities[0] ??
      seedCities[0] ?? {
        id: userTz,
        label: "My Location",
        countryCode: "XX",
        tz: userTz,
      },
    [cities, userTz]
  );

  function handleAddCity(c: City) {
    setCities((prev) => (prev.some((x) => x.id === c.id) ? prev : [...prev, c]));
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar
        cities={cities}
        onRemove={(id) => setCities(cities.filter((c) => c.id !== id))}
        onMakeReference={() => {}}
        referenceCityId={referenceCity.id}
        onOpenAddCity={() => setAddOpen(true)}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      <main className="flex-1 min-w-0 p-4 sm:p-6 space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-lg sm:text-xl font-semibold">Time-Zone Comparison</h1>
          <div />
        </header>

        <Timeline
          cities={cities}
          setCities={setCities}
          prefs={prefs}
          setPrefs={setPrefs}
          referenceCity={referenceCity}
          onOpenAddCity={() => setAddOpen(true)}
          onOpenSidebarMobile={() => setMobileSidebarOpen(true)}
        />
      </main>

      <AddCityDialog
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={handleAddCity}
        existing={cities}
      />
    </div>
  );
}
