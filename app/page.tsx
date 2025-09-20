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

  // Pick a safe initial reference id (first seed if present, otherwise a neutral default)
  const initialRefId = seedCities[0]?.id ?? "Europe/Helsinki";

  const [prefs, setPrefs] = useState<Preferences>({
    timeFormat: "24h",
    referenceCityId: initialRefId
  });

  const [addOpen, setAddOpen] = useState(false);

  // Load persisted
  useEffect(() => {
    (async () => {
      const [c, p] = await Promise.all([loadCities(), loadPrefs()]);
      if (c && Array.isArray(c) && c.length > 0) setCities(c);
      if (p) {
        // Guard against corrupted storage missing referenceCityId
        setPrefs((prev) => ({
          timeFormat: p.timeFormat ?? prev.timeFormat,
          referenceCityId: p.referenceCityId ?? initialRefId
        }));
      }
    })();
  }, [initialRefId]);

  // Persist on changes
  useEffect(() => {
    saveCities(cities);
  }, [cities]);
  useEffect(() => {
    savePrefs(prefs);
  }, [prefs]);

  const referenceCity = useMemo(
    () => cities.find((c) => c.id === prefs.referenceCityId) ?? cities[0] ?? seedCities[0] ?? { id: initialRefId, label: "Helsinki", countryCode: "FI", tz: "Europe/Helsinki" },
    [cities, prefs.referenceCityId, initialRefId]
  );

  function handleAddCity(c: City) {
    setCities((prev) => {
      if (prev.some((x) => x.id === c.id)) return prev;
      return [...prev, c];
    });
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar
        cities={cities}
        onRemove={(id) => setCities(cities.filter((c) => c.id !== id))}
        onMakeReference={(id) => setPrefs({ ...prefs, referenceCityId: id })}
        re
