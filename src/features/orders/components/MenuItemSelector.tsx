import { Card } from "@/components";
import { cn } from "@/utils/cn";
import { AlertCircle, Check, ImageIcon } from "lucide-react";
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
 * Premium MenuItemSelector
 * Used for visual selection of lunch categories (Soups, Principles, etc.)
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
    amber: { text: "text-warning-600", bg: "bg-warning-50" },
    emerald: { text: "text-success-600", bg: "bg-success-50" },
    sage: { text: "text-sage-600", bg: "bg-sage-50" },
    blue: { text: "text-blue-600", bg: "bg-blue-50" },
    purple: { text: "text-info-600", bg: "bg-info-50" },
  };

  const colors = colorClasses[color] || colorClasses.sage;

  if (options.length === 0) {
    return null; // Don't show empty categories
  }

  // Compact mode - high-density grid with icons
  if (compact) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center text-xs shadow-inner transition-all", colors.bg, colors.text)}>
              {icon}
            </div>
            <span className="font-black text-[10px] text-carbon-900 uppercase tracking-[0.15em] leading-none">
              {label}
            </span>
            {required && (
              <span className="text-[7px] bg-carbon-900 text-white px-1.5 py-0.5 rounded font-black tracking-tighter uppercase">
                Requerido
              </span>
            )}
          </div>
          {selectedOption && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex items-center gap-1 text-primary-600"
            >
              <Check className="w-3 h-3 stroke-[4px]" />
              <span className="text-[8px] font-black uppercase">Listo</span>
            </motion.div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          {options.map((option) => {
            const isSelected = selectedOption?.id === option.id;
            return (
              <button
                key={option.id}
                onClick={() => onSelect(option)}
                className={cn(
                  "group relative flex items-center gap-2 p-2 rounded-xl border-2 transition-all duration-300 text-left overflow-hidden active:scale-95",
                  isSelected
                    ? "border-carbon-900 bg-white shadow-soft-lg z-10"
                    : "border-sage-50 bg-white hover:border-sage-200"
                )}
              >
                <div className="w-8 h-8 rounded-lg bg-sage-50 overflow-hidden shrink-0 flex items-center justify-center">
                  {option.imageUrl ? (
                    <img src={option.imageUrl} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <ImageIcon className="w-4 h-4 text-sage-200 stroke-[1.5px]" />
                  )}
                </div>
                <span className={cn(
                  "text-[10px] font-black leading-tight truncate uppercase tracking-tight",
                  isSelected ? "text-carbon-900" : "text-carbon-500"
                )}>
                  {option.name}
                </span>
                {isSelected && (
                  <div className="absolute top-1 right-1 w-4 h-4 bg-carbon-900 rounded-full flex items-center justify-center shadow-md">
                    <Check className="w-2.5 h-2.5 text-white stroke-[4px]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
        {error && (
          <p className="text-[10px] text-error-600 font-bold ml-1 uppercase tracking-widest">{error}</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-y-3 px-1">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-inner", colors.bg, colors.text)}>
            {icon}
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xs text-carbon-900 uppercase tracking-widest leading-none">
              {label}
            </span>
            <div className="flex items-center gap-2 mt-1">
              {required && (
                <span className="text-[8px] bg-carbon-900 text-white px-1.5 py-0.5 rounded font-black tracking-tighter uppercase">
                  Requerido
                </span>
              )}
              <span className="text-[10px] text-carbon-400 font-bold uppercase">{options.length} opciones</span>
            </div>
          </div>
        </div>
        {selectedOption && (
          <motion.div 
            initial={{ opacity: 0, x: 5 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-1.5 px-3 py-1 bg-primary-50 rounded-lg border border-primary-100"
          >
            <Check className="w-3.5 h-3.5 text-primary-600 stroke-[4px]" />
            <span className="text-[10px] text-primary-700 font-black uppercase tracking-wider">Elegido</span>
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {options.map((option) => {
          const isSelected = selectedOption?.id === option.id;
          return (
            <button
              key={option.id}
              onClick={() => onSelect(option)}
              className={cn(
                "group relative flex flex-col rounded-2xl border-2 transition-all duration-300 text-left overflow-hidden active:scale-95 min-h-[120px]",
                isSelected
                  ? "border-carbon-900 bg-white shadow-soft-xl z-10"
                  : "border-sage-100 bg-white hover:border-sage-300 hover:shadow-soft-md"
              )}
            >
              {/* Image Container */}
              <div className="relative aspect-[16/9] w-full bg-sage-50 overflow-hidden">
                {option.imageUrl ? (
                  <img 
                    src={option.imageUrl} 
                    alt={option.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sage-200">
                    <ImageIcon className="w-8 h-8 stroke-[1.5px]" />
                  </div>
                )}
                
                {/* Visual Checkmark Overlay */}
                <div className={cn(
                  "absolute inset-0 bg-carbon-900/10 transition-opacity duration-300",
                  isSelected ? "opacity-100" : "opacity-0"
                )} />
                
                <div className={cn(
                  "absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg",
                  isSelected ? "bg-carbon-900 text-white scale-100" : "bg-white/90 text-transparent scale-75 opacity-0 group-hover:opacity-100 group-hover:scale-90"
                )}>
                  <Check className="w-4 h-4 stroke-[3px]" />
                </div>
              </div>

              {/* Name Container */}
              <div className="p-3 flex-1 flex items-center justify-center">
                <span className={cn(
                  "text-xs font-black leading-tight text-center tracking-tight uppercase",
                  isSelected ? "text-carbon-900" : "text-carbon-500"
                )}>
                  {option.name}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-1.5 text-error-600 bg-error-50 px-3 py-2 rounded-lg border border-error-100"
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span className="text-[10px] font-semibold tracking-wide">{error}</span>
        </motion.div>
      )}
    </div>
  );
}
