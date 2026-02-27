import { useState, useMemo } from "react";
import { SidebarLayout } from "@/layouts/SidebarLayout";
import { Button, Card, Badge, Skeleton, EmptyState, FilterBar, FilterPills, FilterSearch, FilterSelect, FilterDrawer, ActiveFilterChips } from "@/components";
import { useItems } from "../hooks";
import {
  DailyResetModal,
  InventoryTypeModal,
  InventoryDashboard,
} from "../components";
import { usePermissions } from "@/hooks/usePermissions";
import { Package, RotateCcw, Plus, AlertTriangle, Settings2, SlidersHorizontal } from "lucide-react";
import { cn } from "@/utils/cn";
import type { MenuItem } from "@/types";
import { QuickStockModal } from "../components/QuickStockModal";

type StockFilter = "ALL" | "LOW_STOCK" | "OUT_OF_STOCK" | "TRACKED";

/**
 * Premium Stock Management Page
 * Redesigned with advanced filter system and launchpad consistency.
 */
export function StockManagementPage() {
  const { isAdmin } = usePermissions();

  // State
  const [filter, setFilter] = useState<StockFilter>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isInventoryTypeModalOpen, setIsInventoryTypeModalOpen] = useState(false);
  const [isQuickStockOpen, setIsQuickStockOpen] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  // Queries
  const { data: allItems, isLoading: loadingItems } = useItems();

  // Filter options
  const filterOptions = [
    { value: "ALL", label: "Todo" },
    { value: "LOW_STOCK", label: "Stock Bajo" },
    { value: "OUT_OF_STOCK", label: "Agotado" },
  ];

  // Filter items logic
  const filteredItems = useMemo(() => {
    if (!allItems) return [];

    let items = allItems;

    if (searchTerm) {
      items = items.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    switch (filter) {
      case "LOW_STOCK":
        items = items.filter(
          (item) =>
            item.inventoryType === "TRACKED" &&
            item.stockQuantity !== undefined &&
            item.lowStockAlert !== undefined &&
            item.stockQuantity <= item.lowStockAlert &&
            item.stockQuantity > 0,
        );
        break;
      case "OUT_OF_STOCK":
        items = items.filter(
          (item) =>
            item.inventoryType === "TRACKED" && item.stockQuantity === 0,
        );
        break;
      case "TRACKED":
        items = items.filter((item) => item.inventoryType === "TRACKED");
        break;
    }

    return items;
  }, [allItems, filter, searchTerm]);

  const activeChips = [
    ...(filter !== "ALL" ? [{ key: "filter", label: "Nivel", value: filter === "LOW_STOCK" ? "Bajo" : "Agotado" }] : []),
    ...(searchTerm !== "" ? [{ key: "search", label: "Búsqueda", value: searchTerm }] : []),
  ];

  // Handlers
  const handleDailyReset = () => {
    if (!isAdmin) return;
    setIsResetModalOpen(true);
  };

  const handleAdjustStock = (item: MenuItem) => {
    setSelectedItem(item);
    setIsQuickStockOpen(true);
  };

  // Loading state
  if (loadingItems) {
    return (
      <SidebarLayout hideTitle fullWidth>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} variant="card" height={80} />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} variant="card" height={180} />
            ))}
          </div>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout hideTitle fullWidth>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-24 py-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-sage-600">
              <Package className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Control de Existencias</span>
            </div>
            <h1 className="text-3xl font-bold text-carbon-900 tracking-tight">Stock de Productos</h1>
            <p className="text-sm text-carbon-500 font-medium">Monitorea y ajusta el inventario de tus insumos en tiempo real.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {isAdmin && (
              <Button
                variant="primary"
                size="lg"
                onClick={handleDailyReset}
                className="rounded-2xl h-14 px-8 shadow-soft-lg transition-all active:scale-95 font-bold bg-carbon-900 hover:bg-carbon-800"
              >
                <RotateCcw className="w-5 h-5 mr-2 stroke-[3px]" />
                Reinicio Diario
              </Button>
            )}
          </div>
        </header>

        {/* Dashboard Analytics */}
        <InventoryDashboard items={allItems || []} />

        {/* Unified Filter System */}
        <div className="space-y-6">
          <FilterBar>
            <div className="flex flex-col lg:flex-row lg:items-center gap-6 flex-1 min-w-0">
              <div className="w-full lg:w-72 flex-shrink-0">
                <FilterSearch
                  value={searchTerm}
                  onChange={setSearchTerm}
                  placeholder="Buscar producto..."
                  onClear={() => setSearchTerm("")}
                />
              </div>
              
              <div className="flex-1 min-w-0 overflow-x-auto custom-scrollbar-hide">
                <FilterPills
                  options={filterOptions}
                  value={filter}
                  onChange={(v) => setFilter(v as StockFilter)}
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
                {(filter !== "ALL" || searchTerm !== "") && (
                  <span className="ml-2 w-2 h-2 rounded-full bg-sage-500 animate-pulse" />
                )}
              </Button>
            </div>
          </FilterBar>

          <ActiveFilterChips
            chips={activeChips}
            resultCount={filteredItems.length}
            resultLabel="productos"
            onClearFilter={(key) => {
              if (key === "filter") setFilter("ALL");
              if (key === "search") setSearchTerm("");
            }}
            onClearAll={() => {
              setFilter("ALL");
              setSearchTerm("");
            }}
          />
        </div>

        {/* Items Grid */}
        {filteredItems.length === 0 ? (
          <EmptyState
            title="No se encontraron productos"
            description={searchTerm ? `No hay resultados para "${searchTerm}"` : "No hay productos con los filtros seleccionados"}
            icon={<Package className="w-12 h-12" />}
            actionLabel={searchTerm || filter !== "ALL" ? "Limpiar filtros" : undefined}
            onAction={() => {
              setFilter("ALL");
              setSearchTerm("");
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <StockItemCard
                key={item.id}
                item={item}
                onAdjustStock={() => handleAdjustStock(item)}
                onChangeInventoryType={() => {
                  setSelectedItem(item);
                  setIsInventoryTypeModalOpen(true);
                }}
              />
            ))}
          </div>
        )}

        {/* Modals & Drawers */}
        <DailyResetModal
          items={allItems || []}
          isOpen={isResetModalOpen}
          onClose={() => setIsResetModalOpen(false)}
        />

        <FilterDrawer
          isOpen={isFilterDrawerOpen}
          onClose={() => setIsFilterDrawerOpen(false)}
          onApply={() => {}}
          onClear={() => {
            setFilter("ALL");
            setSearchTerm("");
          }}
          isDirty={filter !== "ALL" || searchTerm !== ""}
          title="Refinar Inventario"
        >
          <div className="space-y-8">
            <FilterSelect
              label="Tipo de Rastreo"
              value={filter === "TRACKED" ? "TRACKED" : "ALL"}
              onChange={(v) => setFilter(v === "TRACKED" ? "TRACKED" : "ALL")}
              options={[
                { value: "ALL", label: "Todos los productos" },
                { value: "TRACKED", label: "Solo con seguimiento" },
              ]}
            />
            
            <div className="pt-4 p-5 rounded-2xl bg-sage-50 border border-sage-100">
              <h4 className="text-[10px] font-black text-carbon-400 uppercase tracking-widest mb-3 ml-1">Estado de Inventario</h4>
              <p className="text-sm font-medium text-carbon-600 leading-relaxed">
                Usa las píldoras de acceso rápido para identificar productos críticos que requieren tu atención inmediata.
              </p>
            </div>
          </div>
        </FilterDrawer>

        {selectedItem && (
          <InventoryTypeModal
            item={selectedItem}
            isOpen={isInventoryTypeModalOpen}
            onClose={() => {
              setIsInventoryTypeModalOpen(false);
              setSelectedItem(null);
            }}
          />
        )}

        {selectedItem && (
          <QuickStockModal
            item={selectedItem}
            isOpen={isQuickStockOpen}
            onClose={() => {
              setIsQuickStockOpen(false);
              setSelectedItem(null);
            }}
          />
        )}
      </div>
    </SidebarLayout>
  );
}

/**
 * StockItemCard Component
 * Refined design for inventory items.
 */
interface StockItemCardProps {
  item: MenuItem;
  onAdjustStock: () => void;
  onChangeInventoryType: () => void;
}

function StockItemCard({
  item,
  onAdjustStock,
  onChangeInventoryType,
}: StockItemCardProps) {
  const isTracked = item.inventoryType === "TRACKED";
  const currentStock = item.stockQuantity ?? 0;
  const isLowStock =
    item.lowStockAlert !== undefined &&
    currentStock <= item.lowStockAlert &&
    currentStock > 0;
  const isOutOfStock = currentStock === 0;

  return (
    <Card
      variant="elevated"
      padding="lg"
      className={cn(
        "transition-all duration-300 hover:shadow-soft-lg group rounded-3xl",
        isOutOfStock
          ? "border-2 border-rose-100 bg-rose-50/20"
          : isLowStock
            ? "border-2 border-amber-100 bg-amber-50/20"
            : "border border-sage-100 hover:border-sage-300"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-carbon-900 mb-1 truncate group-hover:text-sage-700 transition-colors">
            {item.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-carbon-400 tracking-wider bg-carbon-50 px-2 py-0.5 rounded-lg border border-carbon-100 uppercase">
              ID: {item.id}
            </span>
          </div>
        </div>
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center shadow-inner",
          isTracked ? "bg-sage-100 text-sage-600" : "bg-carbon-50 text-carbon-300"
        )}>
          <Package className="w-5 h-5" />
        </div>
      </div>

      {/* Stock Info */}
      {isTracked ? (
        <div className="mb-6 space-y-4">
          <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-sage-50 shadow-soft-xs">
            <span className="text-xs font-bold text-carbon-400 uppercase tracking-widest">
              Stock Actual
            </span>
            <span className={cn(
              "text-lg font-black px-3 py-1 rounded-xl",
              isOutOfStock ? "text-rose-600 bg-rose-50" : isLowStock ? "text-amber-600 bg-amber-50" : "text-sage-700 bg-sage-50"
            )}>
              {currentStock} ud.
            </span>
          </div>
          {item.lowStockAlert !== undefined && (
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-1.5">
                <AlertTriangle className={cn("w-3.5 h-3.5", isLowStock ? "text-amber-500" : "text-carbon-300")} />
                <span className="text-[10px] font-black text-carbon-400 uppercase tracking-widest">Alerta en:</span>
              </div>
              <span className="text-xs font-bold text-carbon-700">
                {item.lowStockAlert} ud.
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="mb-6 p-6 bg-sage-50/50 rounded-2xl border border-dashed border-sage-200">
          <p className="text-xs font-bold text-carbon-400 text-center flex flex-col items-center gap-2">
            <Settings2 className="w-5 h-5 opacity-30" />
            Sin control de inventario
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        {isTracked ? (
          <Button
            variant="primary"
            size="md"
            onClick={onAdjustStock}
            className="flex-1 rounded-xl shadow-soft-md bg-carbon-900 hover:bg-carbon-800 text-white font-bold h-12"
          >
            <Plus className="w-4 h-4 mr-2 stroke-[3px]" />
            Ajustar
          </Button>
        ) : (
          <Button
            variant="outline"
            size="md"
            onClick={onChangeInventoryType}
            className="flex-1 rounded-xl border-sage-200 text-sage-700 hover:bg-sage-50 font-bold h-12"
          >
            Activar Rastreo
          </Button>
        )}
        
        <Button
          variant="ghost"
          size="md"
          onClick={onChangeInventoryType}
          className="w-12 h-12 rounded-xl text-carbon-400 hover:text-carbon-900 hover:bg-carbon-100 flex items-center justify-center p-0"
          title="Configuración de inventario"
        >
          <Settings2 className="w-5 h-5" />
        </Button>
      </div>
    </Card>
  );
}
