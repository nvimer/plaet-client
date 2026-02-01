import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";
import type { BreadcrumbItem } from "@/app/breadcrumbConfig";

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Breadcrumbs Component
 *
 * Displays navigation path: Inicio > Mesas > Nueva mesa
 * Accessible, keyboard-navigable, touch-friendly.
 */
export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  if (!items.length) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "flex items-center gap-2 text-sm sm:text-base text-carbon-500",
        className
      )}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <span key={index} className="flex items-center gap-2">
            {index > 0 && (
              <ChevronRight
                className="w-4 h-4 sm:w-5 sm:h-5 text-carbon-300 flex-shrink-0"
                aria-hidden
              />
            )}
            {item.path && !isLast ? (
              <Link
                to={item.path}
                className={cn(
                  "text-carbon-500 hover:text-carbon-800",
                  "transition-colors duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-sage-400 focus:ring-offset-1 rounded"
                )}
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={cn(
                  "text-carbon-700 font-medium",
                  isLast && "text-carbon-900"
                )}
                aria-current={isLast ? "page" : undefined}
              >
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
