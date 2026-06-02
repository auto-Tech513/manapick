import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        primaryInk: "var(--color-primary-ink)",
        accent: "var(--color-accent)",
        spark: "var(--color-spark)",
        ink: "var(--color-ink)",
        muted: "var(--color-muted)",
        line: "var(--color-line)",
        surface: "var(--color-surface)",
        bg: "var(--color-bg)",
        bgSoft: "var(--color-bg-soft)",
        leaf: "var(--color-accent)",
        moss: "var(--color-muted)",
        amberSoft: "var(--color-spark)",
        paper: "var(--color-bg)",
        mist: "var(--color-bg-soft)",
        coral: "var(--color-coral)"
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        DEFAULT: "var(--radius-md)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        pill: "999px"
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem"
      },
      boxShadow: {
        line: "var(--shadow-line)",
        card: "var(--shadow-card)",
        cardHover: "var(--shadow-card-hover)",
        button: "var(--shadow-button)"
      }
    }
  },
  plugins: []
};

export default config;
