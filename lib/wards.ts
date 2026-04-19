// Replace with the actual ward/branch list for your stake.
export const WARDS = [
  "Nyssa 1st Ward",
  "Nyssa 2nd Ward",
  "Nyssa 3rd Ward",
  "Adrian Ward",
  "Owyhee Ward",
  "Parma Ward",
  "Vale Ward",
  "Other",
] as const;

export type Ward = (typeof WARDS)[number];

export const TSHIRT_SIZES = [
  "YS",
  "YM",
  "YL",
  "AS",
  "AM",
  "AL",
  "AXL",
  "A2XL",
  "A3XL",
] as const;

export type TshirtSize = (typeof TSHIRT_SIZES)[number];
