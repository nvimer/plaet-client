
import { Card } from "@/components";
import { cn } from "@/utils/cn";
import { AlertCircle, Check } from "lucide-react";

interface MenuOption {
  id: number;
  name: string;
}

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
      <Card className={cn("p-4 border-2 border-dashed", colors.border, colors.bg)}>
        <div className="flex items-center gap-3">
          {icon && <div className={cn("text-2xl", colors.text)}>{icon}</div>}
          <div>
            <p className={cn("font-semibold", colors.text)}>{label}</p>
            <p className="text-sm text-carbon-500">No configurado en el menú del día</p>
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
          error && "border-rose-400 bg-rose-50"
        )}
        onClick={() => onSelect(onlyOption)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {icon && <div className={cn("text-2xl", colors.text)}>{icon}</div>}
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
                ? "bg-sage-green-500 text-white"
                : "bg-white border-2 border-sage-200"
            )}
          >
            {isSelected ? (
              <Check className="w-6 h-6" />
            ) : (
              <span className="text-sage-400 text-xs">Elegir</span>
            )}
          </div>
        </div>
        
        {/* Show rice info if applicable */}
        {showRiceInfo && riceName && (
          <div className="mt-3 pt-3 border-t border-sage-200">
            <p className="text-sm text-carbon-600">
              <span className="font-medium">Arroz:</span> {riceName}
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
    <div className={cn("space-y-3", error && "p-3 border-2 border-rose-300 rounded-xl bg-rose-50")}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon && <span className={colors.text}>{icon}</span>}
          <span className={cn("font-semibold", colors.text)}>{label}</span>
          {required && (
            <span className="text-[10px] bg-sage-200 text-sage-700 px-1.5 py-0.5 rounded-full">
              Requerido
            </span>
          )}
        </div>
        {selectedOption && (
          <span className="text-sm text-sage-600 font-medium">
            Seleccionado: {selectedOption.name}
          </span>
        )}
      </div>

      {/* Selection Cards Grid */}
      <div className="grid grid-cols-2 gap-3">
        {options.map((option) => {
          const isSelected = selectedOption?.id === option.id;
          return (
            <button
              key={option.id}
              onClick={() => onSelect(option)}
              className={cn(
                "relative p-4 rounded-xl border-2 transition-all duration-200 text-left",
                "min-h-[80px] flex flex-col justify-between",
                "active:scale-95 touch-manipulation",
                isSelected
                  ? cn(colors.selected, "border-sage-green-500 shadow-md")
                  : cn("bg-white border-sage-200", colors.hover)
              )}
            >
              <span
                className={cn(
                  "font-bold text-base leading-tight",
                  isSelected ? "text-carbon-900" : "text-carbon-700"
                )}
              >
                {option.name}
              </span>
              
              {/* Selection indicator */}
              <div
                className={cn(
                  "absolute top-3 right-3 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                  isSelected
                    ? "bg-sage-green-500 border-sage-green-500"
                    : "bg-white border-sage-300"
                )}
              >
                {isSelected && <Check className="w-4 h-4 text-white" />}
              </div>

              {/* Option number badge */}
              <span
                className={cn(
                  "absolute bottom-3 right-3 text-xs font-bold px-2 py-1 rounded-full",
                  isSelected
                    ? "bg-sage-green-100 text-sage-green-700"
                    : "bg-sage-100 text-sage-600"
                )}
              >
                Opción {options.indexOf(option) + 1}
              </span>
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
