module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#060810",
        surface: "rgba(255,255,255,0.04)",
        amber: {
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
        },
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      keyframes: {
        "counter-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-left": {
          from: { opacity: "0", transform: "translateX(-40px)" },
          to:   { opacity: "1", transform: "translateX(0)" },
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(40px)" },
          to:   { opacity: "1", transform: "translateX(0)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(245,158,11,0.3)" },
          "50%":      { boxShadow: "0 0 40px rgba(245,158,11,0.6)" },
        },
        "float-card": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "33%":      { transform: "translateY(-8px) rotate(0.5deg)" },
          "66%":      { transform: "translateY(-4px) rotate(-0.5deg)" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to:   { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "counter-up":    "counter-up 0.6s ease-out both",
        "slide-in-left": "slide-in-left 0.7s ease-out both",
        "slide-in-right":"slide-in-right 0.7s ease-out both",
        "pulse-glow":    "pulse-glow 2s ease-in-out infinite",
        "float-card":    "float-card 6s ease-in-out infinite",
        "spin-slow":     "spin-slow 20s linear infinite",
      },
    },
  },
  plugins: [],
};
