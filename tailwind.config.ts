import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Muted palette (dark-first)
        ink: {
          DEFAULT: "#0b1220",
          50: "#0b1220",
          100: "#0f172a",
          200: "#121a2f",
          300: "#172136",
          400: "#1b273f",
          500: "#20304b"
        },
        slatey: {
          100: "#e5e7eb",
          200: "#cbd5e1",
          300: "#94a3b8",
          400: "#64748b",
          500: "#475569",
          600: "#334155",
          700: "#1f2937",
          800: "#111827",
          900: "#0b1220"
        },
        accent: {
          // subtle blue-cyan for highlights
          400: "#5aa7d7",
          500: "#3f8fbf",
          600: "#2e6f99"
        },
        dayperiod: {
          night: "#1b273f",
          dawn: "#22304e",
          day: "#2a3a59",
          dusk: "#22304e"
        },
        marker: {
          selected: "#0b3a5a",
          now: "#b84a4a"
        }
      },
      boxShadow: {
        soft: "0 1px 0 0 rgba(255,255,255,0.02), 0 0 0 1px rgba(255,255,255,0.04) inset"
      }
    }
  },
  plugins: []
} satisfies Config;
