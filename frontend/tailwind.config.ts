import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#2563EB",
          light: "#60A5FA",
          dark: "#1D4ED8",
        },
      },
    },
  },
  plugins: [],
};

export default config;
