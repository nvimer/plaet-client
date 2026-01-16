import { useState } from "react";
import { ArrowUpDown, Edit2, FolderOpen, Trash2 } from "lucide-react";
import { Button, Card, ConfirmDialog } from "@/components";
import type { MenuCategory } from "@/types";

// =========== TYPES ============
interface CategoryCardProps {
    category: MenuCategory;
    onEdit: (categoryId: number) => void;
    onDelete: (id: number) => void;
}

/**
 * MenuCategory Card component
 *
 *  Displays a single category with actions
 */
export function CategoryCard({
    category,
    onEdit,
    onDelete,
}: CategoryCardProps) {
    // =========== STATE ============
    const [isDeleteDialogOpen, setIsDialogOpen] = useState(false);

    // =========== RENDER ============
    return (
        <>
            <Card
                variant="elevated"
                padding="lg"
                className="transition-all duration-300 hover:shadow-soft-xl hover:-translate-y-1 group"
            >
                {/* ============== HEADER ============ */}
                <div className="flex items-start justify-between mb-4">
                    {/* Category Icon and Name */}
                    <div className="flex items-center gap-3 flex-1">
                        <div className="w-12 h-12 bg-sage-green-100 rounded-xl flex items-center justify-center border-2 border-sage-green-100 group-hover:bg-sage-green-200 transition-colors">
                            <FolderOpen className="w-6 h-6 text-sage-green-600" />
                        </div>

                        {/* Category name  */}
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-carbon-900 mb-1 truncate">
                                {category.name}
                            </h3>

                            {/* Order badge */}
                            <div className="flex items-center gap-1.5 text-carbon-600">
                                <ArrowUpDown className="w-3.5 h-3.5" />
                                <span className="text-xs font-light">
                                    Órden: {category.order}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ========== DESCRIPTION =============== */}
                {category.description && (
                    <div className="mb-6 p-3 bg-sage-50 rounded-lg border border-sage-border-subtle">
                        <p className="text-sm text-carbon-700 font-light leading-relaxed">
                            {category.description}
                        </p>
                    </div>
                )}

                {/* =========== ACTIONS ========== */}
                <div className="flex gap-3 pt-4 border-t border-sage-border-subtle">
                    {/* Edit Button  */}
                    <Button
                        variant="ghost"
                        size="md"
                        onClick={() => onEdit(category.id)}
                        className="flex-1 group/btn"
                    >
                        <Edit2 className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                        Editar
                    </Button>

                    {/* Delete Button */}
                    <Button
                        variant="ghost"
                        size="md"
                        onClick={() => setIsDialogOpen(true)}
                        className="flex-1 text-red-600 hover:bg-red-50 hover:text-red-700 group/btn"
                    >
                        <Trash2 className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                        Eliminar
                    </Button>
                </div>
            </Card>
            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onConfirm={() => {
                    onDelete(category.id);
                    setIsDialogOpen(false); // Close modal after delete
                }}
                title="Eliminar Categoría"
                message={`¿Estás seguro de que deseas eliminar la categoría "${category.name}"? Esta acción no se puede deshacer.`}
                confirmText="Eliminar"
                cancelText="Cancelar"
                variant="danger"
            />
        </>
    );
}
