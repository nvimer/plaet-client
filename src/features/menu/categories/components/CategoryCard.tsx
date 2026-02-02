import { useState } from "react";
import { ArrowUpDown, Edit2, FolderOpen, Package, Trash2 } from "lucide-react";
import { Button, ConfirmDialog } from "@/components";
import type { MenuCategory } from "@/types";
import { cn } from "@/utils/cn";

interface CategoryCardProps {
  category: MenuCategory;
  onEdit: (categoryId: number) => void;
  onDelete: (id: number) => void;
  /** Optional: number of products in this category (restaurant-friendly) */
  productCount?: number;
}

/**
 * CategoryCard Component
 *
 * Modern card for a menu category: clear hierarchy, sage accent,
 * order, description, actions. Aligned with TableCard design (claude.md).
 */
export function CategoryCard({ category, onEdit, onDelete, productCount }: CategoryCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <>
      <article
        className={cn(
          "group relative overflow-hidden",
          "bg-white rounded-2xl border-2 border-sage-200 shadow-sm",
          "transition-all duration-200",
          "hover:shadow-md hover:border-sage-300"
        )}
      >
        <div className="h-1 w-full bg-sage-500" aria-hidden />

        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-14 h-14 rounded-xl bg-sage-50 border border-sage-200 flex items-center justify-center flex-shrink-0">
                <FolderOpen className="w-7 h-7 text-sage-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold text-carbon-900 truncate">
                  {category.name}
                </h3>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-carbon-500">
                  <span className="flex items-center gap-1.5 text-sm">
                    <ArrowUpDown className="w-4 h-4 flex-shrink-0 text-carbon-400" />
                    Orden: {category.order}
                  </span>
                  {productCount !== undefined && (
                    <span className="flex items-center gap-1.5 text-sm">
                      <Package className="w-4 h-4 flex-shrink-0 text-carbon-400" />
                      {productCount} {productCount === 1 ? "producto" : "productos"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {category.description && (
            <p className="text-sm text-carbon-600 font-light leading-relaxed line-clamp-3 mb-5">
              {category.description}
            </p>
          )}

          {/* Actions - touch-friendly min 44px (claude.md) */}
          <div className="flex gap-3 pt-4 border-t border-sage-100">
            <Button
              variant="ghost"
              size="md"
              onClick={() => onEdit(category.id)}
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
          onDelete(category.id);
          setIsDeleteDialogOpen(false);
        }}
        title="Eliminar categoría"
        message={`¿Eliminar la categoría "${category.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
      />
    </>
  );
}
