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
                "primary": "#11d442",
                "accent-gold": "#d4af37",
                "background-light": "#f6f8f6",
                "background-dark": "#102215",
            },
            fontFamily: {
                "sans": ["Public Sans", "sans-serif"],
                "display": ["Public Sans", "sans-serif"],
                "arabic": ["Noto Sans Arabic", "serif"],
                "quran": ["Amiri", "serif"],
            },
            borderRadius: {
                "xl": "0.75rem",
                "2xl": "1rem",
                "3xl": "1.5rem",
            },
            animation: {
                'spin-slow': 'spin 10s linear infinite',
            }
        },
    },
    plugins: [],
}
