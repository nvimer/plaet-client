import { cn } from "@/utils/cn";
import { motion } from "framer-motion";

export interface FilterPillOption {
  value: string;
  label: string;
  count?: number;
}

interface FilterPillsProps {
  label?: string;
  options: FilterPillOption[];
  value: string;
  onChange: (value: string) => void;
  "aria-label"?: string;
  className?: string;
}

/**
 * Premium Filter Pills
 * Modern, tactile-first pills with smooth animations and high-contrast active states.
 */
export function FilterPills({
  label,
  options,
  value,
  onChange,
  "aria-label": ariaLabel,
  className,
}: FilterPillsProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)} role="group" aria-label={ariaLabel ?? label ?? "Opciones de filtrado"}>
      {label && (
        <span className="text-[10px] font-black text-carbon-400 uppercase tracking-[0.2em] ml-1">
          {label}
        </span>
      )}
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isSelected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={cn(
                "relative inline-flex items-center gap-2.5 px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 min-h-[44px] touch-manipulation",
                "border-2",
                isSelected
                  ? "bg-carbon-900 border-carbon-900 text-white shadow-soft-lg shadow-carbon-200 z-10 scale-105"
                  : "bg-white border-sage-100 text-carbon-500 hover:border-sage-300 hover:bg-sage-50/50 hover:text-carbon-800"
              )}
              aria-pressed={isSelected}
            >
              {isSelected && (
                <motion.span
                  layoutId="active-pill-glow"
                  className="absolute inset-0 rounded-full bg-carbon-900 -z-10"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              
              <span className="relative z-10">{opt.label}</span>
              
              {opt.count !== undefined && (
                <span
                  className={cn(
                    "inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-black transition-colors",
                    isSelected ? "bg-white/20 text-white" : "bg-sage-100 text-carbon-500"
                  )}
                >
                  {opt.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}