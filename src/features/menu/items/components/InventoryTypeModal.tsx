import { useState } from "react";
import { BaseModal } from "@/components/ui/BaseModal/BaseModal";
import { Button, Input } from "@/components";
import { useSetInventoryType } from "../hooks";
import { toast } from "sonner";
import type { MenuItem } from "@/types";
import type { AxiosErrorWithResponse } from "@/types/common";
import { Package, AlertTriangle, Check, Info } from "lucide-react";
import { InventoryType } from "@/types";

interface InventoryTypeModalProps {
  item: MenuItem;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * InventoryTypeModal Component
 *
 * Modal for changing the inventory type of a menu item
 * Handles the transition between TRACKED and UNLIMITED inventory types
 */
export function InventoryTypeModal({
  item,
  isOpen,
  onClose,
}: InventoryTypeModalProps) {
  const [selectedType, setSelectedType] = useState<InventoryType>(
    (item.inventoryType as InventoryType) || InventoryType.UNLIMITED,
  );
  const [initialStock, setInitialStock] = useState<string>(
    String(item.initialStock ?? ""),
  );
  const [lowStockAlert, setLowStockAlert] = useState<string>(
    String(item.lowStockAlert ?? "5"),
  );
  const [showConfirmation, setShowConfirmation] = useState(false);

  const { mutate: setInventoryType, isPending } = useSetInventoryType();

  const currentType =
    (item.inventoryType as InventoryType) || InventoryType.UNLIMITED;
  const isChangingToTracked = selectedType === InventoryType.TRACKED;
  const isChangingToUnlimited = selectedType === InventoryType.UNLIMITED;
  const hasTypeChanged = selectedType !== currentType;

  const handleSubmit = () => {
    const updateData: {
      id: number;
      inventoryType: string;
      initialStock?: number;
      lowStockAlert?: number;
    } = {
      id: item.id,
      inventoryType: selectedType,
    };

    // If changing to TRACKED, include stock configuration
    if (isChangingToTracked) {
      const initial = parseInt(initialStock);
      const alert = parseInt(lowStockAlert);

      if (isNaN(initial) || initial < 0) {
        toast.error("Stock inicial inválido", {
          description: "Ingresa un número válido mayor o igual a 0",
        });
        return;
      }

      if (isNaN(alert) || alert < 0) {
        toast.error("Alerta de stock inválida", {
          description: "Ingresa un número válido mayor o igual a 0",
        });
        return;
      }

      updateData.initialStock = initial;
      updateData.lowStockAlert = alert;
    }

    setInventoryType(updateData, {
      onSuccess: () => {
        const typeLabel =
          selectedType === InventoryType.TRACKED ? "rastreado" : "ilimitado";
        toast.success("Tipo de inventario actualizado", {
          description: `"${item.name}" ahora tiene inventario ${typeLabel}`,
          icon: "✅",
        });
        handleClose();
      },
      onError: (error: AxiosErrorWithResponse) => {
        toast.error("Error al actualizar tipo de inventario", {
          description: error.response?.data?.message || error.message,
          icon: "❌",
        });
      },
    });
  };

  const handleClose = () => {
    setSelectedType(currentType);
    setInitialStock(String(item.initialStock ?? ""));
    setLowStockAlert(String(item.lowStockAlert ?? "5"));
    setShowConfirmation(false);
    onClose();
  };

  // Confirmation step
  if (showConfirmation) {
    return (
      <BaseModal
        isOpen={isOpen}
        onClose={() => setShowConfirmation(false)}
        title="Confirmar Cambio"
        size="md"
      >
        <div className="space-y-6">
          {/* Warning Banner */}
          <div className="p-4 bg-amber-50 border-2 border-amber-200 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-800">
                ¿Estás seguro de este cambio?
              </p>
              <p className="text-sm text-amber-700 mt-1">
                {isChangingToTracked
                  ? "El item comenzará a rastrearse con el stock inicial configurado."
                  : "Se dejará de rastrear el stock. El stock actual se mantendrá pero no se controlará."}
              </p>
            </div>
          </div>

          {/* Summary */}
          <div className="p-4 bg-sage-50 rounded-xl space-y-3">
            <h4 className="font-semibold text-carbon-800">
              Resumen del cambio:
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-carbon-600">Item:</span>
                <span className="font-medium text-carbon-800">{item.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-carbon-600">Tipo actual:</span>
                <span className="font-medium text-carbon-800">
                  {currentType === InventoryType.TRACKED
                    ? "Rastreado"
                    : "Ilimitado"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-carbon-600">Nuevo tipo:</span>
                <span className="font-medium text-sage-600">
                  {selectedType === InventoryType.TRACKED
                    ? "Rastreado"
                    : "Ilimitado"}
                </span>
              </div>
              {isChangingToTracked && (
                <>
                  <div className="flex justify-between">
                    <span className="text-carbon-600">Stock inicial:</span>
                    <span className="font-medium text-carbon-800">
                      {initialStock}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-carbon-600">Alerta en:</span>
                    <span className="font-medium text-carbon-800">
                      {lowStockAlert} unidades
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
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
              onClick={handleSubmit}
              disabled={isPending}
              className="flex-1"
            >
              <Check className="w-4 h-4 mr-2" />
              {isPending ? "Actualizando..." : "Confirmar Cambio"}
            </Button>
          </div>
        </div>
      </BaseModal>
    );
  }

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Cambiar Tipo de Inventario - ${item.name}`}
      size="md"
    >
      <div className="space-y-6">
        {/* Current Type Info */}
        <div className="p-4 bg-sage-50 rounded-xl border-2 border-sage-border-subtle">
          <div className="flex items-center gap-3">
            <Package className="w-5 h-5 text-sage-600" />
            <div>
              <p className="text-sm text-carbon-600">Tipo actual</p>
              <p className="font-semibold text-carbon-800">
                {currentType === InventoryType.TRACKED
                  ? "Rastreado (con control de stock)"
                  : "Ilimitado (sin control de stock)"}
              </p>
            </div>
          </div>
        </div>

        {/* Type Selection */}
        <div>
          <label className="block text-sm font-semibold text-carbon-800 mb-3">
            Nuevo tipo de inventario
          </label>
          <div className="space-y-3">
            <label
              className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                selectedType === InventoryType.UNLIMITED
                  ? "border-sage-500 bg-sage-50"
                  : "border-sage-200 hover:border-sage-300"
              }`}
            >
              <input
                type="radio"
                name="inventoryType"
                value={InventoryType.UNLIMITED}
                checked={selectedType === InventoryType.UNLIMITED}
                onChange={() => setSelectedType(InventoryType.UNLIMITED)}
                className="mt-1 w-4 h-4 text-sage-600 focus:ring-sage-500"
              />
              <div>
                <p className="font-semibold text-carbon-800">Ilimitado</p>
                <p className="text-sm text-carbon-600 mt-1">
                  Sin control de stock. El item siempre estará disponible sin
                  importar cantidades.
                </p>
              </div>
            </label>

            <label
              className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                selectedType === InventoryType.TRACKED
                  ? "border-sage-500 bg-sage-50"
                  : "border-sage-200 hover:border-sage-300"
              }`}
            >
              <input
                type="radio"
                name="inventoryType"
                value={InventoryType.TRACKED}
                checked={selectedType === InventoryType.TRACKED}
                onChange={() => setSelectedType(InventoryType.TRACKED)}
                className="mt-1 w-4 h-4 text-sage-600 focus:ring-sage-500"
              />
              <div>
                <p className="font-semibold text-carbon-800">Rastreado</p>
                <p className="text-sm text-carbon-600 mt-1">
                  Control de stock activo. Se rastrearán entradas, salidas y
                  alertas de stock bajo.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* TRACKED Configuration */}
        {isChangingToTracked && (
          <div className="p-5 bg-blue-50 rounded-xl border-2 border-blue-200 space-y-4">
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-blue-800">
                Configuración de stock inicial
              </h4>
            </div>

            <div>
              <label className="block text-sm font-medium text-carbon-700 mb-2">
                Stock inicial *
              </label>
              <Input
                type="number"
                placeholder="Ej: 20"
                value={initialStock}
                onChange={(e) => setInitialStock(e.target.value)}
                min="0"
                fullWidth
              />
              <p className="text-xs text-carbon-500 mt-1">
                Cantidad con la que comenzará el item
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-carbon-700 mb-2">
                Alerta de stock bajo *
              </label>
              <Input
                type="number"
                placeholder="Ej: 5"
                value={lowStockAlert}
                onChange={(e) => setLowStockAlert(e.target.value)}
                min="0"
                fullWidth
              />
              <p className="text-xs text-carbon-500 mt-1">
                Se mostrará alerta cuando el stock llegue a esta cantidad
              </p>
            </div>
          </div>
        )}

        {/* UNLIMITED Warning */}
        {isChangingToUnlimited && hasTypeChanged && (
          <div className="p-4 bg-amber-50 rounded-xl border-2 border-amber-200">
            <p className="text-sm text-amber-800">
              <strong>Nota:</strong> Al cambiar a "Ilimitado", se dejará de
              rastrear el stock. El stock actual ({item.stockQuantity ?? 0}{" "}
              unidades) se mantendrá en la base de datos pero no se controlará
              automáticamente.
            </p>
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
            disabled={!hasTypeChanged || isPending}
            className="flex-1"
          >
            Continuar
          </Button>
        </div>
      </div>
    </BaseModal>
  );
}
