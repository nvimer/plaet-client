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
            {/* TOASTER COMPONENT - Premium Dynamic Island Style */}
            <Toaster
              position="top-center"
              offset="24px"
              duration={3000}
              toastOptions={{
                className: "bg-carbon-900 text-white border border-carbon-800 shadow-2xl rounded-[2rem] font-bold px-6 py-4 flex items-center gap-3",
                style: {
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  backgroundColor: "rgba(17, 24, 39, 0.95)", // carbon-900 slightly transparent
                },
                success: {
                  iconTheme: {
                    primary: "#10b981", // emerald-500
                    secondary: "white",
                  },
                },
                error: {
                  iconTheme: {
                    primary: "#f43f5e", // rose-500
                    secondary: "white",
                  },
                },
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
