// Re-exports kept so existing imports (`@/lib/wards`) keep working.
// All event-level config lives in lib/event.ts now.
export { EVENT, TSHIRT_SIZES } from "./event";

import { EVENT } from "./event";
export const WARDS = EVENT.wards;

export type Ward = (typeof EVENT.wards)[number];

export type TshirtSize =
  | "Youth - Small"
  | "Youth - Medium"
  | "Youth - Large"
  | "Adult - Small"
  | "Adult - Medium"
  | "Adult - Large"
  | "Adult - XL"
  | "Adult - 2XL"
  | "Adult - 3XL";
