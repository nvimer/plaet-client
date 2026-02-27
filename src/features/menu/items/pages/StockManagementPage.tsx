import { useState, useMemo } from "react";
import { SidebarLayout } from "@/layouts/SidebarLayout";
import { Button, Card, Badge, Skeleton, EmptyState } from "@/components";
import { useItems } from "../hooks";
import {
  DailyResetModal,
  InventoryTypeModal,
  InventoryDashboard,
} from "../components";
import { usePermissions } from "@/hooks/usePermissions";
import { ROUTES } from "@/app/routes";
import { Package, RotateCcw, Search, Plus, AlertTriangle, Settings2 } from "lucide-react";
import { cn } from "@/utils/cn";
import type { MenuItem } from "@/types";
import { QuickStockModal } from "../components/QuickStockModal";
import { Input } from "@/components/ui/Input/Input";

type StockFilter = "ALL" | "LOW_STOCK" | "OUT_OF_STOCK" | "TRACKED";

/**
 * StockManagementPage Component
 *
 * Comprehensive stock management page for restaurant inventory.
 * Uses DashboardLayout (from App.tsx) and unified premium design system.
 */
export function StockManagementPage() {
  const { isAdmin } = usePermissions();

  // State
  const [filter, setFilter] = useState<StockFilter>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isInventoryTypeModalOpen, setIsInventoryTypeModalOpen] =
    useState(false);
  const [isQuickStockOpen, setIsQuickStockOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  // Queries
  const { data: allItems, isLoading: loadingItems } = useItems();

  // Filter items
  const filteredItems = useMemo(() => {
    if (!allItems) return [];

    let items = allItems;

    // Apply search filter
    if (searchTerm) {
      items = items.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Apply stock filter
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
      <SidebarLayout hideHeader fullWidth>
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
      {/* ============ PAGE HEADER =============== */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-sage-600">
            <Package className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Control de Existencias</span>
          </div>
          <h1 className="text-3xl font-bold text-carbon-900 tracking-tight">Inventario de Productos</h1>
          <p className="text-sm text-carbon-500 font-medium">Monitorea y ajusta el stock de tus insumos en tiempo real.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {isAdmin && (
            <>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setIsInventoryTypeModalOpen(true)}
                className="rounded-2xl h-14 px-6 border-sage-200 text-sage-700 hover:bg-sage-50 transition-all font-bold"
              >
                <Settings2 className="w-4 h-4 mr-2" />
                Configurar
              </Button>
              
              <Button
                variant="primary"
                size="lg"
                onClick={handleDailyReset}
                className="rounded-2xl h-14 px-8 shadow-soft-lg transition-all active:scale-95 font-bold bg-carbon-900 hover:bg-carbon-800"
              >
                <RotateCcw className="w-5 h-5 mr-2 stroke-[3px]" />
                Reinicio Diario
              </Button>
            </>
          )}
        </div>
      </header>

      {/* Dashboard */}
      <div className="mb-2">
        <InventoryDashboard items={allItems || []} />
      </div>

      {/* Search and Filters */}
      <div className="space-y-4 mb-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-carbon-400" />
          <Input
            placeholder="Buscar producto por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-14 text-lg bg-white shadow-soft-sm border-sage-200"
            fullWidth
          />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-sage-200 p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-carbon-500 mr-1 font-medium tracking-wide">Filtrar por stock:</span>
              <Button
                variant={filter === "ALL" ? "primary" : "outline"}
                size="sm"
                onClick={() => setFilter("ALL")}
                className="rounded-lg px-4"
              >
                Todos
              </Button>
              <Button
                variant={filter === "LOW_STOCK" ? "primary" : "outline"}
                size="sm"
                onClick={() => setFilter("LOW_STOCK")}
                className="rounded-lg px-4"
              >
                Stock Bajo
              </Button>
              <Button
                variant={filter === "OUT_OF_STOCK" ? "primary" : "outline"}
                size="sm"
                onClick={() => setFilter("OUT_OF_STOCK")}
                className="rounded-lg px-4"
              >
                Sin Stock
              </Button>
              <Button
                variant={filter === "TRACKED" ? "primary" : "outline"}
                size="sm"
                onClick={() => setFilter("TRACKED")}
                className="rounded-lg px-4"
              >
                Solo Rastreados
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Result count */}
      <p className="text-sm font-medium text-carbon-600 mb-5">
        Mostrando {filteredItems.length}{" "}
        {filteredItems.length === 1 ? "producto" : "productos"}
      </p>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <EmptyState
          title="No se encontraron productos"
          description={searchTerm ? `No hay resultados para "${searchTerm}"` : "No hay productos con los filtros seleccionados"}
          icon={<Package />}
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

      {/* Daily Reset Modal */}
      <DailyResetModal
        items={allItems || []}
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
      />

      {/* Inventory Type Modal */}
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

      {/* Quick Stock Modal */}
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
 *
 * Card displaying item stock information with unified design.
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
      className={`transition-all hover:shadow-soft-lg group ${
        isOutOfStock
          ? "border-2 border-rose-200 bg-rose-50/30"
          : isLowStock
            ? "border-2 border-amber-200 bg-amber-50/30"
            : "border border-sage-200"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-carbon-900 mb-1 truncate group-hover:text-sage-700 transition-colors">
            {item.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-carbon-400 tracking-wide bg-carbon-100 px-2 py-0.5 rounded">
              ID: {item.id}
            </span>
            {item.categoryId && (
              <span className="text-xs font-medium text-sage-600 bg-sage-50 px-2 py-0.5 rounded border border-sage-100">
                Categoría {item.categoryId}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stock Info */}
      {isTracked ? (
        <div className="mb-6 space-y-4">
          <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-sage-100 shadow-soft-xs">
            <span className="text-sm font-semibold text-carbon-600">
              Stock Actual:
            </span>
            <Badge
              variant={
                isOutOfStock ? "error" : isLowStock ? "warning" : "success"
              }
              size="lg"
              className="text-sm font-black px-3"
            >
              {currentStock} unidades
            </Badge>
          </div>
          {item.lowStockAlert !== undefined && (
            <div className="flex items-center justify-between px-3">
              <div className="flex items-center gap-1.5">
                <AlertTriangle className={cn("w-3.5 h-3.5", isLowStock ? "text-amber-500" : "text-carbon-300")} />
                <span className="text-xs font-medium text-carbon-500 uppercase">Alerta en:</span>
              </div>
              <span className="text-sm font-bold text-carbon-700">
                {item.lowStockAlert} ud.
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="mb-6 p-4 bg-sage-50 rounded-xl border border-dashed border-sage-300">
          <p className="text-sm font-medium text-carbon-500 text-center flex items-center justify-center gap-2">
            <Package className="w-4 h-4 opacity-50" />
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
            className="flex-1 shadow-soft-md bg-sage-600 hover:bg-sage-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajustar Stock
          </Button>
        ) : (
          <Button
            variant="outline"
            size="md"
            onClick={onChangeInventoryType}
            className="flex-1 border-sage-200 text-sage-700 hover:bg-sage-50"
          >
            Activar Rastreo
          </Button>
        )}
        
        <Button
          variant="ghost"
          size="md"
          onClick={onChangeInventoryType}
          className="px-3 text-carbon-400 hover:text-carbon-600 hover:bg-carbon-100"
          title="Configuración de inventario"
        >
          <Package className="w-5 h-5" />
        </Button>
      </div>
    </Card>
  );
}