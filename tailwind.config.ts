import type { Config } from "tailwindcss";

export default {
  darkMode: "class", // keep support, but we won't force it
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Keep existing names but ensure they look fine in light mode
        ink: {
          DEFAULT: "#ffffff",
          50: "#ffffff",
          100: "#f8fafc",
          200: "#f1f5f9",
          300: "#e2e8f0",
          400: "#cbd5e1",
          500: "#94a3b8"
        },
        slatey: {
          100: "#0f172a", /* inverse mapping for text usage in code */
          200: "#1e293b",
          300: "#334155",
          400: "#475569",
          500: "#64748b",
          600: "#94a3b8",
          700: "#cbd5e1",
          800: "#e2e8f0",
          900: "#f8fafc"
        },
        accent: {
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb"
        },
        dayperiod: {
          /* Muted, light-friendly fills for timelines */
          night: "#e2e8f0",  /* slate-200 */
          dawn: "#eaf2ff",   /* soft blue tint */
          day: "#f1f5f9",    /* slate-100 */
          dusk: "#eaf2ff"
        },
        marker: {
          selected: "#0b3a5a",
          now: "#dc2626" /* red-600 with lower opacity in component */
        }
      },
      boxShadow: {
        soft: "0 1px 0 0 rgba(0,0,0,0.02), 0 0 0 1px rgba(0,0,0,0.04) inset"
      }
    }
  },
  plugins: []
} satisfies Config;
