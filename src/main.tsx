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
              theme="dark"
              toastOptions={{
                classNames: {
                  toast: "bg-carbon-900 border border-carbon-800 shadow-2xl rounded-[2rem] px-6 py-4 flex items-center gap-4",
                  title: "!text-white font-bold text-base",
                  description: "!text-carbon-300 font-medium text-sm",
                },
                style: {
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  backgroundColor: "rgba(17, 24, 39, 0.95)", // carbon-900 slightly transparent
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: "white",
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
