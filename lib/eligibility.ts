// Participants must be born on or before this date. Anyone born later is
// considered too young for the event.
export const MAX_BIRTHDATE = "2012-12-31";

export function isBirthdateAllowed(birthdate: string): boolean {
  if (!birthdate) return false;
  return birthdate <= MAX_BIRTHDATE;
}

export const BIRTHDATE_ERROR =
  "Participant must have been born on or before Dec 31, 2012.";
