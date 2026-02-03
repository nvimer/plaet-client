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
 * Responsive design with proportional card sizes.
 * 
 * Features:
 * - Responsive grid (2-3-4-5 columns based on screen size)
 * - Proportional card sizes (not oversized)
 * - Clear visual hierarchy
 * - Touch-friendly but not overwhelming
 * - Quantity indicators
 * 
 * Grid breakpoints:
 * - Mobile (<640px): 2 columns
 * - Tablet (640px+): 3 columns  
 * - Desktop (1024px+): 4 columns
 * - Large Desktop (1280px+): 5 columns
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
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3">
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
                ? "bg-sage-50 border-2 border-sage-400" 
                : "bg-white border-2 border-sage-200 hover:border-sage-300"
              }
              ${!isAvailable ? "opacity-60" : ""}
            `}
          >
            <div className="flex flex-col h-full">
              {/* Product Image - Proportional height */}
              {product.imageUrl ? (
                <div className="w-full h-20 sm:h-24 mb-2 rounded-xl overflow-hidden bg-sage-50">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-20 sm:h-24 mb-2 rounded-xl bg-sage-100 flex items-center justify-center">
                  <span className="text-2xl sm:text-3xl">🍽️</span>
                </div>
              )}

              {/* Product Name - Compact */}
              <h3 className="font-semibold text-sm sm:text-base text-carbon-900 mb-1 line-clamp-2 leading-tight">
                {product.name}
              </h3>

              {/* Description - Only on larger screens, truncated */}
              {product.description && (
                <p className="hidden sm:block text-xs text-carbon-600 mb-1 line-clamp-1">
                  {product.description}
                </p>
              )}

              {/* Price and Quantity - Bottom aligned */}
              <div className="mt-auto flex items-center justify-between gap-1">
                <p className="text-base sm:text-lg font-bold text-sage-700">
                  ${Number(product.price).toLocaleString("es-CO")}
                </p>
                {showQuantity && quantity > 0 && (
                  <span className="bg-sage-100 text-sage-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                    {quantity}
                  </span>
                )}
              </div>

              {/* Availability Badge */}
              {!isAvailable && (
                <span className="text-xs text-rose-500 mt-1 font-medium">
                  No disponible
                </span>
              )}

              {/* Selected indicator */}
              {isSelected && (
                <span className="text-xs text-sage-600 font-medium mt-1">
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
