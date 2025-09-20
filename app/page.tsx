"use client";

import { useEffect, useMemo, useState } from "react";
import Sidebar from "./(components)/Sidebar";
import Timeline from "./(components)/Timeline";
import AddCityDialog from "./(components)/AddCityDialog";
import type { City, Preferences } from "./(lib)/cities";
import { seedCities } from "./(lib)/cities";
import { loadCities, loadPrefs, saveCities, savePrefs } from "./(lib)/storage";

export default function Page() {
  const [cities, setCities] = useState<City[]>(seedCities);
  const initialRefId = seedCities[0]?.id ?? "Europe/Helsinki";
  const [prefs, setPrefs] = useState<Preferences>({ timeFormat: "24h", referenceCityId: initialRefId });
  const [addOpen, setAddOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const [c, p] = await Promise.all([loadCities(), loadPrefs()]);
      if (c && Array.isArray(c) && c.length > 0) setCities(c);
      if (p) {
        setPrefs((prev) => ({
          timeFormat: p.timeFormat ?? prev.timeFormat,
          referenceCityId: p.referenceCityId ?? initialRefId
        }));
      }
    })();
  }, [initialRefId]);

  useEffect(() => { saveCities(cities); }, [cities]);
  useEffect(() => { savePrefs(prefs); }, [prefs]);

  const referenceCity = useMemo(
    () =>
      cities.find((c) => c.id === prefs.referenceCityId) ??
      cities[0] ??
      seedCities[0] ?? {
        id: initialRefId,
        label: "Helsinki",
        countryCode: "FI",
        tz: "Europe/Helsinki"
      },
    [cities, prefs.referenceCityId, initialRefId]
  );

  function handleAddCity(c: City) {
    setCities((prev) => (prev.some((x) => x.id === c.id) ? prev : [...prev, c]));
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar
        cities={cities}
        onRemove={(id) => setCities(cities.filter((c) => c.id !== id))}
        onMakeReference={(id) => setPrefs({ ...prefs, referenceCityId: id })}
        referenceCityId={referenceCity.id}
        onOpenAddCity={() => setAddOpen(true)}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      <main className="flex-1 min-w-0 p-4 sm:p-6 space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-lg sm:text-xl font-semibold">Time-Zone Comparison</h1>
          <div className="text-xs sm:text-sm text-slate-500">
            Light theme • Accessible • Mobile-friendly
          </div>
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
