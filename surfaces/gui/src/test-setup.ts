import { beforeAll } from "vitest";
import { initLocale } from "./i18n";

// Unit tests assert English source strings; pin locale before any component renders.
beforeAll(() => {
  initLocale("en");
});
