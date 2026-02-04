import { TouchableCard } from "@/components";
import { cn } from "@/utils/cn";
import { Beef, Fish, Drumstick } from "lucide-react";

/**
 * Protein Option
 */
export interface ProteinOption {
  id: number;
  name: string;
  price: number; // Precio del almuerzo completo con esta proteína
  icon?: "beef" | "fish" | "chicken" | "pork" | "other";
  isAvailable: boolean;
}

/**
 * ProteinSelector Props
 */
export interface ProteinSelectorProps {
  proteins: ProteinOption[];
  selectedProteinId?: number;
  onSelect: (protein: ProteinOption) => void;
  basePrice: number; // Precio base del almuerzo (ej: $10,000)
  className?: string;
}

/**
 * Icon mapping
 */
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
 * Selector de proteínas para el corrientazo con precios diferenciados.
 * Muestra claramente el precio total del almuerzo según la proteína elegida.
 * 
 * @example
 * ```tsx
 * <ProteinSelector
 *   proteins={[
 *     { id: 1, name: "Carne a la plancha", price: 10000, icon: "beef", isAvailable: true },
 *     { id: 2, name: "Pescado frito", price: 11000, icon: "fish", isAvailable: true },
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
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg sm:text-xl font-semibold text-carbon-900">
          Selecciona la Proteína
        </h3>
        <span className="text-sm text-carbon-500">
          {proteins.filter(p => p.isAvailable).length} disponibles
        </span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
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
                "relative",
                isSelected
                  ? "bg-sage-50 border-2 border-sage-500"
                  : "bg-white border-2 border-sage-200 hover:border-sage-300",
                !protein.isAvailable && "opacity-50"
              )}
            >
              <div className="flex items-center gap-3 sm:gap-4">
                {/* Icon */}
                <div className={cn(
                  "flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center",
                  isSelected ? "bg-sage-100" : "bg-sage-50"
                )}>
                  <Icon className={cn(
                    "w-6 h-6 sm:w-7 sm:h-7",
                    isSelected ? "text-sage-700" : "text-sage-600"
                  )} />
                </div>
                
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className={cn(
                    "font-semibold text-base sm:text-lg truncate",
                    isSelected ? "text-sage-900" : "text-carbon-900"
                  )}>
                    {protein.name}
                  </h4>
                  
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-lg sm:text-xl font-bold text-sage-700">
                      ${protein.price.toLocaleString("es-CO")}
                    </span>
                    
                    {isPremium && (
                      <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                        +${priceDifference.toLocaleString("es-CO")}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Selected indicator */}
                {isSelected && (
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-sage-500 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
              
              {!protein.isAvailable && (
                <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded-2xl">
                  <span className="text-sm font-medium text-carbon-500">Agotado</span>
                </div>
              )}
            </TouchableCard>
          );
        })}
      </div>
    </div>
  );
}
