import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: {
          primary: "var(--foreground-primary)",
          secondary: "var(--foreground-secondary)",
        },
        cardBackground: "var(--card-background)",
        cardForeground: "var(--text-primary)",
        cardBorder: "var(--card-border)",
        button: {
          background: "var(--button-background)",
          foreground: "var(--button-foreground)",
          border: "var(--button-border)",
        },
        accent: "var(--accent)",
        logo: "var(--logo)",
        info: "var(--info)",
        warning: "var(--warning)",
        success: "var(--success)",
        inputBackground: "var(--input-background)",
        inputForeground: "var(--input-foreground)",
        inputBorder: "var(--input-border)",
        muted: {
          foreground: "var(--muted-foreground)",
        },
        secondary: "var(--secondary)",
      },
    },
  },
  plugins: [],
} satisfies Config;
