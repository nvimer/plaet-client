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
          "bg-white rounded-2xl sm:rounded-3xl border-2 border-sage-200 shadow-sm",
          "transition-all duration-300 hover:shadow-soft-xl hover:border-sage-400 sm:hover:-translate-y-1"
        )}
      >
        {/* IMAGEN SUPERIOR - Proporción fija para consistencia */}
        <div className="relative w-full aspect-square sm:aspect-[16/10] bg-sage-100 overflow-hidden">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <ImageIcon className="w-8 h-8 sm:w-12 sm:h-12 text-sage-300" />
            </div>
          )}

          {/* Overlay: Estado y Precio */}
          <div className="absolute inset-0 bg-gradient-to-t from-carbon-900/60 via-transparent to-transparent opacity-60" />
          
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-col gap-2">
            <div
              className={cn(
                "px-2 sm:px-3 py-1 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest shadow-lg backdrop-blur-md border",
                statusVariant === "emerald" && "bg-emerald-500/90 text-white border-emerald-400",
                statusVariant === "amber" && "bg-amber-500/90 text-white border-amber-400",
                statusVariant === "rose" && "bg-rose-500/90 text-white border-rose-400"
              )}
            >
              {item.isAvailable && !isOutOfStock ? "Disponible" : "No disponible"}
            </div>
          </div>

          <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3">
            <div className="bg-white/95 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl shadow-soft-lg border border-sage-100">
              <span className="text-base sm:text-xl font-black text-sage-700">
                ${item.price.toLocaleString("es-CO")}
              </span>
            </div>
          </div>
        </div>

        {/* CONTENIDO INFERIOR */}
        <div className="flex flex-col flex-1 p-4 sm:p-6">
          {/* Categoría y Badges Rápidos */}
          <div className="flex items-center justify-between mb-1.5 sm:mb-2">
            {categoryName && (
              <span className="text-[9px] sm:text-[10px] font-bold text-carbon-400 uppercase tracking-[0.15em] sm:tracking-[0.2em]">
                {categoryName}
              </span>
            )}
            <div className="flex gap-1">
              {item.isExtra && (
                <div className="p-1 sm:p-1.5 rounded-lg bg-amber-100 text-amber-600" title="Producto Extra">
                  <Star className="w-3 sm:w-3.5 h-3 sm:h-3.5 fill-current" />
                </div>
              )}
            </div>
          </div>

          {/* NOMBRE - El protagonista, hasta 3 líneas */}
          <h3 className="text-base sm:text-xl font-bold text-carbon-900 leading-tight mb-2 sm:mb-3 line-clamp-2 sm:line-clamp-3 min-h-[2.5rem] sm:min-h-[3.5rem] group-hover:text-sage-700 transition-colors">
            {item.name}
          </h3>

          {/* Descripción - Truncada suavemente */}
          {item.description && (
            <p className="text-xs sm:text-sm text-carbon-500 font-medium leading-relaxed line-clamp-2 mb-3 sm:mb-4 italic">
              &quot;{item.description}&quot;
            </p>
          )}

          {/* STOCK PILL - Interactivo */}
          <div className="mt-auto mb-4 sm:mb-6">
            {item.inventoryType === "TRACKED" && item.stockQuantity !== undefined ? (
              <button 
                onClick={() => setIsStockModalOpen(true)}
                className={cn(
                  "w-full flex items-center justify-between p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border-2 transition-all active:scale-95",
                  isOutOfStock ? "bg-rose-50 border-rose-100 text-rose-700" :
                  isLowStock ? "bg-amber-50 border-amber-100 text-amber-700" :
                  "bg-sage-50 border-sage-100 text-sage-700"
                )}
              >
                <div className="flex items-center gap-2">
                  <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Stock</span>
                </div>
                <span className="text-xs sm:text-sm font-black">
                  {item.stockQuantity} ud.
                </span>
              </button>
            ) : (
              <div className="h-10 sm:h-12 flex items-center justify-center border-2 border-dashed border-sage-100 rounded-xl sm:rounded-2xl">
                <span className="text-[9px] sm:text-[10px] font-bold text-carbon-300 uppercase tracking-widest">Ilimitado</span>
              </div>
            )}
          </div>

          {/* ACCIONES - Botones grandes y fáciles de tocar */}
          <div className="grid grid-cols-4 gap-2">
            {item.inventoryType === "TRACKED" ? (
              <Button
                variant="primary"
                size="md"
                onClick={() => setIsStockModalOpen(true)}
                className="col-span-2 rounded-xl sm:rounded-2xl bg-sage-600 hover:bg-sage-700 shadow-soft-sm h-11 sm:h-14"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-1" />
                <span className="font-bold text-xs sm:text-base">Stock</span>
              </Button>
            ) : (
              <div className="col-span-2" />
            )}
            
            <Button
              variant="ghost"
              size="md"
              onClick={() => onEdit(item.id)}
              className="col-span-1 rounded-xl sm:rounded-2xl bg-carbon-50 hover:bg-sage-100 text-carbon-600 border border-carbon-100 h-11 sm:h-14"
              title="Editar Producto"
            >
              <Edit2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>

            <Button
              variant="ghost"
              size="md"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="col-span-1 rounded-xl sm:rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 h-11 sm:h-14"
              title="Eliminar"
            >
              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
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