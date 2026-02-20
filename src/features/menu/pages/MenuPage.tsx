import { useMemo, useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import {
  Button,
  FilterBar,
  FilterSelect,
  ActiveFilterChips,
} from "@/components";
import { Skeleton } from "@/components/ui/Skeleton/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState/EmptyState";
import {
  FolderOpen,
  Grid3x3,
  Plus,
  AlertTriangle,
  Package,
} from "lucide-react";
import type { AxiosErrorWithResponse } from "@/types/common";
import { MenuSectionToolbar, CardGrid } from "../components";
import {
  useCategories,
  
} from "../categories";
import {
  MenuItemCard,
  useDeleteItem,
  useLowStockItems,
  useOutOfStockItems,
  useItemsPagination,
} from "../items";
import { Pagination } from "@/components/ui/Pagination";
import {
  ROUTES,
  
  getMenuItemEditRoute,
} from "@/app/routes";
import { cn } from "@/utils/cn";

export function MenuPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterCategory, setFilterCategory] = useState<string>("");

  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setFilterCategory(categoryParam);
    }
  }, [searchParams]);

  const handleFilterChange = (value: string) => {
    setFilterCategory(value);
    setSearchParams(value ? { category: value } : {});
  };

  const { data: categories } = useCategories();
    
  
  const {
    items: paginationData,
    isLoading: loadingItems,
    page,
    limit,
    totalItems,
    totalPages,
    setPage,
    setLimit,
  } = useItemsPagination();

  const items = useMemo(
    () => paginationData?.data || [],
    [paginationData?.data],
  );
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

      const hasStockAlerts =
        (outOfStockItems?.length ?? 0) > 0 || (lowStockItems?.length ?? 0) > 0;
  
    const handleCreateItem = () => navigate(ROUTES.MENU_ITEM_CREATE);
    const handleEditItem = (id: number) => navigate(getMenuItemEditRoute(id));
    const handleDeleteItem = (id: number) => {
      deleteItem(id, {
        onSuccess: () => toast.success("Producto eliminado"),
        onError: (e: AxiosErrorWithResponse) =>
          toast.error("Error al eliminar", {
            description: e.response?.data?.message ?? e.message,
          }),
      });
    };
  
    return (    <div className="space-y-6">
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
              "bg-white border-sage-200 text-carbon-700",
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
              "bg-white border-sage-200 text-carbon-700",
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
            "bg-amber-50/80 border-amber-200 text-amber-900",
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

      

      {/* Panel de contenido */}
      <div className="rounded-2xl border-2 border-sage-200 bg-white shadow-sm overflow-hidden p-6 sm:p-8 space-y-4">
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
              options={(categories ?? []).map((c) => ({
                value: String(c.id),
                label: c.name,
              }))}
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
                  value:
                    categoryNameById[Number(filterCategory)] ??
                    `#${filterCategory}`,
                },
              ]}
              resultCount={filteredItems?.length ?? 0}
              resultLabel={
                (filteredItems?.length ?? 0) === 1 ? "producto" : "productos"
              }
              onClearFilter={(key) => {
                if (key === "category") handleFilterChange("");
              }}
              onClearAll={() => handleFilterChange("")}
            />
          )}

          {loadingItems ? (
            <>
              <Skeleton
                variant="text"
                width={180}
                height={24}
                className="mb-5"
              />
              <CardGrid>
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} variant="card" />
                ))}
              </CardGrid>
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
                  ? "Cambia el filtro o crea un producto aquí"
                  : "Crea tu primer producto del menú"
              }
              actionLabel={
                !filterCategory ? "Crear primer producto" : undefined
              }
              onAction={!filterCategory ? handleCreateItem : undefined}
            />
          ) : (
            <>
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

              {/* Pagination */}
              {(totalItems ?? 0) > 0 && (
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  itemsPerPage={limit}
                  onPageChange={setPage}
                  onItemsPerPageChange={setLimit}
                  isLoading={loadingItems}
                />
              )}
            </>
          )}
        </div>
    </div>
  );
}
