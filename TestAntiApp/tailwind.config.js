/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        // Light mode base colors defined directly
        border: {
          DEFAULT: "hsl(214, 32%, 91%)",
          dark: "hsl(0, 0%, 20%)",
        },
        input: {
          DEFAULT: "hsl(214, 32%, 91%)",
          dark: "hsl(0, 0%, 20%)",
        },
        ring: "hsl(31, 93%, 60%)",
        background: {
          DEFAULT: "hsl(210, 20%, 98%)",
          dark: "hsl(0, 0%, 10%)",
        },
        foreground: {
          DEFAULT: "hsl(0, 0%, 10%)",
          dark: "hsl(0, 0%, 98%)",
        },
        primary: {
          DEFAULT: "hsl(31, 93%, 60%)",
          foreground: "hsl(0, 0%, 100%)",
        },
        secondary: {
          DEFAULT: "hsl(264, 47%, 36%)",
          foreground: "hsl(0, 0%, 100%)",
          dark: "hsl(264, 47%, 46%)",
        },
        destructive: {
          DEFAULT: "hsl(0, 84%, 60%)",
          foreground: "hsl(0, 0%, 100%)",
        },
        muted: {
          DEFAULT: "hsl(210, 20%, 96%)",
          foreground: "hsl(0, 0%, 45%)",
          dark: "hsl(0, 0%, 20%)",
          "dark-foreground": "hsl(0, 0%, 65%)",
        },
        accent: {
          DEFAULT: "hsl(204, 100%, 97%)",
          foreground: "hsl(0, 0%, 10%)",
          dark: "hsl(204, 100%, 20%)",
          "dark-foreground": "hsl(0, 0%, 98%)",
        },
        popover: {
          DEFAULT: "hsl(0, 0%, 100%)",
          foreground: "hsl(0, 0%, 10%)",
          dark: "hsl(0, 0%, 14%)",
          "dark-foreground": "hsl(0, 0%, 98%)",
        },
        card: {
          DEFAULT: "hsl(0, 0%, 100%)",
          foreground: "hsl(0, 0%, 10%)",
          dark: "hsl(0, 0%, 14%)",
          "dark-foreground": "hsl(0, 0%, 98%)",
        },
        brand: {
          purple: "hsl(264, 47%, 36%)",
          orange: "hsl(31, 93%, 60%)",
          text: "hsl(0, 0%, 10%)",
        },
      },
      borderRadius: {
        lg: "12px",
        md: "10px",
        sm: "8px",
      },
    },
  },
  plugins: [],
}
