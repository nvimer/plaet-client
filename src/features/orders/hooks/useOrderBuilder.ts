/**
 * useOrderBuilder Hook
 * Manages order creation state and logic
 */

import { useState, useMemo, useEffect, useCallback } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useCreateOrder, useBatchCreateOrders } from "./useCreateOrder";
import { useTables, useUpdateTableStatus } from "@/features/tables";
import { useItems } from "@/features/menu";
import { useDailyMenuToday, useDailyMenuByDate } from "@/features/menu/hooks/useDailyMenu";
import { OrderType, TableStatus, OrderStatus, PaymentMethod } from "@/types";
import { paymentApi, orderApi } from "@/services";
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
  backdatedDate: string | null;
  
  // Customer info for non-table orders
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  packagingFee: number;
  
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
  setBackdatedDate: (date: string | null) => void;
  setCustomerName: (name: string) => void;
  setCustomerPhone: (phone: string) => void;
  setDeliveryAddress: (address: string) => void;
  setPackagingFee: (fee: number) => void;
  
  // Handlers
  handleAddLooseItem: (item: { id: number; name: string; price: number }) => void;
  handleUpdateLooseItemQuantity: (id: number, quantity: number) => void;
  handleAddOrderToTable: () => void;
  clearCurrentOrder: () => void;
  handleEditOrder: (index: number) => void;
  handleRemoveOrder: (index: number) => void;
  handleDuplicateOrder: (index: number) => void;
  handleShowSummary: () => void;
  handleConfirmTableOrders: (isFastHistoricalEntry?: boolean) => Promise<void>;
  handleSelectOrderType: (type: OrderType) => void;
  handleBackToOrderType: () => void;
  
  // Utilities
  validateOrder: () => ValidationError[];
  hasError: (field: string) => boolean;
  buildOrderNotes: () => string;
}

export function useOrderBuilder(): UseOrderBuilderReturn {
  // Order type and table state
  const [selectedOrderType, setSelectedOrderType] = useState<OrderType | null>(null);
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [tableOrders, setTableOrders] = useState<TableOrder[]>([]);
  const [currentOrderIndex, setCurrentOrderIndex] = useState<number | null>(null);
  const [backdatedDate, setBackdatedDate] = useState<string | null>(null);

  // Customer info state
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [packagingFee, setPackagingFee] = useState(1000);

  // Data hooks
  const { data: tablesData, isLoading: tablesLoading } = useTables();
  const { data: menuItems, isLoading: itemsLoading } = useItems();
  
  // Daily Menu Data fetching logic
  const todayMenu = useDailyMenuToday();
  const historicalMenu = useDailyMenuByDate(backdatedDate || "");
  
  const dailyMenuData = backdatedDate ? historicalMenu.data : todayMenu.data;
  const menuLoading = backdatedDate ? historicalMenu.isLoading : todayMenu.isLoading;
  
  const { mutateAsync: createOrder, isPending: isCreating } = useCreateOrder();
  const { mutateAsync: createBatchOrders, isPending: isBatchCreating } = useBatchCreateOrders();
  const { mutate: updateTableStatus } = useUpdateTableStatus();
  
  const isPending = isCreating || isBatchCreating;

  const tables = tablesData?.tables || [];
  const availableTables = tables.filter((t) => t.status === "AVAILABLE");

  // Lunch selection state

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
  // Calculate popular/common products from real menu data
  // For now, we'll take the first 6 items that are available and not from lunch categories
  const popularProducts = useMemo(() => {
    if (!menuItems || !Array.isArray(menuItems)) return [];
    
    // Lunch category IDs to exclude from "popular" (loose items)
    const lunchCategoryIds = [
      dailyMenuData?.soupCategory?.id,
      dailyMenuData?.principleCategory?.id,
      dailyMenuData?.proteinCategory?.id,
      dailyMenuData?.saladCategory?.id,
      dailyMenuData?.drinkCategory?.id,
      dailyMenuData?.extraCategory?.id,
      dailyMenuData?.dessertCategory?.id,
    ].filter(Boolean);

    return menuItems
      .filter(item => 
        item.isAvailable && 
        !lunchCategoryIds.includes(item.categoryId)
      )
      .slice(0, 8)
      .map(item => ({
        id: item.id,
        name: item.name,
        price: parseFloat(String(item.price || 0)) || 0
      }));
  }, [menuItems, dailyMenuData]);

  // Daily Menu Prices
  const dailyMenuPrices = useMemo(() => ({
    basePrice: dailyMenuData?.basePrice || 0,
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
    
    // Add packaging fee for non-dine-in if not already present in looseItems
    if ((selectedOrderType === OrderType.TAKE_OUT || selectedOrderType === OrderType.DELIVERY) && 
        !looseItems.some(i => i.name === "Portacomida") && 
        packagingFee > 0) {
      total += packagingFee;
    }
    
    return total;
  }, [lunchPrice, looseItems, selectedOrderType, packagingFee]);

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

    if (selectedOrderType === OrderType.TAKE_OUT || selectedOrderType === OrderType.DELIVERY) {
      if (!customerName.trim()) errors.push({ field: "customerName", message: "Nombre del cliente requerido" });
      if (!customerPhone.trim()) errors.push({ field: "customerPhone", message: "Teléfono requerido" });
    }

    if (selectedOrderType === OrderType.DELIVERY) {
      if (!deliveryAddress.trim()) errors.push({ field: "deliveryAddress", message: "Dirección de entrega requerida" });
    }
    
    return errors;
  }, [selectedProtein, looseItems, dailyMenuDisplay, selectedSoup, selectedPrinciple, selectedSalad, selectedDrink, selectedExtra, selectedOrderType, selectedTable, customerName, customerPhone, deliveryAddress]);

  const hasError = useCallback((field: string) => {
    return validationErrors.some(e => e.field === field) && touchedFields.has(field);
  }, [validationErrors, touchedFields]);

  // Build order notes
  const buildOrderNotes = useCallback((): string => {
    let note = "";

    // 1. Add Customer Info for Non-Dine-In
    if (selectedOrderType === OrderType.TAKE_OUT || selectedOrderType === OrderType.DELIVERY) {
      note += `👤 CLIENTE: ${customerName}\n📞 TEL: ${customerPhone}`;
      if (selectedOrderType === OrderType.DELIVERY && deliveryAddress) {
        note += `\n📍 DIR: ${deliveryAddress}`;
      }
      note += "\n-------------------\n";
    }
    
    if (selectedProtein) {
      if (replacements.length > 0) {
        const replText = replacements.map(r => `[-] Sin ${r.fromName} [+] Extra ${r.itemName}`).join(" | ");
        note += `${replText}`;
      }
    }
    
    if (orderNotes) {
      note += note ? `\n📝 NOTAS: ${orderNotes}` : `📝 NOTAS: ${orderNotes}`;
    }
    
    return note;
  }, [selectedProtein, replacements, orderNotes, selectedOrderType, customerName, customerPhone, deliveryAddress]);

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
    // We don't reset customer info here as it might be shared across table services
  }, []);

  const handleAddOrderToTable = useCallback(() => {
    setTouchedFields(new Set(["protein", "soup", "principle", "salad", "drink", "extra"]));
    const errors = validateOrder();
    
    if (errors.length > 0) {
      setValidationErrors(errors);
      toast.error("Completa los campos requeridos");
      return;
    }

    const currentLooseItems = [...looseItems];
    
    // Automatically add Packaging Fee if applicable
    if ((selectedOrderType === OrderType.TAKE_OUT || selectedOrderType === OrderType.DELIVERY) && packagingFee > 0) {
      const existingFee = currentLooseItems.find(i => i.name === "Portacomida");
      if (!existingFee) {
        currentLooseItems.push({
          id: -1, // Virtual ID
          name: "Portacomida",
          price: packagingFee,
          quantity: 1
        });
      }
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
      looseItems: currentLooseItems,
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

  const handleConfirmTableOrders = useCallback(async (isFastHistoricalEntry: boolean = false) => {
    if (!selectedTable && selectedOrderType === OrderType.DINE_IN) {
      toast.error("Selecciona una mesa primero");
      return;
    }

    setShowSummaryModal(false);

    // Transform tableOrders into CreateOrderInput[]
    const ordersPayload = tableOrders.map((order) => {
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
        // Include both real items (id > 0) and manual items (id <= 0 like Portacomida)
        items.push({
          menuItemId: item.id > 0 ? item.id : undefined,
          quantity: item.quantity,
          priceAtOrder: item.price,
          notes: item.name,
        });
      });
      
      return {
        type: selectedOrderType!,
        tableId: selectedOrderType === OrderType.DINE_IN ? (selectedTable ?? undefined) : undefined,
        items,
        notes: order.notes,
        createdAt: backdatedDate ? new Date(backdatedDate).toISOString() : undefined,
      };
    }).filter(order => order.items.length > 0);

    if (ordersPayload.length === 0) {
      toast.error("No hay pedidos válidos para crear");
      return;
    }

    try {
      let createdOrdersList: Order[] = [];
      
      if (ordersPayload.length === 1 && selectedOrderType !== OrderType.DINE_IN) {
        // Single order creation (non-table)
        const res = await createOrder(ordersPayload[0]);
        createdOrdersList = [res];
        if (!isFastHistoricalEntry) toast.success("Pedido creado exitosamente");
              } else {
                // Batch creation for tables or multiple services
                // The backend batch logic now unifies these into one order
                const res = await createBatchOrders({
                  tableId: selectedTable || 0,
                  orders: ordersPayload
                });
                
                // Ensure createdOrdersList is an array, handle potential nested structures
                createdOrdersList = res && res.orders ? res.orders : [];
                
                                  if (!isFastHistoricalEntry) {
                                    if (selectedOrderType === OrderType.DINE_IN && selectedTable) {
                                      toast.success(`${ordersPayload.length} productos agregados a Mesa ${selectedTable}`);
                                    } else {
                                      toast.success(`${ordersPayload.length} pedidos creados`);
                                    }
                                  }
                
              }
            // Fast Historical Entry Logic
      if (isFastHistoricalEntry && createdOrdersList && createdOrdersList.length > 0) {
        await Promise.all(createdOrdersList.map(async (createdOrder) => {
          try {
            // 1. Register payment - Marks Order as PAID
            await paymentApi.createPayment(createdOrder.id, {
              method: PaymentMethod.CASH,
              amount: Number(createdOrder.totalAmount)
            });

            // 2. Mark all items as DELIVERED (historical data shouldn't be in kitchen)
            if (createdOrder.items) {
              await Promise.all(createdOrder.items.map(item => 
                orderApi.updateOrderItemStatus(createdOrder.id, item.id, OrderItemStatus.DELIVERED)
              ));
            }
          } catch (payErr) {
            console.error(`Error processing historical payment/items for ${createdOrder.id}:`, payErr);
          }
        }));
        toast.success("Registro histórico guardado y liquidado", { icon: "📜" });
      }

      // Automatically mark table as occupied if it's DINE_IN and NOT historical
      if (selectedOrderType === OrderType.DINE_IN && selectedTable && !isFastHistoricalEntry) {
        updateTableStatus({ id: selectedTable, status: TableStatus.OCCUPIED });
      }
      
      setTableOrders([]);
      setSelectedTable(null);
      setCustomerName("");
      setCustomerPhone("");
      setDeliveryAddress("");
      setPackagingFee(1000);
      clearCurrentOrder();
      
      // Navigate or reset? UseOrderBuilder doesn't have navigate.
      // The parent component handles UI reset via state change (back to type selection)
      setSelectedOrderType(null); 

    } catch (error: unknown) {
      console.error("Order Creation Error:", error);
      let description = "Intenta nuevamente";
      
      if (axios.isAxiosError(error)) {
        description = error.response?.data?.message || error.message;
      } else if (error instanceof Error) {
        description = error.message;
      }
      
      toast.error("Error al crear los pedidos", { description });
    }
  }, [selectedTable, selectedOrderType, tableOrders, createOrder, backdatedDate, updateTableStatus, clearCurrentOrder]);

  const handleSelectOrderType = useCallback((type: OrderType) => {
    setSelectedOrderType(type);
  }, []);

  const handleBackToOrderType = useCallback(() => {
    setSelectedOrderType(null);
    setSelectedTable(null);
    setTableOrders([]);
    setCustomerName("");
    setCustomerPhone("");
    setDeliveryAddress("");
    setPackagingFee(1000);
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
    backdatedDate,
    
    // Customer info
    customerName,
    customerPhone,
    deliveryAddress,
    packagingFee,
    
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
    setBackdatedDate,
    setCustomerName,
    setCustomerPhone,
    setDeliveryAddress,
    setPackagingFee,
    
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
