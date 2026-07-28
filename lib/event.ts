// One-stop config for the event this app is hosting. To stand up a sibling
// app (e.g. a ward Girls Camp), copy the repo via "Use as template" on
// GitHub, edit this file, swap public/logo.png + public/qr-code.jpg + the
// church PDF if needed, and deploy. Nothing else should need touching.

export interface FeeConfig {
  amount: number;
  donationLine: string;
  showExampleImage: boolean;
}

export interface EventConfig {
  // Branding
  shortName: string; // shows in admin titles, e.g. "NYS Admin"
  title: string; // big heading, e.g. "Nyssa Youth Spectacular"
  metaDescription: string; // browser tab + share preview blurb

  // Date banner shown under the landing page heading
  dateBannerLabel: string; // e.g. "Save the date"
  dateLine: string; // e.g. "Saturday, June 6, 2026"
  timeLine: string; // e.g. "8:00 AM – 11:00 PM"

  // Values stamped into the church PDF's form fields
  pdf: {
    event: string;
    datesOfEvent: string;
    description: string;
    stake: string;
    leader: string;
    leaderPhone: string;
    leaderEmail: string;
  };

  // null = no age cutoff. Otherwise YYYY-MM-DD; participants must be born on
  // or before this date.
  maxBirthdate: string | null;

  // Wards / branches the registration form offers. With a single entry the
  // ward dropdown is hidden everywhere and the value is used automatically.
  wards: readonly string[];

  // Registration fee callout. null hides the section entirely.
  fee: FeeConfig | null;

  // "stake": admin login takes a ward dropdown. ADMIN_PASSWORD authenticates
  // a stake-wide view; per-ward passwords (WARD_PASSWORD_<slug>) authenticate
  // a ward-scoped view.
  // "single": login is password-only. ADMIN_PASSWORD signs in to a single
  // unscoped admin view.
  authMode: "stake" | "single";
}

// =============================================================================
// >>> EDIT BELOW FOR EACH EVENT <<<
// =============================================================================
export const EVENT: EventConfig = {
  shortName: "Primary Super Activity",
  title: "Primary Super Activity",
  metaDescription:
    "Register your Activity Days child for the Primary Super Activity — August 22, 2026 at Camp Hycliffs.",

  dateBannerLabel: "Save the date",
  dateLine: "Saturday, August 22, 2026",
  timeLine: "11:00 AM – 4:00 PM at Camp Hycliffs",

  pdf: {
    event: "Primary Super Activity",
    datesOfEvent: "08/22/2026",
    description: "Fun activities and lunch for Activity Days children (ages 7–11).",
    stake: "Nyssa Stake",
    leader: "Megan Baker",
    leaderPhone: "+1 (541) 212-4790",
    leaderEmail: "",
  },

  maxBirthdate: null,

  wards: ["Parma 1st Ward"],

  fee: null,

  authMode: "single",
};

export const SINGLE_WARD = EVENT.wards.length === 1 ? EVENT.wards[0] : null;
