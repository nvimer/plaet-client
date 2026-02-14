/**
 * useOrderBuilder Hook
 * Manages order creation state and logic
 */

import { useState, useMemo, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useCreateOrder } from "./useCreateOrder";
import { useTables } from "@/features/tables";
import { useItems } from "@/features/menu";
import { useDailyMenuToday } from "@/features/menu/hooks/useDailyMenu";
import { OrderType } from "@/types";
import type {
  MenuOption,
  ProteinOption,
  LooseItem,
  LunchSelection,
  TableOrder,
  ValidationError,
  OrderItemInput,
} from "../types/orderBuilder";
import type { Replacement } from "../components";

export interface UseOrderBuilderReturn {
  // Loading states
  isLoading: boolean;
  isPending: boolean;
  
  // Data
  tables: Array<{ id: number; status: string }>;
  availableTables: Array<{ id: number; status: string }>;
  menuItems: Array<{ id: number; name: string; price: string; isAvailable: boolean }> | undefined;
  dailyMenuData: {
    basePrice: number;
    proteinOptions: Array<{ id: number; name: string; price: number }>;
    proteinCategory?: { name: string } | null;
    soupOptions: MenuOption[];
    principleOptions: MenuOption[];
    saladOptions: MenuOption[];
    drinkOptions: MenuOption[];
    extraOptions: MenuOption[];
    dessertOptions?: MenuOption[];
    riceOptions?: MenuOption[];
  } | null | undefined;
  
  // Order type and table state
  selectedOrderType: OrderType | null;
  selectedTable: number | null;
  tableOrders: TableOrder[];
  currentOrderIndex: number | null;
  
  // Current order state
  selectedProtein: ProteinOption | null;
  looseItems: LooseItem[];
  searchTerm: string;
  showDailyMenu: boolean;
  orderNotes: string;
  
  // Lunch selection state
  selectedSoup: MenuOption | null;
  selectedPrinciple: MenuOption | null;
  selectedSalad: MenuOption | null;
  selectedDrink: MenuOption | null;
  selectedExtra: MenuOption | null;
  selectedRice: MenuOption | null;
  replacements: Replacement[];
  
  // UI state
  showSummaryModal: boolean;
  validationErrors: ValidationError[];
  touchedFields: Set<string>;
  
  // Computed values
  proteins: ProteinOption[];
  filteredLooseItems: Array<{ id: number; name: string; price: string; isAvailable: boolean }>;
  dailyMenuDisplay: {
    soupOptions: MenuOption[];
    principleOptions: MenuOption[];
    saladOptions: MenuOption[];
    extraOptions: MenuOption[];
    drinkOptions: MenuOption[];
    dessertOptions: MenuOption[];
    riceOption: MenuOption | null;
    basePrice: number;
    isConfigured: boolean;
  };
  dailyMenuPrices: {
    basePrice: number;
    isConfigured: boolean;
  };
  lunchPrice: number;
  currentOrderTotal: number;
  tableTotal: number;
  popularProducts: Array<{ id: number; name: string; price: number }>;
  
  // Actions
  setSelectedOrderType: (type: OrderType | null) => void;
  setSelectedTable: (table: number | null) => void;
  setSearchTerm: (term: string) => void;
  setShowDailyMenu: (show: boolean) => void;
  setOrderNotes: (notes: string) => void;
  setShowSummaryModal: (show: boolean) => void;
  setSelectedProtein: (protein: ProteinOption | null) => void;
  setSelectedSoup: (soup: MenuOption | null) => void;
  setSelectedPrinciple: (principle: MenuOption | null) => void;
  setSelectedSalad: (salad: MenuOption | null) => void;
  setSelectedDrink: (drink: MenuOption | null) => void;
  setSelectedExtra: (extra: MenuOption | null) => void;
  setSelectedRice: (rice: MenuOption | null) => void;
  setReplacements: (replacements: Replacement[]) => void;
  setLooseItems: (items: LooseItem[] | ((prev: LooseItem[]) => LooseItem[])) => void;
  setValidationErrors: (errors: ValidationError[]) => void;
  setTouchedFields: (fields: Set<string>) => void;
  setTableOrders: (orders: TableOrder[] | ((prev: TableOrder[]) => TableOrder[])) => void;
  setCurrentOrderIndex: (index: number | null) => void;
  
  // Handlers
  handleAddLooseItem: (item: { id: number; name: string; price: number }) => void;
  handleUpdateLooseItemQuantity: (id: number, quantity: number) => void;
  handleAddOrderToTable: () => void;
  clearCurrentOrder: () => void;
  handleEditOrder: (index: number) => void;
  handleRemoveOrder: (index: number) => void;
  handleDuplicateOrder: (index: number) => void;
  handleShowSummary: () => void;
  handleConfirmTableOrders: () => Promise<void>;
  handleSelectOrderType: (type: OrderType) => void;
  handleBackToOrderType: () => void;
  
  // Utilities
  validateOrder: () => ValidationError[];
  hasError: (field: string) => boolean;
  buildOrderNotes: () => string;
}

export function useOrderBuilder(): UseOrderBuilderReturn {
  // Data hooks
  const { data: tablesData, isLoading: tablesLoading } = useTables();
  const { data: menuItems, isLoading: itemsLoading } = useItems();
  const { data: dailyMenuData, isLoading: menuLoading } = useDailyMenuToday();
  const { mutate: createOrder, isPending } = useCreateOrder();

  const tables = tablesData?.tables || [];
  const availableTables = tables.filter((t) => t.status === "AVAILABLE");

  // Order type and table state
  const [selectedOrderType, setSelectedOrderType] = useState<OrderType | null>(null);
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [tableOrders, setTableOrders] = useState<TableOrder[]>([]);
  const [currentOrderIndex, setCurrentOrderIndex] = useState<number | null>(null);

  // Current order state
  const [selectedProtein, setSelectedProtein] = useState<ProteinOption | null>(null);
  const [looseItems, setLooseItems] = useState<LooseItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDailyMenu, setShowDailyMenu] = useState(false);
  const [orderNotes, setOrderNotes] = useState("");

  // Lunch selection state
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

  // Popular products (quick add-ons)
  const popularProducts = useMemo(() => [
    { id: 9991, name: "Huevo", price: 2000 },
    { id: 9992, name: "Gaseosa", price: 3500 },
    { id: 9993, name: "Papas", price: 3000 },
    { id: 9994, name: "Yuca", price: 2500 },
    { id: 9995, name: "Plátano", price: 2000 },
    { id: 9996, name: "Sopa", price: 5000 },
  ], []);

  // Daily Menu Prices
  const dailyMenuPrices = useMemo(() => ({
    basePrice: dailyMenuData?.basePrice || 4000,
    isConfigured: !!dailyMenuData,
  }), [dailyMenuData]);

  // Get proteins from daily menu
  const proteins = useMemo(() => {
    if (!dailyMenuData?.proteinOptions || dailyMenuData.proteinOptions.length === 0) {
      return [];
    }
    
    return dailyMenuData.proteinOptions.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      isAvailable: true,
      categoryName: dailyMenuData.proteinCategory?.name,
    }));
  }, [dailyMenuData]);

  // Filtered loose items
  const filteredLooseItems = useMemo(() => {
    if (!menuItems) return [];
    return menuItems.filter(
      (item) =>
        item.isAvailable &&
        (searchTerm === "" ||
          item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [menuItems, searchTerm]);

  // Build daily menu display
  const dailyMenuDisplay = useMemo(() => {
    if (!dailyMenuData) {
      return {
        soupOptions: [] as MenuOption[],
        principleOptions: [] as MenuOption[],
        saladOptions: [] as MenuOption[],
        extraOptions: [] as MenuOption[],
        drinkOptions: [] as MenuOption[],
        dessertOptions: [] as MenuOption[],
        riceOption: null as MenuOption | null,
        basePrice: dailyMenuPrices.basePrice,
        isConfigured: false,
      };
    }
    
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
      riceOption,
      basePrice: dailyMenuData.basePrice || dailyMenuPrices.basePrice,
      isConfigured: true,
    };
  }, [dailyMenuData, dailyMenuPrices]);

  // Calculate lunch price
  const lunchPrice = useMemo(() => {
    if (!selectedProtein) return 0;
    return dailyMenuPrices.basePrice + selectedProtein.price;
  }, [selectedProtein, dailyMenuPrices]);

  // Calculate current order total
  const currentOrderTotal = useMemo(() => {
    let total = 0;
    total += lunchPrice;
    looseItems.forEach((item) => {
      total += item.price * item.quantity;
    });
    return total;
  }, [lunchPrice, looseItems]);

  // Calculate table total
  const tableTotal = useMemo(() => {
    return tableOrders.reduce((sum, order) => sum + order.total, 0);
  }, [tableOrders]);

  // Auto-select single options
  useEffect(() => {
    if (dailyMenuDisplay.isConfigured) {
      if (dailyMenuDisplay.soupOptions.length === 1 && !selectedSoup) {
        setSelectedSoup(dailyMenuDisplay.soupOptions[0]);
      }
      if (dailyMenuDisplay.principleOptions.length === 1 && !selectedPrinciple) {
        setSelectedPrinciple(dailyMenuDisplay.principleOptions[0]);
      }
      if (dailyMenuDisplay.saladOptions.length === 1 && !selectedSalad) {
        setSelectedSalad(dailyMenuDisplay.saladOptions[0]);
      }
      if (dailyMenuDisplay.drinkOptions.length === 1 && !selectedDrink) {
        setSelectedDrink(dailyMenuDisplay.drinkOptions[0]);
      }
      if (dailyMenuDisplay.extraOptions.length === 1 && !selectedExtra) {
        setSelectedExtra(dailyMenuDisplay.extraOptions[0]);
      }
    }
  }, [dailyMenuDisplay, selectedSoup, selectedPrinciple, selectedSalad, selectedDrink, selectedExtra]);

  // Validation
  const validateOrder = useCallback((): ValidationError[] => {
    const errors: ValidationError[] = [];
    
    if (!selectedProtein && looseItems.length === 0) {
      errors.push({ field: "protein", message: "Selecciona una proteína o agrega productos" });
    }
    
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
  }, [selectedProtein, looseItems, dailyMenuDisplay, selectedSoup, selectedPrinciple, selectedSalad, selectedDrink, selectedExtra, selectedOrderType, selectedTable]);

  const hasError = useCallback((field: string) => {
    return validationErrors.some(e => e.field === field) && touchedFields.has(field);
  }, [validationErrors, touchedFields]);

  // Build order notes
  const buildOrderNotes = useCallback((): string => {
    if (!selectedProtein) return orderNotes || "";
    
    const components = [
      selectedRice?.name || dailyMenuDisplay.riceOption?.name,
      selectedSoup?.name,
      selectedPrinciple?.name,
      selectedSalad?.name,
      selectedDrink?.name,
      selectedExtra?.name,
    ].filter(Boolean);
    
    let note = `Lunch: ${selectedProtein.name}`;
    
    if (components.length > 0) {
      note += ` + ${components.join(", ")}`;
    }
    
    if (replacements.length > 0) {
      const replText = replacements.map(r => `${r.fromName}→${r.itemName}`).join(", ");
      note += ` | Swap: ${replText}`;
    }
    
    if (orderNotes) {
      note += ` | Note: ${orderNotes}`;
    }
    
    return note;
  }, [selectedProtein, selectedRice, dailyMenuDisplay.riceOption, selectedSoup, selectedPrinciple, selectedSalad, selectedDrink, selectedExtra, replacements, orderNotes]);

  // Handlers
  const handleAddLooseItem = useCallback((item: { id: number; name: string; price: number }) => {
    const existing = looseItems.find((i) => i.id === item.id);
    if (existing) {
      if (existing.quantity <= 1) {
        setLooseItems((prev) => prev.filter((i) => i.id !== item.id));
      } else {
        setLooseItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i))
        );
      }
    } else {
      setLooseItems((prev) => [...prev, { ...item, quantity: 1 }]);
    }
  }, [looseItems]);

  const handleUpdateLooseItemQuantity = useCallback((id: number, quantity: number) => {
    if (quantity <= 0) {
      setLooseItems((prev) => prev.filter((i) => i.id !== id));
    } else {
      setLooseItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)));
    }
  }, []);

  const clearCurrentOrder = useCallback(() => {
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
  }, []);

  const handleAddOrderToTable = useCallback(() => {
    setTouchedFields(new Set(["protein", "soup", "principle", "salad", "drink", "extra"]));
    const errors = validateOrder();
    
    if (errors.length > 0) {
      setValidationErrors(errors);
      toast.error("Completa los campos requeridos");
      return;
    }

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
  }, [selectedProtein, selectedSoup, selectedPrinciple, selectedSalad, selectedDrink, selectedExtra, selectedRice, dailyMenuDisplay.riceOption, replacements, looseItems, currentOrderTotal, buildOrderNotes, currentOrderIndex, tableOrders.length, validateOrder, clearCurrentOrder]);

  const handleEditOrder = useCallback((index: number) => {
    const order = tableOrders[index];
    setCurrentOrderIndex(index);
    setSelectedProtein(order.protein);
    
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
  }, [tableOrders]);

  const handleRemoveOrder = useCallback((index: number) => {
    setTableOrders((prev) => prev.filter((_, i) => i !== index));
    if (currentOrderIndex === index) {
      clearCurrentOrder();
    }
    toast.success("Pedido eliminado");
  }, [currentOrderIndex, clearCurrentOrder]);

  const handleDuplicateOrder = useCallback((index: number) => {
    const order = tableOrders[index];
    const duplicatedOrder: TableOrder = {
      ...order,
      id: Date.now().toString(),
      createdAt: Date.now(),
    };
    setTableOrders((prev) => [...prev, duplicatedOrder]);
    toast.success("Pedido duplicado");
  }, [tableOrders]);

  const handleShowSummary = useCallback(() => {
    if (tableOrders.length === 0) {
      toast.error("No hay pedidos para confirmar");
      return;
    }
    setShowSummaryModal(true);
  }, [tableOrders.length]);

  const handleConfirmTableOrders = useCallback(async () => {
    if (!selectedTable && selectedOrderType === OrderType.DINE_IN) {
      toast.error("Selecciona una mesa primero");
      return;
    }

    setShowSummaryModal(false);
    const orderPromises: Promise<unknown>[] = [];

    tableOrders.forEach((order) => {
      const items: OrderItemInput[] = [];
      
      if (order.protein && order.protein.id > 0) {
        items.push({
          menuItemId: order.protein.id,
          quantity: 1,
          priceAtOrder: order.protein.price,
          notes: `Almuerzo: ${order.protein.name}${order.notes ? ` - ${order.notes}` : ""}`,
        });
      }

      order.looseItems.forEach((item) => {
        if (item.id > 0) {
          items.push({
            menuItemId: item.id,
            quantity: item.quantity,
            priceAtOrder: item.price,
            notes: item.name,
          });
        }
      });

      if (items.length === 0) {
        toast.error("El pedido no tiene items válidos");
        return;
      }

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
      clearCurrentOrder();
    } catch (_error) {
      toast.error("Algunos pedidos no se pudieron crear");
    }
  }, [selectedTable, selectedOrderType, tableOrders, createOrder, tableTotal, clearCurrentOrder]);

  const handleSelectOrderType = useCallback((type: OrderType) => {
    setSelectedOrderType(type);
  }, []);

  const handleBackToOrderType = useCallback(() => {
    setSelectedOrderType(null);
    setSelectedTable(null);
    setTableOrders([]);
    clearCurrentOrder();
  }, [clearCurrentOrder]);

  return {
    // Loading states
    isLoading: tablesLoading || itemsLoading || menuLoading,
    isPending,
    
    // Data
    tables,
    availableTables,
    menuItems,
    dailyMenuData,
    
    // Order type and table state
    selectedOrderType,
    selectedTable,
    tableOrders,
    currentOrderIndex,
    
    // Current order state
    selectedProtein,
    looseItems,
    searchTerm,
    showDailyMenu,
    orderNotes,
    
    // Lunch selection state
    selectedSoup,
    selectedPrinciple,
    selectedSalad,
    selectedDrink,
    selectedExtra,
    selectedRice,
    replacements,
    
    // UI state
    showSummaryModal,
    validationErrors,
    touchedFields,
    
    // Computed values
    proteins,
    filteredLooseItems,
    dailyMenuDisplay,
    dailyMenuPrices,
    lunchPrice,
    currentOrderTotal,
    tableTotal,
    popularProducts,
    
    // Actions
    setSelectedOrderType,
    setSelectedTable,
    setSearchTerm,
    setShowDailyMenu,
    setOrderNotes,
    setShowSummaryModal,
    setSelectedProtein,
    setSelectedSoup,
    setSelectedPrinciple,
    setSelectedSalad,
    setSelectedDrink,
    setSelectedExtra,
    setSelectedRice,
    setReplacements,
    setLooseItems,
    setValidationErrors,
    setTouchedFields,
    setTableOrders,
    setCurrentOrderIndex,
    
    // Handlers
    handleAddLooseItem,
    handleUpdateLooseItemQuantity,
    handleAddOrderToTable,
    clearCurrentOrder,
    handleEditOrder,
    handleRemoveOrder,
    handleDuplicateOrder,
    handleShowSummary,
    handleConfirmTableOrders,
    handleSelectOrderType,
    handleBackToOrderType,
    
    // Utilities
    validateOrder,
    hasError,
    buildOrderNotes,
  };
}
