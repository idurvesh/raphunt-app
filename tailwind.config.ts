import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ["var(--font-inter)", "system-ui", "sans-serif"],
        grotesk: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
      },
      colors: {
        background: "#0a0a0a",
        foreground: "#ffffff",
        accent: "#E63946",
        "accent-hover": "#c1121f",
        surface: "#141414",
        "surface-2": "#1e1e1e",
        border: "#2a2a2a",
        muted: "#888888",
      },
      letterSpacing: {
        tighter: "-0.03em",
        tight: "-0.02em",
      },
    },
  },
  plugins: [],
};
export default config;
