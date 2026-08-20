/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "#FAF8F5",
          panel: "#FFFFFF",
          sunken: "#F2EDE6",
        },
        cocoa: {
          DEFAULT: "#4A2E23",
          light: "#6B4536",
          deep: "#2E1B14",
        },
        rose: {
          DEFAULT: "#C08573",
          deep: "#8B5A4F",
          soft: "#E7C9BE",
        },
        gold: {
          DEFAULT: "#B8935F",
          soft: "#D9BE93",
        },
        ink: "#3A2A22",
        success: "#3F7D58",
        danger: "#B54A3F",
        warn: "#C08A2E",
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Work Sans'", "sans-serif"],
      },
      boxShadow: {
        soft: "0 20px 50px -20px rgba(74, 46, 35, 0.20)",
        card: "0 8px 24px -12px rgba(74, 46, 35, 0.14)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.35s ease-out forwards",
      },
    },
  },
  plugins: [],
};
