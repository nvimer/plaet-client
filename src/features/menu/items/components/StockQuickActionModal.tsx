import { useState } from "react";
import { BaseModal } from "@/components/ui/BaseModal";
import { Button, Input } from "@/components";
import { useAddStock, useRemoveStock } from "../hooks";
import { toast } from "sonner";
import type { MenuItem } from "@/types";
import type { AxiosErrorWithResponse } from "@/types/common";
import { Plus, Minus } from "lucide-react";

interface StockQuickActionModalProps {
  item: MenuItem;
  actionType: "ADD" | "REMOVE";
  isOpen: boolean;
  onClose: () => void;
}

/**
 * StockQuickActionModal Component
 *
 * Modal for quick stock add/remove actions
 */
export function StockQuickActionModal({
  item,
  actionType,
  isOpen,
  onClose,
}: StockQuickActionModalProps) {
  const [quantity, setQuantity] = useState<string>("");
  const [reason, setReason] = useState<string>("");

  const { mutate: addStock, isPending: isAdding } = useAddStock();
  const { mutate: removeStock, isPending: isRemoving } = useRemoveStock();

  const isPending = isAdding || isRemoving;
  const currentStock = item.stockQuantity ?? 0;

  const handleSubmit = () => {
    const qty = parseInt(quantity);
    if (!qty || qty <= 0) {
      toast.error("Cantidad inválida", {
        description: "Ingresa una cantidad válida mayor a 0",
        icon: "❌",
      });
      return;
    }

    if (actionType === "REMOVE" && qty > currentStock) {
      toast.error("Stock insuficiente", {
        description: `Solo hay ${currentStock} unidades disponibles`,
        icon: "❌",
      });
      return;
    }

    const stockData = {
      quantity: qty,
      reason: reason || undefined,
    };

    if (actionType === "ADD") {
      addStock(
        { id: item.id, stockData },
        {
          onSuccess: () => {
            toast.success("Stock agregado", {
              description: `Se agregaron ${qty} unidades al stock`,
              icon: "✅",
            });
            handleClose();
          },
          onError: (error: AxiosErrorWithResponse) => {
            toast.error("Error al agregar stock", {
              description: error.response?.data?.message || error.message,
              icon: "❌",
            });
          },
        }
      );
    } else {
      removeStock(
        { id: item.id, stockData },
        {
          onSuccess: () => {
            toast.success("Stock removido", {
              description: `Se removieron ${qty} unidades del stock`,
              icon: "✅",
            });
            handleClose();
          },
          onError: (error: AxiosErrorWithResponse) => {
            toast.error("Error al remover stock", {
              description: error.response?.data?.message || error.message,
              icon: "❌",
            });
          },
        }
      );
    }
  };

  const handleClose = () => {
    setQuantity("");
    setReason("");
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title={
        actionType === "ADD"
          ? `Agregar Stock - ${item.name}`
          : `Remover Stock - ${item.name}`
      }
      size="md"
    >
      <div className="space-y-6">
        {/* Current Stock Info */}
        <div className="p-4 bg-sage-50 rounded-xl border-2 border-sage-border-subtle">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-carbon-700">
              Stock Actual:
            </span>
            <span className="text-lg font-bold text-carbon-900">
              {currentStock} unidades
            </span>
          </div>
        </div>

        {/* Quantity Input */}
        <div>
          <label className="block text-sm font-medium text-carbon-700 mb-2">
            Cantidad
          </label>
          <Input
            type="number"
            placeholder="Ingresa la cantidad"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            min="1"
            max={actionType === "REMOVE" ? currentStock : undefined}
            fullWidth
            autoFocus
          />
          {actionType === "REMOVE" && currentStock > 0 && (
            <p className="text-xs text-carbon-500 mt-1">
              Máximo disponible: {currentStock} unidades
            </p>
          )}
        </div>

        {/* Reason Input */}
        <div>
          <label className="block text-sm font-medium text-carbon-700 mb-2">
            Razón (opcional)
          </label>
          <Input
            type="text"
            placeholder="Ej: Reposición, Ajuste de inventario, etc."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            fullWidth
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="ghost"
            onClick={handleClose}
            disabled={isPending}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isPending || !quantity}
            className="flex-1"
          >
            {actionType === "ADD" ? (
              <>
                <Plus className="w-4 h-4 mr-2" />
                {isPending ? "Agregando..." : "Agregar Stock"}
              </>
            ) : (
              <>
                <Minus className="w-4 h-4 mr-2" />
                {isPending ? "Removiendo..." : "Remover Stock"}
              </>
            )}
          </Button>
        </div>
      </div>
    </BaseModal>
  );
}
