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
import { Search, ShoppingBag, Plus, Trash2, ChevronDown, ChevronUp, MapPin, UtensilsCrossed, ShoppingBag as ShoppingBagIcon, Bike } from "lucide-react";
import { cn } from "@/utils/cn";

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
 * 1. Tipo de pedido + Mesa (si aplica) - PRIMERO
 * 2. Menú del día - COLAPSABLE
 * 3. Proteínas - DESTACADO
 * 4. Personalización y productos
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
  const [showDailyMenu, setShowDailyMenu] = useState(false);
  const [showTableSelector, setShowTableSelector] = useState(false);

  // Mock data - Menú del día
  const dailyMenu = {
    principio: "Frijoles con plátano maduro",
    sopa: "Sopa de verduras",
    jugo: "Limonada natural",
    postre: "Gelatina",
  };

  // Mock data - Proteínas
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

  // Mock data - Componentes
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
    if (selectedProtein) {
      total += selectedProtein.price;
    }
    additionals.forEach((item) => {
      total += item.price * item.quantity;
    });
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

  // Check if we can duplicate
  const canDuplicate = selectedProtein || looseItems.length > 0;

  return (
    <SidebarLayout
      title="Nuevo Pedido - Corrientazo"
      subtitle="Selecciona mesa y proteína"
      backRoute={ROUTES.ORDERS}
      fullWidth
      actions={
        canDuplicate ? (
          <button
            onClick={handleDuplicate}
            disabled={isPending}
            className="flex items-center gap-2 px-4 py-2 bg-sage-100 text-sage-700 rounded-lg font-medium hover:bg-sage-200 transition-colors disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
            </svg>
            <span className="hidden sm:inline">Duplicar</span>
          </button>
        ) : undefined
      }
    >
      <div className="max-w-[1600px] mx-auto space-y-6">
        
        {/* STEP 1: Order Type & Table Selection */}
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-sage-600 to-sage-500 px-4 py-3 sm:px-6 sm:py-4">
            <h2 className="text-white font-semibold text-lg flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Paso 1: Ubicación del Pedido
            </h2>
          </div>
          
          <div className="p-4 sm:p-6 space-y-4">
            {/* Order Type */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { type: OrderType.DINE_IN, label: "Aquí", icon: UtensilsCrossed },
                { type: OrderType.TAKE_OUT, label: "Llevar", icon: ShoppingBagIcon },
                { type: OrderType.DELIVERY, label: "Domicilio", icon: Bike },
              ].map(({ type, label, icon: Icon }) => (
                <button
                  key={type}
                  onClick={() => {
                    setOrderType(type);
                    if (type !== OrderType.DINE_IN) {
                      setSelectedTable(null);
                      setShowTableSelector(false);
                    }
                  }}
                  className={cn(
                    "p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2",
                    orderType === type
                      ? "border-sage-500 bg-sage-50 text-sage-700 shadow-sm"
                      : "border-sage-200 bg-white text-carbon-600 hover:border-sage-300"
                  )}
                >
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                  <span className="font-semibold text-sm sm:text-base">{label}</span>
                </button>
              ))}
            </div>

            {/* Table Selection (only for DINE_IN) */}
            {orderType === OrderType.DINE_IN && (
              <div className="pt-4 border-t border-sage-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-carbon-900">Seleccionar Mesa</h3>
                    {selectedTable && (
                      <span className="px-3 py-1 bg-sage-100 text-sage-700 rounded-full text-sm font-medium">
                        Mesa {selectedTable} seleccionada
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setShowTableSelector(!showTableSelector)}
                    className="text-sm text-sage-600 hover:text-sage-800 font-medium flex items-center gap-1"
                  >
                    {showTableSelector ? (
                      <>
                        Ocultar mesas <ChevronUp className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        Ver mesas <ChevronDown className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
                
                {showTableSelector && (
                  <TableSelector
                    tables={availableTables}
                    onSelect={(table) => {
                      setSelectedTable(table.id);
                      setShowTableSelector(false);
                    }}
                    selectedTableId={selectedTable || undefined}
                    showOnlyAvailable
                  />
                )}
              </div>
            )}
          </div>
        </Card>

        {/* STEP 2: Daily Menu (Collapsible) */}
        <Card className="overflow-hidden">
          <button
            onClick={() => setShowDailyMenu(!showDailyMenu)}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-400 px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between hover:from-amber-600 hover:to-amber-500 transition-colors"
          >
            <div className="flex items-center gap-2">
              <UtensilsCrossed className="w-5 h-5 text-white" />
              <h2 className="text-white font-semibold text-lg">Paso 2: Menú del Día</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-amber-100 text-sm hidden sm:inline">Toca para {showDailyMenu ? "ocultar" : "ver"}</span>
              {showDailyMenu ? (
                <ChevronUp className="w-5 h-5 text-white" />
              ) : (
                <ChevronDown className="w-5 h-5 text-white" />
              )}
            </div>
          </button>
          
          {showDailyMenu && (
            <DailyMenuSection
              principio={dailyMenu.principio}
              sopa={dailyMenu.sopa}
              jugo={dailyMenu.jugo}
              postre={dailyMenu.postre}
            />
          )}
          
          {!showDailyMenu && (
            <div className="p-4 bg-amber-50/50">
              <p className="text-sm text-carbon-600">
                <span className="font-medium">Hoy:</span> {dailyMenu.principio}, {dailyMenu.sopa}, {dailyMenu.jugo}
              </p>
            </div>
          )}
        </Card>

        {/* STEP 3: Protein Selection */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Protein & Customization */}
          <div className="space-y-6">
            <Card className="overflow-hidden border-2 border-sage-300">
              <div className="bg-gradient-to-r from-sage-600 to-sage-500 px-4 py-3 sm:px-6 sm:py-4">
                <h2 className="text-white font-semibold text-lg">Paso 3: Selecciona la Proteína</h2>
                <p className="text-sage-100 text-sm mt-1">Elige la proteína principal del almuerzo</p>
              </div>
              <div className="p-4 sm:p-6">
                <ProteinSelector
                  proteins={proteins}
                  selectedProteinId={selectedProtein?.id}
                  onSelect={setSelectedProtein}
                  basePrice={10000}
                />
              </div>
            </Card>

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

          {/* Right: Loose Items & Summary */}
          <div className="space-y-6">
            <Card className="p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-carbon-900 mb-4">Productos Sueltos</h3>
              
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

            {/* Action Buttons */}
            <div className="space-y-3">
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
              
              {/* Quick Duplicate Button - Only show when there's something to duplicate */}
              {(selectedProtein || looseItems.length > 0) && (
                <Button
                  variant="outline"
                  size="lg"
                  fullWidth
                  onClick={handleDuplicate}
                  disabled={isPending}
                  className="min-h-[48px] border-2 border-sage-300 text-sage-700 hover:bg-sage-50"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                  </svg>
                  Crear y Preparar Otro Igual
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
