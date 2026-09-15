import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: "rgb(var(--color-base) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        elevated: "rgb(var(--color-elevated) / <alpha-value>)",
        border: "rgb(var(--color-border) / <alpha-value>)",
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        visor: "rgb(var(--color-visor) / <alpha-value>)",
        "visor-ink": "rgb(var(--color-visor-ink) / <alpha-value>)",
        paid: "rgb(var(--color-paid) / <alpha-value>)",
        pending: "rgb(var(--color-pending) / <alpha-value>)",
        cost: "rgb(var(--color-cost) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
        mono: ["var(--font-jbmono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        card: "0 1px 0 0 rgba(255,255,255,0.03) inset, 0 8px 24px -12px rgba(0,0,0,0.6)",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(255,197,48,0.45)" },
          "50%": { boxShadow: "0 0 0 10px rgba(255,197,48,0)" },
        },
        "pop-in": {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "pulse-glow": "pulse-glow 1.8s ease-out infinite",
        "pop-in": "pop-in 0.25s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
