import { useState } from "react";
import { DollarSign, Edit2, ImageIcon, Star, Trash2 } from "lucide-react";
import type { MenuItem } from "@/types";
import { Button, Card, Badge, ConfirmDialog } from "@/components";

// ========== TYPES ========
interface MenuItemCardProps {
    item: MenuItem;
    onEdit: (item: MenuItem) => void;
    onDelete: (id: number) => void;
}

/**
 * MenuItemCard Component
 *
 * Displays a single menu item with details and actions
 */
export function MenuItemCard({ item, onEdit, onDelete }: MenuItemCardProps) {
    // ================== STATE ==================
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    // ======== RENDER ========
    return (
        <>
            <Card
                variant="elevated"
                padding="lg"
                className="transition-all duration-300 hover:shadow-soft-xl hover:-translate-y-1 group"
            >
                {/* ========== HEADER WITH IMAGE ============ */}
                <div className="mb-4">
                    {/* Image preview or placeholder */}
                    {item.imageUrl ? (
                        <div className="w-full h-40 rounded-xl overflow-hidden mb-4 border-2 bg-sage-border-subtle">
                            <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                    ) : (
                        <div className="w-full h-40 bg-sage-100 rounded-xl flex items-center justify-center mb-4 border-2 border-sage-border-subtle">
                            <ImageIcon className="w-12 h-12 text-sage-green-300" />
                        </div>
                    )}

                    {/* Name and Badges row */}
                    <div className="flex justify-between items-start mb-3 gap-3">
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-carbon-900 mb-1 truncate">
                                {item.name}
                            </h3>
                            {/* Category ID indicator */}
                            <p className="text-sm text-carbon-500 font-light">
                                Categoría: {item.categoryId}
                            </p>
                        </div>

                        {/* Badges container */}
                        <div className="flex flex-col gap-2 items-end">
                            {/* Availability Badge */}
                            <Badge variant={item.isAvailable ? "success" : "error"} size="sm">
                                {item.isAvailable ? "Disponible" : "No Disponible"}
                            </Badge>

                            {/* Extras Badge*/}
                            {item.isExtra && (
                                <Badge variant="warning" size="sm">
                                    <Star className="w-3 h-3 mr-1" />
                                    Extra
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>

                {/* =========== DESCRIPTION =========== */}
                {item.description && (
                    <div className="mb-4 p-3 bg-sage-50 rounded-lg border border-sage-border-subtle">
                        <p className="text-sm text-carbon-700 font-light leading-relaxed">
                            {item.description}
                        </p>
                    </div>
                )}

                {/* ========== PRICE =========== */}
                <div className="mb-6 p-4 bg-gradient-sage rounded-xl border-2 border-sage-green-200">
                    <div className="flex items-center justify-center gap-2">
                        <DollarSign className="w-6 h-6 text-sage-green-700" />
                        <span className="text-3xl font-bold text-primary-700">
                            {item.price}
                        </span>
                    </div>
                </div>

                {/* ======= ACTIONS ======= */}
                <div className="flex gap-3 pt-4 border-t border-neutral-100">
                    {/* Edit Button */}
                    <Button
                        variant="ghost"
                        size="md"
                        onClick={() => onEdit(item)}
                        className="flex-1 group/btn"
                    >
                        <Edit2 className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                        Editar
                    </Button>
                    {/* Delete Button  */}
                    <Button
                        variant="ghost"
                        size="md"
                        onClick={() => setIsDeleteDialogOpen(true)}
                        className="flex-1 text-red-600 hover:bg-red-50 hover:text-red-700 group/btn"
                    >
                        <Trash2 className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                        Eliminar
                    </Button>
                </div>
            </Card>
            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={() => {
                    onDelete(item.id);
                    setIsDeleteDialogOpen(false); // Close modal after delete
                }}
                title="Eliminar Producto"
                message={`¿Estás seguro que deseas eliminar el producto "${item.name}"? Esta acción no se puede deshacer.`}
                confirmText="Eliminar"
                cancelText="Cancelar"
                variant="danger"
            />
        </>
    );
}
