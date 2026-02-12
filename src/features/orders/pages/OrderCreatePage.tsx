import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { OrderType } from "@/types";
import { SidebarLayout } from "@/layouts/SidebarLayout";
import { Button, Card, Input } from "@/components";
import { useTables } from "@/features/tables";
import { useItems } from "@/features/menu";
import { useDailyMenuToday } from "@/features/menu/hooks/useDailyMenu";
import { useCreateOrder } from "../hooks";
import { ROUTES } from "@/app/routes";
import { toast } from "sonner";
import {
  DailyMenuSection,
  ProteinSelector,
  MenuItemSelector,
  ReplacementManager,
  type Replacement,
} from "../components";
import { TableSelector } from "@/features/tables";
import { 
  Search, ShoppingBag, Plus, Trash2, ChevronDown, ChevronUp, 
  Users, Edit2, Check, X, ArrowLeft, UtensilsCrossed, Bike, 
  Sparkles, ChefHat, AlertCircle, Receipt, Clock
} from "lucide-react";
import { cn } from "@/utils/cn";

// Types
interface MenuOption {
  id: number;
  name: string;
}

interface ProteinOption {
  id: number;
  name: string;
  price: number;
  icon?: "beef" | "fish" | "chicken" | "pork" | "other";
  isAvailable: boolean;
  categoryName?: string;
}

interface LooseItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface LunchSelection {
  soup: MenuOption | null;
  principle: MenuOption | null;
  salad: MenuOption | null;
  drink: MenuOption | null;
  extra: MenuOption | null;
  protein: ProteinOption | null;
  rice: MenuOption | null;
  replacements: Replacement[];
}

interface TableOrder {
  id: string;
  protein: ProteinOption | null;
  lunch: LunchSelection | null;
  looseItems: LooseItem[];
  total: number;
  notes?: string;
  createdAt: number;
}

interface ValidationError {
  field: string;
  message: string;
}

/**
 * OrderCreatePage - Improved Edition
 * 
 * Key improvements:
 * - Integrated DailyMenu prices
 * - Better validation with visual feedback
 * - Order summary modal before confirm
 * - Improved error handling
 * - Touch-optimized UI (min 48px targets)
 * - Real-time price calculation
 */
export function OrderCreatePage() {
  const navigate = useNavigate();
  const { data: tablesData, isLoading: tablesLoading } = useTables();
  const { data: menuItems, isLoading: itemsLoading } = useItems();
  const { data: dailyMenuData, isLoading: menuLoading } = useDailyMenuToday();
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
  const [looseItems, setLooseItems] = useState<LooseItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDailyMenu, setShowDailyMenu] = useState(false);
  const [orderNotes, setOrderNotes] = useState("");
  
  // NEW: Lunch item selection state
  const [selectedSoup, setSelectedSoup] = useState<MenuOption | null>(null);
  const [selectedPrinciple, setSelectedPrinciple] = useState<MenuOption | null>(null);
  const [selectedSalad, setSelectedSalad] = useState<MenuOption | null>(null);
  const [selectedDrink, setSelectedDrink] = useState<MenuOption | null>(null);
  const [selectedExtra, setSelectedExtra] = useState<MenuOption | null>(null);
  const [selectedRice, setSelectedRice] = useState<MenuOption | null>(null);
  const [replacements, setReplacements] = useState<Replacement[]>([]);
  
  // UI State
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const [isQuickOrder, setIsQuickOrder] = useState(false);

  // Quick order popular products (hardcoded initially, could come from API)
  const popularProducts = [
    { id: 9991, name: "Huevo", price: 2000 },
    { id: 9992, name: "Gaseosa", price: 3500 },
    { id: 9993, name: "Papas", price: 3000 },
    { id: 9994, name: "Yuca", price: 2500 },
    { id: 9995, name: "Plátano", price: 2000 },
    { id: 9996, name: "Sopa", price: 5000 },
  ];

  // Daily Menu Prices - basePrice is now the margin added to protein price
  const dailyMenuPrices = useMemo(() => ({
    basePrice: dailyMenuData?.basePrice || 4000, // Base margin (e.g., $4,000)
    isConfigured: !!dailyMenuData,
  }), [dailyMenuData]);

  // Get proteins ONLY from daily menu configuration
  const proteins = useMemo(() => {
    if (!dailyMenuData?.proteinOptions || dailyMenuData.proteinOptions.length === 0) {
      return [];
    }
    
    // Use proteins from daily menu configuration only
    return dailyMenuData.proteinOptions.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      isAvailable: true,
      categoryName: dailyMenuData.proteinCategory?.name,
    }));
  }, [dailyMenuData]);

  const filteredLooseItems = useMemo(() => {
    if (!menuItems) return [];
    return menuItems.filter(
      (item) =>
        item.isAvailable &&
        (searchTerm === "" ||
          item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [menuItems, searchTerm]);

  // Build daily menu display from API data - ALL options
  const dailyMenuDisplay = useMemo(() => {
    if (!dailyMenuData) {
      return {
        soupOptions: [] as Array<{ id: number; name: string }>,
        principleOptions: [] as Array<{ id: number; name: string }>,
        saladOptions: [] as Array<{ id: number; name: string }>,
        extraOptions: [] as Array<{ id: number; name: string }>,
        drinkOptions: [] as Array<{ id: number; name: string }>,
        dessertOptions: [] as Array<{ id: number; name: string }>,
        basePrice: dailyMenuPrices.basePrice,
        isConfigured: false,
      };
    }
    
    // NEW: Get rice info from daily menu
    const riceOption = dailyMenuData.riceOptions && dailyMenuData.riceOptions.length > 0
      ? dailyMenuData.riceOptions[0]
      : null;
    
    return {
      soupOptions: dailyMenuData.soupOptions || [],
      principleOptions: dailyMenuData.principleOptions || [],
      saladOptions: dailyMenuData.saladOptions || [],
      extraOptions: dailyMenuData.extraOptions || [],
      drinkOptions: dailyMenuData.drinkOptions || [],
      dessertOptions: dailyMenuData.dessertOptions || [],
      riceOption, // NEW: Add rice
      basePrice: dailyMenuData.basePrice || dailyMenuPrices.basePrice,
      isConfigured: true,
    };
  }, [dailyMenuData, dailyMenuPrices]);

  // NEW: Calculate lunch price = basePrice (margin) + individual protein price
  const lunchPrice = useMemo(() => {
    if (!selectedProtein) return 0;
    
    // Lunch price = base margin + individual protein price
    // Example: $4,000 (base) + $6,000 (chicken) = $10,000
    // Example: $4,000 (base) + $7,000 (beef) = $11,000
    return dailyMenuPrices.basePrice + selectedProtein.price;
  }, [selectedProtein, dailyMenuPrices]);

  // Calcular total del pedido actual
  const currentOrderTotal = useMemo(() => {
    let total = 0;
    
    // Precio del almuerzo base
    total += lunchPrice;
    
    // Productos sueltos
    looseItems.forEach((item) => {
      total += item.price * item.quantity;
    });
    
    return total;
  }, [lunchPrice, looseItems]);

  // Calcular total de la mesa
  const tableTotal = useMemo(() => {
    return tableOrders.reduce((sum, order) => sum + order.total, 0);
  }, [tableOrders]);

  // Auto-select single options when daily menu loads
  useEffect(() => {
    if (dailyMenuDisplay.isConfigured) {
      // Auto-select soup if only 1 option
      if (dailyMenuDisplay.soupOptions.length === 1 && !selectedSoup) {
        setSelectedSoup(dailyMenuDisplay.soupOptions[0]);
      }
      // Auto-select principle if only 1 option
      if (dailyMenuDisplay.principleOptions.length === 1 && !selectedPrinciple) {
        setSelectedPrinciple(dailyMenuDisplay.principleOptions[0]);
      }
      // Auto-select salad if only 1 option
      if (dailyMenuDisplay.saladOptions.length === 1 && !selectedSalad) {
        setSelectedSalad(dailyMenuDisplay.saladOptions[0]);
      }
      // Auto-select drink if only 1 option
      if (dailyMenuDisplay.drinkOptions.length === 1 && !selectedDrink) {
        setSelectedDrink(dailyMenuDisplay.drinkOptions[0]);
      }
      // Auto-select extra if only 1 option
      if (dailyMenuDisplay.extraOptions.length === 1 && !selectedExtra) {
        setSelectedExtra(dailyMenuDisplay.extraOptions[0]);
      }
    }
  }, [dailyMenuDisplay, selectedSoup, selectedPrinciple, selectedSalad, selectedDrink, selectedExtra]);

  // Validation
  const validateOrder = (): ValidationError[] => {
    const errors: ValidationError[] = [];
    
    if (!selectedProtein && looseItems.length === 0) {
      errors.push({ field: "protein", message: "Selecciona una proteína o agrega productos" });
    }
    
    // NEW: Validate lunch items are selected (if protein is selected)
    if (selectedProtein) {
      if (dailyMenuDisplay.soupOptions.length > 0 && !selectedSoup) {
        errors.push({ field: "soup", message: "Selecciona una sopa" });
      }
      if (dailyMenuDisplay.principleOptions.length > 0 && !selectedPrinciple) {
        errors.push({ field: "principle", message: "Selecciona un principio" });
      }
      if (dailyMenuDisplay.saladOptions.length > 0 && !selectedSalad) {
        errors.push({ field: "salad", message: "Selecciona una ensalada" });
      }
      if (dailyMenuDisplay.drinkOptions.length > 0 && !selectedDrink) {
        errors.push({ field: "drink", message: "Selecciona un jugo" });
      }
      if (dailyMenuDisplay.extraOptions.length > 0 && !selectedExtra) {
        errors.push({ field: "extra", message: "Selecciona un extra" });
      }
    }
    
    if (selectedOrderType === OrderType.DINE_IN && !selectedTable) {
      errors.push({ field: "table", message: "Selecciona una mesa" });
    }
    
    return errors;
  };

  const hasError = (field: string) => {
    return validationErrors.some(e => e.field === field) && touchedFields.has(field);
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

  // NEW: Build detailed order notes with lunch selections
  const buildOrderNotes = (): string => {
    const parts: string[] = [];
    
    if (selectedProtein) {
      parts.push(`Almuerzo Ejecutivo:`);
      parts.push(`• Arroz: ${selectedRice?.name || dailyMenuDisplay.riceOption?.name || 'Arroz del día'}`);
      parts.push(`• Sopa: ${selectedSoup?.name || 'No seleccionada'}`);
      parts.push(`• Principio: ${selectedPrinciple?.name || 'No seleccionado'}`);
      parts.push(`• Ensalada: ${selectedSalad?.name || 'No seleccionada'}`);
      parts.push(`• Jugo: ${selectedDrink?.name || 'No seleccionado'}`);
      parts.push(`• Extra: ${selectedExtra?.name || 'No seleccionado'}`);
      parts.push(`• Proteína: ${selectedProtein.name}`);
      
      if (replacements.length > 0) {
        parts.push(`\nReemplazos:`);
        replacements.forEach(r => {
          parts.push(`• No ${r.fromName} → ${r.itemName} (${r.toName})`);
        });
      }
    }
    
    if (orderNotes) {
      parts.push(`\nNotas: ${orderNotes}`);
    }
    
    return parts.join('\n');
  };

  // Agregar pedido a la mesa
  const handleAddOrderToTable = () => {
    setTouchedFields(new Set(["protein", "soup", "principle", "salad", "drink", "extra"]));
    const errors = validateOrder();
    
    if (errors.length > 0) {
      setValidationErrors(errors);
      toast.error("Completa los campos requeridos");
      return;
    }

    // NEW: Create lunch selection object
    const lunchSelection: LunchSelection | null = selectedProtein ? {
      soup: selectedSoup,
      principle: selectedPrinciple,
      salad: selectedSalad,
      drink: selectedDrink,
      extra: selectedExtra,
      protein: selectedProtein,
      rice: selectedRice || dailyMenuDisplay.riceOption || null,
      replacements: [...replacements],
    } : null;

    const newOrder: TableOrder = {
      id: Date.now().toString(),
      protein: selectedProtein,
      lunch: lunchSelection,
      looseItems: [...looseItems],
      total: currentOrderTotal,
      notes: buildOrderNotes(),
      createdAt: Date.now(),
    };

    if (currentOrderIndex !== null) {
      setTableOrders((prev) =>
        prev.map((order, idx) => (idx === currentOrderIndex ? newOrder : order))
      );
      toast.success("Pedido actualizado");
    } else {
      setTableOrders((prev) => [...prev, newOrder]);
      toast.success(`Pedido #${tableOrders.length + 1} agregado`);
    }

    clearCurrentOrder();
    setValidationErrors([]);
    setTouchedFields(new Set());
  };

  // Limpiar pedido actual
  const clearCurrentOrder = () => {
    setSelectedProtein(null);
    setSelectedSoup(null);
    setSelectedPrinciple(null);
    setSelectedSalad(null);
    setSelectedDrink(null);
    setSelectedExtra(null);
    setSelectedRice(null);
    setReplacements([]);
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
    
    // NEW: Restore lunch selections if they exist
    if (order.lunch) {
      setSelectedSoup(order.lunch.soup);
      setSelectedPrinciple(order.lunch.principle);
      setSelectedSalad(order.lunch.salad);
      setSelectedDrink(order.lunch.drink);
      setSelectedExtra(order.lunch.extra);
      setSelectedRice(order.lunch.rice);
      setReplacements([...order.lunch.replacements]);
    }
    
    setLooseItems([...order.looseItems]);
    setOrderNotes(order.notes || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Eliminar pedido
  const handleRemoveOrder = (index: number) => {
    setTableOrders((prev) => prev.filter((_, i) => i !== index));
    if (currentOrderIndex === index) {
      clearCurrentOrder();
    }
    toast.success("Pedido eliminado");
  };

  // Duplicar pedido
  const handleDuplicateOrder = (index: number) => {
    const order = tableOrders[index];
    const duplicatedOrder: TableOrder = {
      ...order,
      id: Date.now().toString(),
      createdAt: Date.now(),
    };
    setTableOrders((prev) => [...prev, duplicatedOrder]);
    toast.success("Pedido duplicado");
  };

  // Mostrar resumen antes de confirmar
  const handleShowSummary = () => {
    if (tableOrders.length === 0) {
      toast.error("No hay pedidos para confirmar");
      return;
    }
    setShowSummaryModal(true);
  };

  // Confirmar todos los pedidos de la mesa
  const handleConfirmTableOrders = async () => {
    if (!selectedTable && selectedOrderType === OrderType.DINE_IN) {
      toast.error("Selecciona una mesa primero");
      return;
    }

    setShowSummaryModal(false);
    const orderPromises: Promise<unknown>[] = [];

    tableOrders.forEach((order) => {
      type OrderItemInput = {
        menuItemId: number;
        quantity: number;
        priceAtOrder: number;
        notes: string;
      };
      const items: OrderItemInput[] = [];
      
      if (order.protein) {
        items.push({
          menuItemId: order.protein.id,
          quantity: 1,
          priceAtOrder: order.protein.price,
          notes: `Almuerzo: ${order.protein.name}${order.notes ? ` - ${order.notes}` : ""}`,
        });
      }

      order.looseItems.forEach((item) => {
        items.push({
          menuItemId: item.id,
          quantity: item.quantity,
          priceAtOrder: item.price,
          notes: item.name,
        });
      });

      const promise = new Promise((resolve, reject) => {
        createOrder(
          {
            type: selectedOrderType!,
            tableId: selectedOrderType === OrderType.DINE_IN ? (selectedTable ?? undefined) : undefined,
            items,
          },
          {
            onSuccess: () => resolve(true),
            onError: (error: Error) => {
              toast.error(`Error en pedido`, { description: error.message });
              reject(error);
            },
          }
        );
      });

      orderPromises.push(promise);
    });

    try {
      await Promise.all(orderPromises);
      
      const successMessage = selectedOrderType === OrderType.DINE_IN 
        ? `${tableOrders.length} pedidos creados para Mesa ${selectedTable}`
        : `${tableOrders.length} pedidos creados`;
      
      toast.success(successMessage, {
        description: `Total: $${tableTotal.toLocaleString("es-CO")}`,
      });
      
      setTableOrders([]);
      setSelectedTable(null);
      setSelectedOrderType(null);
      clearCurrentOrder();
      navigate(ROUTES.ORDERS);
    } catch (_error) {
      toast.error("Algunos pedidos no se pudieron crear");
    }
  };

  // Cancel edit
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
    setTableOrders([]);
    clearCurrentOrder();
  };

  // Loading state
  if (tablesLoading || itemsLoading || menuLoading) {
    return (
      <SidebarLayout
        title="Nuevo Pedido"
        subtitle="Cargando..."
        backRoute={ROUTES.ORDERS}
        fullWidth
      >
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-sage-100 text-sage-600 flex items-center justify-center mx-auto mb-4 animate-pulse">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <p className="text-carbon-600 font-medium">Cargando datos...</p>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  // Paso 1: Seleccionar tipo de pedido
  if (!selectedOrderType) {
    return (
      <SidebarLayout
        title="Nuevo Pedido"
        subtitle="Selecciona el tipo de pedido"
        backRoute={ROUTES.ORDERS}
        fullWidth
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Aquí (DINE_IN) */}
            <button
              onClick={() => handleSelectOrderType(OrderType.DINE_IN)}
              className="group flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-sage-200 bg-white hover:border-sage-400 hover:shadow-soft-lg transition-all duration-300 min-h-[200px]"
            >
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-sage-100 to-sage-200 text-sage-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <UtensilsCrossed className="w-10 h-10" />
              </div>
              <span className="text-xl font-bold text-carbon-900">Para Mesa</span>
              <span className="text-sm text-carbon-500 mt-2">Comer en el restaurante</span>
            </button>

            {/* Llevar (TAKE_OUT) */}
            <button
              onClick={() => handleSelectOrderType(OrderType.TAKE_OUT)}
              className="group flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-sage-200 bg-white hover:border-amber-400 hover:shadow-soft-lg transition-all duration-300 min-h-[200px]"
            >
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <span className="text-xl font-bold text-carbon-900">Para Llevar</span>
              <span className="text-sm text-carbon-500 mt-2">Recoger en local</span>
            </button>

            {/* Domicilio (DELIVERY) */}
            <button
              onClick={() => handleSelectOrderType(OrderType.DELIVERY)}
              className="group flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-sage-200 bg-white hover:border-blue-400 hover:shadow-soft-lg transition-all duration-300 min-h-[200px]"
            >
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Bike className="w-10 h-10" />
              </div>
              <span className="text-xl font-bold text-carbon-900">Domicilio</span>
              <span className="text-sm text-carbon-500 mt-2">Entrega a domicilio</span>
            </button>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  // Paso 2: Si es DINE_IN y no hay mesa seleccionada, mostrar selector de mesa
  if (selectedOrderType === OrderType.DINE_IN && !selectedTable) {
    return (
      <SidebarLayout
        title="Nuevo Pedido"
        subtitle="Selecciona la mesa para tomar el pedido"
        backRoute={ROUTES.ORDERS}
        fullWidth
        actions={
          <button
            onClick={handleBackToOrderType}
            className="flex items-center gap-2 px-4 py-2 bg-sage-100 text-sage-700 rounded-xl font-medium hover:bg-sage-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Cambiar Tipo
          </button>
        }
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card variant="elevated" className="overflow-hidden rounded-2xl">
            <div className="bg-gradient-to-r from-sage-600 to-sage-500 px-4 py-6 sm:px-8 sm:py-8">
              <h2 className="text-white font-semibold text-2xl flex items-center gap-3">
                <Users className="w-7 h-7" />
                Seleccionar Mesa
              </h2>
              <p className="text-sage-100 mt-2">
                Elige la mesa donde vas a tomar los pedidos
              </p>
            </div>
            
            <div className="p-4 sm:p-8">
              <TableSelector
                tables={availableTables}
                onSelect={(table) => setSelectedTable(table.id)}
                selectedTableId={selectedTable ?? undefined}
                showOnlyAvailable
              />
            </div>
          </Card>
        </div>
      </SidebarLayout>
    );
  }

  // Determine title and actions
  const getOrderFormTitle = () => {
    if (selectedOrderType === OrderType.DINE_IN) {
      return `Mesa ${selectedTable}`;
    }
    return selectedOrderType === OrderType.TAKE_OUT ? 'Para Llevar' : 'Domicilio';
  };

  const getOrderFormSubtitle = () => {
    return `${tableOrders.length} pedido${tableOrders.length !== 1 ? 's' : ''} · $${tableTotal.toLocaleString("es-CO")}`;
  };

  return (
    <>
      <SidebarLayout
        title={getOrderFormTitle()}
        subtitle={getOrderFormSubtitle()}
        backRoute={ROUTES.ORDERS}
        fullWidth
        actions={
          <button
            onClick={handleBackToOrderType}
            className="flex items-center gap-2 px-4 py-2 bg-sage-100 text-sage-700 rounded-xl font-medium hover:bg-sage-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {selectedOrderType === OrderType.DINE_IN ? 'Cambiar Mesa' : 'Cambiar Tipo'}
          </button>
        }
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            
            {/* LEFT: Formulario de pedido actual */}
            <div className="xl:col-span-7 space-y-6">
              {/* Header del pedido actual */}
              <Card variant="elevated" className="overflow-hidden rounded-2xl">
                <div className={cn(
                  "px-6 py-4 flex items-center justify-between",
                  currentOrderIndex !== null 
                    ? "bg-gradient-to-r from-amber-500 to-amber-400" 
                    : "bg-gradient-to-r from-sage-600 to-sage-500"
                )}>
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      currentOrderIndex !== null ? "bg-white/20" : "bg-white/20"
                    )}>
                      {currentOrderIndex !== null ? (
                        <Edit2 className="w-6 h-6 text-white" />
                      ) : (
                        <Plus className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-white font-semibold text-lg">
                        {currentOrderIndex !== null 
                          ? `Editando Pedido #${currentOrderIndex + 1}` 
                          : `Nuevo Pedido #${tableOrders.length + 1}`}
                      </h2>
                      <p className="text-white/80 text-sm">
                        {currentOrderIndex !== null 
                          ? "Modifica los detalles" 
                          : "Configura el pedido"}
                      </p>
                    </div>
                  </div>
                  {currentOrderIndex !== null && (
                    <button
                      onClick={handleCancelEdit}
                      className="p-3 bg-white/20 hover:bg-white/30 rounded-xl text-white transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  )}
                </div>
              </Card>

              {/* Menú del día colapsable */}
              <Card variant="elevated" className="overflow-hidden rounded-2xl">
                <button
                  onClick={() => setShowDailyMenu(!showDailyMenu)}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-400 px-6 py-4 flex items-center justify-between hover:from-amber-600 hover:to-amber-500 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                      <ChefHat className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <span className="text-white font-semibold block text-lg">Menú del Día</span>
                      <span className="text-amber-100 text-sm hidden sm:inline">
                        {dailyMenuDisplay.isConfigured 
                          ? `${dailyMenuDisplay.soupOptions.length} sopas, ${dailyMenuDisplay.drinkOptions.length} bebidas`
                          : "Usando configuración por defecto"
                        }
                      </span>
                    </div>
                  </div>
                  {showDailyMenu ? (
                    <ChevronUp className="w-6 h-6 text-white" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-white" />
                  )}
                </button>
                {showDailyMenu && (
                  <DailyMenuSection
                    soupOptions={dailyMenuDisplay.soupOptions}
                    principleOptions={dailyMenuDisplay.principleOptions}
                    saladOptions={dailyMenuDisplay.saladOptions}
                    extraOptions={dailyMenuDisplay.extraOptions}
                    drinkOptions={dailyMenuDisplay.drinkOptions}
                    dessertOptions={dailyMenuDisplay.dessertOptions}
                    basePrice={dailyMenuDisplay.basePrice}
                  />
                )}
              </Card>

              {/* Daily Menu Prices Info */}
              {dailyMenuPrices.isConfigured && (
                <div className="flex items-center justify-between p-4 bg-sage-50 rounded-xl border border-sage-200">
                  <div className="flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-sage-600" />
                    <span className="text-sm font-medium text-carbon-700">Margen base del almuerzo:</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-carbon-600">
                      <strong className="text-carbon-900">${dailyMenuPrices.basePrice.toLocaleString()}</strong>
                      <span className="text-carbon-400 ml-2">(se suma al precio de la proteína)</span>
                    </span>
                  </div>
                </div>
              )}

              {/* Configuración del Almuerzo - Selectores condicionales */}
              <Card variant="elevated" className="p-6 rounded-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 text-amber-600 flex items-center justify-center">
                    <UtensilsCrossed className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-carbon-900">Configurar Almuerzo</h3>
                    <p className="text-sm text-carbon-500">Selecciona los elementos del menú</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Sopa - Solo mostrar selector si hay 2+ opciones */}
                  {dailyMenuDisplay.soupOptions.length >= 2 && (
                    <MenuItemSelector
                      label="Sopa"
                      options={dailyMenuDisplay.soupOptions}
                      selectedOption={selectedSoup}
                      onSelect={setSelectedSoup}
                      required={true}
                      error={hasError("soup") ? validationErrors.find(e => e.field === "soup")?.message : undefined}
                      icon="🍲"
                      color="amber"
                    />
                  )}

                  {/* Principio - Solo mostrar selector si hay 2+ opciones */}
                  {dailyMenuDisplay.principleOptions.length >= 2 && (
                    <MenuItemSelector
                      label="Principio"
                      options={dailyMenuDisplay.principleOptions}
                      selectedOption={selectedPrinciple}
                      onSelect={setSelectedPrinciple}
                      required={true}
                      error={hasError("principle") ? validationErrors.find(e => e.field === "principle")?.message : undefined}
                      icon="🥔"
                      color="emerald"
                    />
                  )}

                  {/* Ensalada - Solo mostrar selector si hay 2+ opciones */}
                  {dailyMenuDisplay.saladOptions.length >= 2 && (
                    <MenuItemSelector
                      label="Ensalada"
                      options={dailyMenuDisplay.saladOptions}
                      selectedOption={selectedSalad}
                      onSelect={setSelectedSalad}
                      required={true}
                      error={hasError("salad") ? validationErrors.find(e => e.field === "salad")?.message : undefined}
                      icon="🥗"
                      color="sage"
                    />
                  )}

                  {/* Jugo - Solo mostrar selector si hay 2+ opciones */}
                  {dailyMenuDisplay.drinkOptions.length >= 2 && (
                    <MenuItemSelector
                      label="Jugo"
                      options={dailyMenuDisplay.drinkOptions}
                      selectedOption={selectedDrink}
                      onSelect={setSelectedDrink}
                      required={true}
                      error={hasError("drink") ? validationErrors.find(e => e.field === "drink")?.message : undefined}
                      icon="🥤"
                      color="blue"
                    />
                  )}

                  {/* Extra - Solo mostrar selector si hay 2+ opciones */}
                  {dailyMenuDisplay.extraOptions.length >= 2 && (
                    <MenuItemSelector
                      label="Extra"
                      options={dailyMenuDisplay.extraOptions}
                      selectedOption={selectedExtra}
                      onSelect={setSelectedExtra}
                      required={true}
                      error={hasError("extra") ? validationErrors.find(e => e.field === "extra")?.message : undefined}
                      icon="🍌"
                      color="purple"
                      showRiceInfo={true}
                      riceName={dailyMenuDisplay.riceOption?.name}
                    />
                  )}

                  {/* Visualización moderna del menú auto-configurado */}
                  {dailyMenuDisplay.soupOptions.length <= 1 &&
                   dailyMenuDisplay.principleOptions.length <= 1 &&
                   dailyMenuDisplay.saladOptions.length <= 1 &&
                   dailyMenuDisplay.drinkOptions.length <= 1 &&
                   dailyMenuDisplay.extraOptions.length <= 1 && (
                    <div className="bg-gradient-to-br from-sage-50 via-white to-amber-50 rounded-2xl border border-sage-200 overflow-hidden">
                      <div className="bg-gradient-to-r from-sage-600 to-sage-500 px-4 py-3">
                        <h4 className="text-white font-semibold text-sm flex items-center gap-2">
                          <span className="text-lg">🍽️</span>
                          Menú del Día
                        </h4>
                      </div>
                      <div className="p-4 space-y-3">
                        {/* Sopa */}
                        {dailyMenuDisplay.soupOptions.length === 1 && (
                          <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-amber-100 shadow-sm">
                            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-xl">
                              🍲
                            </div>
                            <div className="flex-1">
                              <p className="text-xs text-amber-600 font-medium uppercase tracking-wider">Sopa</p>
                              <p className="text-carbon-900 font-semibold">{dailyMenuDisplay.soupOptions[0].name}</p>
                            </div>
                            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                              <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          </div>
                        )}
                        
                        {/* Principio */}
                        {dailyMenuDisplay.principleOptions.length === 1 && (
                          <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-emerald-100 shadow-sm">
                            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-xl">
                              🥔
                            </div>
                            <div className="flex-1">
                              <p className="text-xs text-emerald-600 font-medium uppercase tracking-wider">Principio</p>
                              <p className="text-carbon-900 font-semibold">{dailyMenuDisplay.principleOptions[0].name}</p>
                            </div>
                            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                              <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          </div>
                        )}
                        
                        {/* Ensalada */}
                        {dailyMenuDisplay.saladOptions.length === 1 && (
                          <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-sage-100 shadow-sm">
                            <div className="w-10 h-10 rounded-xl bg-sage-100 flex items-center justify-center text-xl">
                              🥗
                            </div>
                            <div className="flex-1">
                              <p className="text-xs text-sage-600 font-medium uppercase tracking-wider">Ensalada</p>
                              <p className="text-carbon-900 font-semibold">{dailyMenuDisplay.saladOptions[0].name}</p>
                            </div>
                            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                              <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          </div>
                        )}
                        
                        {/* Jugo */}
                        {dailyMenuDisplay.drinkOptions.length === 1 && (
                          <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-blue-100 shadow-sm">
                            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-xl">
                              🥤
                            </div>
                            <div className="flex-1">
                              <p className="text-xs text-blue-600 font-medium uppercase tracking-wider">Jugo</p>
                              <p className="text-carbon-900 font-semibold">{dailyMenuDisplay.drinkOptions[0].name}</p>
                            </div>
                            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                              <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          </div>
                        )}
                        
                        {/* Extra */}
                        {dailyMenuDisplay.extraOptions.length === 1 && (
                          <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-purple-100 shadow-sm">
                            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-xl">
                              🍌
                            </div>
                            <div className="flex-1">
                              <p className="text-xs text-purple-600 font-medium uppercase tracking-wider">Extra</p>
                              <p className="text-carbon-900 font-semibold">{dailyMenuDisplay.extraOptions[0].name}</p>
                            </div>
                            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                              <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          </div>
                        )}
                        
                        {/* Arroz */}
                        {dailyMenuDisplay.riceOption && (
                          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-amber-50 to-white rounded-xl border border-amber-200 shadow-sm">
                            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-xl">
                              🍚
                            </div>
                            <div className="flex-1">
                              <p className="text-xs text-amber-700 font-medium uppercase tracking-wider">Arroz incluido</p>
                              <p className="text-carbon-900 font-semibold">{dailyMenuDisplay.riceOption.name}</p>
                            </div>
                            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                              <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {/* Selector de proteína */}
              <Card variant="elevated" className="p-6 rounded-2xl">
                <div className={cn(hasError("protein") && "rounded-xl border-2 border-rose-300 p-2 -m-2")}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-100 to-rose-200 text-rose-600 flex items-center justify-center">
                      <span className="text-2xl">🥩</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-carbon-900">Seleccionar Proteína</h3>
                      <p className="text-sm text-carbon-500">
                        Elige la proteína para tu almuerzo
                      </p>
                    </div>
                  </div>

                  {proteins.length > 0 ? (
                    <>
                      <ProteinSelector
                        proteins={proteins}
                        selectedProteinId={selectedProtein?.id}
                        onSelect={setSelectedProtein}
                        basePrice={dailyMenuPrices.basePrice}
                      />
                      
                      {/* Current order price display */}
                      {selectedProtein && (
                        <div className="mt-4 space-y-3">
                          {/* Base lunch price */}
                          <div className="flex items-center justify-between p-3 bg-sage-50 rounded-xl">
                            <div>
                              <p className="text-sm text-sage-700 font-medium">Almuerzo con {selectedProtein.name}</p>
                              <p className="text-xs text-sage-500">Precio base</p>
                            </div>
                            <p className="text-lg font-bold text-sage-700">
                              ${lunchPrice.toLocaleString()}
                            </p>
                          </div>
                          
                          {/* Loose items summary */}
                          {looseItems.length > 0 && (
                            <div className="space-y-2">
                              {looseItems.map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-2 bg-purple-50 rounded-lg">
                                  <div className="flex items-center gap-2">
                                    <span className="text-purple-600 font-medium">{item.quantity}x</span>
                                    <span className="text-carbon-700">{item.name}</span>
                                  </div>
                                  <p className="text-purple-700 font-semibold">
                                    +${(item.price * item.quantity).toLocaleString()}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {/* Total */}
                          {looseItems.length > 0 && (
                            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-sage-600 to-sage-500 rounded-xl text-white">
                              <p className="font-bold">Total</p>
                              <p className="text-2xl font-black">
                                ${currentOrderTotal.toLocaleString()}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {hasError("protein") && (
                        <p className="text-rose-600 text-sm mt-2 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {validationErrors.find(e => e.field === "protein")?.message}
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-8 h-8" />
                      </div>
                      <h3 className="text-lg font-bold text-carbon-900 mb-2">
                        No hay proteínas configuradas
                      </h3>
                      <p className="text-sm text-carbon-500 mb-4">
                        Por favor, configura las proteínas disponibles en el Menú del Día
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(ROUTES.DAILY_MENU)}
                        className="inline-flex items-center gap-2"
                      >
                        <UtensilsCrossed className="w-4 h-4" />
                        Configurar Menú del Día
                      </Button>
                    </div>
                  )}
                </div>
              </Card>

              {/* NEW: Replacement Manager */}
              {selectedProtein && (
                <Card variant="elevated" className="p-6 rounded-2xl">
                  <ReplacementManager
                    availableItems={{
                      soup: dailyMenuDisplay.soupOptions,
                      principle: dailyMenuDisplay.principleOptions,
                      salad: dailyMenuDisplay.saladOptions,
                      drink: dailyMenuDisplay.drinkOptions,
                      extra: dailyMenuDisplay.extraOptions,
                    }}
                    replacements={replacements}
                    onAddReplacement={(r) => setReplacements(prev => [...prev, r])}
                    onRemoveReplacement={(id) => setReplacements(prev => prev.filter(rep => rep.id !== id))}
                    disabled={!selectedProtein}
                  />
                </Card>
              )}

              {/* Pedido Rápido - Para productos individuales sin almuerzo */}
              <Card variant="elevated" className="p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-white border-amber-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 text-amber-600 flex items-center justify-center">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-carbon-900">Pedido Rápido</h3>
                      <p className="text-sm text-carbon-500">Productos sin almuerzo ejecutivo</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsQuickOrder(!isQuickOrder)}
                    className={cn(
                      "px-4 py-2 rounded-xl font-semibold text-sm transition-all",
                      isQuickOrder
                        ? "bg-amber-500 text-white"
                        : "bg-white border-2 border-amber-300 text-amber-700"
                    )}
                  >
                    {isQuickOrder ? "Activado" : "Activar"}
                  </button>
                </div>

                {/* Acciones rápidas */}
                <div className="flex flex-wrap gap-2">
                  {popularProducts.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => {
                        const existing = looseItems.find((i) => i.id === product.id);
                        if (existing) {
                          handleUpdateLooseItemQuantity(product.id, existing.quantity + 1);
                        } else {
                          handleAddLooseItem({
                            id: product.id,
                            name: product.name,
                            price: product.price,
                          });
                        }
                        toast.success(`${product.name} agregado`);
                      }}
                      className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white border-2 border-amber-200 hover:border-amber-400 hover:bg-amber-50 transition-all active:scale-95"
                    >
                      <Plus className="w-4 h-4 text-amber-600" />
                      <span className="font-medium text-carbon-800">{product.name}</span>
                    </button>
                  ))}
                </div>
              </Card>

              {/* Productos sueltos */}
              <Card variant="elevated" className="p-6 rounded-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600 flex items-center justify-center">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-carbon-900">
                      {isQuickOrder ? "Buscar Producto" : "Productos Individuales"}
                    </h3>
                    <p className="text-sm text-carbon-500">
                      {isQuickOrder ? "Busca y agrega cualquier producto" : "Agrega productos extras"}
                    </p>
                  </div>
                </div>
                
                <div className="relative mb-4">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-carbon-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Buscar producto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 py-3"
                    fullWidth
                  />
                </div>

                {filteredLooseItems.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4 max-h-96 overflow-y-auto scroll-smooth">
                    {filteredLooseItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() =>
                          handleAddLooseItem({
                            id: item.id,
                            name: item.name,
                            price: Number(item.price),
                          })
                        }
                        className="group p-4 rounded-xl border-2 border-sage-200 bg-white hover:border-sage-400 hover:bg-sage-50 transition-all text-left min-h-[80px]"
                      >
                        <p className="font-medium text-carbon-900 text-sm line-clamp-2 group-hover:text-sage-700 transition-colors">{item.name}</p>
                        <p className="text-sage-700 font-bold mt-1">
                          ${Number(item.price).toLocaleString("es-CO")}
                        </p>
                      </button>
                    ))}
                  </div>
                )}

              </Card>

              {/* Notas del pedido */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-carbon-700 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Notas especiales (opcional):
                </label>
                <Input
                  type="text"
                  placeholder="Ej: Sin sal, bien cocido, alérgenos..."
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  fullWidth
                  className="py-3"
                />
              </div>

              {/* Botón agregar/actualizar */}
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleAddOrderToTable}
                disabled={!selectedProtein && looseItems.length === 0}
                className="min-h-[64px] text-lg rounded-xl"
              >
                <Plus className="w-6 h-6 mr-2" />
                {currentOrderIndex !== null ? "Actualizar Pedido" : "Agregar a la Orden"}
                {currentOrderTotal > 0 && (
                  <span className="ml-2 opacity-90">(${currentOrderTotal.toLocaleString("es-CO")})</span>
                )}
              </Button>
            </div>

            {/* RIGHT: Lista de pedidos */}
            <div className="xl:col-span-5">
              <Card variant="elevated" className="overflow-hidden rounded-2xl sticky top-4">
                <div className="bg-gradient-to-r from-sage-600 to-sage-500 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                        <ShoppingBag className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-white font-semibold text-xl">
                          {selectedOrderType === OrderType.DINE_IN ? 'Pedidos Mesa' : 'Pedidos'}
                        </h2>
                        <p className="text-sage-100 text-sm">
                          {tableOrders.length} items
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-white">
                        ${tableTotal.toLocaleString("es-CO")}
                      </p>
                      <p className="text-sage-100 text-xs">Total</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto">
                  {tableOrders.length === 0 ? (
                    <div className="text-center py-12 px-4">
                      <div className="w-16 h-16 rounded-2xl bg-sage-100 text-sage-400 flex items-center justify-center mx-auto mb-4">
                        <ShoppingBag className="w-8 h-8" />
                      </div>
                      <p className="text-carbon-700 font-medium">No hay pedidos</p>
                      <p className="text-sm text-carbon-500 mt-1">Agrega el primer pedido</p>
                    </div>
                  ) : (
                    tableOrders.map((order, index) => (
                      <div
                        key={order.id}
                        className={cn(
                          "p-4 rounded-xl border-2 transition-all duration-200",
                          currentOrderIndex === index
                            ? "border-amber-400 bg-amber-50 shadow-md"
                            : "border-sage-200 bg-white hover:border-sage-300 hover:shadow-sm"
                        )}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-sage-100 to-sage-200 text-sage-700 flex items-center justify-center font-bold text-base">
                              {index + 1}
                            </span>
                            <div>
                              <p className="font-bold text-carbon-900 text-base">
                                {order.protein ? order.protein.name : "Productos sueltos"}
                              </p>
                              <p className="text-sm text-sage-700 font-semibold">
                                ${order.total.toLocaleString("es-CO")}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleEditOrder(index)}
                              className="p-3 text-carbon-400 hover:text-sage-600 hover:bg-sage-100 rounded-xl transition-colors"
                              title="Editar"
                            >
                              <Edit2 className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDuplicateOrder(index)}
                              className="p-3 text-carbon-400 hover:text-sage-600 hover:bg-sage-100 rounded-xl transition-colors"
                              title="Duplicar"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleRemoveOrder(index)}
                              className="p-3 text-carbon-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                        
                        {/* Detalles del pedido */}
                        <div className="flex flex-wrap gap-2 text-xs">
                          {order.looseItems.length > 0 && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                              {order.looseItems.reduce((sum, i) => sum + i.quantity, 0)} extras
                            </span>
                          )}
                          {order.notes && (
                            <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full font-medium italic w-full mt-1 truncate">
                              Nota: {order.notes}
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Botón confirmar */}
                {tableOrders.length > 0 && (
                  <div className="p-4 border-t border-sage-200 bg-sage-50">
                    <Button
                      variant="primary"
                      size="lg"
                      fullWidth
                      onClick={handleShowSummary}
                      disabled={isPending}
                      className="min-h-[64px] rounded-xl text-lg"
                    >
                      <Receipt className="w-6 h-6 mr-2" />
                      Ver Resumen
                      <span className="ml-2 opacity-90">(${tableTotal.toLocaleString("es-CO")})</span>
                    </Button>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </SidebarLayout>

      {/* Summary Modal */}
      {showSummaryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-sage-600 to-sage-500 px-6 py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                    <Receipt className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-white font-semibold text-xl">Resumen del Pedido</h2>
                    <p className="text-sage-100 text-sm">
                      {selectedOrderType === OrderType.DINE_IN ? `Mesa ${selectedTable}` : 'Pedido'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSummaryModal(false)}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-xl text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-4">
                {tableOrders.map((order, index) => (
                  <div key={order.id} className="p-4 bg-sage-50 rounded-xl border border-sage-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-sage-200 text-sage-700 flex items-center justify-center font-bold text-sm">
                          {index + 1}
                        </span>
                        <span className="font-bold text-carbon-900">
                          {order.protein ? `Almuerzo ${order.protein.name}` : "Productos sueltos"}
                        </span>
                      </div>
                      <span className="font-bold text-sage-700">
                        ${order.total.toLocaleString("es-CO")}
                      </span>
                    </div>
                    
                    {/* NEW: Detailed lunch breakdown */}
                    {order.lunch && (
                      <div className="ml-10 mb-3 p-3 bg-white rounded-lg border border-sage-200">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {order.lunch.rice && (
                            <div className="flex items-center gap-1">
                              <span>🍚</span>
                              <span className="text-carbon-600">{order.lunch.rice.name}</span>
                            </div>
                          )}
                          {order.lunch.soup && (
                            <div className="flex items-center gap-1">
                              <span>🍲</span>
                              <span className="text-carbon-600">{order.lunch.soup.name}</span>
                            </div>
                          )}
                          {order.lunch.principle && (
                            <div className="flex items-center gap-1">
                              <span>🥔</span>
                              <span className="text-carbon-600">{order.lunch.principle.name}</span>
                            </div>
                          )}
                          {order.lunch.salad && (
                            <div className="flex items-center gap-1">
                              <span>🥗</span>
                              <span className="text-carbon-600">{order.lunch.salad.name}</span>
                            </div>
                          )}
                          {order.lunch.drink && (
                            <div className="flex items-center gap-1">
                              <span>🥤</span>
                              <span className="text-carbon-600">{order.lunch.drink.name}</span>
                            </div>
                          )}
                          {order.lunch.extra && (
                            <div className="flex items-center gap-1">
                              <span>🍌</span>
                              <span className="text-carbon-600">{order.lunch.extra.name}</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Replacements */}
                        {order.lunch.replacements.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-sage-100">
                            <p className="text-xs font-medium text-emerald-600 mb-1">Reemplazos:</p>
                            <div className="space-y-1">
                              {order.lunch.replacements.map(r => (
                                <p key={r.id} className="text-xs text-carbon-500">
                                  No {r.fromName} → {r.itemName}
                                </p>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="ml-10 space-y-1 text-sm text-carbon-600">
                      {order.looseItems.length > 0 && (
                        <p>Productos sueltos: {order.looseItems.map(i => 
                          `${i.name} (x${i.quantity})`
                        ).join(", ")}</p>
                      )}
                      {order.notes && (
                        <p className="text-amber-600 italic">Nota: {order.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="mt-6 p-4 bg-gradient-to-r from-sage-100 to-sage-50 rounded-xl border-2 border-sage-300">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-carbon-900">Total</span>
                  <span className="text-3xl font-bold text-sage-700">
                    ${tableTotal.toLocaleString("es-CO")}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 border-t border-sage-200 bg-sage-50">
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  fullWidth
                  onClick={() => setShowSummaryModal(false)}
                  className="min-h-[56px]"
                >
                  <X className="w-5 h-5 mr-2" />
                  Cancelar
                </Button>
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
                  Confirmar Pedido
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
