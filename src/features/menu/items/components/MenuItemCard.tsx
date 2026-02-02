import { useState } from "react";
import { DollarSign, Edit2, ImageIcon, Trash2, AlertTriangle, Package, Star } from "lucide-react";
import type { MenuItem } from "@/types";
import { Button, ConfirmDialog } from "@/components";
import { cn } from "@/utils/cn";

interface MenuItemCardProps {
  item: MenuItem;
  categoryName?: string;
  onEdit: (itemId: number) => void;
  onDelete: (id: number) => void;
}

/**
 * MenuItemCard Component
 *
 * Modern card for a menu item: clear hierarchy, status accent (available/unavailable/stock),
 * price, category name. Aligned with TableCard design (claude.md).
 */
export function MenuItemCard({ item, categoryName, onEdit, onDelete }: MenuItemCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Accent by status: available = emerald, unavailable = rose, low/out stock = amber/rose
  const isOutOfStock = item.inventoryType === "TRACKED" && (item.stockQuantity ?? 0) === 0;
  const isLowStock =
    item.inventoryType === "TRACKED" &&
    item.lowStockAlert != null &&
    (item.stockQuantity ?? 0) <= item.lowStockAlert &&
    (item.stockQuantity ?? 0) > 0;

  const getAccentConfig = () => {
    if (!item.isAvailable || isOutOfStock) {
      return {
        border: "border-rose-200",
        accent: "bg-rose-500",
        badge: "bg-rose-100 text-rose-700 border-rose-200",
      };
    }
    if (isLowStock) {
      return {
        border: "border-amber-200",
        accent: "bg-amber-500",
        badge: "bg-amber-100 text-amber-700 border-amber-200",
      };
    }
    return {
      border: "border-emerald-200",
      accent: "bg-emerald-500",
      badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
    };
  };

  const config = getAccentConfig();

  return (
    <>
      <article
        className={cn(
          "group relative overflow-hidden",
          "bg-white rounded-2xl border-2 shadow-sm",
          "transition-all duration-200",
          "hover:shadow-md hover:border-sage-200",
          config.border
        )}
      >
        <div className={cn("h-1 w-full", config.accent)} aria-hidden />

        <div className="p-5 sm:p-6">
          {/* Image */}
          <div className="mb-4">
            {item.imageUrl ? (
              <div className="w-full h-36 rounded-xl overflow-hidden border border-sage-200">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            ) : (
              <div className="w-full h-36 bg-sage-100 rounded-xl flex items-center justify-center border border-sage-200">
                <ImageIcon className="w-10 h-10 text-sage-400" />
              </div>
            )}
          </div>

          {/* Name + category + badges */}
          <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-semibold text-carbon-900 truncate">
                {item.name}
              </h3>
              {categoryName && (
                <p className="text-sm text-carbon-500 mt-0.5 truncate">
                  {categoryName}
                </p>
              )}
              {!categoryName && (
                <p className="text-sm text-carbon-400 mt-0.5">
                  Categoría #{item.categoryId}
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5 justify-end">
              <span
                className={cn(
                  "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border",
                  config.badge
                )}
              >
                {item.isAvailable && !isOutOfStock
                  ? "Disponible"
                  : "No disponible"}
              </span>
              {item.inventoryType === "TRACKED" && item.stockQuantity !== undefined && (
                <>
                  {item.stockQuantity === 0 ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border bg-rose-100 text-rose-700 border-rose-200">
                      <AlertTriangle className="w-3 h-3" />
                      Sin stock
                    </span>
                  ) : isLowStock ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border bg-amber-100 text-amber-700 border-amber-200">
                      <Package className="w-3 h-3" />
                      {item.stockQuantity}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border bg-sage-100 text-sage-700 border-sage-200">
                      <Package className="w-3 h-3" />
                      {item.stockQuantity}
                    </span>
                  )}
                </>
              )}
              {item.isExtra && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border bg-amber-100 text-amber-700 border-amber-200">
                  <Star className="w-3 h-3" />
                  Extra
                </span>
              )}
            </div>
          </div>

          {item.description && (
            <p className="text-sm text-carbon-600 font-light leading-relaxed line-clamp-2 mb-4">
              {item.description}
            </p>
          )}

          {/* Price */}
          <div className="flex items-center justify-center gap-2 py-3 px-4 bg-sage-50 rounded-xl border border-sage-200 mb-5">
            <DollarSign className="w-5 h-5 text-sage-600" />
            <span className="text-2xl font-bold text-carbon-900">
              {item.price}
            </span>
          </div>

          {/* Actions - touch-friendly min 44px (claude.md) */}
          <div className="flex gap-3 pt-4 border-t border-sage-100">
            <Button
              variant="ghost"
              size="md"
              onClick={() => onEdit(item.id)}
              className="flex-1 min-h-[44px] touch-manipulation"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Editar
            </Button>
            <Button
              variant="ghost"
              size="md"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="flex-1 min-h-[44px] touch-manipulation text-rose-600 hover:bg-rose-50 hover:text-rose-700"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Eliminar
            </Button>
          </div>
        </div>
      </article>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => {
          onDelete(item.id);
          setIsDeleteDialogOpen(false);
        }}
        title="Eliminar producto"
        message={`¿Eliminar "${item.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
      />
    </>
  );
}
