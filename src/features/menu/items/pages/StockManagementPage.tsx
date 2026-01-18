import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FullScreenLayout } from "@/layouts/FullScreenLayout";
import { Button, Card, Input, Badge, Skeleton, EmptyState, StatCard } from "@/components";
import {
  useItems,
  useLowStockItems,
  useOutOfStockItems,
  useAddStock,
  useRemoveStock,
  useDailyStockReset,
} from "../hooks";
import { usePermissions } from "@/hooks/usePermissions";
import { ROUTES } from "@/app/routes";
import { toast } from "sonner";
import {
  Package,
  AlertTriangle,
  Plus,
  Minus,
  RotateCcw,
  Search,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import type { MenuItem } from "@/types";
import type { AxiosErrorWithResponse } from "@/types/common";
import { StockQuickActionModal } from "../components/StockQuickActionModal";

type StockFilter = "ALL" | "LOW_STOCK" | "OUT_OF_STOCK" | "TRACKED";

/**
 * StockManagementPage Component
 *
 * Comprehensive stock management page for restaurant inventory.
 * Features:
 * - View all items with stock information
 * - Filter by stock status (all, low stock, out of stock, tracked)
 * - Quick actions to add/remove stock
 * - Daily stock reset (Admin only)
 * - Stock statistics and alerts
 */
export function StockManagementPage() {
  const navigate = useNavigate();
  const { isAdmin } = usePermissions();

  // State
  const [filter, setFilter] = useState<StockFilter>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [actionType, setActionType] = useState<"ADD" | "REMOVE" | null>(null);

  // Queries
  const { data: allItems, isLoading: loadingItems } = useItems();
  const { data: lowStockItems } = useLowStockItems();
  const { data: outOfStockItems } = useOutOfStockItems();
  const { mutate: addStock, isPending: isAdding } = useAddStock();
  const { mutate: removeStock, isPending: isRemoving } = useRemoveStock();
  const { mutate: dailyReset, isPending: isResetting } = useDailyStockReset();

  // Filter and search items
  const filteredItems = useMemo(() => {
    if (!allItems) return [];

    let filtered = allItems;

    // Filter by stock status
    switch (filter) {
      case "LOW_STOCK":
        filtered = filtered.filter((item) => {
          if (item.inventoryType !== "TRACKED") return false;
          const stock = item.stockQuantity ?? 0;
          return (
            stock > 0 &&
            item.lowStockAlert !== undefined &&
            stock <= item.lowStockAlert
          );
        });
        break;
      case "OUT_OF_STOCK":
        filtered = filtered.filter((item) => {
          if (item.inventoryType !== "TRACKED") return false;
          return (item.stockQuantity ?? 0) === 0;
        });
        break;
      case "TRACKED":
        filtered = filtered.filter(
          (item) => item.inventoryType === "TRACKED"
        );
        break;
      case "ALL":
      default:
        // Show all items
        break;
    }

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchLower) ||
          item.description?.toLowerCase().includes(searchLower)
      );
    }

    // Sort by stock status (out of stock first, then low stock, then by name)
    return filtered.sort((a, b) => {
      const aStock = a.stockQuantity ?? 0;
      const bStock = b.stockQuantity ?? 0;
      const aLowStock =
        a.lowStockAlert !== undefined && aStock <= a.lowStockAlert;
      const bLowStock =
        b.lowStockAlert !== undefined && bStock <= b.lowStockAlert;

      // Out of stock first
      if (aStock === 0 && bStock > 0) return -1;
      if (aStock > 0 && bStock === 0) return 1;

      // Then low stock
      if (aLowStock && !bLowStock) return -1;
      if (!aLowStock && bLowStock) return 1;

      // Then by name
      return a.name.localeCompare(b.name);
    });
  }, [allItems, filter, searchTerm]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (!allItems) {
      return {
        total: 0,
        tracked: 0,
        lowStock: 0,
        outOfStock: 0,
        totalStockValue: 0,
      };
    }

    const tracked = allItems.filter((item) => item.inventoryType === "TRACKED");
    const lowStockCount =
      lowStockItems?.length || 0;
    const outOfStockCount = outOfStockItems?.length || 0;

    // Calculate total stock value (rough estimate)
    const totalStockValue = tracked.reduce((sum, item) => {
      const stock = item.stockQuantity ?? 0;
      const price = parseFloat(item.price) || 0;
      return sum + stock * price;
    }, 0);

    return {
      total: allItems.length,
      tracked: tracked.length,
      lowStock: lowStockCount,
      outOfStock: outOfStockCount,
      totalStockValue,
    };
  }, [allItems, lowStockItems, outOfStockItems]);

  // Handle quick actions
  const handleQuickAction = (item: MenuItem, type: "ADD" | "REMOVE") => {
    setSelectedItem(item);
    setActionType(type);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
    setActionType(null);
  };

  // Handle daily reset
  const handleDailyReset = () => {
    if (!allItems) return;

    const trackedItems = allItems.filter(
      (item) => item.inventoryType === "TRACKED"
    );

    if (trackedItems.length === 0) {
      toast.error("No hay items con inventario rastreado", {
        icon: "❌",
      });
      return;
    }

    const resetData = {
      items: trackedItems.map((item) => ({
        menuItemId: item.id,
        quantity: item.initialStock ?? 0,
      })),
    };

    dailyReset(resetData, {
      onSuccess: (response) => {
        const resetCount = response.data?.resetCount || trackedItems.length;
        toast.success("Stock diario reseteado", {
          description: `Se reseteó el stock de ${resetCount} items`,
          icon: "✅",
        });
      },
      onError: (error: AxiosErrorWithResponse) => {
        toast.error("Error al resetear stock", {
          description: error.response?.data?.message || error.message,
          icon: "❌",
        });
      },
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
    <>
      <FullScreenLayout title="Gestión de Stock" backRoute={ROUTES.MENU}>
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-semibold text-carbon-900 tracking-tight mb-2">
                Gestión de Stock
              </h1>
              <p className="text-carbon-600">
                Administra el inventario de productos del menú
              </p>
            </div>
            {isAdmin() && (
              <Button
                variant="primary"
                size="lg"
                onClick={handleDailyReset}
                disabled={isResetting}
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                {isResetting ? "Reseteando..." : "Reset Diario"}
              </Button>
            )}
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
              title="Con Inventario"
              value={stats.tracked}
              icon={<Package />}
              iconBgColor="bg-blue-100"
              iconColor="text-blue-600"
            />
            <StatCard
              title="Stock Bajo"
              value={stats.lowStock}
              icon={<TrendingDown />}
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

          {/* Filters and Search */}
          <Card variant="elevated" padding="md">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-carbon-400" />
                  <Input
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Filter Buttons */}
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={filter === "ALL" ? "primary" : "ghost"}
                  size="md"
                  onClick={() => setFilter("ALL")}
                >
                  Todos ({stats.total})
                </Button>
                <Button
                  variant={filter === "TRACKED" ? "primary" : "ghost"}
                  size="md"
                  onClick={() => setFilter("TRACKED")}
                >
                  Con Inventario ({stats.tracked})
                </Button>
                <Button
                  variant={filter === "LOW_STOCK" ? "primary" : "ghost"}
                  size="md"
                  onClick={() => setFilter("LOW_STOCK")}
                >
                  <TrendingDown className="w-4 h-4 mr-2" />
                  Stock Bajo ({stats.lowStock})
                </Button>
                <Button
                  variant={filter === "OUT_OF_STOCK" ? "primary" : "ghost"}
                  size="md"
                  onClick={() => setFilter("OUT_OF_STOCK")}
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Sin Stock ({stats.outOfStock})
                </Button>
              </div>
            </div>
          </Card>

          {/* Items Grid */}
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <StockItemCard
                  key={item.id}
                  item={item}
                  onQuickAdd={() => handleQuickAction(item, "ADD")}
                  onQuickRemove={() => handleQuickAction(item, "REMOVE")}
                  onViewDetail={() =>
                    navigate(`/menu/items/${item.id}/edit`)
                  }
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Package />}
              title="No hay productos"
              description={
                searchTerm
                  ? "No se encontraron productos con ese término de búsqueda"
                  : filter === "LOW_STOCK"
                    ? "No hay productos con stock bajo"
                    : filter === "OUT_OF_STOCK"
                      ? "No hay productos sin stock"
                      : "No hay productos registrados"
              }
            />
          )}
        </div>
      </FullScreenLayout>

      {/* Quick Action Modal */}
      {selectedItem && actionType && (
        <StockQuickActionModal
          item={selectedItem}
          actionType={actionType}
          isOpen={!!selectedItem}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}

/**
 * StockItemCard Component
 *
 * Card displaying item stock information with quick actions
 */
interface StockItemCardProps {
  item: MenuItem;
  onQuickAdd: () => void;
  onQuickRemove: () => void;
  onViewDetail: () => void;
}

function StockItemCard({
  item,
  onQuickAdd,
  onQuickRemove,
  onViewDetail,
}: StockItemCardProps) {
  const isTracked = item.inventoryType === "TRACKED";
  const currentStock = item.stockQuantity ?? 0;
  const isLowStock =
    item.lowStockAlert !== undefined && currentStock <= item.lowStockAlert;
  const isOutOfStock = currentStock === 0;

  if (!isTracked) {
    return (
      <Card variant="elevated" padding="lg" className="opacity-60">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-carbon-900 mb-1">
              {item.name}
            </h3>
            <p className="text-sm text-carbon-500">Sin inventario rastreado</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onViewDetail}
          className="w-full"
        >
          Ver Detalle
        </Button>
      </Card>
    );
  }

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
        {item.initialStock !== undefined && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-carbon-600">Stock Inicial:</span>
            <span className="text-sm font-medium text-carbon-700">
              {item.initialStock} unidades
            </span>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2 pt-4 border-t border-sage-border-subtle">
        <Button
          variant="primary"
          size="sm"
          onClick={onQuickAdd}
          className="flex-1"
        >
          <Plus className="w-4 h-4 mr-1" />
          Agregar
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onQuickRemove}
          disabled={currentStock === 0}
          className="flex-1"
        >
          <Minus className="w-4 h-4 mr-1" />
          Remover
        </Button>
        <Button variant="ghost" size="sm" onClick={onViewDetail}>
          Ver
        </Button>
      </div>
    </Card>
  );
}
