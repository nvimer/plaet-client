import { useState } from "react";
import { Package, Plus, Minus, History, AlertTriangle } from "lucide-react";
import { Button, Card, Input, Badge } from "@/components";
import { useAddStock, useRemoveStock, useStockHistory } from "../hooks";
import { toast } from "sonner";
import type { MenuItem } from "@/types";
import type { AxiosErrorWithResponse } from "@/types/common";
import { StockHistoryModal } from "./StockHistoryModal";

interface StockManagementSectionProps {
  item: MenuItem;
}

/**
 * StockManagementSection Component
 *
 * Section for managing stock of a menu item
 * Shows current stock, allows adding/removing stock, and viewing history
 */
export function StockManagementSection({ item }: StockManagementSectionProps) {
  const [addQuantity, setAddQuantity] = useState<string>("");
  const [removeQuantity, setRemoveQuantity] = useState<string>("");
  const [addReason, setAddReason] = useState<string>("");
  const [removeReason, setRemoveReason] = useState<string>("");
  const [showHistory, setShowHistory] = useState(false);

  const { mutate: addStock, isPending: isAdding } = useAddStock();
  const { mutate: removeStock, isPending: isRemoving } = useRemoveStock();
  const { data: stockHistory } = useStockHistory(item.id);

  // Only show if item has tracked inventory
  if (item.inventoryType !== "TRACKED") {
    return null;
  }

  const handleAddStock = () => {
    const quantity = parseInt(addQuantity);
    if (!quantity || quantity <= 0) {
      toast.error("Cantidad inválida", {
        description: "Ingresa una cantidad válida mayor a 0",
        icon: "❌",
      });
      return;
    }

    addStock(
      {
        id: item.id,
        stockData: {
          quantity,
          reason: addReason || undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success("Stock agregado", {
            description: `Se agregaron ${quantity} unidades al stock`,
            icon: "✅",
          });
          setAddQuantity("");
          setAddReason("");
        },
        onError: (error: AxiosErrorWithResponse) => {
          toast.error("Error al agregar stock", {
            description: error.response?.data?.message || error.message,
            icon: "❌",
          });
        },
      }
    );
  };

  const handleRemoveStock = () => {
    const quantity = parseInt(removeQuantity);
    if (!quantity || quantity <= 0) {
      toast.error("Cantidad inválida", {
        description: "Ingresa una cantidad válida mayor a 0",
        icon: "❌",
      });
      return;
    }

    if (item.stockQuantity !== undefined && quantity > item.stockQuantity) {
      toast.error("Stock insuficiente", {
        description: `Solo hay ${item.stockQuantity} unidades disponibles`,
        icon: "❌",
      });
      return;
    }

    removeStock(
      {
        id: item.id,
        stockData: {
          quantity,
          reason: removeReason || undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success("Stock removido", {
            description: `Se removieron ${quantity} unidades del stock`,
            icon: "✅",
          });
          setRemoveQuantity("");
          setRemoveReason("");
        },
        onError: (error: AxiosErrorWithResponse) => {
          toast.error("Error al remover stock", {
            description: error.response?.data?.message || error.message,
            icon: "❌",
          });
        },
      }
    );
  };

  const currentStock = item.stockQuantity ?? 0;
  const isLowStock =
    item.lowStockAlert !== undefined && currentStock <= item.lowStockAlert;
  const isOutOfStock = currentStock === 0;

  return (
    <>
      <Card variant="elevated" padding="lg" className="mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-carbon-900 mb-2">
              Gestión de Stock
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-carbon-600" />
                <span className="text-lg font-medium text-carbon-900">
                  Stock Actual:
                </span>
                <Badge
                  variant={
                    isOutOfStock
                      ? "error"
                      : isLowStock
                        ? "warning"
                        : "success"
                  }
                  size="lg"
                >
                  {currentStock} unidades
                </Badge>
              </div>
              {item.lowStockAlert !== undefined && (
                <span className="text-sm text-carbon-600">
                  Alerta: {item.lowStockAlert} unidades
                </span>
              )}
            </div>
          </div>
          {isOutOfStock && (
            <Badge variant="error" size="lg">
              <AlertTriangle className="w-4 h-4 mr-1" />
              Sin Stock
            </Badge>
          )}
          {isLowStock && !isOutOfStock && (
            <Badge variant="warning" size="lg">
              <AlertTriangle className="w-4 h-4 mr-1" />
              Stock Bajo
            </Badge>
          )}
        </div>

        {/* Add Stock Section */}
        <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl">
          <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Agregar Stock
          </h4>
          <div className="space-y-3">
            <div className="flex gap-3">
              <Input
                type="number"
                placeholder="Cantidad"
                value={addQuantity}
                onChange={(e) => setAddQuantity(e.target.value)}
                min="1"
                className="flex-1"
              />
              <Button
                variant="primary"
                onClick={handleAddStock}
                disabled={isAdding || !addQuantity}
              >
                {isAdding ? "Agregando..." : "Agregar"}
              </Button>
            </div>
            <Input
              type="text"
              placeholder="Razón (opcional)"
              value={addReason}
              onChange={(e) => setAddReason(e.target.value)}
            />
          </div>
        </div>

        {/* Remove Stock Section */}
        <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
          <h4 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
            <Minus className="w-4 h-4" />
            Remover Stock
          </h4>
          <div className="space-y-3">
            <div className="flex gap-3">
              <Input
                type="number"
                placeholder="Cantidad"
                value={removeQuantity}
                onChange={(e) => setRemoveQuantity(e.target.value)}
                min="1"
                max={currentStock}
                className="flex-1"
              />
              <Button
                variant="ghost"
                onClick={handleRemoveStock}
                disabled={isRemoving || !removeQuantity || currentStock === 0}
                className="text-red-600 hover:bg-red-100"
              >
                {isRemoving ? "Removiendo..." : "Remover"}
              </Button>
            </div>
            <Input
              type="text"
              placeholder="Razón (opcional)"
              value={removeReason}
              onChange={(e) => setRemoveReason(e.target.value)}
            />
          </div>
        </div>

        {/* History Button */}
        <Button
          variant="ghost"
          size="md"
          onClick={() => setShowHistory(true)}
          className="w-full"
        >
          <History className="w-4 h-4 mr-2" />
          Ver Historial de Stock ({stockHistory?.length || 0} registros)
        </Button>
      </Card>

      {/* Stock History Modal */}
      {showHistory && (
        <StockHistoryModal
          itemId={item.id}
          itemName={item.name}
          isOpen={showHistory}
          onClose={() => setShowHistory(false)}
        />
      )}
    </>
  );
}
