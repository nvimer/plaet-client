import { cn } from "@/utils/cn";

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
 * Pills horizontales para filtros (estado, ubicación, etc.).
 * Mismo diseño en todos los módulos. Touch-friendly 44px.
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
    <div className={cn("flex flex-col gap-2", className)} role="group" aria-label={ariaLabel ?? label ?? "Opciones"}>
      {label && (
        <span className="text-sm font-semibold text-carbon-800">{label}</span>
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
                "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium min-h-[44px] touch-manipulation transition-all duration-200",
                "border-2",
                isSelected
                  ? "bg-sage-100 border-sage-400 text-sage-900 ring-2 ring-sage-green-400/20"
                  : "bg-white border-sage-200 text-carbon-600 hover:bg-sage-50 hover:border-sage-300"
              )}
              aria-pressed={isSelected}
            >
              <span>{opt.label}</span>
              {opt.count !== undefined && (
                <span
                  className={cn(
                    "inline-flex items-center justify-center min-w-[22px] h-5 px-1.5 rounded-full text-xs font-semibold",
                    isSelected ? "bg-sage-200 text-sage-800" : "bg-sage-100 text-carbon-600"
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
