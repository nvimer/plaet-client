import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

interface FilterBarProps {
  children: ReactNode;
  className?: string;
}

/**
 * Contenedor unificado para filtros en todos los módulos.
 * Mismo diseño: bordes redondeados, borde sage, fondo blanco, touch-friendly.
 */
export function FilterBar({ children, className }: FilterBarProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border-2 border-sage-200 bg-white shadow-sm",
        "p-4 sm:p-5",
        "min-h-[52px]",
        className
      )}
      role="search"
      aria-label="Filtros"
    >
      {children}
    </div>
  );
}
