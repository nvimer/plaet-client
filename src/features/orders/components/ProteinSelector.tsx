import { cn } from "@/utils/cn";
import { Beef, Fish, Drumstick, AlertCircle, Check } from "lucide-react";
import type { ProteinOption } from "../types/orderBuilder";
import { motion } from "framer-motion";

export interface ProteinSelectorProps {
  proteins: ProteinOption[];
  selectedProteinId?: number;
  onSelect: (protein: ProteinOption | null) => void;
  basePrice: number;
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
 * Premium Protein Selector - Refined Evolution
 * Blends the intuitive old layout with new high-contrast standards.
 */
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
        const protein = availableProteins.find((p) => p.id === selectedProteinId);
        return protein ? basePrice + protein.price : null;
      })()
    : null;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header Banner - High Contrast Premium */}
      <div className="bg-carbon-900 rounded-3xl p-6 text-white transition-all shadow-soft-xl border border-white/5 overflow-hidden relative">
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shadow-inner">
              <Beef className="w-6 h-6 text-sage-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight uppercase tracking-[0.1em]">Precio del Menú</h3>
              <p className="text-xs text-carbon-400 font-medium">
                Almuerzo completo configurado
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-black text-white tracking-tighter">
              {selectedProteinTotal
                ? `$${selectedProteinTotal.toLocaleString("es-CO")}`
                : `$${minPrice.toLocaleString("es-CO")}${minPrice !== maxPrice ? ` - $${maxPrice.toLocaleString("es-CO")}` : ""}`}
            </p>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl" />
      </div>

      <div className="px-1 flex items-center justify-between">
        <span className="text-[11px] font-black text-carbon-900 uppercase tracking-[0.2em] flex items-center gap-2">
          <div className="w-1 h-4 bg-sage-500 rounded-full" />
          Proteína Principal
        </span>
        {selectedProteinId && (
          <button 
            onClick={() => onSelect(null)}
            className="text-[10px] font-bold text-rose-600 uppercase tracking-widest hover:underline"
          >
            Quitar selección
          </button>
        )}
      </div>

      {/* Protein Grid - Robust and Clean */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {availableProteins.map((protein) => {
          const isSelected = selectedProteinId === protein.id;
          const totalPrice = basePrice + protein.price;
          const isExtra = totalPrice > minPrice;
          const Icon = iconMap[protein.icon || "other"];

          return (
            <button
              key={protein.id}
              onClick={() => onSelect(isSelected ? null : protein)}
              className={cn(
                "group relative flex flex-col rounded-3xl border-2 transition-all duration-300 overflow-hidden active:scale-95",
                isSelected
                  ? "border-carbon-900 bg-white shadow-soft-2xl ring-4 ring-carbon-900/5 z-10"
                  : "border-sage-100 bg-white hover:border-sage-300 hover:shadow-soft-lg"
              )}
            >
              {/* Image Area (Old Style Layout) */}
              <div className="relative aspect-[16/11] w-full bg-sage-50 overflow-hidden border-b border-sage-50">
                {protein.imageUrl ? (
                  <img
                    src={protein.imageUrl}
                    alt={protein.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-sage-50 to-sage-100">
                    <Icon className="w-10 h-10 text-sage-200" />
                  </div>
                )}

                {/* Status Overlay for selected */}
                <div className={cn(
                  "absolute inset-0 bg-carbon-900/5 transition-opacity duration-300",
                  isSelected ? "opacity-100" : "opacity-0"
                )} />

                {/* Price Pill (Over Image - Old Style) */}
                <div className="absolute bottom-2.5 right-2.5">
                  <div className={cn(
                    "px-2.5 py-1.5 rounded-xl shadow-lg border backdrop-blur-md transition-all duration-300 font-black text-xs",
                    isSelected ? "bg-carbon-900 border-white/20 text-white" : "bg-white/90 border-sage-100 text-carbon-900"
                  )}>
                    ${totalPrice.toLocaleString("es-CO")}
                  </div>
                </div>

                {/* Selection Check (Over Image - Old Style) */}
                <div className={cn(
                  "absolute top-2.5 left-2.5 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 shadow-md",
                  isSelected ? "bg-carbon-900 text-white scale-100" : "bg-white/80 text-transparent scale-75 opacity-0 group-hover:opacity-100"
                )}>
                  <Check className="w-4 h-4 stroke-[4px]" />
                </div>

                {/* Extra Badge */}
                {isExtra && !isSelected && (
                  <div className="absolute top-2.5 right-2.5">
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[9px] font-black uppercase rounded-lg border border-amber-200 shadow-sm">
                      Extra
                    </span>
                  </div>
                )}
              </div>

              {/* Info Area (Clean White) */}
              <div className="p-4 flex flex-col items-center justify-center text-center bg-white min-h-[64px]">
                <h4 className={cn(
                  "font-bold text-sm leading-tight tracking-tight transition-colors duration-300",
                  isSelected ? "text-carbon-900" : "text-carbon-700"
                )}>
                  {protein.name}
                </h4>
                {protein.categoryName && (
                  <span className="text-[9px] font-black text-carbon-400 uppercase tracking-widest mt-1">
                    {protein.categoryName}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
