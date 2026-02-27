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
  label?: string;
}

const DATE_OPTIONS: DateFilterOption[] = [
  { value: "TODAY", label: "Hoy", shortcut: "H" },
  { value: "YESTERDAY", label: "Ayer", shortcut: "A" },
  { value: "WEEK", label: "Últimos 7 días", shortcut: "7" },
  { value: "CUSTOM", label: "Personalizado", shortcut: "P" },
];

/**
 * Premium Date Filter
 * Refined dropdown with quick options and range selection.
 */
export function DateFilter({
  value,
  onChange,
  customRange,
  onCustomRangeChange,
  className,
  label,
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
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <span className="text-[10px] font-black text-carbon-400 uppercase tracking-[0.2em] ml-1">
          {label}
        </span>
      )}
      <div className="relative">
        {/* Trigger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex items-center gap-3 px-5 py-3 rounded-2xl border-2 transition-all duration-300",
            "min-h-[48px] w-full sm:w-auto",
            "bg-white border-sage-100 hover:border-sage-400",
            isOpen ? "border-sage-400 shadow-soft-lg" : "shadow-soft-sm"
          )}
        >
          <Calendar className="w-4 h-4 text-sage-600 flex-shrink-0" />
          <span className="text-sm font-bold text-carbon-900 truncate">
            {selectedOption?.label || "Seleccionar fecha"}
          </span>
          <ChevronDown
            className={cn(
              "w-4 h-4 text-carbon-300 transition-transform duration-300 flex-shrink-0 ml-2",
              isOpen && "rotate-180 text-carbon-900"
            )}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            <div
              className={cn(
                "absolute z-50 mt-3 bg-white rounded-3xl border border-sage-100 shadow-2xl",
                "min-w-[280px] sm:min-w-[320px]",
                "right-0 sm:left-0",
                "animate-in fade-in slide-in-from-top-3 duration-300"
              )}
            >
              {/* Quick Options */}
              <div className="p-3">
                {DATE_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    className={cn(
                      "flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all duration-200",
                      value === option.value
                        ? "bg-sage-100 text-sage-900 font-bold"
                        : "hover:bg-sage-50 text-carbon-600 font-medium"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm">{option.label}</span>
                    </div>
                    {value === option.value && (
                      <div className="w-1.5 h-1.5 rounded-full bg-sage-600 shadow-sm" />
                    )}
                  </button>
                ))}
              </div>

              {/* Custom Range Picker */}
              {showCustomPicker && (
                <div className="border-t border-sage-50 p-5 space-y-4 bg-sage-50/20 rounded-b-3xl">
                  <p className="text-[10px] font-black text-carbon-400 uppercase tracking-widest">
                    Rango personalizado
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-carbon-400 uppercase ml-1">
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
                          "w-full px-3 py-2 rounded-xl border-2 text-sm font-bold text-carbon-900 bg-white",
                          "border-sage-100 focus:border-sage-400 focus:outline-none transition-colors"
                        )}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-carbon-400 uppercase ml-1">
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
                          "w-full px-3 py-2 rounded-xl border-2 text-sm font-bold text-carbon-900 bg-white",
                          "border-sage-100 focus:border-sage-400 focus:outline-none transition-colors"
                        )}
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-full py-3 px-4 bg-carbon-900 text-white rounded-2xl text-sm font-bold hover:bg-carbon-800 transition-all shadow-soft-lg active:scale-95"
                  >
                    Aplicar Rango
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}