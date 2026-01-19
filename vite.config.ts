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
  // Configurar alias @ para importaciones limpias
  // Ahora puedes hacer: import { Order } from '@/types'
  // En lugar de: import { Order } from '../../../types'
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          vendor: ['react', 'react-dom', 'react-router-dom'],
          query: ['@tanstack/react-query'],
          ui: ['lucide-react', 'sonner'],
          // Feature chunks
          users: ['@/features/users'],
          orders: ['@/features/orders'],
          menu: ['@/features/menu'],
          tables: ['@/features/tables'],
        },
      },
    },
    chunkSizeWarningLimit: 800, // Increase warning limit
  },
});
