import { X, SlidersHorizontal } from "lucide-react";
import { cn } from "@/utils/cn";
import { motion, AnimatePresence } from "framer-motion";

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
 * Premium Active Filter Chips
 * Animated labels showing current filters with quick removal.
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
        "flex flex-wrap items-center justify-between gap-4 py-2",
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 mr-2 px-3 py-1.5 bg-carbon-900 rounded-full text-white">
          <SlidersHorizontal className="w-3 h-3 stroke-[3px]" />
          <span className="text-[10px] font-black uppercase tracking-widest">Activos</span>
        </div>
        
        <AnimatePresence mode="popLayout">
          {chips.map((chip) => (
            <motion.span
              key={chip.key}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="inline-flex items-center gap-2 pl-3 pr-1.5 py-1.5 rounded-full bg-white border border-sage-200 text-xs font-bold text-carbon-700 shadow-soft-sm"
            >
              <span className="text-carbon-400 font-medium">{chip.label}:</span>
              <span>{chip.value}</span>
              <button
                type="button"
                onClick={() => onClearFilter(chip.key)}
                className="p-1 rounded-full text-carbon-300 hover:text-rose-600 hover:bg-rose-50 transition-all active:scale-90"
                aria-label={`Quitar filtro ${chip.label}`}
              >
                <X className="w-3 h-3 stroke-[3px]" />
              </button>
            </motion.span>
          ))}
        </AnimatePresence>

        <button
          type="button"
          onClick={onClearAll}
          className="text-[10px] font-black text-sage-600 uppercase tracking-widest hover:text-carbon-900 transition-colors ml-2 px-2 py-1"
        >
          Limpiar Todo
        </button>
      </div>

      <div className="flex items-center gap-2 bg-sage-50 px-4 py-1.5 rounded-full border border-sage-100">
        <span className="text-[10px] font-black text-carbon-400 uppercase tracking-widest">Resultados:</span>
        <span className="text-xs font-black text-carbon-900">
          {resultCount} {resultLabel}
        </span>
      </div>
    </div>
  );
}