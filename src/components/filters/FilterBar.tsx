import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

interface FilterBarProps {
  children: ReactNode;
  className?: string;
  variant?: "inline" | "card";
}

/**
 * Premium Filter Bar Container
 * A layout wrapper for organizing search and filter components.
 */
export function FilterBar({ children, className, variant = "inline" }: FilterBarProps) {
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row md:items-end justify-between gap-6",
        variant === "card" && "bg-white p-6 rounded-3xl border border-sage-100 shadow-smooth-sm",
        className
      )}
      role="search"
      aria-label="Contenedor de filtros"
    >
      {children}
    </div>
  );
}