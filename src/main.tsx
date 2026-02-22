import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "@/contexts/EnhancedAuthContext";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient.ts";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "sonner";
import { HelmetProvider } from "react-helmet-async";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* TanStank Query Provider */}
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <AuthProvider>
          <SidebarProvider>
            <App />
            {/* TOASTER COMPONENT */}
            {/* Displays toast notifications throughtout the app */}
            <Toaster
              position="top-right"
              expand={true}
              richColors
              closeButton
              toastOptions={{
                // Custom styles matching our design system
                style: {
                  borderRadius: "12px",
                  padding: "16px",
                  fontSize: "15px",
                  fontWeight: "400",
                },
                className: "font-light",
              }}
            />
            {/* DevTools (only in development) */}
            <ReactQueryDevtools initialIsOpen={false} />
          </SidebarProvider>
        </AuthProvider>
      </HelmetProvider>
    </QueryClientProvider>
  </StrictMode>,
);
