import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

interface CardGridProps {
  children: ReactNode;
  className?: string;
}

/**
 * Reusable grid for menu cards (productos / categorías).
 * Touch-friendly spacing (gap-6), responsive columns.
 */
export function CardGrid({ children, className }: CardGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6",
        className
      )}
    >
      {children}
    </div>
  );
}
