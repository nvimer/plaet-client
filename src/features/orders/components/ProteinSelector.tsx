import { TouchableCard } from "@/components";
import { cn } from "@/utils/cn";
import { Beef, Fish, Drumstick, AlertCircle, Check, ImageIcon } from "lucide-react";
import type { ProteinOption } from "../types/orderBuilder";

export interface ProteinSelectorProps {
  proteins: ProteinOption[];
  selectedProteinId?: number;
  onSelect: (protein: ProteinOption | null) => void;
  basePrice: number; // Base margin price
  className?: string;
}

const iconMap = {
  beef: Beef,
  fish: Fish,
  chicken: Drumstick,
  pork: Beef,
  other: Beef,
};

export function ProteinSelector({
  proteins,
  selectedProteinId,
  onSelect,
  basePrice,
  className,
}: ProteinSelectorProps) {
  const availableProteins = proteins.filter((p) => p.isAvailable);

  const lunchPrices = availableProteins.map((p) => basePrice + p.price);
  const minPrice = availableProteins.length > 0 ? Math.min(...lunchPrices) : 0;
  const maxPrice = availableProteins.length > 0 ? Math.max(...lunchPrices) : 0;

  const selectedProteinTotal = selectedProteinId
    ? (() => {
        const protein = availableProteins.find(
          (p) => p.id === selectedProteinId,
        );
        return protein ? basePrice + protein.price : null;
      })()
    : null;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header with total lunch price */}
      <div className="bg-gradient-to-br from-carbon-900 to-carbon-800 rounded-2xl p-5 text-white transition-all shadow-xl border border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Beef className="w-6 h-6 text-sage-400" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold tracking-tight">Precio del Almuerzo</h3>
              <p className="text-xs text-carbon-400 font-medium">
                Incluye todos los componentes
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl sm:text-3xl font-bold text-sage-400 tracking-tight">
              {selectedProteinTotal
                ? `$${selectedProteinTotal.toLocaleString("es-CO")}`
                : `$${minPrice.toLocaleString("es-CO")}${minPrice !== maxPrice ? ` - $${maxPrice.toLocaleString("es-CO")}` : ""}`}
            </p>
          </div>
        </div>
      </div>

      {/* Protein Grid / Scroll Row */}
      <div className="flex overflow-x-auto sm:grid sm:grid-cols-3 lg:grid-cols-4 gap-3 pb-4 sm:pb-0 snap-x snap-mandatory hide-scrollbar">
        {availableProteins.map((protein) => {
          const isSelected = selectedProteinId === protein.id;
          const totalPrice = basePrice + protein.price;
          const isHigherPrice = totalPrice > minPrice;
          const Icon = iconMap[protein.icon || "other"];

          return (
            <button
              key={protein.id}
              onClick={() => onSelect(isSelected ? null : protein)}
              className={cn(
                "group relative flex flex-col overflow-hidden transition-all duration-300",
                "bg-white rounded-2xl border-2 shadow-sm touch-manipulation active:scale-[0.98]",
                "min-w-[160px] sm:min-w-0 flex-shrink-0 snap-center",
                isSelected
                  ? "border-sage-500 shadow-md ring-4 ring-sage-500/10"
                  : "border-sage-100 hover:border-sage-300",
              )}
            >
              {/* Protein Image Area */}
              <div className="relative w-full h-24 sm:aspect-[16/10] sm:h-auto bg-sage-50 overflow-hidden border-b border-sage-50">
                {protein.imageUrl ? (
                  <img
                    src={protein.imageUrl}
                    alt={protein.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Icon className="w-10 h-10 text-sage-200/60" />
                  </div>
                )}
                
                {/* Price Tag Overlay */}
                <div className="absolute bottom-2 right-2">
                  <div className="bg-carbon-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg shadow-lg border border-white/10">
                    <span className="text-xs sm:text-sm font-bold text-white">
                      ${totalPrice.toLocaleString("es-CO")}
                    </span>
                  </div>
                </div>

                {/* Higher Price Badge */}
                {isHigherPrice && !isSelected && (
                  <div className="absolute top-2 right-2">
                    <span className="text-[9px] font-semibold text-warning-700 bg-warning-100 px-2 py-0.5 rounded-full border border-warning-200">
                      Extra + ${(totalPrice - minPrice).toLocaleString()}
                    </span>
                  </div>
                )}

                {/* Selection Indicator */}
                <div className={cn(
                  "absolute top-2 left-2 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all",
                  isSelected
                    ? "bg-sage-500 border-sage-500 text-white shadow-md"
                    : "bg-white/80 border-sage-200 text-transparent",
                )}>
                  <Check className="w-4 h-4 stroke-[4px]" />
                </div>
              </div>

              {/* Protein Info */}
              <div className="p-4 flex flex-col items-center text-center justify-center flex-1">
                {protein.categoryName && (
                  <span className="text-[10px] font-medium text-carbon-400 block mb-1">
                    {protein.categoryName}
                  </span>
                )}
                <h4 className={cn(
                  "font-semibold text-sm sm:text-base leading-tight tracking-tight",
                  isSelected ? "text-carbon-900" : "text-carbon-700"
                )}>
                  {protein.name}
                </h4>
              </div>

              {/* Unavailable overlay */}
              {!protein.isAvailable && (
                <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center backdrop-blur-[1px]">
                  <AlertCircle className="w-8 h-8 text-carbon-400 mb-1" />
                  <span className="text-xs font-semibold text-carbon-500">
                    Agotado
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
