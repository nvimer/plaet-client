import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
import { Package, RotateCcw, ArrowRight } from "lucide-react";
import type { MenuItem } from "@/types";

type StockFilter = "ALL" | "LOW_STOCK" | "OUT_OF_STOCK" | "TRACKED";

/**
 * StockManagementPage Component
 *
 * Comprehensive stock management page for restaurant inventory.
 * Uses SidebarLayout and unified design system.
 */
export function StockManagementPage() {
  const navigate = useNavigate();
  const { isAdmin } = usePermissions();

  // State
  const [filter, setFilter] = useState<StockFilter>("ALL");
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isInventoryTypeModalOpen, setIsInventoryTypeModalOpen] =
    useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  // Queries
  const { data: allItems, isLoading: loadingItems } = useItems();

  // Filter items
  const filteredItems = useMemo(() => {
    if (!allItems) return [];

    let items = allItems;

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
  }, [allItems, filter]);

  // Handlers
  const handleDailyReset = () => {
    if (!isAdmin) return;
    setIsResetModalOpen(true);
  };

  // Loading state
  if (loadingItems) {
    return (
      <SidebarLayout
        title="Gestión de Stock"
        backRoute={ROUTES.MENU}
        fullWidth
        contentClassName="p-4 sm:p-6 lg:p-10"
      >
        <div className="space-y-6">
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
    <SidebarLayout
      title="Gestión de Stock"
      subtitle="Control de inventario de productos"
      backRoute={ROUTES.MENU}
      fullWidth
      contentClassName="p-4 sm:p-6 lg:p-10"
    >
      {/* Dashboard */}
      <div className="mb-8">
        <InventoryDashboard items={allItems || []} />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-sage-200 p-4 mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-carbon-500 mr-1">Filtrar:</span>
            <Button
              variant={filter === "ALL" ? "primary" : "outline"}
              size="sm"
              onClick={() => setFilter("ALL")}
            >
              Todos
            </Button>
            <Button
              variant={filter === "LOW_STOCK" ? "primary" : "outline"}
              size="sm"
              onClick={() => setFilter("LOW_STOCK")}
            >
              Stock Bajo
            </Button>
            <Button
              variant={filter === "OUT_OF_STOCK" ? "primary" : "outline"}
              size="sm"
              onClick={() => setFilter("OUT_OF_STOCK")}
            >
              Sin Stock
            </Button>
            <Button
              variant={filter === "TRACKED" ? "primary" : "outline"}
              size="sm"
              onClick={() => setFilter("TRACKED")}
            >
              Rastreados
            </Button>
          </div>

          {isAdmin() && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDailyReset}
              className="text-sage-600"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset Diario
            </Button>
          )}
        </div>
      </div>

      {/* Result count */}
      <p className="text-sm font-medium text-carbon-600 mb-5">
        {filteredItems.length}{" "}
        {filteredItems.length === 1 ? "producto" : "productos"}
        {filter !== "ALL" && " encontrados"}
      </p>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <EmptyState
          title="No se encontraron productos"
          description="No hay productos con los filtros seleccionados"
          icon={<Package />}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <StockItemCard
              key={item.id}
              item={item}
              onViewDetail={() => navigate(`${ROUTES.MENU}/items/${item.id}`)}
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
  onViewDetail: () => void;
  onChangeInventoryType: () => void;
}

function StockItemCard({
  item,
  onViewDetail,
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
      className={`transition-all hover:shadow-soft-lg ${
        isOutOfStock
          ? "border-2 border-rose-200 bg-rose-50/30"
          : isLowStock
            ? "border-2 border-amber-200 bg-amber-50/30"
            : ""
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-carbon-900 mb-1 truncate">
            {item.name}
          </h3>
          {item.description && (
            <p className="text-sm text-carbon-600 line-clamp-2">
              {item.description}
            </p>
          )}
        </div>
      </div>

      {/* Stock Info */}
      {isTracked ? (
        <div className="mb-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-carbon-700">
              Stock Actual:
            </span>
            <Badge
              variant={
                isOutOfStock ? "error" : isLowStock ? "warning" : "success"
              }
              size="md"
            >
              {currentStock} unidades
            </Badge>
          </div>
          {item.lowStockAlert !== undefined && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-carbon-600">Alerta en:</span>
              <span className="text-sm font-medium text-carbon-700">
                {item.lowStockAlert} unidades
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="mb-4 p-3 bg-sage-50 rounded-xl">
          <p className="text-sm text-carbon-600 text-center">
            Sin control de inventario
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="md"
          onClick={onChangeInventoryType}
          className="flex-1"
        >
          Tipo Inventario
        </Button>
        <Button
          variant="outline"
          size="md"
          onClick={onViewDetail}
          className="flex-1"
        >
          Ver Detalle
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </Card>
  );
}
