import { Button, ConfirmDialog } from "@/components";
import { useState } from "react";
import { Edit2, ImageIcon, Trash2, Package, Star, Plus } from "lucide-react";
import type { MenuItem } from "@/types";
import { cn } from "@/utils/cn";
import { formatCurrency } from "@/utils/formatUtils";
import { QuickStockModal } from "@/features/inventory/components/QuickStockModal";

interface MenuItemCardProps {
  item: MenuItem;
  categoryName?: string;
  onEdit: (itemId: number) => void;
  onDelete: (id: number) => void;
  highlighted?: boolean;
}

/**
 * MenuItemCard – Rediseño Vertical & Táctil.
 * Optimizado para lectura de nombres largos y uso en pantallas táctiles.
 */
export function MenuItemCard({ item, categoryName, onEdit, onDelete, highlighted }: MenuItemCardProps) {
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
          "group relative flex flex-col h-full overflow-hidden",
          "bg-white rounded-3xl border-2 border-transparent shadow-sm",
          "transition-all duration-300 hover:shadow-soft-xl hover:border-sage-200 sm:hover:-translate-y-1",
          !item.isAvailable && "opacity-75 grayscale-[0.5]",
          highlighted && "ring-4 ring-sage-400 ring-offset-2 border-sage-400 animate-pulse"
        )}
      >
        {/* IMAGE AREA - Clean / Kiosk Style */}
        <div className="relative w-full pt-5 px-5 overflow-hidden">
          <div className="relative aspect-square w-full rounded-2xl bg-sage-50/50 overflow-hidden group-hover:bg-sage-50 transition-colors duration-300">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <ImageIcon className="w-12 h-12 text-sage-200/60" />
              </div>
            )}

            {/* Status Indicators */}
            <div className="absolute top-3 left-3 flex gap-2 items-center">
              <div
                title={item.isAvailable ? "Disponible" : "No disponible"}
                className={cn(
                  "w-3 h-3 rounded-full shadow-sm border-2 border-white",
                  statusVariant === "emerald" && "bg-success-500",
                  statusVariant === "amber" && "bg-warning-500",
                  statusVariant === "rose" && "bg-error-500"
                )}
              />
              {item.isExtra && (
                <div className="p-1 rounded-full bg-warning-400 text-white shadow-sm" title="Extra">
                  <Star className="w-2 h-2 fill-current" />
                </div>
              )}
            </div>

            {/* Compact Stock Badge */}
            {item.inventoryType === "TRACKED" && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsStockModalOpen(true);
                }}
                className={cn(
                  "absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg border shadow-soft-sm transition-all hover:scale-105 active:scale-95",
                  isOutOfStock ? "bg-error-50 border-error-200 text-error-700" :
                  isLowStock ? "bg-warning-50 border-warning-200 text-warning-700" :
                  "bg-white/90 backdrop-blur-md border-sage-200 text-sage-700"
                )}
              >
                <Package className="w-3 h-3 opacity-70" />
                <span className="text-[10px] font-black tracking-tight">
                  {item.stockQuantity} <span className="font-medium">ud</span>
                </span>
              </button>
            )}
          </div>
        </div>

        {/* CONTENT - Focus on Name and Price */}
        <div className="flex flex-col flex-1 p-4 sm:p-5 pt-2">
          <div className="text-center mb-4">
            {categoryName && (
              <span className="text-[8px] sm:text-[9px] font-black text-carbon-300 uppercase tracking-[0.2em] block mb-1">
                {categoryName}
              </span>
            )}
            
            <div className="flex flex-col gap-1 min-h-[3.5rem] justify-center">
              <h3 className="text-sm sm:text-base font-bold text-carbon-900 leading-tight line-clamp-2">
                {item.name}
              </h3>
              {item.description && (
                <p className="text-[10px] sm:text-xs text-carbon-400 italic line-clamp-2 leading-tight px-2">
                  "{item.description}"
                </p>
              )}
            </div>

            <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-carbon-900 text-white shadow-sm mt-3">
              <span className="text-xs sm:text-sm font-black tracking-tight leading-none">
                {formatCurrency(item.price)}
              </span>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="mt-auto flex items-center gap-2 pt-2 border-t border-sage-50">
            {item.inventoryType === "TRACKED" && (
              <Button
                variant="primary"
                onClick={() => setIsStockModalOpen(true)}
                className="flex-1 rounded-xl bg-sage-600 h-10 sm:h-11 px-0 shadow-sm transition-all hover:bg-sage-700"
                title="Ajustar Stock"
              >
                <Plus className="w-5 h-5" />
              </Button>
            )}
            
            <Button
              variant="ghost"
              onClick={() => onEdit(item.id)}
              className={cn(
                "rounded-xl bg-carbon-50 h-10 sm:h-11 text-carbon-600 border border-carbon-100 transition-all hover:bg-white hover:border-sage-300 hover:text-sage-600 shrink-0",
                item.inventoryType === "TRACKED" ? "w-10 sm:w-11" : "flex-1"
              )}
              title="Editar"
            >
              <Edit2 className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              onClick={() => setIsDeleteDialogOpen(true)}
              className={cn(
                "rounded-xl bg-error-50 h-10 sm:h-11 text-error-600 border border-error-100 transition-all hover:bg-error-600 hover:text-white shrink-0",
                item.inventoryType === "TRACKED" ? "w-10 sm:w-11" : "flex-1"
              )}
              title="Eliminar"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
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