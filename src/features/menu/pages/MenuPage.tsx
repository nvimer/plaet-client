import { useMemo, useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Button, Card, FilterBar, FilterSelect, ActiveFilterChips } from "@/components";
import { Skeleton } from "@/components/ui/Skeleton/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState/EmptyState";
import { FolderOpen, Grid3x3, Plus, UtensilsCrossed, AlertTriangle, Package } from "lucide-react";
import type { AxiosErrorWithResponse } from "@/types/common";
import { MenuSectionToolbar, CardGrid } from "../components";
import {
  useCategories,
  useDeleteCategory,
  useUpdateCategory,
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
import { cn } from "@/utils/cn";

type Tab = "categories" | "items";

/**
 * MenuPage Component
 *
 * Gestión de menú con diseño actual: header con estadísticas,
 * pestañas tipo segmented control, alertas compactas y panel de contenido.
 */
export function MenuPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<Tab>("items");
  const [filterCategory, setFilterCategory] = useState<string>("");

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    const categoryParam = searchParams.get("category");
    if (tabParam === "categories") setActiveTab("categories");
    else if (categoryParam) {
      setActiveTab("items");
      setFilterCategory(categoryParam);
    }
  }, [searchParams]);

  const handleFilterChange = (value: string) => {
    setFilterCategory(value);
    setSearchParams(value ? { category: value } : {});
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setSearchParams(tab === "categories" ? { tab: "categories" } : {});
  };

  const { data: categories, isLoading: loadingCategories } = useCategories();
  const { mutate: deleteCategory } = useDeleteCategory();
  const { mutate: updateCategory } = useUpdateCategory();

  const sortedCategories = useMemo(
    () => [...(categories ?? [])].sort((a, b) => a.order - b.order),
    [categories]
  );

  const { data: items, isLoading: loadingItems } = useItems();
  const { mutate: deleteItem } = useDeleteItem();

  const { data: lowStockItems } = useLowStockItems();
  const { data: outOfStockItems } = useOutOfStockItems();

  const categoryNameById = useMemo(() => {
    const map: Record<number, string> = {};
    categories?.forEach((c) => { map[c.id] = c.name; });
    return map;
  }, [categories]);

  const countByCategory = useMemo(() => {
    const map: Record<number, number> = {};
    items?.forEach((i) => { map[i.categoryId] = (map[i.categoryId] ?? 0) + 1; });
    return map;
  }, [items]);

  const filteredItems = filterCategory
    ? items?.filter((item) => String(item.categoryId) === filterCategory)
    : items;

  const hasStockAlerts =
    (outOfStockItems?.length ?? 0) > 0 || (lowStockItems?.length ?? 0) > 0;

  const handleCreateCategory = () => navigate(ROUTES.MENU_CATEGORY_CREATE);
  const handleEditCategory = (id: number) => navigate(getCategoryEditRoute(id));
  const handleDeleteCategory = (id: number) => {
    deleteCategory(id, {
      onSuccess: () => toast.success("Categoría eliminada"),
      onError: (e: AxiosErrorWithResponse) =>
        toast.error("Error al eliminar", { description: e.response?.data?.message ?? e.message }),
    });
  };

  const handleMoveCategoryUp = (index: number) => {
    if (index <= 0) return;
    const current = sortedCategories[index];
    const prev = sortedCategories[index - 1];
    updateCategory(
      { id: current.id, order: prev.order },
      {
        onSuccess: () => {
          updateCategory(
            { id: prev.id, order: current.order },
            {
              onSuccess: () => toast.success("Orden actualizado"),
              onError: (e: AxiosErrorWithResponse) =>
                toast.error("Error al reordenar", { description: e.response?.data?.message ?? e.message }),
            }
          );
        },
        onError: (e: AxiosErrorWithResponse) =>
          toast.error("Error al reordenar", { description: e.response?.data?.message ?? e.message }),
      }
    );
  };

  const handleMoveCategoryDown = (index: number) => {
    if (index < 0 || index >= sortedCategories.length - 1) return;
    const current = sortedCategories[index];
    const next = sortedCategories[index + 1];
    updateCategory(
      { id: current.id, order: next.order },
      {
        onSuccess: () => {
          updateCategory(
            { id: next.id, order: current.order },
            {
              onSuccess: () => toast.success("Orden actualizado"),
              onError: (e: AxiosErrorWithResponse) =>
                toast.error("Error al reordenar", { description: e.response?.data?.message ?? e.message }),
            }
          );
        },
        onError: (e: AxiosErrorWithResponse) =>
          toast.error("Error al reordenar", { description: e.response?.data?.message ?? e.message }),
      }
    );
  };

  const handleCreateItem = () => navigate(ROUTES.MENU_ITEM_CREATE);
  const handleEditItem = (id: number) => navigate(getMenuItemEditRoute(id));
  const handleDeleteItem = (id: number) => {
    deleteItem(id, {
      onSuccess: () => toast.success("Producto eliminado"),
      onError: (e: AxiosErrorWithResponse) =>
        toast.error("Error al eliminar", { description: e.response?.data?.message ?? e.message }),
    });
  };

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-carbon-900 tracking-tight">
            Menú
          </h1>
          <p className="text-sm text-carbon-500 mt-1">
            Productos y categorías del restaurante
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 min-h-[44px] touch-manipulation",
              "bg-white border-sage-200 text-carbon-700"
            )}
          >
            <Grid3x3 className="w-5 h-5 text-sage-600 flex-shrink-0" />
            <span className="text-sm font-medium">
              {items?.length ?? 0} productos
            </span>
          </div>
          <div
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 min-h-[44px] touch-manipulation",
              "bg-white border-sage-200 text-carbon-700"
            )}
          >
            <FolderOpen className="w-5 h-5 text-sage-600 flex-shrink-0" />
            <span className="text-sm font-medium">
              {categories?.length ?? 0} categorías
            </span>
          </div>
        </div>
      </header>

      {/* Alertas de stock (compactas) */}
      {hasStockAlerts && (
        <div
          className={cn(
            "flex flex-wrap items-center justify-between gap-3 px-4 py-3 rounded-xl border-2 min-h-[44px]",
            "bg-amber-50/80 border-amber-200 text-amber-900"
          )}
        >
          <div className="flex flex-wrap items-center gap-4">
            {(outOfStockItems?.length ?? 0) > 0 && (
              <span className="flex items-center gap-2 text-sm font-medium">
                <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                {outOfStockItems!.length} sin stock
              </span>
            )}
            {(lowStockItems?.length ?? 0) > 0 && (
              <span className="flex items-center gap-2 text-sm font-medium">
                <Package className="w-4 h-4 text-amber-600 flex-shrink-0" />
                {lowStockItems!.length} stock bajo
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(ROUTES.STOCK_MANAGEMENT)}
            className="min-h-[40px] text-amber-800 hover:bg-amber-100 touch-manipulation"
          >
            Ver inventario
          </Button>
        </div>
      )}

      {/* Tabs tipo segmented control */}
      <div
        role="tablist"
        aria-label="Sección del menú"
        className={cn(
          "inline-flex p-1.5 rounded-2xl border-2 border-sage-200 bg-sage-50/50",
          "min-h-[48px] touch-manipulation"
        )}
      >
        <button
          role="tab"
          aria-selected={activeTab === "items"}
          aria-controls="panel-productos"
          id="tab-productos"
          onClick={() => handleTabChange("items")}
          className={cn(
            "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium min-h-[44px] transition-all duration-200",
            activeTab === "items"
              ? "bg-white text-sage-800 shadow-sm border border-sage-200"
              : "text-carbon-600 hover:text-carbon-800 hover:bg-sage-100/50"
          )}
        >
          <UtensilsCrossed className="w-5 h-5 flex-shrink-0" />
          Productos
          <span
            className={cn(
              "ml-1 px-2 py-0.5 rounded-full text-xs font-semibold",
              activeTab === "items" ? "bg-sage-100 text-sage-700" : "bg-sage-200/80 text-carbon-600"
            )}
          >
            {items?.length ?? 0}
          </span>
        </button>
        <button
          role="tab"
          aria-selected={activeTab === "categories"}
          aria-controls="panel-categorias"
          id="tab-categorias"
          onClick={() => handleTabChange("categories")}
          className={cn(
            "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium min-h-[44px] transition-all duration-200",
            activeTab === "categories"
              ? "bg-white text-sage-800 shadow-sm border border-sage-200"
              : "text-carbon-600 hover:text-carbon-800 hover:bg-sage-100/50"
          )}
        >
          <FolderOpen className="w-5 h-5 flex-shrink-0" />
          Categorías
          <span
            className={cn(
              "ml-1 px-2 py-0.5 rounded-full text-xs font-semibold",
              activeTab === "categories" ? "bg-sage-100 text-sage-700" : "bg-sage-200/80 text-carbon-600"
            )}
          >
            {categories?.length ?? 0}
          </span>
        </button>
      </div>

      {/* Panel de contenido */}
      <section
        id="panel-productos"
        role="tabpanel"
        aria-labelledby="tab-productos"
        hidden={activeTab !== "items"}
        className={cn(
          "rounded-2xl border-2 border-sage-200 bg-white shadow-sm overflow-hidden",
          "focus:outline-none"
        )}
      >
        <div className="p-6 sm:p-8 space-y-4">
          <MenuSectionToolbar
            countLabel={`${filteredItems?.length ?? 0} ${(filteredItems?.length ?? 0) === 1 ? "producto" : "productos"}${filterCategory ? " en esta categoría" : ""}`}
            primaryLabel="Nuevo producto"
            onPrimaryAction={handleCreateItem}
            primaryIcon={<Plus className="w-5 h-5" />}
          />

          <FilterBar>
            <FilterSelect
              label="Categoría"
              value={filterCategory}
              onChange={handleFilterChange}
              options={(categories ?? []).map((c) => ({ value: String(c.id), label: c.name }))}
              placeholder="Todas las categorías"
              aria-label="Filtrar por categoría"
              className="max-w-xs"
            />
          </FilterBar>

          {filterCategory && (
            <ActiveFilterChips
              chips={[
                {
                  key: "category",
                  label: "Categoría",
                  value: categoryNameById[Number(filterCategory)] ?? `#${filterCategory}`,
                },
              ]}
              resultCount={filteredItems?.length ?? 0}
              resultLabel={(filteredItems?.length ?? 0) === 1 ? "producto" : "productos"}
              onClearFilter={(key) => { if (key === "category") handleFilterChange(""); }}
              onClearAll={() => handleFilterChange("")}
            />
          )}

          {loadingItems ? (
            <>
              <Skeleton variant="text" width={180} height={24} className="mb-5" />
              <CardGrid>
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} variant="card" />
                ))}
              </CardGrid>
            </>
          ) : !filteredItems?.length ? (
            <EmptyState
              icon={<Grid3x3 />}
              title={filterCategory ? "No hay productos en esta categoría" : "No hay productos"}
              description={filterCategory ? "Cambia el filtro o crea un producto aquí" : "Crea tu primer producto del menú"}
              actionLabel={!filterCategory ? "Crear primer producto" : undefined}
              onAction={!filterCategory ? handleCreateItem : undefined}
            />
          ) : (
            <CardGrid>
              {filteredItems.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  categoryName={categoryNameById[item.categoryId]}
                  onEdit={handleEditItem}
                  onDelete={handleDeleteItem}
                />
              ))}
            </CardGrid>
          )}
        </div>
      </section>

      <section
        id="panel-categorias"
        role="tabpanel"
        aria-labelledby="tab-categorias"
        hidden={activeTab !== "categories"}
        className={cn(
          "rounded-2xl border-2 border-sage-200 bg-white shadow-sm overflow-hidden",
          "focus:outline-none"
        )}
      >
        <div className="p-6 sm:p-8">
          <MenuSectionToolbar
            countLabel={`${categories?.length ?? 0} ${(categories?.length ?? 0) === 1 ? "categoría" : "categorías"}`}
            primaryLabel="Nueva categoría"
            onPrimaryAction={handleCreateCategory}
            primaryIcon={<Plus className="w-5 h-5" />}
          />

          {loadingCategories ? (
            <>
              <Skeleton variant="text" width={160} height={24} className="mb-6" />
              <CardGrid>
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} variant="card" />
                ))}
              </CardGrid>
            </>
          ) : !categories?.length ? (
            <EmptyState
              icon={<FolderOpen />}
              title="No hay categorías"
              description="Crea tu primera categoría para organizar el menú"
              actionLabel="Crear primera categoría"
              onAction={handleCreateCategory}
            />
          ) : (
            <CardGrid>
              {sortedCategories.map((category, index) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  onEdit={handleEditCategory}
                  onDelete={handleDeleteCategory}
                  productCount={countByCategory[category.id]}
                  onMoveUp={() => handleMoveCategoryUp(index)}
                  onMoveDown={() => handleMoveCategoryDown(index)}
                  canMoveUp={index > 0}
                  canMoveDown={index < sortedCategories.length - 1}
                />
              ))}
            </CardGrid>
          )}
        </div>
      </section>
    </div>
  );
}
