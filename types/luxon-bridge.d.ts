// Bridge TS to Luxon's OWN bundled types – no third-party typings.
// We cover both the package import ("luxon") and the internal source path
// TS sometimes stumbles into during Next's type-check step.

declare module "luxon" {
  export * from "luxon/types/luxon";
}

// Some builds resolve to the JS source file path below during type checking.
// Point it to the same official declaration file.
declare module "luxon/src/luxon" {
  export * from "luxon/types/luxon";
}
