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
        primary: {
          DEFAULT: "#8B4513",
          dark: "#5D2E0C",
          light: "#A0522D",
        },
        accent: {
          DEFAULT: "#D4AF37",
          dark: "#B8960C",
          light: "#E5C158",
        },
        sand: {
          DEFAULT: "#F5F0E6",
          dark: "#E8E0D1",
          light: "#FAF7F1",
        },
        clay: {
          DEFAULT: "#C19A6B",
          dark: "#A07850",
        },
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
