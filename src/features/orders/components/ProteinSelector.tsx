import { TouchableCard } from "@/components";
import { cn } from "@/utils/cn";
import { Beef, Fish, Drumstick, Crown, AlertCircle } from "lucide-react";

/**
 * Protein option data structure
 */
export interface ProteinOption {
  id: number;
  name: string;
  price: number; // Complete lunch combo price with this protein
  icon?: "beef" | "fish" | "chicken" | "pork" | "other";
  isAvailable: boolean;
}

export interface ProteinSelectorProps {
  proteins: ProteinOption[];
  selectedProteinId?: number;
  onSelect: (protein: ProteinOption) => void;
  basePrice: number; // Base lunch price (e.g., $10,000)
  className?: string;
}

const iconMap = {
  beef: Beef,
  fish: Fish,
  chicken: Drumstick,
  pork: Beef,
  other: Beef,
};

/**
 * ProteinSelector Component
 * 
 * Displays available proteins with differentiated pricing for corrientazo.
 * Shows clear price difference for premium proteins.
 * 
 * Features:
 * - Visual distinction for premium proteins
 * - Clear availability status
 * - Smooth selection animations
 * - Accessible with keyboard navigation
 * 
 * @example
 * ```tsx
 * <ProteinSelector
 *   proteins={[
 *     { id: 1, name: "Grilled Steak", price: 10000, icon: "beef", isAvailable: true },
 *     { id: 2, name: "Fried Fish", price: 11000, icon: "fish", isAvailable: true },
 *   ]}
 *   selectedProteinId={1}
 *   onSelect={handleProteinSelect}
 *   basePrice={10000}
 * />
 * ```
 */
export function ProteinSelector({
  proteins,
  selectedProteinId,
  onSelect,
  basePrice,
  className,
}: ProteinSelectorProps) {
  const availableCount = proteins.filter((p) => p.isAvailable).length;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-carbon-900">
            Select Protein
          </h3>
          <p className="text-sm text-carbon-500 mt-0.5">
            Choose the main protein for the lunch combo
          </p>
        </div>
        <span className="text-sm font-medium text-sage-600 bg-sage-50 px-3 py-1 rounded-full">
          {availableCount} available
        </span>
      </div>

      {/* Protein Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
        {proteins.map((protein) => {
          const isSelected = selectedProteinId === protein.id;
          const isPremium = protein.price > basePrice;
          const priceDifference = protein.price - basePrice;

          const Icon = iconMap[protein.icon || "other"];

          return (
            <TouchableCard
              key={protein.id}
              onPress={() => onSelect(protein)}
              size="medium"
              hapticFeedback
              selected={isSelected}
              disabled={!protein.isAvailable}
              className={cn(
                "relative overflow-hidden transition-all duration-300",
                isSelected
                  ? "bg-sage-50 border-2 border-sage-500 shadow-md ring-2 ring-sage-200"
                  : "bg-white border-2 border-sage-200 hover:border-sage-400 hover:shadow-lg",
                !protein.isAvailable && "opacity-60 grayscale"
              )}
            >
              {/* Premium badge */}
              {isPremium && (
                <div className="absolute top-2 right-2">
                  <div className="flex items-center gap-1 bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                    <Crown className="w-3 h-3" />
                    Premium
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 sm:gap-4 p-1">
                {/* Icon container */}
                <div
                  className={cn(
                    "flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center transition-colors",
                    isSelected
                      ? "bg-sage-200 text-sage-800"
                      : "bg-sage-50 text-sage-600 group-hover:bg-sage-100"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-6 h-6 sm:w-7 sm:h-7 transition-transform",
                      isSelected && "scale-110"
                    )}
                  />
                </div>

                {/* Protein info */}
                <div className="flex-1 min-w-0">
                  <h4
                    className={cn(
                      "font-bold text-base sm:text-lg truncate",
                      isSelected ? "text-sage-900" : "text-carbon-900"
                    )}
                  >
                    {protein.name}
                  </h4>

                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xl font-black text-sage-700">
                      ${protein.price.toLocaleString("es-CO")}
                    </span>

                    {isPremium && (
                      <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-1 rounded-full border border-amber-200">
                        +${priceDifference.toLocaleString("es-CO")}
                      </span>
                    )}
                  </div>
                </div>

                {/* Selection indicator */}
                {isSelected && (
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-sage-500 flex items-center justify-center shadow-sm">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* Unavailable overlay */}
              {!protein.isAvailable && (
                <div className="absolute inset-0 bg-white/70 flex flex-col items-center justify-center rounded-2xl backdrop-blur-sm">
                  <AlertCircle className="w-8 h-8 text-carbon-400 mb-1" />
                  <span className="text-sm font-bold text-carbon-500">
                    Out of Stock
                  </span>
                </div>
              )}
            </TouchableCard>
          );
        })}
      </div>

      {/* Helper text */}
      <p className="text-xs text-carbon-500 text-center">
        Premium proteins have an additional cost. Select one to continue.
      </p>
    </div>
  );
}
