import { TouchableCard } from "@/components";
import type { MenuItem } from "@/types";

/**
 * ProductGrid Props
 */
export interface ProductGridProps {
  products: MenuItem[];
  onSelect: (product: MenuItem) => void;
  columns?: 2 | 3 | 4;
  selectedIds?: Set<number>;
  showQuantity?: boolean;
  quantities?: Map<number, number>;
}

/**
 * ProductGrid Component
 *
 * Visual grid of products optimized for touch interactions.
 * Similar to McDonald's kiosk interface - large, táctil, visual.
 *
 * Features:
 * - Large touch targets
 * - Product images
 * - Clear pricing
 * - Visual selection state
 * - Quantity indicators
 *
 * @example
 * ```tsx
 * <ProductGrid
 *   products={menuItems}
 *   onSelect={handleSelect}
 *   columns={3}
 *   selectedIds={selectedProductIds}
 * />
 * ```
 */
export function ProductGrid({
  products,
  onSelect,
  columns = 3,
  selectedIds,
  showQuantity = false,
  quantities,
}: ProductGridProps) {
  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-4`}>
      {products.map((product) => {
        const isSelected = selectedIds?.has(product.id);
        const quantity = quantities?.get(product.id) || 0;

        return (
          <TouchableCard
            key={product.id}
            onPress={() => onSelect(product)}
            size="large"
            hapticFeedback
            selected={isSelected}
            disabled={!product.isAvailable}
          >
            <div className="flex flex-col h-full">
              {/* Product Image */}
              {product.imageUrl ? (
                <div className="w-full h-32 mb-3 rounded-xl overflow-hidden bg-sage-50">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-32 mb-3 rounded-xl bg-sage-100 flex items-center justify-center">
                  <span className="text-4xl">🍽️</span>
                </div>
              )}

              {/* Product Name */}
              <h3 className="font-semibold text-lg text-carbon-900 mb-2 line-clamp-2">
                {product.name}
              </h3>

              {/* Description (optional, truncated) */}
              {product.description && (
                <p className="text-sm text-carbon-600 mb-2 line-clamp-2">
                  {product.description}
                </p>
              )}

              {/* Price and Quantity */}
              <div className="mt-auto flex items-center justify-between">
                <p className="text-2xl font-bold text-sage-green-600">
                  ${Number(product.price).toLocaleString("es-CO")}
                </p>
                {showQuantity && quantity > 0 && (
                  <span className="bg-sage-green-100 text-sage-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                    {quantity}
                  </span>
                )}
              </div>

              {/* Availability Badge */}
              {!product.isAvailable && (
                <span className="text-xs text-red-500 mt-2">No disponible</span>
              )}
            </div>
          </TouchableCard>
        );
      })}
    </div>
  );
}
