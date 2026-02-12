import { TouchableCard } from "@/components";
import { cn } from "@/utils/cn";
import { Beef, Fish, Drumstick, AlertCircle } from "lucide-react";

/**
 * Protein option data structure
 */
export interface ProteinOption {
  id: number;
  name: string;
  price: number; // Individual protein portion price
  icon?: "beef" | "fish" | "chicken" | "pork" | "other";
  isAvailable: boolean;
}

export interface ProteinSelectorProps {
  proteins: ProteinOption[];
  selectedProteinId?: number;
  onSelect: (protein: ProteinOption) => void;
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
  
  const lunchPrices = availableProteins.map(p => basePrice + p.price);
  const minPrice = Math.min(...lunchPrices);
  const maxPrice = Math.max(...lunchPrices);

  const getPriceIndicator = (proteinPrice: number) => {
    const total = basePrice + proteinPrice;
    if (total === minPrice && minPrice !== maxPrice) return { symbol: "○", label: "Más económica", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" };
    if (total === maxPrice && minPrice !== maxPrice) return { symbol: "↑", label: "+Costosa", color: "text-amber-600", bg: "bg-amber-50 border-amber-200" };
    return { symbol: "○", label: "Estándar", color: "text-carbon-500", bg: "bg-carbon-50 border-carbon-200" };
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header with total lunch price */}
      <div className="bg-gradient-to-r from-sage-600 to-sage-500 rounded-2xl p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">Precio del Almuerzo</h3>
            <p className="text-sm text-sage-100">Incluye todos los componentes</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-black">
              ${minPrice.toLocaleString("es-CO")}
              {minPrice !== maxPrice && (
                <span className="text-lg font-medium text-sage-200"> - ${maxPrice.toLocaleString("es-CO")}</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Protein Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {availableProteins.map((protein) => {
          const isSelected = selectedProteinId === protein.id;
          const totalPrice = basePrice + protein.price;
          const indicator = getPriceIndicator(protein.price);
          const Icon = iconMap[protein.icon || "other"];

          return (
            <TouchableCard
              key={protein.id}
              onPress={() => onSelect(protein)}
              size="medium"
              hapticFeedback
              selected={isSelected}
              className={cn(
                "relative overflow-hidden transition-all duration-300",
                isSelected
                  ? "bg-sage-50 border-2 border-sage-500 shadow-md ring-2 ring-sage-200"
                  : "bg-white border-2 border-sage-200 hover:border-sage-400 hover:shadow-lg"
              )}
            >
              <div className="flex items-center gap-3 p-3">
                {/* Icon */}
                <div
                  className={cn(
                    "flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                    isSelected
                      ? "bg-sage-200 text-sage-800"
                      : "bg-sage-50 text-sage-600"
                  )}
                >
                  <Icon className={cn("w-6 h-6 transition-transform", isSelected && "scale-110")} />
                </div>

                {/* Protein info */}
                <div className="flex-1 min-w-0">
                  <h4 className={cn("font-bold text-base truncate", isSelected ? "text-sage-900" : "text-carbon-900")}>
                    {protein.name}
                  </h4>
                  
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-lg font-black text-carbon-900">
                      ${totalPrice.toLocaleString("es-CO")}
                    </span>
                    
                    <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full border", indicator.bg, indicator.color)}>
                      {indicator.symbol} {indicator.label}
                    </span>
                  </div>
                </div>

                {/* Selection indicator */}
                {isSelected && (
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-sage-500 flex items-center justify-center shadow-sm">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Unavailable overlay */}
              {!protein.isAvailable && (
                <div className="absolute inset-0 bg-white/70 flex flex-col items-center justify-center rounded-2xl backdrop-blur-sm">
                  <AlertCircle className="w-8 h-8 text-carbon-400 mb-1" />
                  <span className="text-sm font-bold text-carbon-500">Agotado</span>
                </div>
              )}
            </TouchableCard>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 text-xs text-carbon-500 bg-carbon-50 py-2 rounded-lg">
        <span className="flex items-center gap-1">
          <span className="w-4 h-4 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center text-[10px] font-bold">○</span>
          Más económica
        </span>
        <span className="flex items-center gap-1">
          <span className="w-4 h-4 rounded-full bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center text-[10px] font-bold">↑</span>
          +Costosa
        </span>
      </div>
    </div>
  );
}
