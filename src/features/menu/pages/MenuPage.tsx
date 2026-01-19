import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button, Card, Badge } from "@/components";
import { FolderOpen, Grid3x3, ListFilter, Plus } from "lucide-react";
import type { AxiosErrorWithResponse } from "@/types/common";
import {
    useCategories,
    useDeleteCategory,
    CategoryCard,
} from "../categories";
import { MenuItemCard, useItems, useDeleteItem, useLowStockItems, useOutOfStockItems } from "../items";
import { ROUTES, getCategoryEditRoute, getMenuItemEditRoute } from "@/app/routes";
import { AlertTriangle, Package } from "lucide-react";

type Tab = "categories" | "items";

/**
 * MenuPage Component
 *
 * Main page for menu magement (categories and items)
 */
export function MenuPage() {
    const navigate = useNavigate();
    // ======== STATE =========
    // Tab state
    const [activeTab, setActiveTab] = useState<Tab>("items");
    const [filterCategory, setFilterCategory] = useState<string>("");

    // ======== QUERIES =========
    // Fetch Categories
    const { data: categories, isLoading: loadingCategories } = useCategories();
    const { mutate: deleteCategory } = useDeleteCategory();

    // Fetch Items
    const { data: items, isLoading: loadingItems } = useItems();
    const { mutate: deleteItem } = useDeleteItem();
    
    // Stock alerts
    const { data: lowStockItems } = useLowStockItems();
    const { data: outOfStockItems } = useOutOfStockItems();

    // ========== COMPUTED VALUES ==========
    // Filter Items by Category
    const filteredItems = filterCategory
        ? items?.filter((item) => String(item.categoryId) === filterCategory)
        : items;

    // ========= EVENT HANDLERS - CATEGORIES ============
    const handleCreateCategory = () => {
        navigate(ROUTES.MENU_CATEGORY_CREATE);
    };

    const handleEditCategory = (categoryId: number) => {
        navigate(getCategoryEditRoute(categoryId));
    };

    const handleDeleteCategory = (id: number) => {
        deleteCategory(id, {
            onSuccess: () => {
                toast.success("Categoría eliminada", {
                    description: "La categoría ha sido eliminada exitosamente",
                    icon: "🗑️",
                });
            },
            onError: (error: AxiosErrorWithResponse) => {
                toast.error("Error al eliminar categoría", {
                    description: error.response?.data?.message || error.message,
                    icon: "❌",
                });
            },
        });
    };

    // ======== EVENT HANDLERS - ITEMS =========
    const handleCreateItem = () => {
        navigate(ROUTES.MENU_ITEM_CREATE);
    };

    const handleEditItem = (itemId: number) => {
        navigate(getMenuItemEditRoute(itemId));
    };

    const handleDeleteItem = (id: number) => {
        deleteItem(id, {
            onSuccess: () => {
                toast.success("Producto eliminado", {
                    description: "El producto ha sido eliminado exitosamente",
                    icon: "🗑️",
                });
            },
            onError: (error: AxiosErrorWithResponse) => {
                toast.error("Error al eliminar producto", {
                    description: error.response?.data?.message || error.message,
                    icon: "❌",
                });
            },
        });
    };

    // ======= MAIN RENDER ========
    return (
        <>
            {/* ============= PAGE HEADER =============== */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-4xl font-semibold text-carbon-600 tracking-tight">
                            Gestión de Menú
                        </h1>
                        <p className="text-[15px] text-carbon-600 font-light">
                            Administra categorías e items del menú
                        </p>
                    </div>
                </div>

                {/* Stock Alerts */}
                {(outOfStockItems && outOfStockItems.length > 0) ||
                (lowStockItems && lowStockItems.length > 0) ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {outOfStockItems && outOfStockItems.length > 0 && (
                            <Card
                                variant="elevated"
                                padding="md"
                                className="bg-red-50 border-2 border-red-200"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-red-100 rounded-lg">
                                        <AlertTriangle className="w-5 h-5 text-red-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-red-900">
                                            Sin Stock
                                        </p>
                                        <p className="text-sm text-red-700">
                                            {outOfStockItems.length} producto(s) sin stock
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        )}

                        {lowStockItems && lowStockItems.length > 0 && (
                            <Card
                                variant="elevated"
                                padding="md"
                                className="bg-yellow-50 border-2 border-yellow-200"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-yellow-100 rounded-lg">
                                        <Package className="w-5 h-5 text-yellow-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-yellow-900">
                                            Stock Bajo
                                        </p>
                                        <p className="text-sm text-yellow-700">
                                            {lowStockItems.length} producto(s) con stock bajo
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        )}
                    </div>
                ) : null}
            </div>

            {/* ================ TAB NAVIGATION ==================== */}
            <Card variant="elevated" padding="md" className="mb-8">
                <div className="flex items-center gap-4">
                    {/* Items Tab  */}
                    <Button
                        variant={activeTab === "items" ? "primary" : "ghost"}
                        size="lg"
                        onClick={() => setActiveTab("items")}
                        className={activeTab === "items" ? "bg-sage-green-400 hover:bg-sage-green-500" : ""}
                    >
                        <Grid3x3 className="w-5 h-5 mr-2" />
                        Productos{" "}
                        <Badge
                            size="md"
                            variant={activeTab === "items" ? "neutral" : "success"}
                            className="ml-2"
                        >
                            {items?.length || 0}
                        </Badge>
                    </Button>

                    {/* Categories Tab  */}
                    <Button
                        variant={activeTab === "categories" ? "primary" : "ghost"}
                        size="lg"
                        onClick={() => setActiveTab("categories")}
                        className={activeTab === "categories" ? "bg-sage-green-400 hover:bg-sage-green-500" : ""}
                    >
                        <FolderOpen className="w-5 h-5 mr-2" /> Categorías{" "}
                        <Badge
                            size="md"
                            variant={activeTab === "categories" ? "neutral" : "success"}
                            className="ml-2"
                        >
                            {categories?.length || 0}
                        </Badge>
                    </Button>
                </div>
            </Card>

            {/* ============== TAB CONTENT: CATEGORIES ============== */}
            {activeTab === "categories" && (
                <div>
                    {/* New Category Button */}
                    <div className="my-8">
                        <Button
                            size="lg"
                            variant="primary"
                            onClick={handleCreateCategory}
                        >
                            <Plus className="w-5 h-5 mr-2" /> Nueva Categoría
                        </Button>
                    </div>

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
                                    onClick={handleCreateCategory}
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
                                    onEdit={(categoryId) => handleEditCategory(categoryId)}
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
                    {/* Controls: New Item + Item Filter */}
                    <div className="flex flex-wrap items-center gap-4 my-8">
                        {/* New Product Button  */}
                        <Button
                            size="lg"
                            variant="primary"
                            onClick={handleCreateItem}
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Nuevo Producto
                        </Button>

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
                                        onClick={handleCreateItem}
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
                                    onEdit={() => handleEditItem(item.id)}
                                    onDelete={handleDeleteItem}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
