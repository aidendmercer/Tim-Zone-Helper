// Minimal ambient declarations for the parts of Luxon used by this app.

declare module "luxon" {
  export class DateTime {
    static now(): DateTime;
    static fromJSDate(date: Date): DateTime;
    static fromObject(obj: {
      year?: number;
      month?: number;
      day?: number;
      hour?: number;
      minute?: number;
    }): DateTime;
    /** Optional: allow fromISO if any stray call remains */
    static fromISO(text: string, options?: { zone?: string }): DateTime;

    setZone(zone: string): DateTime;
    startOf(unit: "day" | "hour"): DateTime;
    plus(values: { minutes?: number; hours?: number }): DateTime;
    set(values: {
      year?: number;
      month?: number;
      day?: number;
      hour?: number;
      minute?: number;
    }): DateTime;

    diff(other: DateTime, unit: "hours"): { hours: number };
    get hour(): number;

    toFormat(fmt: string): string;
    toISODate(): string | null;
  }

  export class Duration {}
  export class Interval {}
}
