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
        manualChunks(id) {
          // Vendor chunks
          if (id.includes("node_modules")) {
            if (id.includes("react") || id.includes("react-dom") || id.includes("react-router-dom")) {
              return "vendor-core";
            }
            if (id.includes("framer-motion") || id.includes("lucide-react")) {
              return "vendor-ui";
            }
            if (id.includes("recharts")) {
              return "vendor-charts";
            }
            if (id.includes("@tanstack/react-query")) {
              return "vendor-query";
            }
            if (id.includes("@dnd-kit")) {
              return "vendor-dnd";
            }
            return "vendor"; // Other small dependencies
          }

          // Feature chunks
          if (id.includes("/src/features/orders/")) {
            return "feature-orders";
          }
          if (id.includes("/src/features/inventory/") || id.includes("/src/features/daily-menu/")) {
            return "feature-inventory";
          }
          if (id.includes("/src/features/menu/")) {
            return "feature-menu";
          }
          if (id.includes("/src/features/analytics/") || id.includes("/src/features/permissions/") || id.includes("/src/features/restaurants/")) {
            return "feature-admin";
          }
          if (id.includes("/src/features/users/") || id.includes("/src/features/customers/")) {
            return "feature-users";
          }
          if (id.includes("/src/features/auth/")) {
            return "feature-auth";
          }
        },
      },
    },
    chunkSizeWarningLimit: 800, // Increase limit slightly as we now have controlled chunks
  },
  // @ts-expect-error - Vitest configuration
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/tests/setup.ts",
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
});
