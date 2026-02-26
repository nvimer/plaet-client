import { useState } from "react";
import { Edit2, ImageIcon, Trash2, Package, Star, Plus } from "lucide-react";
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
 * MenuItemCard – Rediseño Vertical & Táctil.
 * Optimizado para lectura de nombres largos y uso en pantallas táctiles.
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
          "group relative flex flex-col h-full overflow-hidden",
          "bg-white rounded-3xl border-2 border-transparent shadow-sm",
          "transition-all duration-300 hover:shadow-soft-xl hover:border-sage-200 sm:hover:-translate-y-1",
          !item.isAvailable && "opacity-75 grayscale-[0.5]"
        )}
      >
        {/* ÁREA DE IMAGEN - Estilo Limpio/Kiosko */}
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

            <div className="absolute top-3 left-3 flex gap-2 items-center">
              <div
                className={cn(
                  "w-3.5 h-3.5 rounded-full shadow-sm border-2 border-white",
                  statusVariant === "emerald" && "bg-emerald-500",
                  statusVariant === "amber" && "bg-amber-500",
                  statusVariant === "rose" && "bg-rose-500"
                )}
              />
              {item.isExtra && (
                <div className="p-1 rounded-full bg-amber-400 text-white shadow-sm">
                  <Star className="w-2.5 h-2.5 fill-current" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CONTENIDO - Enfoque en Nombre y Precio */}
        <div className="flex flex-col flex-1 p-4 sm:p-5 pt-2">
          <div className="text-center mb-3">
            {categoryName && (
              <span className="text-[8px] sm:text-[9px] font-black text-carbon-300 uppercase tracking-[0.2em] block mb-1">
                {categoryName}
              </span>
            )}
            
            <div className="flex flex-col gap-1 min-h-[4rem] justify-center">
              <h3 className="text-sm sm:text-base font-bold text-carbon-900 leading-tight line-clamp-2">
                {item.name}
              </h3>
              {item.description && (
                <p className="text-[10px] sm:text-xs text-carbon-400 italic line-clamp-2 leading-tight">
                  "{item.description}"
                </p>
              )}
            </div>

            <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-carbon-900 text-white shadow-sm mt-2">
              <span className="text-xs sm:text-sm font-black tracking-tight leading-none">
                ${item.price.toLocaleString("es-CO")}
              </span>
            </div>
          </div>

          {/* STOCK & ACCIONES - Compactos pero Táctiles */}
          <div className="mt-auto space-y-3">
            {item.inventoryType === "TRACKED" && (
              <button 
                onClick={() => setIsStockModalOpen(true)}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-2 rounded-xl border-2 transition-all active:scale-95",
                  isOutOfStock ? "bg-rose-50 border-rose-100 text-rose-700" :
                  isLowStock ? "bg-amber-50 border-amber-100 text-amber-700" :
                  "bg-sage-50 border-sage-100 text-sage-700 shadow-sm"
                )}
              >
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-sage-500" />
                  <span className="text-[10px] sm:text-xs font-medium tracking-wide">Existencias</span>
                </div>
                <span className="text-xs sm:text-base font-black">{item.stockQuantity} ud.</span>
              </button>
            )}

            <div className="flex items-center gap-2">
              {item.inventoryType === "TRACKED" && (
                <Button
                  variant="primary"
                  onClick={() => setIsStockModalOpen(true)}
                  className="flex-1 rounded-xl bg-sage-600 h-11 sm:h-12 px-0 shadow-sm"
                >
                  <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
                </Button>
              )}
              
              <Button
                variant="ghost"
                onClick={() => onEdit(item.id)}
                className={cn(
                  "rounded-xl bg-carbon-50 h-11 sm:h-12 text-carbon-600 border border-carbon-100 transition-all hover:bg-sage-100 shrink-0",
                  item.inventoryType === "TRACKED" ? "w-11 sm:w-12" : "flex-1"
                )}
                title="Editar"
              >
                <Edit2 className="w-5 h-5 sm:w-6 sm:h-6" />
              </Button>

              <Button
                variant="ghost"
                onClick={() => setIsDeleteDialogOpen(true)}
                className={cn(
                  "rounded-xl bg-rose-50 h-11 sm:h-12 text-rose-600 border border-rose-100 transition-all hover:bg-rose-100 shrink-0",
                  item.inventoryType === "TRACKED" ? "w-11 sm:w-12" : "flex-1"
                )}
                title="Eliminar"
              >
                <Trash2 className="w-5 h-5 sm:w-6 sm:h-6" />
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