// Make TypeScript treat Luxon's internal JS source paths as the public module.
// We do NOT re-declare "luxon" itself (to avoid shadowing its bundled types).

declare module "luxon/src/luxon" {
  export * from "luxon";
}
declare module "luxon/src/luxon.js" {
  export * from "luxon";
}
