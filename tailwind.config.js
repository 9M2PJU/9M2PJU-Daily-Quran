/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": {
                    DEFAULT: "#10b981", // Emerald 500
                    50: "#ecfdf5",
                    100: "#d1fae5",
                    200: "#a7f3d0",
                    300: "#6ee7b7",
                    400: "#34d399",
                    500: "#10b981",
                    600: "#059669",
                    700: "#047857",
                    800: "#065f46",
                    900: "#064e3b",
                    950: "#022c22",
                },
                "gold": {
                    DEFAULT: "#d4af37",
                    50: "#fdfbf2",
                    100: "#faf4df",
                    200: "#f4e6b8",
                    300: "#ecd38c",
                    400: "#e5c065",
                    500: "#d4af37",
                    600: "#b89228",
                    700: "#927020",
                    800: "#775920",
                    900: "#644a1f",
                    950: "#39270e",
                },
                "emerald-night": {
                    950: "#050e09",
                    900: "#091710",
                    850: "#0d2017",
                    800: "#132b20",
                    750: "#193729",
                    700: "#214434",
                },
                "accent-gold": "#d4af37",
                "background-light": "#f6f9f6",
                "background-dark": "#07140e",
            },
            fontFamily: {
                "sans": ["Public Sans", "Inter", "system-ui", "sans-serif"],
                "display": ["Public Sans", "sans-serif"],
                "arabic": ["Amiri", "Noto Naskh Arabic", "Scheherazade New", "serif"],
                "quran": ["Amiri", "Noto Naskh Arabic", "serif"],
            },
            borderRadius: {
                "xl": "0.75rem",
                "2xl": "1rem",
                "3xl": "1.5rem",
            },
            animation: {
                'spin-slow': 'spin 10s linear infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }
        },
    },
    plugins: [],
}
