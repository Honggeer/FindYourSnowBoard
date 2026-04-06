import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        snow: {
          50: "#f0f4ff",
          100: "#e0e9ff",
          500: "#4a6fa5",
          600: "#3a5a8c",
          700: "#2d4a73",
          800: "#1e3254",
          900: "#12203a",
        },
      },
    },
  },
  plugins: [],
};
export default config;
