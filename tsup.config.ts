import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.ts"],
    format: ["esm", "cjs"],
    dts: true,
    clean: true,
    external: [
        /^@radix-ui\/.*/,
        "server-only",
        "react",
        "next",
        "next/navigation",
        "next/headers",
        "react-dom",
        "lucide-react",
        "zustand",
        "react-hook-form",
        "@hookform/resolvers",
        "@hookform/resolvers/zod",
        "zod",
        "class-variance-authority",
        "clsx",
        "tailwind-merge",
        "axios",        // ← this was the big one
        "sonner",       // ← toast library
    ],
    esbuildOptions(options) {
        options.alias = {
            "@": "./src",
        };
    },
});