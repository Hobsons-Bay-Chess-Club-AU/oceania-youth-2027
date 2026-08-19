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
          navy: "#0a192f",
          deep: "#050e1d",
          midnight: "#0c1e38",
          blue: "#173463",
          gold: "#d4af37",
          amber: "#f59e0b",
          lightGold: "#fef08a",
          cyan: "#06b6d4",
          sky: "#38bdf8",
          sand: "#f4efe6",
          ink: "#0f172a",
          mist: "#64748b",
          pearl: "#f8fafc",
        },
      },
      fontFamily: {
        display: ["var(--font-cinzel)", "Iowan Old Style", "Georgia", "serif"],
        body: ["var(--font-jakarta)", "Avenir Next", "Segoe UI", "sans-serif"],
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(10, 25, 47, 0.12)",
        glow: "0 0 25px rgba(212, 175, 55, 0.25)",
        "glow-cyan": "0 0 25px rgba(6, 182, 212, 0.25)",
        shell: "0 20px 60px rgba(10, 25, 47, 0.16)",
      },
    },
  },
  plugins: [],
};

export default config;
