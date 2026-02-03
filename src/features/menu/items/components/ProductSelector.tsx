import { TouchableCard } from "@/components";
import type { MenuItem } from "@/types";

/**
 * ProductSelector Props
 */
export interface ProductSelectorProps {
  products: MenuItem[];
  onSelect: (product: MenuItem) => void;
  selectedIds?: Set<number>;
  showQuantity?: boolean;
  quantities?: Map<number, number>;
}

/**
 * ProductSelector Component
 * 
 * Optimized product selection grid for order creation.
 * Responsive design with FEWER columns on large screens for bigger cards.
 * 
 * Features:
 * - Responsive grid with FEWER columns on large screens (cards get bigger)
 * - Mobile: 2 columns (compact)
 * - Tablet: 2 columns (medium)
 * - Desktop: 2-3 columns (large spacious cards)
 * - Large Desktop: 3 columns (extra large cards)
 * - Clear visual hierarchy
 * - Touch-friendly
 * 
 * @example
 * ```tsx
 * <ProductSelector
 *   products={menuItems}
 *   onSelect={handleProductSelect}
 *   selectedIds={selectedProductIds}
 *   showQuantity
 *   quantities={quantities}
 * />
 * ```
 */
export function ProductSelector({
  products,
  onSelect,
  selectedIds,
  showQuantity = false,
  quantities,
}: ProductSelectorProps) {
  if (products.length === 0) {
    return (
      <div className="p-6 bg-sage-50 border-2 border-sage-200 rounded-2xl text-center">
        <p className="text-sm text-carbon-600 font-medium">
          No hay productos disponibles
        </p>
        <p className="text-xs text-carbon-500 mt-1">
          Intenta con otra búsqueda o categoría
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
      {products.map((product) => {
        const isSelected = selectedIds?.has(product.id);
        const quantity = quantities?.get(product.id) || 0;
        const isAvailable = product.isAvailable;

        return (
          <TouchableCard
            key={product.id}
            onPress={() => onSelect(product)}
            size="medium"
            hapticFeedback
            selected={isSelected}
            disabled={!isAvailable}
            className={`
              ${isSelected 
                ? "bg-sage-50 border-2 border-sage-400 lg:border-[3px]" 
                : "bg-white border-2 border-sage-200 hover:border-sage-300"
              }
              ${!isAvailable ? "opacity-60" : ""}
            `}
          >
            <div className="flex flex-col h-full">
              {/* Product Image - Much bigger on large screens */}
              {product.imageUrl ? (
                <div className="w-full h-28 sm:h-32 lg:h-48 xl:h-56 mb-2 sm:mb-3 lg:mb-4 rounded-xl overflow-hidden bg-sage-50">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-28 sm:h-32 lg:h-48 xl:h-56 mb-2 sm:mb-3 lg:mb-4 rounded-xl bg-sage-100 flex items-center justify-center">
                  <span className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl">🍽️</span>
                </div>
              )}

              {/* Product Name - Much bigger on large screens */}
              <h3 className="font-semibold text-base sm:text-lg lg:text-xl xl:text-2xl text-carbon-900 mb-1 sm:mb-2 lg:mb-3 line-clamp-2 leading-tight">
                {product.name}
              </h3>

              {/* Description - Visible on all screens */}
              {product.description && (
                <p className="text-xs sm:text-sm lg:text-base text-carbon-600 mb-1 sm:mb-2 lg:mb-3 line-clamp-2">
                  {product.description}
                </p>
              )}

              {/* Price and Quantity - Bottom aligned, much bigger on large screens */}
              <div className="mt-auto flex items-center justify-between gap-2">
                <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-sage-700">
                  ${Number(product.price).toLocaleString("es-CO")}
                </p>
                {showQuantity && quantity > 0 && (
                  <span className="bg-sage-100 text-sage-700 px-2 sm:px-3 py-0.5 sm:py-1 lg:px-4 lg:py-2 rounded-full text-sm sm:text-base lg:text-lg font-semibold">
                    {quantity}
                  </span>
                )}
              </div>

              {/* Availability Badge - Bigger on large screens */}
              {!isAvailable && (
                <span className="text-xs sm:text-sm lg:text-base text-rose-500 mt-1 sm:mt-2 lg:mt-3 font-medium">
                  No disponible
                </span>
              )}

              {/* Selected indicator */}
              {isSelected && (
                <span className="text-xs sm:text-sm lg:text-base text-sage-600 font-medium mt-1 sm:mt-2 lg:mt-3">
                  ✓ Agregado
                </span>
              )}
            </div>
          </TouchableCard>
        );
      })}
    </div>
  );
}
