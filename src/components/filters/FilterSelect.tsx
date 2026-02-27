import { cn } from "@/utils/cn";
import { ChevronDown } from "lucide-react";

export interface FilterSelectOption {
  value: string;
  label: string;
}

interface FilterSelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: FilterSelectOption[];
  placeholder?: string;
  "aria-label"?: string;
  className?: string;
  id?: string;
}

const inputClass =
  "appearance-none min-h-[48px] w-full px-5 py-3 rounded-2xl border-2 border-sage-100 bg-white text-carbon-900 text-sm font-bold placeholder:text-carbon-300 focus:outline-none focus:border-sage-400 focus:shadow-soft-lg transition-all duration-300 touch-manipulation cursor-pointer";

/**
 * Premium Filter Select
 * Elegant dropdown for filtering categories, roles or types.
 */
export function FilterSelect({
  label,
  value,
  onChange,
  options,
  placeholder = "Seleccionar...",
  "aria-label": ariaLabel,
  className,
  id,
}: FilterSelectProps) {
  const selectId = id ?? `filter-select-${label?.replace(/\s/g, "-") ?? "default"}`;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <label
          htmlFor={selectId}
          className="text-[10px] font-black text-carbon-400 uppercase tracking-[0.2em] ml-1"
        >
          {label}
        </label>
      )}
      <div className="relative group">
        <select
          id={selectId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
          aria-label={ariaLabel ?? label ?? "Filtrar"}
        >
          {placeholder && (
            <option value="">{placeholder}</option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-carbon-300 group-hover:text-carbon-900 transition-colors">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}