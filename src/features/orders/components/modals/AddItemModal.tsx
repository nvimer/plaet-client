import { useItems } from "@/features/menu";
import { type MenuItem, type Order } from "@/types";
import type { AxiosErrorWithResponse } from "@/types/common";
import { useState } from "react";
import { useAddOrderItem } from "../../hooks";
import { toast } from "sonner";
import { BaseModal, Input } from "@/components";
import { Plus, Search } from "lucide-react";

// ============= TYPES ===============
interface AddItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: Order | null;
}

/**
 * AddItemModal Component
 *
 * Modal to add items to an existing order
 */
export function AddItemModal({ isOpen, onClose, order }: AddItemModalProps) {
    // ============= STATE =================
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [notes, setNotes] = useState("");

    // =========== HOOKS ===============
    const { data: menuItems } = useItems();
    const { mutate: addItem, isPending } = useAddOrderItem();

    // =============== EARLY RETURN =================
    if (!order) return null;

    // ================ CUMPUTED VALUES ===================
    const filteredItems =
        menuItems?.filter(
            (item) =>
                item.isAvailable &&
                item.name.toLowerCase().includes(searchTerm.toLowerCase()),
        ) || [];

    // ================== HANDLERS ===================
    const handleSelectItem = (item: MenuItem) => {
        setSelectedItem(item);
        setQuantity(1);
        setNotes("");
    };

    const handleClose = () => {
        setSearchTerm("");
        setSelectedItem(null);
        setQuantity(1);
        setNotes("");
        onClose();
    };

    const handleSubmit = () => {
        if (!selectedItem) return;

        addItem(
            {
                orderId: order.id,
                itemData: {
                    menuItemId: selectedItem.id,
                    quantity,
                    priceAtOrder: Number(selectedItem.price),
                    notes: notes || undefined,
                },
            },
            {
                onSuccess: () => {
                    toast.success("Producto agregado", {
                        description: `${quantity}x ${selectedItem.name}`,
                        icon: "✅",
                    });
                    handleClose();
                },
                onError: (error: AxiosErrorWithResponse) => {
                    toast.error("Error al agregar producto", {
                        description: error.response?.data?.message || error.message,
                    });
                },
            },
        );
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={handleClose}
            title="Agregar Producto"
            subtitle={`Pedido #${order.id.slice(-6).toUpperCase()}`}
            size="md"
        >
            <div className="space-y-2">
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" />
                    <Input
                        type="text"
                        placeholder="Buscar producto..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        fullWidth
                        className="pl-10"
                    />
                </div>

                {/* Product List */}
                {!selectedItem && (
                    <div className="max-h-64 overflow-y-auto space-y-2">
                        {filteredItems.slice(0, 10).map((item) => (
                            <button>
                                <div>
                                    <p>{item.name}</p>
                                    <p>${Number(item.price).toLocaleString("es-CO")}</p>
                                </div>
                                <Plus />
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </BaseModal>
    );
}
