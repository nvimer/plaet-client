import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { OrderType } from "@/types";
import { SidebarLayout } from "@/layouts/SidebarLayout";
import { Button, Card, Input } from "@/components";
import { useTables } from "@/features/tables";
import { useItems } from "@/features/menu";
import { useCreateOrder } from "../hooks";
import { ROUTES } from "@/app/routes";
import { toast } from "sonner";
import {
  DailyMenuSection,
  ProteinSelector,
  PlateCustomizer,
} from "../components";
import { TableSelector } from "@/features/tables";
import { Search, ShoppingBag, Plus, Trash2, ChevronDown, ChevronUp, Users, Edit2, Check, X, ArrowLeft, UtensilsCrossed, Bike } from "lucide-react";
import { cn } from "@/utils/cn";

// Types
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

interface TableOrder {
  id: string;
  protein: ProteinOption;
  substitutions: Substitution[];
  additionals: AdditionalItem[];
  looseItems: LooseItem[];
  total: number;
  notes?: string;
}

/**
 * OrderCreatePage - Multi-diner Edition
 * 
 * Flujo para mesas con múltiples comensales:
 * 1. Seleccionar mesa (una vez)
 * 2. Agregar pedidos uno por uno
 * 3. Ver lista de pedidos de la mesa
 * 4. Confirmar todos juntos o individualmente
 */
export function OrderCreatePage() {
  const navigate = useNavigate();
  const { data: tablesData } = useTables();
  const { data: menuItems } = useItems();
  const { mutate: createOrder, isPending } = useCreateOrder();

  const tables = tablesData?.tables || [];
  const availableTables = tables.filter((t) => t.status === "AVAILABLE");

  // Estado del tipo de pedido y mesa
  const [selectedOrderType, setSelectedOrderType] = useState<OrderType | null>(null);
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [tableOrders, setTableOrders] = useState<TableOrder[]>([]);
  const [currentOrderIndex, setCurrentOrderIndex] = useState<number | null>(null);
  
  // Estado del pedido actual
  const [selectedProtein, setSelectedProtein] = useState<ProteinOption | null>(null);
  const [substitutions, setSubstitutions] = useState<Substitution[]>([]);
  const [additionals, setAdditionals] = useState<AdditionalItem[]>([]);
  const [looseItems, setLooseItems] = useState<LooseItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDailyMenu, setShowDailyMenu] = useState(false);
  const [orderNotes, setOrderNotes] = useState("");

  // Mock data - Daily Menu
  const dailyMenu = {
    side: "Frijoles con plátano maduro",
    soup: "Sopa de verduras",
    drink: "Limonada natural",
    dessert: "Gelatina",
  };

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

  const filteredLooseItems = useMemo(() => {
    if (!menuItems) return [];
    return menuItems.filter(
      (item) =>
        item.isAvailable &&
        (searchTerm === "" ||
          item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [menuItems, searchTerm]);

  // Calcular total del pedido actual
  const currentOrderTotal = useMemo(() => {
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

  // Calcular total de la mesa
  const tableTotal = useMemo(() => {
    return tableOrders.reduce((sum, order) => sum + order.total, 0);
  }, [tableOrders]);

  // Handlers para personalización
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

  // Agregar pedido a la mesa
  const handleAddOrderToTable = () => {
    if (!selectedProtein && looseItems.length === 0) {
      toast.error("Selecciona al menos una proteína o un producto");
      return;
    }

    const newOrder: TableOrder = {
      id: Date.now().toString(),
      protein: selectedProtein!,
      substitutions: [...substitutions],
      additionals: [...additionals],
      looseItems: [...looseItems],
      total: currentOrderTotal,
      notes: orderNotes,
    };

    if (currentOrderIndex !== null) {
      // Editando pedido existente
      setTableOrders((prev) =>
        prev.map((order, idx) => (idx === currentOrderIndex ? newOrder : order))
      );
      toast.success("Pedido actualizado");
    } else {
      // Nuevo pedido
      setTableOrders((prev) => [...prev, newOrder]);
      toast.success(`Pedido #${tableOrders.length + 1} agregado a la mesa`);
    }

    // Limpiar para siguiente pedido
    clearCurrentOrder();
  };

  // Limpiar pedido actual
  const clearCurrentOrder = () => {
    setSelectedProtein(null);
    setSubstitutions([]);
    setAdditionals([]);
    setLooseItems([]);
    setOrderNotes("");
    setCurrentOrderIndex(null);
    setSearchTerm("");
  };

  // Editar pedido existente
  const handleEditOrder = (index: number) => {
    const order = tableOrders[index];
    setCurrentOrderIndex(index);
    setSelectedProtein(order.protein);
    setSubstitutions([...order.substitutions]);
    setAdditionals([...order.additionals]);
    setLooseItems([...order.looseItems]);
    setOrderNotes(order.notes || "");
    
    // Scroll al formulario
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Eliminar pedido
  const handleRemoveOrder = (index: number) => {
    setTableOrders((prev) => prev.filter((_, i) => i !== index));
    toast.success("Pedido eliminado");
  };

  // Duplicar pedido
  const handleDuplicateOrder = (index: number) => {
    const order = tableOrders[index];
    const duplicatedOrder: TableOrder = {
      ...order,
      id: Date.now().toString(),
    };
    setTableOrders((prev) => [...prev, duplicatedOrder]);
    toast.success("Pedido duplicado");
  };

  // Confirmar todos los pedidos de la mesa
  const handleConfirmTableOrders = async () => {
    if (tableOrders.length === 0) {
      toast.error("No hay pedidos para confirmar");
      return;
    }

    if (!selectedTable) {
      toast.error("Selecciona una mesa primero");
      return;
    }

    // Crear todos los pedidos
    const promises = tableOrders.map((order) => {
      const items: Array<{
        menuItemId: number;
        quantity: number;
        priceAtOrder: number;
        notes: string;
      }> = [];
      
      if (order.protein) {
        items.push({
          menuItemId: order.protein.id,
          quantity: 1,
          priceAtOrder: order.protein.price,
          notes: `Almuerzo con ${order.protein.name}${order.notes ? ` - ${order.notes}` : ""}`,
        });
      }

      order.additionals.forEach((item) => {
        items.push({
          menuItemId: item.id,
          quantity: item.quantity,
          priceAtOrder: item.price,
          notes: item.name,
        });
      });

      order.looseItems.forEach((item) => {
        items.push({
          menuItemId: item.id,
          quantity: item.quantity,
          priceAtOrder: item.price,
          notes: item.name,
        });
      });

      return new Promise((resolve) => {
        createOrder(
          {
            type: selectedOrderType!,
            tableId: selectedOrderType === OrderType.DINE_IN ? selectedTable : undefined,
            items,
          },
          {
            onSuccess: resolve,
            onError: (error: any) => {
              toast.error("Error en pedido", {
                description: error.response?.data?.message || error.message,
              });
              resolve(null);
            },
          }
        );
      });
    });

    await Promise.all(promises);
    
    const successMessage = selectedOrderType === OrderType.DINE_IN 
      ? `${tableOrders.length} pedidos creados para Mesa ${selectedTable}`
      : `${tableOrders.length} pedidos creados para ${selectedOrderType === OrderType.TAKE_OUT ? 'Llevar' : 'Domicilio'}`;
    
    toast.success(successMessage, {
      description: `Total: $${tableTotal.toLocaleString("es-CO")}`,
    });
    
    // Limpiar todo
    setTableOrders([]);
    setSelectedTable(null);
    setSelectedOrderType(null);
    clearCurrentOrder();
    
    navigate(ROUTES.ORDERS);
  };

  // Cancelar edición
  const handleCancelEdit = () => {
    clearCurrentOrder();
    toast.info("Edición cancelada");
  };

  // Handler para seleccionar tipo de pedido
  const handleSelectOrderType = (type: OrderType) => {
    setSelectedOrderType(type);
  };

  // Handler para volver a seleccionar tipo de pedido
  const handleBackToOrderType = () => {
    setSelectedOrderType(null);
    setSelectedTable(null);
  };

  // Render
  // Paso 1: Seleccionar tipo de pedido
  if (!selectedOrderType) {
    return (
      <SidebarLayout
        title="Nuevo Pedido - Corrientazo"
        subtitle="Selecciona el tipo de pedido"
        backRoute={ROUTES.ORDERS}
        fullWidth
      >
        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-sage-600 to-sage-500 px-4 py-6 sm:px-8 sm:py-8">
              <h2 className="text-white font-semibold text-2xl flex items-center gap-3">
                <ShoppingBag className="w-7 h-7" />
                Tipo de Pedido
              </h2>
              <p className="text-sage-100 mt-2">
                Selecciona cómo se servirá el pedido
              </p>
            </div>
            
            <div className="p-4 sm:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Aquí (DINE_IN) */}
                <button
                  onClick={() => handleSelectOrderType(OrderType.DINE_IN)}
                  className="flex flex-col items-center justify-center p-8 rounded-xl border-2 border-sage-200 bg-white hover:border-sage-400 hover:bg-sage-50 transition-all group"
                >
                  <div className="w-20 h-20 rounded-full bg-sage-100 text-sage-600 flex items-center justify-center mb-4 group-hover:bg-sage-200 transition-colors">
                    <UtensilsCrossed className="w-10 h-10" />
                  </div>
                  <span className="text-xl font-semibold text-carbon-900">Aquí</span>
                  <span className="text-sm text-carbon-500 mt-1">Comer en el restaurante</span>
                </button>

                {/* Llevar (TAKE_OUT) */}
                <button
                  onClick={() => handleSelectOrderType(OrderType.TAKE_OUT)}
                  className="flex flex-col items-center justify-center p-8 rounded-xl border-2 border-sage-200 bg-white hover:border-sage-400 hover:bg-sage-50 transition-all group"
                >
                  <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-4 group-hover:bg-amber-200 transition-colors">
                    <ShoppingBag className="w-10 h-10" />
                  </div>
                  <span className="text-xl font-semibold text-carbon-900">Llevar</span>
                  <span className="text-sm text-carbon-500 mt-1">Para recoger</span>
                </button>

                {/* Domicilio (DELIVERY) */}
                <button
                  onClick={() => handleSelectOrderType(OrderType.DELIVERY)}
                  className="flex flex-col items-center justify-center p-8 rounded-xl border-2 border-sage-200 bg-white hover:border-sage-400 hover:bg-sage-50 transition-all group"
                >
                  <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                    <Bike className="w-10 h-10" />
                  </div>
                  <span className="text-xl font-semibold text-carbon-900">Domicilio</span>
                  <span className="text-sm text-carbon-500 mt-1">Entrega a domicilio</span>
                </button>
              </div>
            </div>
          </Card>
        </div>
      </SidebarLayout>
    );
  }

  // Paso 2: Si es DINE_IN y no hay mesa seleccionada, mostrar selector de mesa
  if (selectedOrderType === OrderType.DINE_IN && !selectedTable) {
    return (
      <SidebarLayout
        title="Nuevo Pedido - Corrientazo"
        subtitle="Selecciona la mesa para tomar el pedido"
        backRoute={ROUTES.ORDERS}
        fullWidth
        actions={
          <button
            onClick={handleBackToOrderType}
            className="flex items-center gap-2 px-4 py-2 bg-sage-100 text-sage-700 rounded-lg font-medium hover:bg-sage-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Cambiar Tipo
          </button>
        }
      >
        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-sage-600 to-sage-500 px-4 py-6 sm:px-8 sm:py-8">
              <h2 className="text-white font-semibold text-2xl flex items-center gap-3">
                <Users className="w-7 h-7" />
                Seleccionar Mesa
              </h2>
              <p className="text-sage-100 mt-2">
                Elige la mesa donde vas a tomar los pedidos de los comensales
              </p>
            </div>
            
            <div className="p-4 sm:p-8">
              <TableSelector
                tables={availableTables}
                onSelect={(table) => setSelectedTable(table.id)}
                selectedTableId={selectedTable || undefined}
                showOnlyAvailable
              />
            </div>
          </Card>
        </div>
      </SidebarLayout>
    );
  }

  // Determinar título y acciones según el tipo de pedido
  const getOrderFormTitle = () => {
    if (selectedOrderType === OrderType.DINE_IN) {
      return `Mesa ${selectedTable} - ${tableOrders.length} pedido${tableOrders.length !== 1 ? 's' : ''}`;
    }
    return `${selectedOrderType === OrderType.TAKE_OUT ? 'Llevar' : 'Domicilio'} - ${tableOrders.length} pedido${tableOrders.length !== 1 ? 's' : ''}`;
  };

  const getOrderFormSubtitle = () => {
    return `Total: $${tableTotal.toLocaleString("es-CO")}`;
  };

  return (
    <SidebarLayout
      title={getOrderFormTitle()}
      subtitle={getOrderFormSubtitle()}
      backRoute={ROUTES.ORDERS}
      fullWidth
      actions={
        <button
          onClick={handleBackToOrderType}
          className="flex items-center gap-2 px-4 py-2 bg-sage-100 text-sage-700 rounded-lg font-medium hover:bg-sage-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {selectedOrderType === OrderType.DINE_IN ? 'Cambiar Mesa' : 'Cambiar Tipo'}
        </button>
      }
    >
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT: Formulario de pedido actual */}
          <div className="lg:col-span-7 space-y-6">
            {/* Header del pedido actual */}
            <Card className="overflow-hidden">
              <div className={cn(
                "px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between",
                currentOrderIndex !== null 
                  ? "bg-gradient-to-r from-amber-500 to-amber-400" 
                  : "bg-gradient-to-r from-sage-600 to-sage-500"
              )}>
                <div>
                  <h2 className="text-white font-semibold text-lg flex items-center gap-2">
                    {currentOrderIndex !== null ? (
                      <>
                        <Edit2 className="w-5 h-5" />
                        Editando Pedido #{currentOrderIndex + 1}
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5" />
                        Pedido #{tableOrders.length + 1}
                        {selectedOrderType === OrderType.DINE_IN && ` para Mesa ${selectedTable}`}
                      </>
                    )}
                  </h2>
                  <p className="text-white/80 text-sm mt-0.5">
                    {currentOrderIndex !== null 
                      ? "Modifica el pedido existente" 
                      : selectedOrderType === OrderType.DINE_IN 
                        ? "Agrega un nuevo pedido a la mesa"
                        : "Agrega un nuevo pedido"}
                  </p>
                </div>
                {currentOrderIndex !== null && (
                  <button
                    onClick={handleCancelEdit}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </Card>

            {/* Menú del día colapsable */}
            <Card className="overflow-hidden">
              <button
                onClick={() => setShowDailyMenu(!showDailyMenu)}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-400 px-4 py-3 sm:px-6 flex items-center justify-between hover:from-amber-600 hover:to-amber-500 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-white font-semibold">Menú del Día</span>
                  <span className="text-amber-100 text-sm hidden sm:inline">
                    ({dailyMenu.side}, {dailyMenu.soup}, {dailyMenu.drink})
                  </span>
                </div>
                {showDailyMenu ? (
                  <ChevronUp className="w-5 h-5 text-white" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-white" />
                )}
              </button>
              {showDailyMenu && (
                <DailyMenuSection
                  side={dailyMenu.side}
                  soup={dailyMenu.soup}
                  drink={dailyMenu.drink}
                  dessert={dailyMenu.dessert}
                />
              )}
            </Card>

            {/* Selector de proteína */}
            <Card className="p-4 sm:p-6 border-2 border-sage-300">
              <h3 className="text-lg font-semibold text-carbon-900 mb-4">Selecciona la Proteína</h3>
              <ProteinSelector
                proteins={proteins}
                selectedProteinId={selectedProtein?.id}
                onSelect={setSelectedProtein}
                basePrice={10000}
              />
            </Card>

            {/* Personalización */}
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

            {/* Productos sueltos */}
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

            {/* Notas del pedido */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-carbon-700">Notas (opcional):</label>
              <Input
                type="text"
                placeholder="Ej: Sin sal, bien cocido, etc."
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                fullWidth
              />
            </div>

            {/* Botón agregar/actualizar */}
            <div className="flex gap-3">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleAddOrderToTable}
                disabled={!selectedProtein && looseItems.length === 0}
                className="min-h-[56px] text-lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                {currentOrderIndex !== null ? "Actualizar Pedido" : "Agregar a la Mesa"}
                {currentOrderTotal > 0 && ` - $${currentOrderTotal.toLocaleString("es-CO")}`}
              </Button>
            </div>
          </div>

          {/* RIGHT: Lista de pedidos de la mesa */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="overflow-hidden sticky top-4">
              <div className="bg-gradient-to-r from-sage-600 to-sage-500 px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-white font-semibold text-xl flex items-center gap-2">
                      <ShoppingBag className="w-6 h-6" />
                      {selectedOrderType === OrderType.DINE_IN ? 'Pedidos de la Mesa' : 'Pedidos'}
                    </h2>
                    <p className="text-sage-100 text-sm mt-1">
                      {tableOrders.length} pedido{tableOrders.length !== 1 ? 's' : ''} agregado{tableOrders.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">
                      ${tableTotal.toLocaleString("es-CO")}
                    </p>
                    <p className="text-sage-100 text-xs">{selectedOrderType === OrderType.DINE_IN ? 'Total mesa' : 'Total'}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto">
                {tableOrders.length === 0 ? (
                  <div className="text-center py-8 text-carbon-500">
                    <p className="text-sm">No hay pedidos aún</p>
                    <p className="text-xs mt-1">Agrega el primer pedido desde el formulario</p>
                  </div>
                ) : (
                  tableOrders.map((order, index) => (
                    <div
                      key={order.id}
                      className={cn(
                        "p-4 rounded-xl border-2 transition-all",
                        currentOrderIndex === index
                          ? "border-amber-400 bg-amber-50"
                          : "border-sage-200 bg-white"
                      )}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-8 h-8 rounded-full bg-sage-100 text-sage-700 flex items-center justify-center font-bold text-sm">
                            {index + 1}
                          </span>
                          <div>
                            <p className="font-semibold text-carbon-900">{order.protein.name}</p>
                            <p className="text-sm text-sage-700 font-medium">
                              ${order.total.toLocaleString("es-CO")}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleEditOrder(index)}
                            className="p-1.5 text-carbon-400 hover:text-sage-600 hover:bg-sage-100 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDuplicateOrder(index)}
                            className="p-1.5 text-carbon-400 hover:text-sage-600 hover:bg-sage-100 rounded-lg transition-colors"
                            title="Duplicar"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleRemoveOrder(index)}
                            className="p-1.5 text-carbon-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Detalles del pedido */}
                      <div className="text-xs text-carbon-600 space-y-1">
                        {order.substitutions.length > 0 && (
                          <p>
                            {order.substitutions.length} sustitución{order.substitutions.length !== 1 ? 'es' : ''}
                          </p>
                        )}
                        {order.additionals.length > 0 && (
                          <p>
                            {order.additionals.reduce((sum, a) => sum + a.quantity, 0)} adicional{order.additionals.reduce((sum, a) => sum + a.quantity, 0) !== 1 ? 'es' : ''}
                          </p>
                        )}
                        {order.looseItems.length > 0 && (
                          <p>
                            {order.looseItems.reduce((sum, i) => sum + i.quantity, 0)} producto{order.looseItems.reduce((sum, i) => sum + i.quantity, 0) !== 1 ? 's' : ''} suelto{order.looseItems.reduce((sum, i) => sum + i.quantity, 0) !== 1 ? 's' : ''}
                          </p>
                        )}
                        {order.notes && (
                          <p className="text-amber-600 italic">Nota: {order.notes}</p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Botón confirmar todos */}
              {tableOrders.length > 0 && (
                <div className="p-4 border-t border-sage-200 bg-sage-50">
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={handleConfirmTableOrders}
                    disabled={isPending}
                    isLoading={isPending}
                    className="min-h-[56px]"
                  >
                    <Check className="w-5 h-5 mr-2" />
                    Confirmar {tableOrders.length} Pedido{tableOrders.length !== 1 ? 's' : ''}
                    <span className="ml-2">(${tableTotal.toLocaleString("es-CO")})</span>
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
