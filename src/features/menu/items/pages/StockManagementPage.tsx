import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FullScreenLayout } from "@/layouts/FullScreenLayout";
import {
  Button,
  Card,
  Badge,
  Skeleton,
  EmptyState,
  StatCard,
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
} from "lucide-react";
import type { MenuItem } from "@/types";

type StockFilter = "ALL" | "LOW_STOCK" | "OUT_OF_STOCK" | "TRACKED";

/**
 * StockManagementPage Component
 *
 * Comprehensive stock management page for restaurant inventory.
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
      <FullScreenLayout title="Gestión de Stock" backRoute={ROUTES.MENU}>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} variant="stat" />
            ))}
          </div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
        </div>
      </FullScreenLayout>
    );
  }

  return (
    <FullScreenLayout title="Gestión de Stock" backRoute={ROUTES.MENU}>
      <div className="space-y-6">
        {/* Header with Actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilter("ALL")}
            >
              Todos
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilter("LOW_STOCK")}
            >
              Stock Bajo
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilter("OUT_OF_STOCK")}
            >
              Sin Stock
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilter("TRACKED")}
            >
              Rastreados
            </Button>
            {isAdmin && (
              <Button
                variant="primary"
                size="lg"
                onClick={handleDailyReset}
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Reset Diario
              </Button>
            )}
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            title="Total Items"
            value={stats.total}
            icon={<Package />}
            iconBgColor="bg-sage-green-100"
            iconColor="text-sage-green-600"
          />
          <StatCard
            title="Items Rastreados"
            value={stats.tracked}
            icon={<Package />}
            iconBgColor="bg-blue-100"
            iconColor="text-blue-600"
          />
          <StatCard
            title="Stock Bajo"
            value={stats.lowStock}
            icon={<AlertTriangle />}
            iconBgColor="bg-yellow-100"
            iconColor="text-yellow-600"
          />
          <StatCard
            title="Sin Stock"
            value={stats.outOfStock}
            icon={<AlertTriangle />}
            iconBgColor="bg-red-100"
            iconColor="text-red-600"
          />
        </div>

        {/* Items Grid */}
        {filteredItems.length === 0 ? (
          <EmptyState
            title="No se encontraron items"
            description="No hay items con los filtros seleccionados"
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
      </div>
    </FullScreenLayout>
  );
}

/**
 * StockItemCard Component
 *
 * Card displaying item stock information
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
    item.lowStockAlert !== undefined && currentStock <= item.lowStockAlert;
  const isOutOfStock = currentStock === 0;

  return (
    <Card
      variant="elevated"
      padding="lg"
      className={`transition-all ${
        isOutOfStock
          ? "border-2 border-red-200 bg-red-50"
          : isLowStock
          ? "border-2 border-yellow-200 bg-yellow-50"
          : ""
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-carbon-900 mb-1">
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
      {isTracked && (
        <div className="mb-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-carbon-700">
              Stock Actual:
            </span>
            <Badge
              variant={
                isOutOfStock ? "error" : isLowStock ? "warning" : "success"
              }
              size="lg"
            >
              {currentStock} unidades
            </Badge>
          </div>
          {item.lowStockAlert !== undefined && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-carbon-600">Alerta:</span>
              <span className="text-sm font-medium text-carbon-700">
                {item.lowStockAlert} unidades
              </span>
            </div>
          )}
        </div>
      )}

      {/* Action */}
      <Button variant="ghost" size="sm" onClick={onViewDetail}>
        Ver Detalle
      </Button>
    </Card>
  );
}