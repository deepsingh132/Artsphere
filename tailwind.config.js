module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: ["Roboto", "sans-serif"],
      roboto: ["Roboto", "sans-serif"],
    },
    extend: {
      colors: {
        primary: "#f8b591",
        secondary: "#faeeae",
        text: "#263238",
        hoverColor: "#FF9A3E",
        cardBorder: "#cfd8dc",
        darkBg: "#000000",
        darkText: "#e7e9ea",
        darkCard: "#202327",
        lightBorderColor: "#eff3f4",
        darkBorderColor: "#2f3336",
        darkCardBorder: "#656e70",
        darkHover: "rgba(231,233,234,0.1)",
        "overlay-color": "#656e70",
      },
      keyframes: {
        chevronMove: {
          "0%": { transform: "translateX(0px)" },
          "40%": { transform: "translateX(4px)" },
          "60%": { transform: "translateX(8px)" },
        },
      },

      animation: {
        chevronMove: "chevronMove 2s ease-in-out infinite",
      },
    },
  },

  darkMode: "class",

  variants: { display: ["responsive", "hover", "focus"] },
  plugins: [require("@tailwindcss/forms")],
};
