import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarLayout } from "@/layouts/SidebarLayout";
import {
  Button,
  Card,
  Badge,
  Skeleton,
  EmptyState,
} from "@/components";
import {
  useItems,
  useLowStockItems,
  useOutOfStockItems,
} from "../hooks";
import { usePermissions } from "@/hooks/usePermissions";
import { ROUTES } from "@/app/routes";
import { toast } from "sonner";
import {
  Package,
  AlertTriangle,
  RotateCcw,
  TrendingUp,
  ShoppingCart,
  ArrowRight,
} from "lucide-react";
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

  // Queries
  const { data: allItems, isLoading: loadingItems } = useItems();
  const { data: lowStockItems } = useLowStockItems();
  const { data: outOfStockItems } = useOutOfStockItems();

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
            item.stockQuantity > 0
        );
        break;
      case "OUT_OF_STOCK":
        items = items.filter(
          (item) =>
            item.inventoryType === "TRACKED" && item.stockQuantity === 0
        );
        break;
      case "TRACKED":
        items = items.filter((item) => item.inventoryType === "TRACKED");
        break;
    }

    return items;
  }, [allItems, filter]);

  // Statistics
  const stats = useMemo(() => {
    if (!allItems) {
      return {
        total: 0,
        tracked: 0,
        lowStock: 0,
        outOfStock: 0,
      };
    }

    return {
      total: allItems.length,
      tracked: allItems.filter((item) => item.inventoryType === "TRACKED")
        .length,
      lowStock:
        lowStockItems?.length ||
        allItems.filter(
          (item) =>
            item.inventoryType === "TRACKED" &&
            item.stockQuantity !== undefined &&
            item.lowStockAlert !== undefined &&
            item.stockQuantity <= item.lowStockAlert &&
            item.stockQuantity > 0
        ).length,
      outOfStock:
        outOfStockItems?.length ||
        allItems.filter(
          (item) =>
            item.inventoryType === "TRACKED" && item.stockQuantity === 0
        ).length,
    };
  }, [allItems, lowStockItems, outOfStockItems]);

  // Handlers
  const handleDailyReset = () => {
    // Admin check done in JSX
    toast.info("Función no disponible temporalmente", {
      description: "El reseteo diario de stock está en desarrollo",
      icon: "🚧",
    });
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
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl border-2 border-sage-200 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sage-100 flex items-center justify-center text-sage-600">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-carbon-500">Total Items</p>
              <p className="text-xl font-bold text-carbon-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border-2 border-sage-200 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-carbon-500">Rastreados</p>
              <p className="text-xl font-bold text-carbon-900">{stats.tracked}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border-2 border-sage-200 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-carbon-500">Stock Bajo</p>
              <p className="text-xl font-bold text-carbon-900">{stats.lowStock}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border-2 border-sage-200 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-carbon-500">Sin Stock</p>
              <p className="text-xl font-bold text-carbon-900">{stats.outOfStock}</p>
            </div>
          </div>
        </div>
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
        {filteredItems.length} {filteredItems.length === 1 ? "producto" : "productos"}
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
              onViewDetail={() =>
                navigate(`${ROUTES.MENU}/items/${item.id}`)
              }
            />
          ))}
        </div>
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
}

function StockItemCard({
  item,
  onViewDetail,
}: StockItemCardProps) {
  const isTracked = item.inventoryType === "TRACKED";
  const currentStock = item.stockQuantity ?? 0;
  const isLowStock =
    item.lowStockAlert !== undefined && currentStock <= item.lowStockAlert && currentStock > 0;
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

      {/* Action */}
      <Button
        variant="ghost"
        size="md"
        onClick={onViewDetail}
        className="w-full"
      >
        Ver Detalle
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </Card>
  );
}
