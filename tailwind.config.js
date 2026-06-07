/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{vue,ts}"],
    theme: {
        extend: {
            colors: {
                lz: {
                    50: "rgb(var(--lz-50) / <alpha-value>)",
                    100: "rgb(var(--lz-100) / <alpha-value>)",
                    200: "rgb(var(--lz-200) / <alpha-value>)",
                    300: "rgb(var(--lz-300) / <alpha-value>)",
                    400: "rgb(var(--lz-400) / <alpha-value>)",
                    500: "rgb(var(--lz-500) / <alpha-value>)",
                    600: "rgb(var(--lz-600) / <alpha-value>)",
                    700: "rgb(var(--lz-700) / <alpha-value>)",
                    800: "rgb(var(--lz-800) / <alpha-value>)",
                    900: "rgb(var(--lz-900) / <alpha-value>)",
                    950: "rgb(var(--lz-950) / <alpha-value>)",
                },
                dark: {
                    50: "rgb(var(--dark-50) / <alpha-value>)",
                    100: "rgb(var(--dark-100) / <alpha-value>)",
                    200: "rgb(var(--dark-200) / <alpha-value>)",
                    300: "rgb(var(--dark-300) / <alpha-value>)",
                    400: "rgb(var(--dark-400) / <alpha-value>)",
                    500: "rgb(var(--dark-500) / <alpha-value>)",
                    600: "rgb(var(--dark-600) / <alpha-value>)",
                    700: "rgb(var(--dark-700) / <alpha-value>)",
                    750: "rgb(var(--dark-750) / <alpha-value>)",
                    800: "rgb(var(--dark-800) / <alpha-value>)",
                    850: "rgb(var(--dark-850) / <alpha-value>)",
                    900: "rgb(var(--dark-900) / <alpha-value>)",
                    950: "rgb(var(--dark-950) / <alpha-value>)",
                },
            },
            fontFamily: {
                sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
                display: ["Inter", "system-ui", "-apple-system", "sans-serif"],
            },
        },
    },
    plugins: [],
};
