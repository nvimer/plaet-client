import { Card } from "@/components";
import { cn } from "@/utils/cn";
import { AlertCircle, Check, ImageIcon } from "lucide-react";
import type { MenuOption } from "../types/orderBuilder";

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
    amber: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-700",
      selected: "bg-amber-100 border-amber-400",
      hover: "hover:bg-amber-100 hover:border-amber-300",
    },
    emerald: {
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      text: "text-emerald-700",
      selected: "bg-emerald-100 border-emerald-400",
      hover: "hover:bg-emerald-100 hover:border-emerald-300",
    },
    sage: {
      bg: "bg-sage-50",
      border: "border-sage-200",
      text: "text-sage-700",
      selected: "bg-sage-100 border-sage-400",
      hover: "hover:bg-sage-100 hover:border-sage-300",
    },
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-700",
      selected: "bg-blue-100 border-blue-400",
      hover: "hover:bg-blue-100 hover:border-blue-300",
    },
    purple: {
      bg: "bg-purple-50",
      border: "border-purple-200",
      text: "text-purple-700",
      selected: "bg-purple-100 border-purple-400",
      hover: "hover:bg-purple-100 hover:border-purple-300",
    },
  };

  const colors = colorClasses[color];

  // If no options configured
  if (options.length === 0) {
    return (
      <Card
        className={cn("p-4 border-2 border-dashed", colors.border, colors.bg)}
      >
        <div className="flex items-center gap-3">
          {icon && <div className={cn("text-2xl", colors.text)}>{icon}</div>}
          <div>
            <p className={cn("font-semibold", colors.text)}>{label}</p>
            <p className="text-sm text-carbon-500">
              No configurado en el menú del día
            </p>
          </div>
        </div>
      </Card>
    );
  }

  // If only one option - auto-selected display
  if (options.length === 1) {
    const onlyOption = options[0];
    const isSelected = selectedOption?.id === onlyOption.id;

    return (
      <Card
        className={cn(
          "p-4 border-2 cursor-pointer transition-all duration-200",
          colors.bg,
          colors.border,
          isSelected ? colors.selected : colors.hover,
          error && "border-rose-400 bg-rose-50",
        )}
        onClick={() => onSelect(onlyOption)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-lg bg-white overflow-hidden border border-carbon-100 flex-shrink-0">
              {onlyOption.imageUrl ? (
                <img src={onlyOption.imageUrl} alt={onlyOption.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-carbon-300">
                  <ImageIcon className="w-6 h-6" />
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className={cn("font-semibold", colors.text)}>{label}</p>
                {required && (
                  <span className="text-[10px] bg-sage-200 text-sage-700 px-1.5 py-0.5 rounded-full">
                    Requerido
                  </span>
                )}
              </div>
              <p className="text-lg font-bold text-carbon-900 mt-1">
                {onlyOption.name}
              </p>
            </div>
          </div>
          <div
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center transition-all",
              isSelected
                ? "bg-sage-500 text-white"
                : "bg-white border-2 border-sage-200",
            )}
          >
            {isSelected ? (
              <Check className="w-6 h-6" />
            ) : (
              <span className="text-sage-400 text-xs font-bold">ELEGIR</span>
            )}
          </div>
        </div>

        {/* Show rice info if applicable */}
        {showRiceInfo && riceName && (
          <div className="mt-3 pt-3 border-t border-sage-200">
            <p className="text-sm text-carbon-600">
              <span className="font-medium">🍚 Arroz incluido:</span> {riceName}
            </p>
          </div>
        )}

        {error && (
          <div className="mt-2 flex items-center gap-1 text-rose-600 text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}
      </Card>
    );
  }

  // Multiple options - show clickable cards
  return (
    <div
      className={cn(
        "space-y-3",
        error && "p-3 border-2 border-rose-300 rounded-xl bg-rose-50",
      )}
    >
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          {icon && <span className={cn("text-lg", colors.text)}>{icon}</span>}
          <span className={cn("font-semibold text-sm sm:text-base", colors.text)}>
            {label}
          </span>
          {required && (
            <span className="text-[10px] bg-white/50 text-carbon-500 border border-carbon-200 px-1.5 py-0.5 rounded-full tracking-wide font-bold">
              Obligatorio
            </span>
          )}
        </div>
        {selectedOption && (
          <span className="text-[10px] sm:text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg font-bold border border-emerald-100 animate-in fade-in zoom-in-95 duration-300">
            ✓ Seleccionado
          </span>
        )}
      </div>

      {/* Selection Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
        {options.map((option) => {
          const isSelected = selectedOption?.id === option.id;
          return (
            <button
              key={option.id}
              onClick={() => onSelect(option)}
              className={cn(
                "group relative overflow-hidden rounded-2xl border-2 transition-all duration-300 text-left",
                "min-h-[100px] sm:min-h-[120px] flex flex-col",
                "active:scale-95 touch-manipulation",
                isSelected
                  ? cn(
                      colors.selected,
                      "border-sage-500 shadow-md ring-4 ring-sage-500/10",
                    )
                  : cn("bg-white border-sage-200", colors.hover),
              )}
            >
              {/* Product Image in Selector */}
              <div className="relative h-16 sm:h-20 w-full bg-sage-50/50 overflow-hidden border-b border-sage-100">
                {option.imageUrl ? (
                  <img src={option.imageUrl} alt={option.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sage-200">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                )}
                {/* Selection indicator */}
                <div
                  className={cn(
                    "absolute top-2 right-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all backdrop-blur-sm",
                    isSelected
                      ? "bg-sage-500 border-sage-500 text-white shadow-md"
                      : "bg-white/80 border-sage-300 text-transparent",
                  )}
                >
                  <Check className="w-4 h-4 stroke-[3px]" />
                </div>
              </div>

              <div className="p-2 sm:p-3 flex flex-col justify-center flex-1">
                <span
                  className={cn(
                    "font-semibold text-xs sm:text-sm leading-tight text-center",
                    isSelected ? "text-carbon-900" : "text-carbon-700",
                  )}
                >
                  {option.name}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Show rice info if applicable */}
      {showRiceInfo && riceName && (
        <div className="mt-2 p-3 bg-sage-50 rounded-lg border border-sage-200">
          <p className="text-sm text-carbon-600">
            <span className="font-medium">🍚 Arroz incluido:</span> {riceName}
          </p>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-1 text-rose-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}
    </div>
  );
}

export default MenuItemSelector;

