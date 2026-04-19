import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f7ff",
          100: "#e0efff",
          500: "#1e6ee8",
          600: "#1855c4",
          700: "#14449c",
        },
      },
    },
  },
  plugins: [],
};
export default config;
