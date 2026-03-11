import { BaseModal, Button } from "@/components";
import { useState, useMemo } from "react";
import { useResetStock, useResetStockByCategory } from "../hooks";
import { toast } from "sonner";
import type { MenuItem, MenuCategory } from "@/types";
import type { AxiosErrorWithResponse } from "@/types/common";
import { RotateCcw, Package, AlertTriangle, Check, List, FolderOpen } from "lucide-react";
import { InventoryType } from "@/types";

type ResetMode = "individual" | "category";

interface DailyResetModalProps {
  items: MenuItem[];
  categories: MenuCategory[];
  isOpen: boolean;
  onClose: () => void;
}

/**
 * DailyResetModal Component
 *
 * Modal for daily stock reset operation
 * Allows selecting which tracked items to reset to their initial stock
 * Supports both individual selection and reset by category
 */
export function DailyResetModal({
  items,
  categories,
  isOpen,
  onClose,
}: DailyResetModalProps) {
  const [mode, setMode] = useState<ResetMode>("individual");
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [categoryQuantities, setCategoryQuantities] = useState<Record<number, number>>({});
  const [showConfirmation, setShowConfirmation] = useState(false);

  const { mutate: resetStock, isPending: isPendingIndividual } = useResetStock();
  const { mutate: resetStockByCategory, isPending: isPendingCategory } = useResetStockByCategory();

  const isPending = isPendingIndividual || isPendingCategory;

  const trackedItems = items.filter(
    (item) => item.inventoryType === InventoryType.TRACKED,
  );

  const trackedCategories = useMemo(() => {
    const categoryIds = new Set(trackedItems.map((item) => item.categoryId));
    return categories.filter((cat) => categoryIds.has(cat.id));
  }, [categories, trackedItems]);

  const itemsByCategory = useMemo(() => {
    const grouped: Record<number, MenuItem[]> = {};
    trackedItems.forEach((item) => {
      if (!grouped[item.categoryId]) {
        grouped[item.categoryId] = [];
      }
      grouped[item.categoryId].push(item);
    });
    return grouped;
  }, [trackedItems]);

  const selectedCategoryItems = useMemo(() => {
    if (!selectedCategoryId) return [];
    return itemsByCategory[selectedCategoryId] || [];
  }, [selectedCategoryId, itemsByCategory]);

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

  const handleQuantityChange = (itemId: number, quantity: number) => {
    setCategoryQuantities((prev) => ({
      ...prev,
      [itemId]: quantity,
    }));
  };

  const handleCategorySelect = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
    const itemsInCategory = itemsByCategory[categoryId] || [];
    const newQuantities: Record<number, number> = {};
    itemsInCategory.forEach((item) => {
      newQuantities[item.id] = item.initialStock ?? 0;
    });
    setCategoryQuantities(newQuantities);
  };

  const handleReset = () => {
    if (mode === "individual") {
      const itemsToReset = trackedItems
        .filter((item) => selectedItems.has(item.id))
        .map((item) => ({
          itemId: item.id,
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
    } else {
      if (!selectedCategoryId) return;
      
      const itemsToReset = selectedCategoryItems.map((item) => ({
        itemId: item.id,
        quantity: categoryQuantities[item.id] ?? 0,
      }));

      resetStockByCategory(
        { categoryId: selectedCategoryId, items: itemsToReset },
        {
          onSuccess: () => {
            toast.success("Reset por categoría completado", {
              description: `Se resetearon ${itemsToReset.length} items de la categoría`,
              icon: "✅",
            });
            handleClose();
          },
          onError: (error: AxiosErrorWithResponse) => {
            toast.error("Error al realizar reset por categoría", {
              description: error.response?.data?.message || error.message,
              icon: "❌",
            });
          },
        },
      );
    }
  };

  const handleClose = () => {
    setSelectedItems(new Set());
    setSelectedCategoryId(null);
    setCategoryQuantities({});
    setShowConfirmation(false);
    setMode("individual");
    onClose();
  };

  const selectedItemsData = trackedItems.filter((item) =>
    selectedItems.has(item.id),
  );

  const categorySelectedCount = Object.keys(categoryQuantities).length;

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
          <div className="p-4 bg-warning-50 border-2 border-warning-200 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-warning-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-warning-800">
                Esta acción no se puede deshacer
              </p>
              <p className="text-sm text-warning-700 mt-1">
                El stock de los items seleccionados será reemplazado por su
                stock inicial.
              </p>
            </div>
          </div>

          {/* Summary */}
          <div>
            <h4 className="text-sm font-semibold text-carbon-700 mb-3">
              {mode === "individual"
                ? `Resumen (${selectedItemsData.length} items seleccionados)`
                : `Resumen (${selectedCategoryItems.length} items de categoría)`}
            </h4>
            <div className="max-h-64 overflow-y-auto border-2 border-sage-200 rounded-xl divide-y divide-sage-200">
              {mode === "individual"
                ? selectedItemsData.map((item) => (
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
                  ))
                : selectedCategoryItems.map((item) => (
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
                          {item.stockQuantity ?? 0} → {categoryQuantities[item.id] ?? 0}
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
              className="flex-1 bg-warning-600 hover:bg-warning-700"
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
        {/* Mode Tabs */}
        <div className="flex gap-2 p-1 bg-sage-100 rounded-xl">
          <button
            type="button"
            onClick={() => setMode("individual")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
              mode === "individual"
                ? "bg-white text-carbon-900 shadow-sm"
                : "text-carbon-600 hover:text-carbon-800"
            }`}
          >
            <List className="w-4 h-4" />
            Individual
          </button>
          <button
            type="button"
            onClick={() => setMode("category")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
              mode === "category"
                ? "bg-white text-carbon-900 shadow-sm"
                : "text-carbon-600 hover:text-carbon-800"
            }`}
          >
            <FolderOpen className="w-4 h-4" />
            Por Categoría
          </button>
        </div>

        {mode === "individual" ? (
          <>
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
          </>
        ) : (
          <>
            {/* Category Selection */}
            <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
              <p className="text-sm text-blue-800">
                Selecciona una categoría para configurar el stock de sus items.
              </p>
            </div>

            {/* Category List */}
            {trackedCategories.length === 0 ? (
              <div className="text-center py-8 text-carbon-500">
                <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No hay categorías con items rastreados</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {trackedCategories.map((category) => {
                  const itemCount = (itemsByCategory[category.id] || []).length;
                  const isSelected = selectedCategoryId === category.id;
                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => handleCategorySelect(category.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        isSelected
                          ? "border-sage-500 bg-sage-50"
                          : "border-sage-200 hover:border-sage-300 hover:bg-sage-50/50"
                      }`}
                    >
                      <p className="font-medium text-carbon-800">{category.name}</p>
                      <p className="text-sm text-carbon-500">
                        {itemCount} item{itemCount !== 1 ? "s" : ""}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Items in Category */}
            {selectedCategoryId && selectedCategoryItems.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-carbon-700">
                  Configurar stock para:{" "}
                  {categories.find((c) => c.id === selectedCategoryId)?.name}
                </h4>
                <div className="max-h-64 overflow-y-auto border-2 border-sage-200 rounded-xl divide-y divide-sage-200">
                  {selectedCategoryItems.map((item) => (
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
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          value={categoryQuantities[item.id] ?? 0}
                          onChange={(e) =>
                            handleQuantityChange(
                              item.id,
                              parseInt(e.target.value) || 0,
                            )
                          }
                          className="w-20 px-3 py-1.5 text-center border-2 border-sage-200 rounded-lg text-sm focus:border-sage-400 focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
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
                disabled={!selectedCategoryId || categorySelectedCount === 0 || isPending}
                className="flex-1"
              >
                Continuar
              </Button>
            </div>
          </>
        )}
      </div>
    </BaseModal>
  );
}
