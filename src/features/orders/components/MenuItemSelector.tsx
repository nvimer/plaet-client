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
  showRiceInfo?: boolean;
  riceName?: string;
}

/**
 * Premium MenuItemSelector
 * High-density tactile selection for daily menu options.
 */
export function MenuItemSelector({
  label,
  options,
  selectedOption,
  onSelect,
  required = false,
  error,
  icon,
  color = "sage",
  showRiceInfo = false,
  riceName,
}: MenuItemSelectorProps) {
  const colorClasses = {
    amber: { text: "text-amber-600", bg: "bg-amber-50" },
    emerald: { text: "text-success-600", bg: "bg-success-50" },
    sage: { text: "text-sage-600", bg: "bg-sage-50" },
    blue: { text: "text-blue-600", bg: "bg-blue-50" },
    purple: { text: "text-purple-600", bg: "bg-purple-50" },
  };

  const colors = colorClasses[color];

  if (options.length === 0) {
    return (
      <Card variant="bordered" className="p-4 border-dashed border-sage-200 bg-sage-50/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-xl shadow-soft-sm grayscale opacity-50">
            {icon}
          </div>
          <div>
            <p className="text-sm font-bold text-carbon-400 uppercase tracking-widest">{label}</p>
            <p className="text-xs text-carbon-400 font-medium">No disponible hoy</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-y-3 px-1">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center text-base shadow-soft-sm", colors.bg)}>
            {icon}
          </div>
          <div className="flex items-center gap-2">
            <span className="font-black text-[11px] sm:text-xs text-carbon-900 uppercase tracking-[0.15em]">
              {label}
            </span>
            {required && (
              <span className="text-[9px] bg-carbon-900 text-white px-2 py-0.5 rounded-full font-black uppercase tracking-tighter whitespace-nowrap">
                Obligatorio
              </span>
            )}
          </div>
        </div>
        {selectedOption && (
          <motion.div 
            initial={{ opacity: 0, x: 5 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-success-50 rounded-lg border border-success-100"
          >
            <Check className="w-3.5 h-3.5 text-success-600 stroke-[4px]" />
            <span className="text-[10px] text-success-700 font-black uppercase tracking-widest">Elegido</span>
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
                "group relative flex flex-col rounded-2xl border-2 transition-all duration-300 text-left overflow-hidden active:scale-95",
                isSelected
                  ? "border-carbon-900 bg-white shadow-soft-xl z-10"
                  : "border-sage-100 bg-white hover:border-sage-300 hover:shadow-soft-md"
              )}
            >
              {/* Image Container */}
              <div className="relative aspect-[16/10] w-full bg-sage-50 overflow-hidden">
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
              <div className="p-3 flex-1 flex items-center justify-center min-h-[56px]">
                <span className={cn(
                  "text-xs font-bold leading-tight text-center tracking-tight",
                  isSelected ? "text-carbon-900" : "text-carbon-600"
                )}>
                  {option.name}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {showRiceInfo && riceName && (
        <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100 flex items-center gap-2">
          <span className="text-lg">🍚</span>
          <p className="text-[10px] font-bold text-amber-800 uppercase tracking-widest">
            Incluye: <span className="text-carbon-900">{riceName}</span>
          </p>
        </div>
      )}

      {error && (
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-1.5 text-rose-600 bg-rose-50 px-3 py-2 rounded-lg border border-rose-100"
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span className="text-[10px] font-black uppercase tracking-wider">{error}</span>
        </motion.div>
      )}
    </div>
  );
}

export default MenuItemSelector;