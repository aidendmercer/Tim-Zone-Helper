export type City = {
  id: string; // slug e.g. "America/New_York"
  label: string; // "New York"
  countryCode: string; // "US"
  tz: string; // IANA TZ
};

export type Preferences = {
  timeFormat: "12h" | "24h";
  referenceCityId: string;
};

export const seedCities: City[] = [
  { id: "Europe/Helsinki", label: "Helsinki", countryCode: "FI", tz: "Europe/Helsinki" },
  { id: "Europe/London", label: "London", countryCode: "GB", tz: "Europe/London" },
  { id: "America/New_York", label: "New York", countryCode: "US", tz: "America/New_York" },
  { id: "Asia/Tokyo", label: "Tokyo", countryCode: "JP", tz: "Asia/Tokyo" },
  { id: "Australia/Sydney", label: "Sydney", countryCode: "AU", tz: "Australia/Sydney" }
];

export const popularCities: City[] = [
  ...seedCities,
  { id: "Europe/Paris", label: "Paris", countryCode: "FR", tz: "Europe/Paris" },
  { id: "Europe/Berlin", label: "Berlin", countryCode: "DE", tz: "Europe/Berlin" },
  { id: "America/Los_Angeles", label: "Los Angeles", countryCode: "US", tz: "America/Los_Angeles" },
  { id: "America/Chicago", label: "Chicago", countryCode: "US", tz: "America/Chicago" },
  { id: "Asia/Singapore", label: "Singapore", countryCode: "SG", tz: "Asia/Singapore" },
  { id: "Asia/Dubai", label: "Dubai", countryCode: "AE", tz: "Asia/Dubai" },
  { id: "Asia/Shanghai", label: "Shanghai", countryCode: "CN", tz: "Asia/Shanghai" },
  { id: "America/Sao_Paulo", label: "São Paulo", countryCode: "BR", tz: "America/Sao_Paulo" }
];
