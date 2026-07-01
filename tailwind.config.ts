import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        oceania: {
          navy: "#173463",
          deep: "#0c2246",
          gold: "#c7891b",
          sand: "#f4efe6",
          ink: "#182235",
          mist: "#586273",
        },
      },
      fontFamily: {
        display: [
          "Iowan Old Style",
          "Palatino Linotype",
          "Book Antiqua",
          "Georgia",
          "serif",
        ],
        body: ["Avenir Next", "Segoe UI", "Helvetica", "Arial", "sans-serif"],
      },
      boxShadow: {
        shell: "0 20px 60px rgba(23, 52, 99, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
