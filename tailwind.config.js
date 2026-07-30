/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter-tight)", "sans-serif"],
      },
      fontSize: {
        xs: ["12px", { lineHeight: "1.4" }],
        sm: ["15px", { lineHeight: "1.4" }],
        base: ["16px", { lineHeight: "1.6" }],
        lg: ["18px", { lineHeight: "1.35" }],
        xl: ["16px", { lineHeight: "1.4" }],
        "2xl": ["22px", { lineHeight: "1.3" }],
        "3xl": ["26px", { lineHeight: "1.25" }],
        "4xl": ["32px", { lineHeight: "1.2" }],
        "5xl": ["32px", { lineHeight: "1.2" }],
        "6xl": ["32px", { lineHeight: "1.2" }],
      },
      fontWeight: {
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "700",
        black: "700",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
  ],
}
