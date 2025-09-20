import { get, set } from "idb-keyval";
import type { City, Preferences } from "./cities";

const CITIES_KEY = "tz.cities";
const PREFS_KEY = "tz.prefs";

export async function saveCities(cities: City[]) {
  try {
    await set(CITIES_KEY, cities);
  } catch {}
}
export async function loadCities(): Promise<City[] | null> {
  try {
    return (await get(CITIES_KEY)) ?? null;
  } catch {
    return null;
  }
}

export async function savePrefs(prefs: Preferences) {
  try {
    await set(PREFS_KEY, prefs);
  } catch {}
}
export async function loadPrefs(): Promise<Preferences | null> {
  try {
    return (await get(PREFS_KEY)) ?? null;
  } catch {
    return null;
  }
}
