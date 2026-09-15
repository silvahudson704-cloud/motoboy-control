import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: "#0A0A0B", // preto grafite, alto contraste
        surface: "#151517",
        elevated: "#1E1E21",
        border: "#2F2F33",
        ink: "#FAFAFA",
        muted: "#9A9AA0",
        visor: "#FFD60A", // dourado/amarelo neon — cor de marca / ação primária
        "visor-ink": "#1A1400",
        paid: "#39E37B",
        pending: "#FF9F3D",
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
