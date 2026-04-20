export const WARDS = [
  "Nyssa 1st Ward",
  "Nyssa 2nd Ward",
  "Nyssa 3rd Ward",
  "Owyhee Ward",
  "Parma 1st Ward",
  "Parma 2nd Ward",
  "Parma 3rd Ward",
  "Vale 1st Ward",
  "Vale 2nd Ward",
  "Other",
] as const;

export type Ward = (typeof WARDS)[number];

export const TSHIRT_SIZES = [
  "Youth - Small",
  "Youth - Medium",
  "Youth - Large",
  "Adult - Small",
  "Adult - Medium",
  "Adult - Large",
  "Adult - XL",
  "Adult - 2XL",
  "Adult - 3XL",
] as const;

export type TshirtSize = (typeof TSHIRT_SIZES)[number];
