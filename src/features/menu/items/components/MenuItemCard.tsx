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
          "bg-white rounded-3xl border-2 border-sage-200 shadow-sm",
          "transition-all duration-300 hover:shadow-soft-xl hover:border-sage-400 hover:-translate-y-1"
        )}
      >
        {/* IMAGEN SUPERIOR - Proporción fija para consistencia */}
        <div className="relative w-full aspect-[16/10] bg-sage-100 overflow-hidden">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <ImageIcon className="w-12 h-12 text-sage-300" />
            </div>
          )}

          {/* Overlay: Estado y Precio */}
          <div className="absolute inset-0 bg-gradient-to-t from-carbon-900/60 via-transparent to-transparent opacity-60" />
          
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            <div
              className={cn(
                "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg backdrop-blur-md border",
                statusVariant === "emerald" && "bg-emerald-500/90 text-white border-emerald-400",
                statusVariant === "amber" && "bg-amber-500/90 text-white border-amber-400",
                statusVariant === "rose" && "bg-rose-500/90 text-white border-rose-400"
              )}
            >
              {item.isAvailable && !isOutOfStock ? "Disponible" : "No disponible"}
            </div>
          </div>

          <div className="absolute bottom-3 right-3">
            <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-soft-lg border border-sage-100">
              <span className="text-xl font-black text-sage-700">
                ${item.price.toLocaleString("es-CO")}
              </span>
            </div>
          </div>
        </div>

        {/* CONTENIDO INFERIOR */}
        <div className="flex flex-col flex-1 p-6">
          {/* Categoría y Badges Rápidos */}
          <div className="flex items-center justify-between mb-2">
            {categoryName && (
              <span className="text-[10px] font-bold text-carbon-400 uppercase tracking-[0.2em]">
                {categoryName}
              </span>
            )}
            <div className="flex gap-1">
              {item.isExtra && (
                <div className="p-1.5 rounded-lg bg-amber-100 text-amber-600" title="Producto Extra">
                  <Star className="w-3.5 h-3.5 fill-current" />
                </div>
              )}
            </div>
          </div>

          {/* NOMBRE - El protagonista, hasta 3 líneas */}
          <h3 className="text-xl font-bold text-carbon-900 leading-tight mb-3 line-clamp-3 min-h-[3.5rem] group-hover:text-sage-700 transition-colors">
            {item.name}
          </h3>

          {/* Descripción - Truncada suavemente */}
          {item.description && (
            <p className="text-sm text-carbon-500 font-medium leading-relaxed line-clamp-2 mb-4 italic">
              &quot;{item.description}&quot;
            </p>
          )}

          {/* STOCK PILL - Interactivo */}
          <div className="mt-auto mb-6">
            {item.inventoryType === "TRACKED" && item.stockQuantity !== undefined ? (
              <button 
                onClick={() => setIsStockModalOpen(true)}
                className={cn(
                  "w-full flex items-center justify-between p-3 rounded-2xl border-2 transition-all active:scale-95",
                  isOutOfStock ? "bg-rose-50 border-rose-100 text-rose-700" :
                  isLowStock ? "bg-amber-50 border-amber-100 text-amber-700" :
                  "bg-sage-50 border-sage-100 text-sage-700"
                )}
              >
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Inventario</span>
                </div>
                <span className="text-sm font-black">
                  {item.stockQuantity} ud.
                </span>
              </button>
            ) : (
              <div className="h-12 flex items-center justify-center border-2 border-dashed border-sage-100 rounded-2xl">
                <span className="text-[10px] font-bold text-carbon-300 uppercase tracking-widest">Ilimitado</span>
              </div>
            )}
          </div>

          {/* ACCIONES - Botones grandes y fáciles de tocar */}
          <div className="grid grid-cols-4 gap-2">
            {item.inventoryType === "TRACKED" ? (
              <Button
                variant="primary"
                size="lg"
                onClick={() => setIsStockModalOpen(true)}
                className="col-span-2 rounded-2xl bg-sage-600 hover:bg-sage-700 shadow-soft-sm h-14"
              >
                <Plus className="w-5 h-5 mr-1" />
                <span className="font-bold">Stock</span>
              </Button>
            ) : (
              <div className="col-span-2" />
            )}
            
            <Button
              variant="ghost"
              size="lg"
              onClick={() => onEdit(item.id)}
              className="col-span-1 rounded-2xl bg-carbon-50 hover:bg-sage-100 text-carbon-600 border border-carbon-100 h-14"
              title="Editar Producto"
            >
              <Edit2 className="w-5 h-5" />
            </Button>

            <Button
              variant="ghost"
              size="lg"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="col-span-1 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 h-14"
              title="Eliminar"
            >
              <Trash2 className="w-5 h-5" />
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