import { TouchableCard } from "@/components";
import { cn } from "@/utils/cn";
import { Beef, Fish, Drumstick, AlertCircle, Check } from "lucide-react";

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

  const lunchPrices = availableProteins.map((p) => basePrice + p.price);
  const minPrice = Math.min(...lunchPrices);
  const maxPrice = Math.max(...lunchPrices);

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
      <div className="bg-gradient-to-r from-sage-600 to-sage-500 rounded-2xl p-4 text-white transition-all duration-500">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">Precio del Almuerzo</h3>
            <p className="text-sm text-sage-100">
              Incluye todos los componentes
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-black">
              {selectedProteinTotal
                ? `$${selectedProteinTotal.toLocaleString("es-CO")}`
                : `$${minPrice.toLocaleString("es-CO")}${minPrice !== maxPrice ? ` - $${maxPrice.toLocaleString("es-CO")}` : ""}`}
            </p>
          </div>
        </div>
      </div>

      {/* Protein Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
        {availableProteins.map((protein) => {
          const isSelected = selectedProteinId === protein.id;
          const totalPrice = basePrice + protein.price;
          const isHigherPrice = totalPrice > minPrice;
          const Icon = iconMap[protein.icon || "other"];

          return (
            <TouchableCard
              key={protein.id}
              onPress={() => {
                if (isSelected) {
                  onSelect(null as unknown as ProteinOption);
                } else {
                  onSelect(protein);
                }
              }}
              size="medium"
              hapticFeedback
              selected={isSelected}
              className={cn(
                "relative overflow-hidden transition-all duration-300",
                isSelected
                  ? "bg-gradient-to-br from-sage-100 to-sage-50 border-2 border-sage-500 shadow-md ring-2 ring-sage-500/20 scale-[1.02]"
                  : isHigherPrice
                    ? "bg-gradient-to-br from-white to-amber-50 border-2 border-amber-200 hover:border-amber-400"
                    : "bg-white border-2 border-sage-100 hover:border-sage-400",
              )}
            >
              <div className="flex items-center gap-3 p-2.5 sm:p-3">
                {/* Icon */}
                <div
                  className={cn(
                    "flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-all duration-300",
                    isSelected
                      ? "bg-sage-500 text-white shadow-inner scale-110"
                      : isHigherPrice
                        ? "bg-amber-100 text-amber-700"
                        : "bg-sage-50 text-sage-600",
                  )}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5 sm:w-6 sm:h-6 transition-transform",
                      isSelected && "rotate-12",
                    )}
                  />
                </div>

                {/* Protein info */}
                <div className="flex-1 min-w-0">
                  <h4
                    className={cn(
                      "font-bold text-sm sm:text-base truncate",
                      isSelected ? "text-sage-900" : "text-carbon-900",
                    )}
                  >
                    {protein.name}
                  </h4>

                  <div className="flex items-baseline gap-1">
                    <span
                      className={cn(
                        "text-base sm:text-lg font-black",
                        isSelected
                          ? "text-sage-700"
                          : isHigherPrice
                            ? "text-amber-700"
                            : "text-carbon-900",
                      )}
                    >
                      ${totalPrice.toLocaleString("es-CO")}
                    </span>
                    {isHigherPrice && !isSelected && (
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-100 px-1 rounded">
                        + ${(totalPrice - minPrice).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Selection indicator */}
                {isSelected && (
                  <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-sage-500 flex items-center justify-center shadow-lg animate-in zoom-in-50 duration-300">
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 text-white stroke-[3]" />
                  </div>
                )}
              </div>

              {/* Higher price accent bar */}
              {isHigherPrice && !isSelected && (
                <div className="absolute top-0 right-0 w-1.5 h-full bg-amber-400/30" />
              )}

              {/* Unavailable overlay */}
              {!protein.isAvailable && (
                <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center rounded-2xl backdrop-blur-[1px]">
                  <AlertCircle className="w-6 h-6 text-carbon-400 mb-1" />
                  <span className="text-[10px] font-black uppercase text-carbon-500">
                    Agotado
                  </span>
                </div>
              )}
            </TouchableCard>
          );
        })}
      </div>
    </div>
  );
}
