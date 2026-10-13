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
          DEFAULT: "#111111", // Noir Haute Couture (profond, intemporel)
          dark: "#000000",
          light: "#2A2A2A",
        },
        terracotta: {
          DEFAULT: "#A84C2C", // Touche terracotta subtile marocaine
          dark: "#84361C",
          light: "#C66744",
        },
        accent: {
          DEFAULT: "#A84C2C", // Accent terracotta couture
          dark: "#84361C",
          light: "#C66744",
        },
        sand: {
          DEFAULT: "#FFFFFF", // Fond Blanc Pur Studio Haute Couture
          dark: "#F4F4F4",    // Gris studio minimaliste
          light: "#FFFFFF",   // Blanc absolu
        },
        clay: {
          DEFAULT: "#E5E5E5",
          dark: "#CCCCCC",
        },
      },
      fontFamily: {
        serif: ["var(--font-cinzel)", "Didot", "Bodoni MT", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
