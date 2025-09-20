// Bridge TypeScript to Luxon's bundled declaration file.
// No third-party typings; this re-exports Luxon's own types.
declare module "luxon" {
  export * from "luxon/types/luxon";
}
