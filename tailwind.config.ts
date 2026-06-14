import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./components/**/*.{ts,tsx}",
        "./src/**/*.{ts,tsx}",
        "./context/**/*.{ts,tsx}",
        "./hooks/**/*.{ts,tsx}",
    ],
    theme: {
        extend: {},
    },
    plugins: [],
};

export default config;