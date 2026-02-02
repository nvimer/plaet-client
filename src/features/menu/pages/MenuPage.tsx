import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button, Card, Badge } from "@/components";
import { Skeleton } from "@/components/ui/Skeleton/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState/EmptyState";
import { FolderOpen, Grid3x3, ListFilter, Plus } from "lucide-react";
import type { AxiosErrorWithResponse } from "@/types/common";
import {
  useCategories,
  useDeleteCategory,
  CategoryCard,
} from "../categories";
import {
  MenuItemCard,
  useItems,
  useDeleteItem,
  useLowStockItems,
  useOutOfStockItems,
} from "../items";
import { ROUTES, getCategoryEditRoute, getMenuItemEditRoute } from "@/app/routes";
import { AlertTriangle, Package } from "lucide-react";

type Tab = "categories" | "items";

/**
 * MenuPage Component
 *
 * Main page for menu management (categories and items).
 * Aligned with app design system (claude.md) and TablesPage layout.
 */
export function MenuPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("items");
  const [filterCategory, setFilterCategory] = useState<string>("");

  const { data: categories, isLoading: loadingCategories } = useCategories();
  const { mutate: deleteCategory } = useDeleteCategory();

  const { data: items, isLoading: loadingItems } = useItems();
  const { mutate: deleteItem } = useDeleteItem();

  const { data: lowStockItems } = useLowStockItems();
  const { data: outOfStockItems } = useOutOfStockItems();

  const categoryNameById = useMemo(() => {
    const map: Record<number, string> = {};
    categories?.forEach((c) => {
      map[c.id] = c.name;
    });
    return map;
  }, [categories]);

  const filteredItems = filterCategory
    ? items?.filter((item) => String(item.categoryId) === filterCategory)
    : items;

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
        });
      },
      onError: (error: AxiosErrorWithResponse) => {
        toast.error("Error al eliminar categoría", {
          description: error.response?.data?.message || error.message,
        });
      },
    });
  };

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
        });
      },
      onError: (error: AxiosErrorWithResponse) => {
        toast.error("Error al eliminar producto", {
          description: error.response?.data?.message || error.message,
        });
      },
    });
  };

  return (
    <>
      {/* Page Header - aligned with TablesPage */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-carbon-900 tracking-tight">
            Gestión de Menú
          </h1>
          <p className="text-sm text-carbon-500 mt-1">
            Administra categorías y productos del menú
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
              className="bg-rose-50 border-2 border-rose-200 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-100 rounded-xl">
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-rose-900">Sin stock</p>
                  <p className="text-sm text-rose-700">
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
              className="bg-amber-50 border-2 border-amber-200 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-xl">
                  <Package className="w-5 h-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-amber-900">Stock bajo</p>
                  <p className="text-sm text-amber-700">
                    {lowStockItems.length} producto(s) con stock bajo
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      ) : null}

      {/* Tab Navigation */}
      <Card
        variant="elevated"
        padding="md"
        className="mb-8 rounded-2xl border border-sage-200 shadow-sm"
      >
        <div className="flex items-center gap-3 flex-wrap">
          <Button
            variant={activeTab === "items" ? "primary" : "ghost"}
            size="lg"
            onClick={() => setActiveTab("items")}
            className={
              activeTab === "items"
                ? "bg-sage-green-500 hover:bg-sage-green-600"
                : ""
            }
          >
            <Grid3x3 className="w-5 h-5 mr-2" />
            Productos
            <Badge
              size="md"
              variant={activeTab === "items" ? "neutral" : "success"}
              className="ml-2"
            >
              {items?.length ?? 0}
            </Badge>
          </Button>
          <Button
            variant={activeTab === "categories" ? "primary" : "ghost"}
            size="lg"
            onClick={() => setActiveTab("categories")}
            className={
              activeTab === "categories"
                ? "bg-sage-green-500 hover:bg-sage-green-600"
                : ""
            }
          >
            <FolderOpen className="w-5 h-5 mr-2" />
            Categorías
            <Badge
              size="md"
              variant={activeTab === "categories" ? "neutral" : "success"}
              className="ml-2"
            >
              {categories?.length ?? 0}
            </Badge>
          </Button>
        </div>
      </Card>

      {/* TAB: Categories */}
      {activeTab === "categories" && (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <p className="text-sm font-medium text-carbon-600">
              {categories?.length ?? 0}{" "}
              {(categories?.length ?? 0) === 1 ? "categoría" : "categorías"}
            </p>
            <Button
              size="lg"
              variant="primary"
              onClick={handleCreateCategory}
              className="w-full sm:w-auto min-h-[44px]"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nueva Categoría
            </Button>
          </div>

          {loadingCategories ? (
            <>
              <div className="mb-6">
                <Skeleton variant="text" width={160} height={24} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} variant="card" />
                ))}
              </div>
            </>
          ) : !categories?.length ? (
            <EmptyState
              icon={<FolderOpen />}
              title="No hay categorías"
              description="Crea tu primera categoría para organizar el menú"
              actionLabel="Crear Primera Categoría"
              onAction={handleCreateCategory}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
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

      {/* TAB: Items */}
      {activeTab === "items" && (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex flex-wrap items-center gap-4">
              <p className="text-sm font-medium text-carbon-600">
                {filteredItems?.length ?? 0}{" "}
                {(filteredItems?.length ?? 0) === 1 ? "producto" : "productos"}
                {filterCategory ? " en esta categoría" : ""}
              </p>
              <div className="flex items-center gap-2">
                <ListFilter className="w-5 h-5 text-carbon-500" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border-2 border-sage-300 bg-sage-50/80 text-carbon-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sage-green-400 focus:border-sage-green-400"
                >
                  <option value="">Todas las categorías</option>
                  {categories?.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <Button
              size="lg"
              variant="primary"
              onClick={handleCreateItem}
              className="w-full sm:w-auto min-h-[44px]"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nuevo Producto
            </Button>
          </div>

          {loadingItems ? (
            <>
              <div className="mb-5">
                <Skeleton variant="text" width={180} height={24} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} variant="card" />
                ))}
              </div>
            </>
          ) : !filteredItems?.length ? (
            <EmptyState
              icon={<Grid3x3 />}
              title={
                filterCategory
                  ? "No hay productos en esta categoría"
                  : "No hay productos"
              }
              description={
                filterCategory
                  ? "Cambia el filtro o crea un producto en esta categoría"
                  : "Crea tu primer producto para el menú"
              }
              actionLabel={!filterCategory ? "Crear Primer Producto" : undefined}
              onAction={!filterCategory ? handleCreateItem : undefined}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  categoryName={categoryNameById[item.categoryId]}
                  onEdit={handleEditItem}
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
