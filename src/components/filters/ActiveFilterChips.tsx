import { Filter, X } from "lucide-react";
import { cn } from "@/utils/cn";

export interface ActiveFilterChipItem {
  key: string;
  label: string;
  value: string;
}

interface ActiveFilterChipsProps {
  chips: ActiveFilterChipItem[];
  resultCount: number;
  resultLabel: string;
  onClearFilter: (key: string) => void;
  onClearAll: () => void;
  className?: string;
}

/**
 * Chips de filtros activos + contador + "Limpiar todos".
 * Mismo diseño en mesas, productos y cualquier módulo.
 */
export function ActiveFilterChips({
  chips,
  resultCount,
  resultLabel,
  onClearFilter,
  onClearAll,
  className,
}: ActiveFilterChipsProps) {
  if (chips.length === 0) return null;

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl border-2 border-sage-200 bg-sage-50/60",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
        <span className="flex items-center gap-2 text-sm font-semibold text-sage-800 shrink-0">
          <Filter className="w-4 h-4" />
          Filtros activos
        </span>
        {chips.map((chip) => (
          <span
            key={chip.key}
            className="inline-flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-xl bg-white border-2 border-sage-200 text-sm font-medium text-carbon-800"
          >
            <span className="text-carbon-500">{chip.label}:</span>
            <span>{chip.value}</span>
            <button
              type="button"
              onClick={() => onClearFilter(chip.key)}
              className="p-1 rounded-lg text-carbon-400 hover:text-rose-600 hover:bg-rose-50 transition-colors min-w-[28px] min-h-[28px] flex items-center justify-center touch-manipulation"
              aria-label={`Quitar filtro ${chip.label}`}
            >
              <X className="w-4 h-4" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-sm font-medium text-carbon-600">
          <strong>{resultCount}</strong> {resultLabel}
        </span>
        <button
          type="button"
          onClick={onClearAll}
          className="text-sm font-semibold text-sage-700 hover:text-sage-900 hover:underline transition-colors touch-manipulation py-1"
        >
          Limpiar todos
        </button>
      </div>
    </div>
  );
}
