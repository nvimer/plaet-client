import { useMemo, useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import {
  Button,
  FilterBar,
  FilterSearch,
  FilterPills,
  ActiveFilterChips,
  FilterDrawer,
  FilterSelect,
} from "@/components";
import { Skeleton } from "@/components/ui/Skeleton/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState/EmptyState";
import {
  Grid3x3,
  Plus,
  AlertTriangle,
  Package,
  SlidersHorizontal,
} from "lucide-react";
import type { AxiosErrorWithResponse } from "@/types/common";
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
import { SidebarLayout } from "@/layouts/SidebarLayout";

/**
 * Premium Menu Page
 * Catalog management with unified advanced filters and tactile design.
 */
export function MenuPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setFilterCategory(categoryParam);
    }
  }, [searchParams]);

  const handleCategoryChange = (value: string) => {
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
  } = useItemsPagination(1, 12, filterCategory);

  const items = useMemo(() => paginationData?.data || [], [paginationData?.data]);
  const { mutate: deleteItem } = useDeleteItem();
  const { data: lowStockItems } = useLowStockItems();
  const { data: outOfStockItems } = useOutOfStockItems();

  const categoryNameById = useMemo(() => {
    const map: Record<number, string> = {};
    categories?.forEach((c) => { map[c.id] = c.name; });
    return map;
  }, [categories]);

  // Client-side search for current page
  const filteredItems = useMemo(() => {
    if (!searchTerm) return items;
    return items.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm]);

  const hasStockAlerts = (outOfStockItems?.length ?? 0) > 0 || (lowStockItems?.length ?? 0) > 0;
  
  const activeChips = [
    ...(filterCategory !== "" ? [{ key: "category", label: "Categoría", value: categoryNameById[Number(filterCategory)] ?? `#${filterCategory}` }] : []),
    ...(searchTerm !== "" ? [{ key: "search", label: "Búsqueda", value: searchTerm }] : []),
  ];

  const handleCreateItem = () => navigate(ROUTES.MENU_ITEM_CREATE);
  const handleEditItem = (id: number) => navigate(getMenuItemEditRoute(id));
  const handleDeleteItem = (id: number) => {
    deleteItem(id, {
      onSuccess: () => toast.success("Producto eliminado"),
      onError: (e: AxiosErrorWithResponse) =>
        toast.error("Error al eliminar", { description: e.response?.data?.message ?? e.message }),
    });
  };

  const categoryOptions = useMemo(() => [
    { value: "", label: "Todos" },
    ...(categories ?? []).map(c => ({ value: String(c.id), label: c.name }))
  ], [categories]);

  if (isLoading && !paginationData) {
    return (
      <SidebarLayout hideTitle fullWidth>
        <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => <Skeleton key={i} variant="card" height={100} />)}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => <Skeleton key={i} variant="card" />)}
          </div>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout hideTitle fullWidth>
      <div className="px-4 sm:px-6 lg:px-8 space-y-8 pb-24 py-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-sage-600">
              <Grid3x3 className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Catálogo Comercial</span>
            </div>
            <h1 className="text-3xl font-bold text-carbon-900 tracking-tight">Productos del Menú</h1>
            <p className="text-sm text-carbon-500 font-medium">Administra los productos, precios y categorías de tu restaurante.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate(ROUTES.STOCK_MANAGEMENT)}
              className="rounded-2xl h-14 px-6 border-sage-200 text-sage-700 hover:bg-sage-50 transition-all font-bold shadow-soft-sm"
            >
              <Package className="w-5 h-5 mr-2" />
              Ver Inventario
            </Button>

            <Button
              size="lg"
              variant="primary"
              onClick={handleCreateItem}
              className="rounded-2xl h-14 px-8 shadow-soft-lg transition-all active:scale-95 font-bold bg-carbon-900 hover:bg-carbon-800"
            >
              <Plus className="w-5 h-5 mr-2 stroke-[3px]" />
              Nuevo Producto
            </Button>
          </div>
        </header>

        {/* Alertas de stock */}
        {hasStockAlerts && (
          <div className="flex items-center justify-between p-4 bg-amber-50 rounded-2xl border border-amber-100 shadow-soft-sm">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                Alertas de Stock
              </div>
              <div className="h-4 w-px bg-amber-200" />
              <div className="flex gap-4">
                <span className="text-xs font-medium text-amber-700">
                  <strong className="text-carbon-900">{outOfStockItems?.length ?? 0}</strong> agotados
                </span>
                <span className="text-xs font-medium text-amber-700">
                  <strong className="text-carbon-900">{lowStockItems?.length ?? 0}</strong> bajos
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(ROUTES.STOCK_MANAGEMENT)}
              className="text-amber-900 font-bold hover:bg-amber-100"
            >
              Gestionar
            </Button>
          </div>
        )}

        {/* Unified Filter System */}
        <div className="space-y-6">
          <FilterBar>
            <div className="flex flex-col lg:flex-row lg:items-center gap-6 flex-1 min-w-0">
              <div className="w-full lg:w-72 flex-shrink-0">
                <FilterSearch
                  value={searchTerm}
                  onChange={setSearchTerm}
                  placeholder="Buscar en esta página..."
                  onClear={() => setSearchTerm("")}
                />
              </div>
              
              <div className="flex-1 min-w-0 overflow-x-auto custom-scrollbar-hide">
                <FilterPills
                  options={categoryOptions.slice(0, 6)} // Quick access to first 5 categories
                  value={filterCategory}
                  onChange={handleCategoryChange}
                />
              </div>
            </div>

            <div className="flex-shrink-0">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setIsFilterDrawerOpen(true)}
                className="rounded-2xl h-12 px-6 border-sage-100 text-carbon-600 hover:border-sage-400 hover:text-carbon-900 transition-all font-bold group shadow-soft-sm bg-white"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2 text-carbon-400 group-hover:text-carbon-900 transition-colors" />
                Filtros
                {(filterCategory !== "" || searchTerm !== "") && (
                  <span className="ml-2 w-2 h-2 rounded-full bg-sage-500 animate-pulse" />
                )}
              </Button>
            </div>
          </FilterBar>

          <ActiveFilterChips
            chips={activeChips}
            resultCount={filteredItems.length}
            resultLabel={filteredItems.length === 1 ? "producto" : "productos"}
            onClearFilter={(key) => {
              if (key === "category") handleCategoryChange("");
              if (key === "search") setSearchTerm("");
            }}
            onClearAll={() => {
              handleCategoryChange("");
              setSearchTerm("");
            }}
          />
        </div>

        {/* Main Grid */}
        {loadingItems ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {[...Array(8)].map((_, i) => <Skeleton key={i} variant="card" />)}
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
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
        ) : (
          <EmptyState
            icon={<Grid3x3 className="w-12 h-12" />}
            title={filterCategory ? "Sin resultados" : "Carta vacía"}
            description={
              filterCategory 
                ? "No hay productos que coincidan con la categoría o búsqueda." 
                : "Comienza agregando productos a tu catálogo digital."
            }
            actionLabel={filterCategory || searchTerm ? "Limpiar filtros" : "Nuevo Producto"}
            onAction={filterCategory || searchTerm ? () => { handleCategoryChange(""); setSearchTerm(""); } : handleCreateItem}
          />
        )}

        {/* Pagination */}
        {(totalItems ?? 0) > 0 && !searchTerm && (
          <div className="pt-8 border-t border-sage-100">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={limit}
              onPageChange={setPage}
              onItemsPerPageChange={setLimit}
              isLoading={loadingItems}
            />
          </div>
        )}

        {/* Filter Drawer */}
        <FilterDrawer
          isOpen={isFilterDrawerOpen}
          onClose={() => setIsFilterDrawerOpen(false)}
          onApply={() => {}}
          onClear={() => { handleCategoryChange(""); setSearchTerm(""); }}
          isDirty={filterCategory !== "" || searchTerm !== ""}
          title="Refinar Catálogo"
        >
          <div className="space-y-8">
            <FilterSelect
              label="Todas las Categorías"
              value={filterCategory}
              onChange={handleCategoryChange}
              options={categoryOptions}
              placeholder="Seleccionar rubro..."
            />
            
            <div className="pt-4 p-5 rounded-2xl bg-sage-50 border border-sage-100">
              <h4 className="text-[10px] font-black text-carbon-400 uppercase tracking-widest mb-3 ml-1">Organización</h4>
              <p className="text-sm font-medium text-carbon-600 leading-relaxed">
                Clasifica tus productos por rubros comerciales para facilitar la toma de pedidos y la lectura de reportes.
              </p>
            </div>
          </div>
        </FilterDrawer>
      </div>
    </SidebarLayout>
  );
}