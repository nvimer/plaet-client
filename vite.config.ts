import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // We simplify manualChunks to avoid circular dependencies between features.
        // Let Vite handle internal feature splitting via React.lazy() imports.
        manualChunks(id) {
          if (id.includes("node_modules")) {
            // Group large UI/Chart libraries separately
            if (id.includes("recharts")) {
              return "vendor-charts";
            }
            if (id.includes("framer-motion")) {
              return "vendor-animations";
            }
            if (id.includes("@dnd-kit")) {
              return "vendor-dnd";
            }
            if (id.includes("lucide-react")) {
              return "vendor-icons";
            }
            // React and core routing stay together for stability
            if (id.includes("react") || id.includes("react-dom") || id.includes("react-router-dom")) {
              return "vendor-core";
            }
            return "vendor-base";
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  // @ts-expect-error - Vitest configuration
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/tests/setup.ts",
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
});
