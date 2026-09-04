/** @type {import('tailwindcss').Config} */
module.exports = {
  // 1. File Path Coverage: Ensures Tailwind scans all JS/TS/JSX/TSX/MDX files 
  // across both App Router, Pages Router, components, and optional src directory structure.
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  // 2. Dark Mode Strategy: Uses the class-based dark mode approach, required for 
  // manual theme switching and full compatibility with shadcn/ui.
  darkMode: ["class"],

  theme: {
    extend: {
      // 3. Color Palette Configuration: Combines custom brand design tokens with 
      // shadcn/ui core CSS variable fallbacks for unified dark mode styling.
      colors: {
        primary: "#060810",
        surface: "rgba(255,255,255,0.04)",
        brandBlue: "#2563eb",
        brandOrange: "#f97316",
        amber: {
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
        },
        // shadcn/ui mandatory structural tokens
        border: "rgba(255,255,255,0.08)",
        input: "rgba(255,255,255,0.05)",
        ring: "#2563eb",
        background: "#040612",
        foreground: "#f3f4f6",
      },

      // 4. Typography Hierarchy: Prioritizes modern, highly readable sans-serif 
      // variable fonts with standard system rollbacks.
      fontFamily: {
        sans: ["Plus Jakarta Sans", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },

      // 5. Custom Animation Keyframes: Defines complex CSS transitions for UI interactions, 
      // UI entry states, glow effects, and micro-animations.
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

      // 6. Animation Classes Map: Utility classes exposing keyframes to Tailwind templates.
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

  // 7. Tailwind Plugins: Includes tailwindcss-animate to enable shadcn/ui design engine animations.
  plugins: [require("tailwindcss-animate")],
};