import { cn } from "@/utils/cn";
import { Check } from "lucide-react";
import type { MenuOption } from "../types/orderBuilder";
import { motion } from "framer-motion";

interface MenuItemSelectorProps {
  label: string;
  options: MenuOption[];
  selectedOption: MenuOption | null;
  onSelect: (option: MenuOption) => void;
  required?: boolean;
  error?: string;
  icon?: React.ReactNode;
  color?: "amber" | "emerald" | "sage" | "blue" | "purple";
  compact?: boolean;
}

/**
 * Normalized MenuItemSelector
 * 
 * Compact version: Uses high-density pills to prevent overflow and save space.
 * Standard version: Uses card-based selection.
 */
export function MenuItemSelector({
  label,
  options = [],
  selectedOption,
  onSelect,
  required = false,
  error,
  icon,
  color = "sage",
  compact = false,
}: MenuItemSelectorProps) {
  const colorClasses = {
    amber: { text: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
    emerald: { text: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
    sage: { text: "text-sage-600", bg: "bg-sage-50", border: "border-sage-100" },
    blue: { text: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
    purple: { text: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100" },
  };

  const colors = colorClasses[color] || colorClasses.sage;

  if (options.length === 0) return null;

  // COMPACT MODE: Minimalist Pill Layout
  if (compact) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 px-1">
          <div className={cn("w-6 h-6 rounded-lg flex items-center justify-center scale-90", colors.bg, colors.text)}>
            {icon}
          </div>
          <span className="text-[11px] font-bold text-carbon-700">
            {label} {required && <span className="text-error-500">*</span>}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {options.map((option) => {
            const isSelected = selectedOption?.id === option.id;
            return (
              <button
                key={option.id}
                onClick={() => onSelect(option)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium transition-all border-2 flex items-center gap-1.5 active:scale-95",
                  isSelected
                    ? "bg-carbon-900 border-carbon-900 text-white shadow-soft-md"
                    : "bg-white border-sage-50 text-carbon-500 hover:border-sage-200"
                )}
              >
                {isSelected && <Check className="w-3 h-3 stroke-[3px]" />}
                {option.name}
              </button>
            );
          })}
        </div>
        {error && touched && (
          <p className="text-[10px] text-error-600 font-semibold ml-1">{error}</p>
        )}
      </div>
    );
  }

  // STANDARD MODE (Used if needed elsewhere)
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-3">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-inner", colors.bg, colors.text)}>
            {icon}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm text-carbon-900">{label}</span>
            {required && <span className="text-[10px] text-error-500 font-bold uppercase tracking-tighter">Selección requerida</span>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {options.map((option) => {
          const isSelected = selectedOption?.id === option.id;
          return (
            <button
              key={option.id}
              onClick={() => onSelect(option)}
              className={cn(
                "group relative flex items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 text-center active:scale-95 min-h-[60px]",
                isSelected
                  ? "border-carbon-900 bg-carbon-900 text-white shadow-soft-xl"
                  : "border-sage-50 bg-sage-50/30 text-carbon-600 hover:border-sage-200"
              )}
            >
              <span className="text-xs font-bold">{option.name}</span>
              {isSelected && (
                <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary-500 border-2 border-white rounded-full flex items-center justify-center shadow-md">
                  <Check className="w-3 h-3 text-white stroke-[4px]" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
