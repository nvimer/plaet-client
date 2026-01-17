import { OrderType, TableStatus, type MenuItem } from "@/types";
import type { AxiosErrorWithResponse } from "@/types/common";
import { useState } from "react";
import { useCreateOrder } from "../../hooks";
import { useTables, useItems } from "@/features";
import { toast } from "sonner";
import type { CreateOrderFormInput } from "../../schemas/orderSchemas";
import {
    Bike,
    Check,
    Minus,
    Plus,
    ShoppingBag,
    Trash2,
    UtensilsCrossed,
} from "lucide-react";
import { Button, Input, BaseModal } from "@/components";

// ========== TYPES ===========
interface CreateOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface SelectedItem {
    menuItemId: number;
    menuItem: MenuItem;
    quantity: number;
    priceAtOrder: number;
    isFreeSubstitution: boolean;
    notes?: string;
}

/**
 * CreateOrderModal Component
 *
 * Modal to create a new order with item selection
 */

export function CreateOrderModal({ isOpen, onClose }: CreateOrderModalProps) {
    // ============== STATE ===============
    const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
    const [orderType, setOrderType] = useState<OrderType>(OrderType.DINE_IN);
    const [selectedTable, setSelectedTable] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    // ============= HOOKS =============
    const { mutate: createOrder, isPending } = useCreateOrder();
    const { data: tables } = useTables();
    const { data: menuItems } = useItems();

    // Filter available tables
    const availableTables = tables?.filter(
        (t) => t.status === TableStatus.AVAILABLE || [],
    );

    // Filter menu items by search
    const filteredItems =
        menuItems?.filter(
            (item) =>
                item.isAvailable &&
                item.name.toLowerCase().includes(searchTerm.toLowerCase()),
        ) || [];

    // =============== COMPUTED VALUES ===============
    const totalAmount = selectedItems.reduce(
        (sum, item) => sum + item.priceAtOrder * item.quantity,
        0,
    );

    // ================= HANDLERS ==================
    // Add item to order
    const handleAddItem = (menuItem: MenuItem) => {
        const existingIndex = selectedItems.findIndex(
            (item) => item.menuItemId === menuItem.id,
        );

        if (existingIndex >= 0) {
            // Increment quantity
            const updated = [...selectedItems];
            updated[existingIndex].quantity += 1;
            setSelectedItems(updated);
        } else {
            // Add new item
            setSelectedItems([
                ...selectedItems,
                {
                    menuItemId: menuItem.id,
                    menuItem,
                    quantity: 1,
                    priceAtOrder: Number(menuItem.price),
                    isFreeSubstitution: menuItem.isExtra,
                },
            ]);
        }
    };

    // Update item quantity
    const handleUpdateQuantity = (menuItemId: number, delta: number) => {
        setSelectedItems((prev) =>
            prev
                .map((item) =>
                    item.menuItemId === menuItemId
                        ? { ...item, quantity: Math.max(0, item.quantity + delta) }
                        : item,
                )
                .filter((item) => item.quantity > 0),
        );
    };

    // Remove item
    const handleRemoveItem = (menuItemsId: number) => {
        setSelectedItems((prev) =>
            prev.filter((item) => item.menuItemId !== menuItemsId),
        );
    };

    // Submit order
    const handleSubmit = () => {
        if (selectedItems.length === 0) {
            toast.error("Agrega al menos un producto", { icon: "⚠️" });
            return;
        }

        const orderData: CreateOrderFormInput = {
            type: orderType,
            tableId: orderType === OrderType.DINE_IN ? selectedTable : null,
            items: selectedItems.map((item) => ({
                menuItemId: item.menuItemId,
                quantity: item.quantity,
                priceAtOrder: item.priceAtOrder,
                notes: item.notes,
                isFreeSubstitution: item.isFreeSubstitution,
            })),
        };

        createOrder(orderData, {
            onSuccess: () => {
                toast.success("Pedido creado", {
                    description: `Total: ${totalAmount.toLocaleString("es-CO")}`,
                    icon: "🎉",
                });
                // Reset and close
                setSelectedItems([]);
                setOrderType(OrderType.DINE_IN);
                setSelectedTable(null);
                onClose();
            },
            onError: (error: AxiosErrorWithResponse) => {
                toast.error("Error al crear pedido", {
                    description: error.response?.data?.message || error.message,
                    icon: "❌",
                });
            },
        });
    };

    // Reset on close
    const handleClose = () => {
        setSelectedItems([]);
        setOrderType(OrderType.DINE_IN);
        setSelectedTable(null);
        setSearchTerm("");
        onClose();
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={handleClose}
            title="Nuevo Pedido"
            subtitle="Selecciona tipo, mesa y productos"
            size="xl"
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* ================ LEFT COLUMN =================== */}
                <div className="space-y-6">
                    {/* Order Type */}
                    <div>
                        <label className="block text-sm font-semibold text-carbon-900 mb-3">
                            Tipo de pedido
                        </label>
                        <div className="grid grid-cols-3 gap-2">
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
                                    onClick={() => setOrderType(type)}
                                    className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${orderType === type
                                            ? "border-sage-green-400 bg-sage-green-50 text-sage-green-600"
                                            : "border-sage-border-subtle bg-white text-carbon-600 hover:border-sage-green-200"
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="text-sm font-medium">{label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Table Selection */}
                    {orderType === OrderType.DINE_IN && (
                        <div>
                            <label className="block text-sm font-semibold text-carbon-900 mb-3">
                                Mesa
                            </label>
                            <div className="grid grid-cols-4 gap-2">
                                {availableTables?.length > 0 ? (
                                    availableTables?.map((table) => (
                                        <button
                                            key={table.id}
                                            onClick={() => setSelectedTable(table.id)}
                                            className={`p-3 rounded-xl border-2 transition-all font-semibold ${selectedTable === table.id
                                                    ? "border-sage-green-400 bg-sage-green-50 text-sage-green-600"
                                                    : "border-sage-border-subtle bg-white text-carbon-700 hover:border-sage-green-200"
                                                }`}
                                        >
                                            {table.number}
                                        </button>
                                    ))
                                ) : (
                                    <p className="col-span-4 text-sm text-carbon-500 italic">
                                        No hay mesas disponibles
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Product Search */}
                    <div>
                        <label className="block text-sm font-semibold text-carbon-900 mb-3">
                            Agregar Productos
                        </label>
                        <Input
                            type="text"
                            placeholder="Buscar producto..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            fullWidth
                        />

                        {/* Product List */}
                        <div className="mt-3 max-h-48 overflow-y-auto space-y-2">
                            {filteredItems.slice(0, 10).map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between p-3 bg-sage-50 rounded-xl hover:bg-sage-100 transition-colors"
                                >
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-carbon-900 truncate">
                                            {item.name}
                                        </p>
                                        <p className="text-sm text-sage-green-600 font-semibold">
                                            ${Number(item.price).toLocaleString("es-CO")}
                                        </p>
                                    </div>
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={() => handleAddItem(item)}
                                    >
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ================ RIGHT COLUMN ================= */}
                <div className="bg-sage-50 rounded-2xl p-4">
                    <h3 className="font-semibold text-carbon-900 mb-4">
                        Resumen del Pedido
                    </h3>

                    {selectedItems.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-carbon-500 font-light">
                                No hay productos seleccionados
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Items List */}
                            <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                                {selectedItems.map((item) => (
                                    <div
                                        key={item.menuItemId}
                                        className="bg-white rounded-xl p-3 border border-sage-border-subtle"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-carbon-900 truncate">
                                                    {item.menuItem.name}
                                                </p>
                                                <p className="text-sm text-sage-green-600">
                                                    ${item.priceAtOrder.toLocaleString("es-CO")} c/u
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveItem(item.menuItemId)}
                                                className="p-1 text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        {/* Quantity Controls */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() =>
                                                        handleUpdateQuantity(item.menuItemId, -1)
                                                    }
                                                    className="p-1.5 rounded-lg bg-sage-100 text-carbon-700 hover:bg-sage-200"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span>{item.quantity}</span>
                                                <button
                                                    onClick={() =>
                                                        handleUpdateQuantity(item.menuItemId, 1)
                                                    }
                                                    className="p-1.5 rounded-lg bg-sage-100 text-carbon-700 hover:bg-sage-200"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <p className="font-semibold text-carbon-900">
                                                $
                                                {(item.priceAtOrder * item.quantity).toLocaleString(
                                                    "es-CO",
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Total */}
                            <div className="border-t border-sage-border-subtle pt-4">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-lg font-semibold text-carbon-900">
                                        Total
                                    </span>
                                    <span className="text-2xl font-bold text-sage-green-600">
                                        ${totalAmount.toLocaleString("es-CO")}
                                    </span>
                                </div>

                                {/* Submit Button */}
                                <Button
                                    variant="primary"
                                    size="lg"
                                    fullWidth
                                    onClick={handleSubmit}
                                    disabled={isPending || selectedItems.length === 0}
                                    isLoading={isPending}
                                >
                                    {!isPending && <Check className="w-5 h-5 mr-2" />}
                                    Crear Pedido
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </BaseModal>
    );
}
