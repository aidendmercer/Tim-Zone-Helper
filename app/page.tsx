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

export default function Page() {
  // 1) Stable initial render: use seedCities as-is (no timezone detection yet)
  const [cities, setCities] = useState<City[]>(seedCities);
  const [prefs, setPrefs] = useState<Preferences>({
    timeFormat: "24h",
    referenceCityId: seedCities[0]?.id ?? "UTC",
  });
  const [addOpen, setAddOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // 2) After mount only: load persisted + detect user TZ and reorder
  useEffect(() => {
    (async () => {
      const [persistedCities, persistedPrefs] = await Promise.all([loadCities(), loadPrefs()]);
      const userTz = detectUserTZ();

      let nextCities = cities;
      if (persistedCities && Array.isArray(persistedCities) && persistedCities.length > 0) {
        nextCities = persistedCities;
      }

      // If we can detect user TZ, ensure that city is first (or add a "My Location")
      if (userTz) {
        const existingIndex = nextCities.findIndex((c) => c.tz === userTz);
        if (existingIndex > -1) {
          nextCities = [nextCities[existingIndex], ...nextCities.filter((_, i) => i !== existingIndex)];
        } else {
          const myLocation: City = {
            id: userTz,
            label: "My Location",
            countryCode: "XX",
            tz: userTz,
          };
          nextCities = [myLocation, ...nextCities];
        }
      }

      setCities(nextCities);

      if (persistedPrefs) {
        setPrefs((prev) => ({
          timeFormat: persistedPrefs.timeFormat ?? prev.timeFormat,
          // anchor to user's tz if available; otherwise keep current reference
          referenceCityId:
            (userTz && (nextCities.find((c) => c.tz === userTz)?.id ?? prev.referenceCityId)) ??
            prev.referenceCityId,
        }));
      } else if (userTz) {
        const refId = nextCities.find((c) => c.tz === userTz)?.id;
        if (refId) {
          setPrefs((prev) => ({ ...prev, referenceCityId: refId }));
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist after changes
  useEffect(() => {
    saveCities(cities);
  }, [cities]);

  useEffect(() => {
    savePrefs(prefs);
  }, [prefs]);

  // Find reference city safely
  const referenceCity = useMemo(
    () =>
      cities.find((c) => c.id === prefs.referenceCityId) ??
      cities[0] ??
      seedCities[0] ?? {
        id: "UTC",
        label: "My Location",
        countryCode: "XX",
        tz: "UTC",
      },
    [cities, prefs.referenceCityId]
  );

  function handleAddCity(c: City) {
    setCities((prev) => (prev.some((x) => x.id === c.id) ? prev : [...prev, c]));
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar
        cities={cities}
        onRemove={(id) => setCities((prev) => prev.filter((c) => c.id !== id))}
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
