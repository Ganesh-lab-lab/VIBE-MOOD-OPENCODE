/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        primary: "var(--primary)",
        "primary-2": "var(--primary-2)",
        "on-primary": "var(--on-primary)",
        "accent-new": "var(--accent-new)",
        secondary: "var(--secondary)",
        highlight: "var(--highlight)",
        text: "var(--text)",
        muted: "var(--muted)",
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', '"Noto Sans Devanagari"', '"Noto Sans Telugu"', '"Noto Sans Tamil"', '"Noto Sans Malayalam"', '"Noto Sans Kannada"', "ui-sans-serif", "system-ui", "sans-serif"],
        body: ['"DM Sans"', '"Noto Sans Devanagari"', '"Noto Sans Telugu"', '"Noto Sans Tamil"', '"Noto Sans Malayalam"', '"Noto Sans Kannada"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        glass: "24px",
      },
      backdropBlur: {
        glass: "28px",
      },
      boxShadow: {
        glass: "var(--glass-shadow)",
      },
    },
  },
  plugins: [],
};