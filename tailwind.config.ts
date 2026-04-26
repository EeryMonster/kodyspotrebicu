import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#2563eb",        // blue-600 — hlavní CTA
          "primary-dark": "#1d4ed8", // blue-700 — hover / aktivní stav i modré texty
          soft: "#eff6ff",           // blue-50 — světlá modrá pozadí (badge, hover)
          "soft-border": "#bfdbfe",  // blue-200 — jemné modré okraje
          surface: "#f8fafc",        // slate-50 — neutrální podklad
          border: "#e2e8f0",         // slate-200 — neutrální okraje
        },
      },
    },
  },
  plugins: [],
};
export default config;
