// Minimal ambient declarations for the parts of Luxon used by this app.
// This satisfies TypeScript during Vercel's type check without changing runtime behavior.

declare module "luxon" {
  /** Subset of Luxon's DateTime API used in this project */
  export class DateTime {
    // constructors / factories
    static now(): DateTime;
    static fromJSDate(date: Date): DateTime;
    static fromObject(obj: {
      year?: number;
      month?: number;
      day?: number;
      hour?: number;
      minute?: number;
    }): DateTime;

    // immutables returning new DateTime
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

    // comparisons / math
    diff(other: DateTime, unit: "hours"): { hours: number };

    // getters
    get hour(): number;

    // formatting
    toFormat(fmt: string): string;
    toISODate(): string | null;
  }

  // Placeholders so named imports compile; exact shapes not needed here.
  export class Duration {}
  export class Interval {}
}
