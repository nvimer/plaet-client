import { useState } from "react";
import { BaseModal } from "@/components/ui/BaseModal/BaseModal";
import { Button } from "@/components";
import { useResetStock } from "../hooks";
import { toast } from "sonner";
import type { MenuItem } from "@/types";
import type { AxiosErrorWithResponse } from "@/types/common";
import { RotateCcw, Package, AlertTriangle, Check } from "lucide-react";
import { InventoryType } from "@/types";

interface DailyResetModalProps {
  items: MenuItem[];
  isOpen: boolean;
  onClose: () => void;
}

/**
 * DailyResetModal Component
 *
 * Modal for daily stock reset operation
 * Allows selecting which tracked items to reset to their initial stock
 */
export function DailyResetModal({
  items,
  isOpen,
  onClose,
}: DailyResetModalProps) {
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [showConfirmation, setShowConfirmation] = useState(false);

  const { mutate: resetStock, isPending } = useResetStock();

  // Filter only TRACKED items
  const trackedItems = items.filter(
    (item) => item.inventoryType === InventoryType.TRACKED,
  );

  const toggleItem = (itemId: number) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const selectAll = () => {
    if (selectedItems.size === trackedItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(trackedItems.map((item) => item.id)));
    }
  };

  const handleReset = () => {
    const itemsToReset = trackedItems
      .filter((item) => selectedItems.has(item.id))
      .map((item) => ({
        menuItemId: item.id,
        quantity: item.initialStock ?? 0,
      }));

    resetStock(
      { items: itemsToReset },
      {
        onSuccess: () => {
          toast.success("Reset diario completado", {
            description: `Se resetearon ${itemsToReset.length} items al stock inicial`,
            icon: "✅",
          });
          handleClose();
        },
        onError: (error: AxiosErrorWithResponse) => {
          toast.error("Error al realizar reset diario", {
            description: error.response?.data?.message || error.message,
            icon: "❌",
          });
        },
      },
    );
  };

  const handleClose = () => {
    setSelectedItems(new Set());
    setShowConfirmation(false);
    onClose();
  };

  const selectedItemsData = trackedItems.filter((item) =>
    selectedItems.has(item.id),
  );

  // Confirmation step
  if (showConfirmation) {
    return (
      <BaseModal
        isOpen={isOpen}
        onClose={() => setShowConfirmation(false)}
        title="Confirmar Reset Diario"
        size="lg"
      >
        <div className="space-y-6">
          {/* Warning Banner */}
          <div className="p-4 bg-amber-50 border-2 border-amber-200 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-800">
                Esta acción no se puede deshacer
              </p>
              <p className="text-sm text-amber-700 mt-1">
                El stock de los items seleccionados será reemplazado por su
                stock inicial.
              </p>
            </div>
          </div>

          {/* Summary */}
          <div>
            <h4 className="text-sm font-semibold text-carbon-700 mb-3">
              Resumen ({selectedItemsData.length} items seleccionados)
            </h4>
            <div className="max-h-64 overflow-y-auto border-2 border-sage-200 rounded-xl divide-y divide-sage-200">
              {selectedItemsData.map((item) => (
                <div
                  key={item.id}
                  className="p-3 flex items-center justify-between bg-sage-50/50"
                >
                  <div className="flex items-center gap-3">
                    <Package className="w-4 h-4 text-sage-600" />
                    <span className="font-medium text-carbon-800">
                      {item.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-carbon-500">
                      {item.stockQuantity ?? 0} → {item.initialStock ?? 0}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-sage-200">
            <Button
              variant="ghost"
              onClick={() => setShowConfirmation(false)}
              disabled={isPending}
              className="flex-1"
            >
              Volver
            </Button>
            <Button
              variant="primary"
              onClick={handleReset}
              disabled={isPending}
              className="flex-1 bg-amber-600 hover:bg-amber-700"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              {isPending ? "Procesando..." : "Confirmar Reset"}
            </Button>
          </div>
        </div>
      </BaseModal>
    );
  }

  // Selection step
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Reset Diario de Stock"
      size="lg"
    >
      <div className="space-y-6">
        {/* Info Banner */}
        <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
          <p className="text-sm text-blue-800">
            Selecciona los items con inventario rastreado que deseas resetear a
            su stock inicial.
          </p>
        </div>

        {/* Select All */}
        {trackedItems.length > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-carbon-600">
              {trackedItems.length} items con inventario rastreado
            </span>
            <Button variant="ghost" size="sm" onClick={selectAll}>
              {selectedItems.size === trackedItems.length
                ? "Deseleccionar todo"
                : "Seleccionar todo"}
            </Button>
          </div>
        )}

        {/* Items List */}
        {trackedItems.length === 0 ? (
          <div className="text-center py-8 text-carbon-500">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No hay items con inventario rastreado</p>
            <p className="text-sm mt-1">
              Solo los items con tipo "Rastreado" aparecen aquí
            </p>
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto border-2 border-sage-200 rounded-xl divide-y divide-sage-200">
            {trackedItems.map((item) => {
              const isSelected = selectedItems.has(item.id);
              return (
                <label
                  key={item.id}
                  className={`p-4 flex items-center gap-4 cursor-pointer transition-colors ${
                    isSelected ? "bg-sage-50" : "hover:bg-sage-50/50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleItem(item.id)}
                    className="w-5 h-5 rounded border-sage-300 text-sage-600 focus:ring-sage-500"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-carbon-800">{item.name}</p>
                    <p className="text-sm text-carbon-500">
                      Stock actual: {item.stockQuantity ?? 0} → Inicial:{" "}
                      {item.initialStock ?? 0}
                    </p>
                  </div>
                  {isSelected && <Check className="w-5 h-5 text-sage-600" />}
                </label>
              );
            })}
          </div>
        )}

        {/* Selected Count */}
        {selectedItems.size > 0 && (
          <div className="p-3 bg-sage-50 rounded-lg text-center">
            <span className="text-sm font-medium text-sage-800">
              {selectedItems.size} item{selectedItems.size !== 1 ? "s" : ""}{" "}
              seleccionado{selectedItems.size !== 1 ? "s" : ""}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-sage-200">
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
            onClick={() => setShowConfirmation(true)}
            disabled={selectedItems.size === 0 || isPending}
            className="flex-1"
          >
            Continuar
          </Button>
        </div>
      </div>
    </BaseModal>
  );
}
