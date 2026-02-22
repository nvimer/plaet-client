import { useState } from "react";
import { Edit2, ImageIcon, Trash2, AlertTriangle, Package, Star, Plus } from "lucide-react";
import type { MenuItem } from "@/types";
import { Button, ConfirmDialog } from "@/components";
import { cn } from "@/utils/cn";
import { QuickStockModal } from "./QuickStockModal";

interface MenuItemCardProps {
  item: MenuItem;
  categoryName?: string;
  onEdit: (itemId: number) => void;
  onDelete: (id: number) => void;
}

/**
 * MenuItemCard – Diseño horizontal: imagen a la izquierda, contenido a la derecha.
 * Precio destacado, badges discretos, acciones en barra inferior. Fácil de escanear.
 */
export function MenuItemCard({ item, categoryName, onEdit, onDelete }: MenuItemCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);

  const isOutOfStock =
    item.inventoryType === "TRACKED" && (item.stockQuantity ?? 0) === 0;
  const isLowStock =
    item.inventoryType === "TRACKED" &&
    item.lowStockAlert != null &&
    (item.stockQuantity ?? 0) <= item.lowStockAlert &&
    (item.stockQuantity ?? 0) > 0;

  const statusVariant =
    !item.isAvailable || isOutOfStock
      ? "rose"
      : isLowStock
        ? "amber"
        : "emerald";

  return (
    <>
      <article
        className={cn(
          "group relative overflow-hidden",
          "bg-white rounded-2xl border-2 border-sage-200 shadow-sm",
          "transition-all duration-200 hover:shadow-md hover:border-sage-300"
        )}
      >
        <div className="flex flex-col sm:flex-row min-h-0">
          {/* Imagen – izquierda (o arriba en móvil) */}
          <div className="relative w-full sm:w-36 sm:flex-shrink-0 sm:h-auto aspect-[4/3] sm:aspect-square bg-sage-100">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <ImageIcon className="w-10 h-10 text-sage-400" />
              </div>
            )}
            {/* Badge de estado sobre la imagen */}
            <div
              className={cn(
                "absolute top-2 left-2 px-2 py-1 rounded-lg text-xs font-semibold shadow-sm",
                statusVariant === "emerald" &&
                  "bg-emerald-500/90 text-white",
                statusVariant === "amber" && "bg-amber-500/90 text-white",
                statusVariant === "rose" && "bg-rose-500/90 text-white"
              )}
            >
              {item.isAvailable && !isOutOfStock
                ? "Disponible"
                : "No disponible"}
            </div>
          </div>

          {/* Contenido – derecha */}
          <div
            className={cn(
              "relative flex flex-col flex-1 min-w-0 p-4 sm:p-5",
              "border-l-0 sm:border-l-4 border-t-4 sm:border-t-0",
              statusVariant === "emerald" && "border-emerald-400",
              statusVariant === "amber" && "border-amber-400",
              statusVariant === "rose" && "border-rose-400"
            )}
          >
            {/* Línea: nombre + precio */}
            <div className="flex items-start justify-between gap-3 mb-1">
              <h3 className="text-lg font-bold text-carbon-900 truncate flex-1 min-w-0">
                {item.name}
              </h3>
              <span className="text-xl font-bold text-sage-700 whitespace-nowrap">
                ${item.price}
              </span>
            </div>

            {categoryName && (
              <p className="text-sm text-carbon-500 truncate mb-2">
                {categoryName}
              </p>
            )}

            {item.description && (
              <p className="text-sm text-carbon-600 font-light leading-snug line-clamp-2 mb-3">
                {item.description}
              </p>
            )}

            {/* Pills: stock, extra */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {item.inventoryType === "TRACKED" && item.stockQuantity !== undefined && (
                <button 
                  onClick={() => setIsStockModalOpen(true)}
                  className="transition-transform active:scale-95"
                >
                  {item.stockQuantity === 0 ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold bg-rose-100 text-rose-700 border border-rose-200 hover:bg-rose-200">
                      <AlertTriangle className="w-3 h-3" />
                      SIN STOCK
                    </span>
                  ) : isLowStock ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200 hover:bg-amber-200">
                      <Package className="w-3 h-3" />
                      {item.stockQuantity} ud.
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold bg-sage-100 text-sage-700 border border-sage-200 hover:bg-sage-200">
                      <Package className="w-3 h-3" />
                      {item.stockQuantity} ud.
                    </span>
                  )}
                </button>
              )}
              {item.isExtra && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-amber-100 text-amber-700 border border-amber-200">
                  <Star className="w-3 h-3" />
                  Extra
                </span>
              )}
            </div>

            {/* Acciones – siempre visibles, barra inferior */}
            <div className="mt-auto flex gap-2 pt-3 border-t border-sage-100">
              {item.inventoryType === "TRACKED" && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsStockModalOpen(true)}
                  className="flex-1 min-h-[40px] touch-manipulation shadow-soft-sm bg-sage-600 hover:bg-sage-700"
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  Stock
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(item.id)}
                className="flex-1 min-h-[40px] touch-manipulation text-carbon-600 hover:bg-sage-50 border border-sage-200"
              >
                <Edit2 className="w-4 h-4 mr-1.5" />
                Editar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDeleteDialogOpen(true)}
                className="min-h-[40px] touch-manipulation text-rose-600 hover:bg-rose-50 px-3 border border-rose-100"
                aria-label="Eliminar"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </article>

      <QuickStockModal 
        item={item} 
        isOpen={isStockModalOpen} 
        onClose={() => setIsStockModalOpen(false)} 
      />

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
