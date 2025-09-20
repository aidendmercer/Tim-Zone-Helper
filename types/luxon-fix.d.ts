// Ensure TypeScript always finds Luxon's bundled type definitions.
// This DOES NOT add any third-party types; it points to Luxon's own .d.ts.
declare module "luxon" {
  export * from "luxon/build/node/luxon";
}
