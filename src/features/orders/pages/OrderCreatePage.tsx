import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { OrderType } from "@/types";
import { SidebarLayout } from "@/layouts/SidebarLayout";
import { Button, Card, Input } from "@/components";
import { useTables } from "@/features/tables";
import { useItems } from "@/features/menu";
import { useCreateOrder } from "../hooks";
import { ROUTES, getOrderDetailRoute } from "@/app/routes";
import { toast } from "sonner";
import {
  DailyMenuSection,
  ProteinSelector,
  PlateCustomizer,
  OrderSummary,
} from "../components";
import { TableSelector } from "@/features/tables";
import { Search, ShoppingBag, Plus, Trash2 } from "lucide-react";

// Types for corrientazo
interface ProteinOption {
  id: number;
  name: string;
  price: number;
  icon?: "beef" | "fish" | "chicken" | "pork" | "other";
  isAvailable: boolean;
}

interface Substitution {
  from: "sopa" | "principio" | "ensalada" | "adicional";
  to: "sopa" | "principio" | "ensalada" | "adicional";
  quantity: number;
}

interface AdditionalItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface LooseItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

/**
 * OrderCreatePage Component - Corrientazo Edition
 *
 * Flujo optimizado para restaurante de corrientazos/almuerzos:
 * 1. Menú del día visible inmediatamente
 * 2. Selector de proteína con precios diferenciados
 * 3. Personalización del plato (sustituciones/adicionales)
 * 4. Productos sueltos
 * 5. Resumen con desglose
 * 6. Opción de duplicar pedido
 */
export function OrderCreatePage() {
  const navigate = useNavigate();
  const { data: tablesData } = useTables();
  const { data: menuItems } = useItems();
  const { mutate: createOrder, isPending } = useCreateOrder();

  const tables = tablesData?.tables || [];
  const availableTables = tables.filter((t) => t.status === "AVAILABLE");

  // State
  const [orderType, setOrderType] = useState<OrderType>(OrderType.DINE_IN);
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [selectedProtein, setSelectedProtein] = useState<ProteinOption | null>(null);
  const [substitutions, setSubstitutions] = useState<Substitution[]>([]);
  const [additionals, setAdditionals] = useState<AdditionalItem[]>([]);
  const [looseItems, setLooseItems] = useState<LooseItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data - Menú del día (esto vendría de la API en producción)
  const dailyMenu = {
    principio: "Frijoles con plátano maduro",
    sopa: "Sopa de verduras",
    jugo: "Limonada natural",
    postre: "Gelatina",
  };

  // Mock data - Proteínas disponibles
  const proteins: ProteinOption[] = useMemo(
    () => [
      { id: 1, name: "Carne a la plancha", price: 10000, icon: "beef", isAvailable: true },
      { id: 2, name: "Chuleta de cerdo", price: 10000, icon: "pork", isAvailable: true },
      { id: 3, name: "Pollo asado", price: 10000, icon: "chicken", isAvailable: true },
      { id: 4, name: "Carne de res", price: 11000, icon: "beef", isAvailable: true },
      { id: 5, name: "Pescado frito", price: 11000, icon: "fish", isAvailable: true },
      { id: 6, name: "Pollo apanado", price: 10000, icon: "chicken", isAvailable: true },
    ],
    []
  );

  // Mock data - Componentes disponibles para sustituciones/adicionales
  const availableComponents = useMemo(
    () => [
      { id: 101, name: "Porción de principio", type: "principio" as const, price: 0 },
      { id: 102, name: "Porción de ensalada", type: "ensalada" as const, price: 0 },
      { id: 103, name: "Porción de papa", type: "adicional" as const, price: 0 },
      { id: 104, name: "Porción de plátano", type: "adicional" as const, price: 0 },
      { id: 201, name: "Huevo", type: "adicional" as const, price: 2000 },
      { id: 202, name: "Huevo doble", type: "adicional" as const, price: 3500 },
      { id: 203, name: "Porción extra de principio", type: "principio" as const, price: 3000 },
      { id: 204, name: "Porción extra de ensalada", type: "ensalada" as const, price: 2500 },
      { id: 205, name: "Porción de aguacate", type: "adicional" as const, price: 3000 },
    ],
    []
  );

  // Productos sueltos filtrados
  const filteredLooseItems = useMemo(() => {
    if (!menuItems) return [];
    return menuItems.filter(
      (item) =>
        item.isAvailable &&
        (searchTerm === "" ||
          item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [menuItems, searchTerm]);

  // Cálculo del total
  const orderTotal = useMemo(() => {
    let total = 0;

    // Almuerzo base con proteína
    if (selectedProtein) {
      total += selectedProtein.price;
    }

    // Adicionales (con costo)
    additionals.forEach((item) => {
      total += item.price * item.quantity;
    });

    // Productos sueltos
    looseItems.forEach((item) => {
      total += item.price * item.quantity;
    });

    return total;
  }, [selectedProtein, additionals, looseItems]);

  // Items para el resumen
  const summaryItems = useMemo(() => {
    const items = [];

    if (selectedProtein) {
      items.push({
        name: "Almuerzo Completo",
        quantity: 1,
        unitPrice: selectedProtein.price,
        totalPrice: selectedProtein.price,
        type: "base" as const,
      });
      items.push({
        name: selectedProtein.name,
        quantity: 1,
        unitPrice: selectedProtein.price,
        totalPrice: selectedProtein.price,
        type: "protein" as const,
      });
    }

    substitutions.forEach((sub) => {
      items.push({
        name: `Sust: ${sub.from} → ${sub.to}`,
        quantity: 1,
        unitPrice: 0,
        totalPrice: 0,
        type: "substitution" as const,
      });
    });

    additionals.forEach((item) => {
      items.push({
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.price,
        totalPrice: item.price * item.quantity,
        type: "additional" as const,
      });
    });

    looseItems.forEach((item) => {
      items.push({
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.price,
        totalPrice: item.price * item.quantity,
        type: "additional" as const,
      });
    });

    return items;
  }, [selectedProtein, substitutions, additionals, looseItems]);

  // Handlers
  const handleAddSubstitution = (from: Substitution["from"], to: Substitution["to"]) => {
    setSubstitutions((prev) => [...prev, { from, to, quantity: 1 }]);
  };

  const handleRemoveSubstitution = (index: number) => {
    setSubstitutions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddAdditional = (component: Omit<AdditionalItem, "quantity">) => {
    const existing = additionals.find((a) => a.id === component.id);
    if (existing) {
      setAdditionals((prev) =>
        prev.map((a) =>
          a.id === component.id ? { ...a, quantity: a.quantity + 1 } : a
        )
      );
    } else {
      setAdditionals((prev) => [...prev, { ...component, quantity: 1 }]);
    }
  };

  const handleUpdateAdditionalQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      setAdditionals((prev) => prev.filter((a) => a.id !== id));
    } else {
      setAdditionals((prev) =>
        prev.map((a) => (a.id === id ? { ...a, quantity } : a))
      );
    }
  };

  const handleRemoveAdditional = (id: number) => {
    setAdditionals((prev) => prev.filter((a) => a.id !== id));
  };

  const handleAddLooseItem = (item: { id: number; name: string; price: number }) => {
    const existing = looseItems.find((i) => i.id === item.id);
    if (existing) {
      setLooseItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i))
      );
    } else {
      setLooseItems((prev) => [...prev, { ...item, quantity: 1 }]);
    }
  };

  const handleUpdateLooseItemQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      setLooseItems((prev) => prev.filter((i) => i.id !== id));
    } else {
      setLooseItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)));
    }
  };

  const handleRemoveLooseItem = (id: number) => {
    setLooseItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleDuplicate = () => {
    const currentOrder = {
      orderType,
      selectedTable,
      selectedProtein,
      substitutions,
      additionals,
      looseItems,
    };

    handleSubmit();

    setTimeout(() => {
      setOrderType(currentOrder.orderType);
      setSelectedTable(currentOrder.selectedTable);
      setSelectedProtein(currentOrder.selectedProtein);
      setSubstitutions(currentOrder.substitutions);
      setAdditionals(currentOrder.additionals);
      setLooseItems(currentOrder.looseItems);
      toast.success("Pedido duplicado", {
        description: "Se creó el pedido y se preparó uno igual para el siguiente cliente",
      });
    }, 500);
  };

  const handleSubmit = () => {
    if (!selectedProtein && looseItems.length === 0) {
      toast.error("Selecciona al menos una proteína o un producto");
      return;
    }

    if (orderType === OrderType.DINE_IN && !selectedTable) {
      toast.error("Selecciona una mesa para el pedido");
      return;
    }

    const items = [];

    if (selectedProtein) {
      items.push({
        menuItemId: selectedProtein.id,
        quantity: 1,
        priceAtOrder: selectedProtein.price,
        notes: `Almuerzo con ${selectedProtein.name}`,
      });
    }

    additionals.forEach((item) => {
      items.push({
        menuItemId: item.id,
        quantity: item.quantity,
        priceAtOrder: item.price,
        notes: item.name,
      });
    });

    looseItems.forEach((item) => {
      items.push({
        menuItemId: item.id,
        quantity: item.quantity,
        priceAtOrder: item.price,
        notes: item.name,
      });
    });

    createOrder(
      {
        type: orderType,
        tableId: orderType === OrderType.DINE_IN && selectedTable ? selectedTable : undefined,
        items,
      },
      {
        onSuccess: (order) => {
          toast.success("Pedido creado exitosamente", {
            description: `Total: $${orderTotal.toLocaleString("es-CO")}`,
          });
          navigate(getOrderDetailRoute(order.id));
        },
        onError: (error: any) => {
          toast.error("Error al crear pedido", {
            description: error.response?.data?.message || error.message,
          });
        },
      }
    );
  };

  return (
    <SidebarLayout
      title="Nuevo Pedido - Corrientazo"
      subtitle="Selecciona proteína y personaliza el almuerzo"
      backRoute={ROUTES.ORDERS}
      fullWidth
    >
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <DailyMenuSection
              principio={dailyMenu.principio}
              sopa={dailyMenu.sopa}
              jugo={dailyMenu.jugo}
              postre={dailyMenu.postre}
            />

            <ProteinSelector
              proteins={proteins}
              selectedProteinId={selectedProtein?.id}
              onSelect={setSelectedProtein}
              basePrice={10000}
            />

            {orderType === OrderType.DINE_IN && (
              <Card className="p-4 sm:p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-carbon-900">Seleccionar Mesa</h3>
                  {selectedTable && (
                    <span className="text-sm text-sage-600 font-medium">
                      Mesa {selectedTable}
                    </span>
                  )}
                </div>
                <TableSelector
                  tables={availableTables}
                  onSelect={(table) => setSelectedTable(table.id)}
                  selectedTableId={selectedTable || undefined}
                  showOnlyAvailable
                />
              </Card>
            )}

            {selectedProtein && (
              <PlateCustomizer
                substitutions={substitutions}
                additionals={additionals}
                onAddSubstitution={handleAddSubstitution}
                onRemoveSubstitution={handleRemoveSubstitution}
                onAddAdditional={handleAddAdditional}
                onUpdateAdditionalQuantity={handleUpdateAdditionalQuantity}
                onRemoveAdditional={handleRemoveAdditional}
                availableComponents={availableComponents}
              />
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <Card className="p-4 sm:p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-carbon-900">Productos Sueltos</h3>
                <span className="text-sm text-carbon-500">
                  {filteredLooseItems.length} disponibles
                </span>
              </div>

              <div className="relative mb-4">
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

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {filteredLooseItems.slice(0, 6).map((item) => (
                  <button
                    key={item.id}
                    onClick={() =>
                      handleAddLooseItem({
                        id: item.id,
                        name: item.name,
                        price: Number(item.price),
                      })
                    }
                    className="p-3 rounded-xl border-2 border-sage-200 bg-white hover:border-sage-400 hover:bg-sage-50 transition-all text-left"
                  >
                    <p className="font-medium text-carbon-900 text-sm line-clamp-2">{item.name}</p>
                    <p className="text-sage-700 font-semibold mt-1">
                      ${Number(item.price).toLocaleString("es-CO")}
                    </p>
                  </button>
                ))}
              </div>

              {looseItems.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-carbon-700">Agregados:</p>
                  {looseItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-sage-50 rounded-xl"
                    >
                      <div>
                        <p className="font-medium text-carbon-900">{item.name}</p>
                        <p className="text-sm text-sage-700">
                          ${item.price.toLocaleString("es-CO")} c/u
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateLooseItemQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 rounded-lg bg-white text-carbon-700 hover:bg-sage-100"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <span className="w-6 text-center font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateLooseItemQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 rounded-lg bg-white text-carbon-700 hover:bg-sage-100"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleRemoveLooseItem(item.id)}
                          className="p-1.5 text-carbon-400 hover:text-rose-500 ml-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <OrderSummary
              items={summaryItems}
              total={orderTotal}
              onDuplicate={handleDuplicate}
            />

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleSubmit}
              disabled={isPending || (!selectedProtein && looseItems.length === 0)}
              isLoading={isPending}
              className="min-h-[56px] text-lg"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Crear Pedido - ${orderTotal.toLocaleString("es-CO")}
            </Button>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
