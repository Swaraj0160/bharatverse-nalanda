import type { Config } from "tailwindcss";

/**
 * BHARATVERSE design tokens — a pan-India stone-and-pigment palette.
 *
 * Tokens are named for real materials and pigments, never `primary-500`, so the
 * system stays authored rather than generic. `sandstone` is the pan-India shell
 * ground (Konark khondalite/laterite); `leaf` is retained as the palm-leaf
 * ground for Nalanda interiors. Both keep a 4-colour-max feel per screen.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sandstone: "#D9C29A",
        "sandstone-deep": "#C4A97B",
        "stone-deep": "#8C7355",
        indigo: "#26406B",
        leaf: "#E8D6B0",
        "leaf-deep": "#D8C097",
        "leaf-dim": "#C9B48C",
        tala: "#C7924B",
        ink: "#1B1712",
        "ink-soft": "#4A3F33",
        hingula: "#B23A2E",
        haritala: "#D9A63F",
        // flashback / miniature-painting palette (memory moments only)
        terreverte: "#5B7B5A",
        redochre: "#9C5233",
        lapis: "#2E4C7E",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "Georgia", "serif"],
        hand: ["var(--font-hand)", "cursive"],
        deva: ["var(--font-deva)", "serif"],
      },
      boxShadow: {
        leaf: "0 1px 0 rgba(27,23,18,0.12), 0 18px 40px -24px rgba(27,23,18,0.55)",
      },
      transitionTimingFunction: {
        // authored easings — weight, ink and footfall. No generic ease-in-out.
        stone: "cubic-bezier(0.32, 0, 0.24, 1)",
        ink: "cubic-bezier(0.22, 1, 0.36, 1)",
        step: "cubic-bezier(0.5, 0, 0.2, 1)",
        page: "cubic-bezier(0.7, 0, 0.2, 1)",
      },
      keyframes: {
        "seal-in": {
          "0%": { transform: "scale(0.6) rotate(-12deg)", opacity: "0" },
          "60%": { transform: "scale(1.08) rotate(2deg)", opacity: "1" },
          "100%": { transform: "scale(1) rotate(0deg)", opacity: "1" },
        },
      },
      animation: {
        "seal-in": "seal-in 520ms cubic-bezier(0.16,0.84,0.44,1) both",
      },
    },
  },
  plugins: [],
};

export default config;
