import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
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
    },
  },
  plugins: [],
};
export default config;
