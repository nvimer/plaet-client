import { cn } from "@/utils/cn";

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
  "min-h-[44px] w-full px-4 py-2.5 rounded-xl border-2 border-sage-300 bg-sage-50/80 text-carbon-900 text-sm font-medium placeholder:text-carbon-400 focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-sage-400 touch-manipulation transition-colors";

/**
 * Select de filtro unificado. Mismo estilo en mesas, productos, categorías.
 * Touch-friendly 44px, accesible.
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
          className="text-sm font-semibold text-carbon-800"
        >
          {label}
        </label>
      )}
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
    </div>
  );
}
