import { useState } from "react";
import { toast } from "sonner";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { Button, Card, Badge } from "@/components";
import { FolderOpen, Grid3x3, ListFilter, Plus } from "lucide-react";
import { type MenuItem, type MenuCategory } from "@/types";
import {
    useCategories,
    useDeleteCategory,
    CategoryForm,
    CategoryCard,
} from "../categories";
import { MenuItemCard, MenuItemForm, useItems, useDeleteItem } from "../items";

type Tab = "categories" | "items";

/**
 * MenuPage Component
 *
 * Main page for menu magement (categories and items)
 */
export function MenuPage() {
    // ======== STATE =========
    // Tab state
    const [activeTab, setActiveTab] = useState<Tab>("items");

    // Category state
    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState<
        MenuCategory | undefined
    >();

    // Item State
    const [showItemForm, setShowItemForm] = useState(false);
    const [editingItem, setEditingItem] = useState<MenuItem | undefined>();
    const [filterCategory, setFilterCategory] = useState<string>("");

    // ======== QUERIES =========
    // Fetch Categories
    const { data: categories, isLoading: loadingCategories } = useCategories();
    const { mutate: deleteCategory } = useDeleteCategory();

    // Fetch Items
    const { data: items, isLoading: loadingItems } = useItems();
    const { mutate: deleteItem } = useDeleteItem();

    // ========== COMPUTED VALUES ==========
    // Filter Items by Category
    const filteredItems = filterCategory
        ? items?.filter((item) => String(item.categoryId) === filterCategory)
        : items;

    // ========= EVENT HANDLERS - CATEGORIES ============
    const handleEditCategory = (category: MenuCategory) => {
        setEditingCategory(category);
        setShowCategoryForm(true);
    };

    const handleDeleteCategory = (id: number) => {
        deleteCategory(id, {
            onSuccess: () => {
                toast.success("Categoría eliminada", {
                    description: "La categoría ha sido eliminada exitosamente",
                    icon: "🗑️",
                });
            },
            onError: (error: any) => {
                toast.error("Error al eliminar categoría", {
                    description: error.response?.data?.message || error.message,
                    icon: "❌",
                });
            },
        });
    };

    const handleCategorySuccess = () => {
        setShowCategoryForm(false);
        setEditingCategory(undefined);
    };

    // ======== EVENT HANDLERS - ITEMS =========
    const handleEditItem = (item: MenuItem) => {
        setEditingItem(item);
        setShowItemForm(true);
    };

    const handleDeleteItem = (id: number) => {
        deleteItem(id, {
            onSuccess: () => {
                toast.success("Producto eliminado", {
                    description: "El producto ha sido eliminado exitosamente",
                    icon: "🗑️",
                });
            },
            onError: (error: any) => {
                toast.error("Error al eliminar producto", {
                    description: error.response?.data?.message || error.message,
                    icon: "❌",
                });
            },
        });
    };

    const handleItemSuccess = () => {
        setShowItemForm(false);
        setEditingItem(undefined);
    };

    // ======= MAIN RENDER ========
    return (
        <DashboardLayout>
            {/* ============= PAGE HEADER =============== */}
            <div className="flex items-center justify-between mb-12">
                <div>
                    <h1 className="text-4xl font-semibold text-carbon-600 tracking-tight">
                        Gestión de Menú
                    </h1>
                    <p className="text-[15px] text-carbon-600 font-light">
                        Administra categorías e items del menú
                    </p>
                </div>
            </div>

            {/* ================ TAB NAVIGATION ==================== */}
            <Card variant="elevated" padding="md" className="mb-8">
                <div className="flex items-center gap-4">
                    {/* Items Tab  */}
                    <button
                        onClick={() => setActiveTab("items")}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all font-medium ${activeTab === "items"
                                ? "bg-sage-green-400 text-white shadow-soft-md"
                                : "bg-sage-50 text-carbon-600 hover:bg-sage-100"
                            } `}
                    >
                        <Grid3x3 className="w-5 h-5" />
                        Productos{" "}
                        <Badge
                            size="md"
                            variant={activeTab === "items" ? "neutral" : "success"}
                        >
                            {items?.length || 0}
                        </Badge>
                    </button>

                    {/* Categories Tab  */}
                    <button
                        onClick={() => setActiveTab("categories")}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all font-medium ${activeTab === "categories"
                                ? "bg-sage-green-400 text-white shadow-soft-md"
                                : "bg-sage-50 text-carbon-600 hover:bg-sage-100"
                            }`}
                    >
                        <FolderOpen className="w-5 h-5" /> Categorías{" "}
                        <Badge
                            size="md"
                            variant={activeTab === "categories" ? "neutral" : "success"}
                        >
                            {categories?.length || 0}
                        </Badge>
                    </button>
                </div>
            </Card>

            {/* ============== TAB CONTENT: CATEGORIES ============== */}
            {activeTab === "categories" && (
                <div>
                    {/* Category Form */}
                    {showCategoryForm && (
                        <Card variant="elevated" padding="lg" className="mb-8">
                            <h2 className="text-2xl font-semibold text-carbon-900 mb-6">
                                {editingCategory ? "Editar Categoría" : "Nueva Categoría"}
                            </h2>
                            <CategoryForm
                                category={editingCategory}
                                onSuccess={handleCategorySuccess}
                                onCancel={() => {
                                    setShowCategoryForm(false);
                                    setEditingCategory(undefined);
                                }}
                            />
                        </Card>
                    )}

                    {/* New Category Button */}
                    {!showCategoryForm && (
                        <div className="my-8">
                            <Button
                                size="lg"
                                variant="primary"
                                onClick={() => setShowCategoryForm(true)}
                            >
                                <Plus className="w-5 h-5 mr-2" /> Nueva Categoría
                            </Button>
                        </div>
                    )}

                    {/* Categories Grid */}
                    {loadingCategories ? (
                        <div className="text-center py-16">
                            <div className="animate-spin rounded-full h-12 w-12 border-2 border-sage-green-200 border-t-sage-green-600 mx-auto mb-4"></div>
                            <p className="text-carbon-600 font-light">
                                Cargando Categorías...
                            </p>
                        </div>
                    ) : categories?.length === 0 ? (
                        <Card variant="elevated" padding="lg" className="text-center">
                            <div className="py-12">
                                <FolderOpen className="h-16 w-16 text-sage-green-300 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-carbon-900 mb-6">
                                    No hay categorías
                                </h3>
                                <p className="text-carbon-600 font-light mb-6">
                                    Crea tu primera categoría para organizar el menú
                                </p>
                                <Button
                                    variant="primary"
                                    onClick={() => setShowCategoryForm(true)}
                                >
                                    <Plus className="w-5 h-5 mr-2" />
                                    Crear Primera Categoría
                                </Button>
                            </div>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {categories?.map((category) => (
                                <CategoryCard
                                    key={category.id}
                                    category={category}
                                    onEdit={handleEditCategory}
                                    onDelete={handleDeleteCategory}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* =============== TAB CONTENT: ITEMS ================== */}
            {activeTab === "items" && (
                <div>
                    {/* Item Form */}
                    {showItemForm && (
                        <Card variant="elevated" padding="lg" className="mb-8">
                            <h2 className="text-2xl font-semibold text-carbon-900 mb-4">
                                {editingItem ? "Editar Producto" : "Nuevo Producto"}
                            </h2>
                            <MenuItemForm
                                item={editingItem}
                                onSuccess={handleItemSuccess}
                                onCancel={() => {
                                    setShowItemForm(true);
                                    setEditingItem(undefined);
                                }}
                            />
                        </Card>
                    )}

                    {/* Controls: New Item + Item Filter */}
                    <div className="flex flex-wrap items-center gap-4 my-8">
                        {/* New Product Button  */}
                        {!showItemForm && (
                            <Button
                                size="lg"
                                variant="primary"
                                onClick={() => setShowItemForm(true)}
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                Nuevo Producto
                            </Button>
                        )}

                        {/* Category Filter */}
                        <div className="flex items-center gap-3">
                            <ListFilter className="w-5 h-5 text-carbon-600" />
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className="px-4 py-2.5 border-2 border-sage-border-subtle rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-300 focus:border-sage-green-300 bg-white text-carbon-900 font-medium text-sm hover:border-sage-green-200 transition-colors"
                            >
                                <option value="">Todas las Categorías</option>
                                {categories?.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Items Grid */}
                    {loadingItems ? (
                        <div className="flex text-center py-16">
                            <div className="animate-spin rounded-full h-12 w-12 border-2 border-sage-green-200 border-t-sage-green-600 mx-auto mb-4"></div>
                            <p className="text-carbon-600 font-light">
                                Cargando Productos...
                            </p>
                        </div>
                    ) : filteredItems?.length === 0 ? (
                        <Card variant="elevated" padding="lg" className="text-center">
                            <div className="py-12 text-center">
                                <Grid3x3 className="w-16 h-16 text-sage-green-300 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-carbon-900 mb-2">
                                    {filterCategory
                                        ? "No hay Productos en esta categoría"
                                        : "No hay Productos"}
                                </h3>
                                <p className="text-carbon-600 font-light mb-6">
                                    {filterCategory
                                        ? "Intenta seleccionar otra categoría"
                                        : "Crea tu primer producto para el menú"}
                                </p>
                                {!filterCategory && (
                                    <Button
                                        variant="primary"
                                        onClick={() => setShowItemForm(true)}
                                    >
                                        <Plus className="w-5 h-5 mr-2" />
                                        Crear Primer Producto
                                    </Button>
                                )}
                            </div>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredItems?.map((item) => (
                                <MenuItemCard
                                    key={item.id}
                                    item={item}
                                    onEdit={handleEditItem}
                                    onDelete={handleDeleteItem}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </DashboardLayout>
    );
}
