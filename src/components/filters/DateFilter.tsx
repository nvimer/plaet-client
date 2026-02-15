import { useState } from "react";
import { ChevronDown, Calendar, X } from "lucide-react";
import { cn } from "@/utils/cn";

export type DateFilterType = "TODAY" | "YESTERDAY" | "WEEK" | "CUSTOM";

interface DateFilterOption {
  value: DateFilterType;
  label: string;
  shortcut?: string;
}

export interface DateRange {
  start: string;
  end: string;
}

interface DateFilterProps {
  value: DateFilterType;
  onChange: (value: DateFilterType) => void;
  customRange?: DateRange;
  onCustomRangeChange?: (range: DateRange) => void;
  className?: string;
}

const DATE_OPTIONS: DateFilterOption[] = [
  { value: "TODAY", label: "Hoy", shortcut: "H" },
  { value: "YESTERDAY", label: "Ayer", shortcut: "A" },
  { value: "WEEK", label: "Últimos 7 días", shortcut: "7" },
  { value: "CUSTOM", label: "Personalizado", shortcut: "P" },
];

/**
 * DateFilter Component
 *
 * Modern date filtering with quick options and custom range picker.
 * Designed for touch-friendly interaction with clear visual hierarchy.
 *
 * Features:
 * - Quick date options (Today, Yesterday, Week)
 * - Custom date range picker
 * - Visual indicators for active selection
 * - Mobile-optimized dropdown
 */
export function DateFilter({
  value,
  onChange,
  customRange,
  onCustomRangeChange,
  className,
}: DateFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showCustomPicker, setShowCustomPicker] = useState(value === "CUSTOM");

  const selectedOption = DATE_OPTIONS.find((opt) => opt.value === value);

  const handleSelect = (optionValue: DateFilterType) => {
    onChange(optionValue);
    setShowCustomPicker(optionValue === "CUSTOM");
    if (optionValue !== "CUSTOM") {
      setIsOpen(false);
    }
  };

  const getDefaultCustomRange = (): DateRange => {
    const today = new Date();
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    return {
      start: lastWeek.toISOString().split("T")[0],
      end: today.toISOString().split("T")[0],
    };
  };

  return (
    <div className={cn("relative", className)}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all duration-200",
          "min-h-[44px] w-full sm:w-auto",
          "bg-white border-sage-200 hover:border-sage-400",
          "focus:outline-none focus:ring-2 focus:ring-sage-500/20",
          isOpen && "border-sage-400 ring-2 ring-sage-500/20"
        )}
      >
        <Calendar className="w-4 h-4 text-sage-600 flex-shrink-0" />
        <span className="text-sm font-medium text-carbon-700 truncate">
          {selectedOption?.label || "Seleccionar fecha"}
        </span>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-carbon-400 transition-transform duration-200 flex-shrink-0",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <div
            className="fixed inset-0 bg-black/20 z-40 sm:hidden"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div
            className={cn(
              "absolute z-50 mt-2 bg-white rounded-2xl border-2 border-sage-200 shadow-xl",
              "min-w-[280px] sm:min-w-[320px]",
              "right-0 sm:left-0",
              "animate-in fade-in slide-in-from-top-2 duration-200"
            )}
          >
            {/* Quick Options */}
            <div className="p-2">
              {DATE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    "flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all duration-200",
                    "min-h-[44px]",
                    value === option.value
                      ? "bg-sage-100 text-sage-900 border border-sage-200"
                      : "hover:bg-sage-50 text-carbon-700"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">{option.label}</span>
                    {option.shortcut && (
                      <kbd className="hidden sm:inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium text-carbon-500 bg-carbon-100 rounded">
                        {option.shortcut}
                      </kbd>
                    )}
                  </div>
                  {value === option.value && (
                    <div className="w-2 h-2 rounded-full bg-sage-600" />
                  )}
                </button>
              ))}
            </div>

            {/* Custom Range Picker */}
            {showCustomPicker && (
              <div className="border-t border-sage-200 p-4 space-y-3">
                <p className="text-sm font-medium text-carbon-700 mb-3">
                  Rango personalizado
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-carbon-500 mb-1.5">
                      Desde
                    </label>
                    <input
                      type="date"
                      value={customRange?.start || getDefaultCustomRange().start}
                      onChange={(e) =>
                        onCustomRangeChange?.({
                          ...(customRange || getDefaultCustomRange()),
                          start: e.target.value,
                        })
                      }
                      className={cn(
                        "w-full px-3 py-2 rounded-xl border-2 text-sm",
                        "border-sage-200 focus:border-sage-400 focus:outline-none",
                        "min-h-[44px]"
                      )}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-carbon-500 mb-1.5">
                      Hasta
                    </label>
                    <input
                      type="date"
                      value={customRange?.end || getDefaultCustomRange().end}
                      onChange={(e) =>
                        onCustomRangeChange?.({
                          ...(customRange || getDefaultCustomRange()),
                          end: e.target.value,
                        })
                      }
                      className={cn(
                        "w-full px-3 py-2 rounded-xl border-2 text-sm",
                        "border-sage-200 focus:border-sage-400 focus:outline-none",
                        "min-h-[44px]"
                      )}
                    />
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full py-2.5 px-4 bg-sage-600 text-white rounded-xl text-sm font-medium hover:bg-sage-700 transition-colors min-h-[44px]"
                >
                  Aplicar
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Selected Range Display */}
      {value === "CUSTOM" && customRange && (
        <div className="flex items-center gap-2 mt-2 text-xs text-carbon-500">
          <span>
            {new Date(customRange.start).toLocaleDateString("es-CO")} -
            {new Date(customRange.end).toLocaleDateString("es-CO")}
          </span>
          <button
            onClick={() => onChange("TODAY")}
            className="p-1 hover:bg-sage-100 rounded-full transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}
