import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { OrderType, TableStatus } from "@/types";
import type { AxiosErrorWithResponse } from "@/types/common";
import { SidebarLayout } from "@/layouts/SidebarLayout";
import { ProductSelector } from "@/features/menu/items";
import { TableSelector } from "@/features/tables";
import { Button, Input } from "@/components";
import { useItems } from "@/features/menu";
import { useTables } from "@/features/tables";
import { useCreateOrder } from "../hooks";
import { ROUTES, getOrderDetailRoute } from "@/app/routes";
import { toast } from "sonner";
import {
  Bike,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  Trash2,
  UtensilsCrossed,
} from "lucide-react";
import type { MenuItem } from "@/types";

/**
 * OrderCreatePage Component
 * 
 * Full-screen page for creating new orders.
 * Optimized for touch interactions with visual product selection.
 * 
 * Features:
 * - Visual product grid (like McDonald's kiosk)
 * - Large touch targets
 * - Table selection for dine-in orders
 * - Real-time order summary
 * - Search functionality
 */
export function OrderCreatePage() {
  const navigate = useNavigate();
  const { data: menuItems } = useItems();
  const { data: tablesData } = useTables();
  const tables = tablesData?.tables;
  const { mutate: createOrder, isPending } = useCreateOrder();

  // State
  const [orderType, setOrderType] = useState<OrderType>(OrderType.DINE_IN);
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [selectedItems, setSelectedItems] = useState<Map<number, SelectedItem>>(
    new Map()
  );
  const [searchTerm, setSearchTerm] = useState("");

  // Filter available tables
  const availableTables =
    tables?.filter((t) => t.status === TableStatus.AVAILABLE) || [];

  // Filter menu items by search
  const filteredItems =
    menuItems?.filter(
      (item) =>
        item.isAvailable &&
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  // Computed values
  const selectedItemsArray = Array.from(selectedItems.values());
  const totalAmount = selectedItemsArray.reduce(
    (sum, item) => sum + item.priceAtOrder * item.quantity,
    0
  );
  const selectedProductIds = new Set(selectedItems.keys());
  const quantities = new Map(
    Array.from(selectedItems.entries()).map(([id, item]) => [id, item.quantity])
  );

  // Handlers
  const handleProductSelect = (product: MenuItem) => {
    setSelectedItems((prev) => {
      const newMap = new Map(prev);
      const existing = newMap.get(product.id);

      if (existing) {
        newMap.set(product.id, {
          ...existing,
          quantity: existing.quantity + 1,
        });
      } else {
        newMap.set(product.id, {
          menuItemId: product.id,
          menuItem: product,
          quantity: 1,
          priceAtOrder: Number(product.price),
          isFreeSubstitution: product.isExtra,
        });
      }

      return newMap;
    });
  };

  const handleQuantityChange = (productId: number, delta: number) => {
    setSelectedItems((prev) => {
      const newMap = new Map(prev);
      const existing = newMap.get(productId);

      if (!existing) return newMap;

      const newQuantity = Math.max(0, existing.quantity + delta);

      if (newQuantity === 0) {
        newMap.delete(productId);
      } else {
        newMap.set(productId, {
          ...existing,
          quantity: newQuantity,
        });
      }

      return newMap;
    });
  };

  const handleRemoveItem = (productId: number) => {
    setSelectedItems((prev) => {
      const newMap = new Map(prev);
      newMap.delete(productId);
      return newMap;
    });
  };

  const handleSubmit = () => {
    if (selectedItems.size === 0) {
      toast.error("Agrega al menos un producto", { icon: "⚠️" });
      return;
    }

    if (orderType === OrderType.DINE_IN && !selectedTable) {
      toast.error("Selecciona una mesa", { icon: "⚠️" });
      return;
    }

    const items = selectedItemsArray.map((item) => ({
      menuItemId: item.menuItemId,
      quantity: item.quantity,
      priceAtOrder: item.priceAtOrder,
      notes: item.notes,
      isFreeSubstitution: item.isFreeSubstitution,
    }));

    createOrder(
      {
        type: orderType,
        tableId: orderType === OrderType.DINE_IN && selectedTable ? selectedTable : undefined,
        items,
      },
      {
        onSuccess: (order) => {
          toast.success("Pedido creado exitosamente", {
            icon: "🎉",
            description: `Total: ${totalAmount.toLocaleString("es-CO")}`,
          });
          navigate(getOrderDetailRoute(order.id));
        },
        onError: (error: AxiosErrorWithResponse) => {
          toast.error("Error al crear pedido", {
            description: error.response?.data?.message || error.message,
            icon: "❌",
          });
        },
      }
    );
  };

  return (
    <SidebarLayout
      title="Nuevo Pedido"
      subtitle="Selecciona productos y completa la información"
      backRoute={ROUTES.ORDERS}
      fullWidth
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ============ LEFT COLUMN: Order Type & Table ============ */}
          <div className="space-y-6">
            {/* Order Type Selection */}
            <div className="bg-white rounded-2xl border-2 border-sage-200 p-4 sm:p-5">
              <h2 className="text-base sm:text-lg font-semibold text-carbon-900 mb-4">
                Tipo de Pedido
              </h2>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {[
                  {
                    type: OrderType.DINE_IN,
                    label: "Aquí",
                    icon: UtensilsCrossed,
                  },
                  {
                    type: OrderType.TAKE_OUT,
                    label: "Llevar",
                    icon: ShoppingBag,
                  },
                  {
                    type: OrderType.DELIVERY,
                    label: "Domicilio",
                    icon: Bike,
                  },
                ].map(({ type, label, icon: Icon }) => (
                  <button
                    key={type}
                    onClick={() => {
                      setOrderType(type);
                      if (type !== OrderType.DINE_IN) {
                        setSelectedTable(null);
                      }
                    }}
                    className={`
                      p-3 sm:p-4 rounded-xl border-2 transition-all duration-200
                      flex flex-col items-center gap-1.5 sm:gap-2
                      min-h-[80px] sm:min-h-[90px]
                      ${
                        orderType === type
                          ? "border-sage-500 bg-sage-50 text-sage-700 shadow-sm"
                          : "border-sage-200 bg-white text-carbon-600 hover:border-sage-300 hover:bg-sage-50/50"
                      }
                    `}
                  >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="font-semibold text-sm sm:text-base">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Table Selection - Only for DINE_IN */}
            {orderType === OrderType.DINE_IN && (
              <div className="bg-white rounded-2xl border-2 border-sage-200 p-4 sm:p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base sm:text-lg font-semibold text-carbon-900">
                    Seleccionar Mesa
                  </h2>
                  {selectedTable && (
                    <span className="text-sm text-sage-600 font-medium">
                      Mesa {selectedTable} seleccionada
                    </span>
                  )}
                </div>
                <TableSelector
                  tables={availableTables}
                  onSelect={(table) => setSelectedTable(table.id)}
                  selectedTableId={selectedTable || undefined}
                  showOnlyAvailable
                />
              </div>
            )}
          </div>

          {/* ============ MIDDLE COLUMN: Products ============ */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search */}
            <div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-carbon-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Buscar producto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  fullWidth
                />
              </div>
            </div>

            {/* Products Grid */}
            <div className="bg-white rounded-2xl border-2 border-sage-200 p-4 sm:p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base sm:text-lg font-semibold text-carbon-900">
                  Productos Disponibles
                </h2>
                <span className="text-sm text-carbon-500">
                  {filteredItems.length} productos
                </span>
              </div>
              <ProductSelector
                products={filteredItems}
                onSelect={handleProductSelect}
                selectedIds={selectedProductIds}
                showQuantity
                quantities={quantities}
              />
            </div>
          </div>
        </div>

        {/* ============ FLOATING SUMMARY ============ */}
        {selectedItems.size > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-sage-border-subtle shadow-lg z-50">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                {/* Selected Items List */}
                <div className="flex-1 overflow-x-auto">
                  <div className="flex gap-3">
                    {selectedItemsArray.map((item) => (
                      <div
                        key={item.menuItemId}
                        className="flex items-center gap-2 bg-sage-50 rounded-xl p-3 min-w-[200px]"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-carbon-900 truncate text-sm">
                            {item.menuItem.name}
                          </p>
                          <p className="text-xs text-carbon-600">
                            ${item.priceAtOrder.toLocaleString("es-CO")} c/u
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleQuantityChange(item.menuItemId, -1)}
                            className="p-1.5 rounded-lg bg-white text-carbon-700 hover:bg-sage-100 transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-semibold text-carbon-900 min-w-[24px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.menuItemId, 1)}
                            className="p-1.5 rounded-lg bg-white text-carbon-700 hover:bg-sage-100 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRemoveItem(item.menuItemId)}
                            className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors ml-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total and Submit */}
                <div className="flex items-center gap-6 ml-6">
                  <div className="text-right">
                    <p className="text-sm text-carbon-600">
                      {selectedItems.size} producto{selectedItems.size !== 1 ? "s" : ""}
                    </p>
                    <p className="text-3xl font-bold text-carbon-900">
                      ${totalAmount.toLocaleString("es-CO")}
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleSubmit}
                    disabled={
                      isPending ||
                      selectedItems.size === 0 ||
                      (orderType === OrderType.DINE_IN && !selectedTable)
                    }
                    isLoading={isPending}
                  >
                    Crear Pedido
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </SidebarLayout>
  );
}

// Types
interface SelectedItem {
  menuItemId: number;
  menuItem: MenuItem;
  quantity: number;
  priceAtOrder: number;
  isFreeSubstitution: boolean;
  notes?: string;
}
