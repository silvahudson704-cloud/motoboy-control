import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: "#0B0F14",
        surface: "#121821",
        elevated: "#1B232D",
        border: "#2A343F",
        ink: "#F4F7FA",
        muted: "#8B98A5",
        visor: "#FFC530", // amarelo visor — cor de marca / ação primária
        "visor-ink": "#171204",
        paid: "#35D07F",
        pending: "#FF8A3D",
        cost: "#FF5C5C",
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
