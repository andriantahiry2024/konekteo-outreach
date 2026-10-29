/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0a",
        surface: "#121214",
        "surface-card": "#18181b",
        "surface-border": "#242429",
        "surface-border-subtle": "#2e2e36",
        lime: {
          DEFAULT: "#e9ff3b",
          hover: "#d4eb2b",
          muted: "rgba(233, 255, 59, 0.12)",
          border: "rgba(233, 255, 59, 0.3)",
        },
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
        metric: ["var(--font-outfit)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
