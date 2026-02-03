import { useState } from "react";
import { ChevronDown, ChevronUp, Edit2, FolderOpen, Package, Trash2 } from "lucide-react";
import { Button, ConfirmDialog } from "@/components";
import type { MenuCategory } from "@/types";
import { cn } from "@/utils/cn";

interface CategoryCardProps {
  category: MenuCategory;
  onEdit: (categoryId: number) => void;
  onDelete: (id: number) => void;
  /** Optional: number of products in this category */
  productCount?: number;
  /** Optional: reorder up (decrease order index) */
  onMoveUp?: () => void;
  /** Optional: reorder down (increase order index) */
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
}

/**
 * CategoryCard – Compact card for a menu category.
 * Shows name, order, product count, optional description; actions + optional order controls.
 */
export function CategoryCard({
  category,
  onEdit,
  onDelete,
  productCount,
  onMoveUp,
  onMoveDown,
  canMoveUp = false,
  canMoveDown = false,
}: CategoryCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <>
      <article
        className={cn(
          "group relative overflow-hidden",
          "bg-white rounded-xl border-2 border-sage-200 shadow-sm",
          "transition-all duration-200",
          "hover:shadow-md hover:border-sage-300"
        )}
      >
        <div className="h-0.5 w-full bg-sage-500" aria-hidden />

        <div className="p-4">
          <div className="flex items-center gap-3">
            {/* Order controls */}
            {(onMoveUp != null || onMoveDown != null) && (
              <div className="flex flex-col gap-0.5 flex-shrink-0" aria-label="Orden">
                <button
                  type="button"
                  onClick={onMoveUp}
                  disabled={!canMoveUp}
                  className={cn(
                    "p-1 rounded-md transition-colors touch-manipulation min-h-[32px] min-w-[32px] flex items-center justify-center",
                    canMoveUp
                      ? "text-sage-600 hover:bg-sage-100"
                      : "text-sage-300 cursor-not-allowed"
                  )}
                  aria-label="Subir categoría"
                >
                  <ChevronUp className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={onMoveDown}
                  disabled={!canMoveDown}
                  className={cn(
                    "p-1 rounded-md transition-colors touch-manipulation min-h-[32px] min-w-[32px] flex items-center justify-center",
                    canMoveDown
                      ? "text-sage-600 hover:bg-sage-100"
                      : "text-sage-300 cursor-not-allowed"
                  )}
                  aria-label="Bajar categoría"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>
            )}

            <div className="w-10 h-10 rounded-lg bg-sage-50 border border-sage-200 flex items-center justify-center flex-shrink-0">
              <FolderOpen className="w-5 h-5 text-sage-600" />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-base font-semibold text-carbon-900 truncate">
                {category.name}
              </h3>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5 text-carbon-500 text-sm">
                <span>Orden {category.order}</span>
                {productCount !== undefined && (
                  <span className="flex items-center gap-1">
                    <Package className="w-3.5 h-3.5 text-carbon-400" />
                    {productCount} {productCount === 1 ? "producto" : "productos"}
                  </span>
                )}
              </div>
            </div>
          </div>

          {category.description && (
            <p className="text-sm text-carbon-600 font-light line-clamp-2 mt-2">
              {category.description}
            </p>
          )}

          <div className="flex gap-2 mt-3 pt-3 border-t border-sage-100">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(category.id)}
              className="flex-1 min-h-[40px] touch-manipulation"
            >
              <Edit2 className="w-4 h-4 mr-1.5" />
              Editar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="flex-1 min-h-[40px] touch-manipulation text-rose-600 hover:bg-rose-50 hover:text-rose-700"
            >
              <Trash2 className="w-4 h-4 mr-1.5" />
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
