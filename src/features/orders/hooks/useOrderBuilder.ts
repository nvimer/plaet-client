/**
 * useOrderBuilder Hook
 * Manages order creation state and logic.
 * Refactored into smaller sub-hooks and pure logic functions for better maintainability.
 * Integrated with useOrderBuilderStore for total persistence and resilience.
 */

import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { getLocalDateString } from "@/utils/dateUtils";
import { ROUTES } from "@/app/routes";
import { useCreateOrder, useBatchCreateOrders } from "./useCreateOrder";
import { useTables } from "@/features/tables";
import { useItems, useCategories } from "@/features/menu";
import { useDailyMenuByDate } from "@/features/daily-menu/hooks";
import { OrderItemStatus, OrderType, OrderStatus } from "@/types";
import { logger } from "@/utils";
import type { DailyMenuResponse } from "@/services/dailyMenuApi";
import { useOrderBuilderStore } from "@/stores/useOrderBuilderStore";
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

// Logic, Sub-hooks and Stores
import { useCustomerLookup } from "./useCustomerLookup";
import { useOrderPricing } from "./useOrderPricing";
import { buildOrderNotesString, extractManualNotes } from "../logic/noteLogic";
import { validateOrderDraft } from "../logic/validationLogic";

export interface UseOrderBuilderReturn {
  // Loading states
  isLoading: boolean;
  isMenuLoading: boolean;
  isPending: boolean;
  
  // Data
  tables: Array<{ id: number; status: string }>;
  availableTables: Array<{ id: number; status: string }>;
  menuItems: Array<{ id: number; name: string; price: string; isAvailable: boolean }> | undefined;
  dailyMenuData: DailyMenuResponse | undefined;
  
  // Order type and table state
  selectedOrderType: OrderType | null;
  selectedTable: number | null;
  tableOrders: TableOrder[];
  currentOrderIndex: number | null;
  backdatedDate: string | null;
  isHistoricalMode: boolean;
  
  // Customer info
  customerName: string;
  customerPhone: string;
  customerPhone2: string;
  deliveryAddress: string;
  address2: string;
  hasCustomerData: boolean;
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
  setIsHistoricalMode: (isHistorical: boolean) => void;
  setCustomerName: (name: string) => void;
  setCustomerPhone: (phone: string) => void;
  setCustomerPhone2: (phone: string) => void;
  setDeliveryAddress: (address: string) => void;
  setAddress2: (address: string) => void;
  setHasCustomerData: (hasData: boolean) => void;
  packagingQuantity: number;
  setPackagingQuantity: (qty: number) => void;
  
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
  // 1. Core State from Zustand Store (Persistent)
  const {
    selectedOrderType, setSelectedOrderType,
    selectedTable, setSelectedTable,
    tableOrders, setTableOrders,
    currentOrderIndex, setCurrentOrderIndex,
    backdatedDate, setBackdatedDate,
    isHistoricalMode, setIsHistoricalMode,
    selectedProtein, setSelectedProtein,
    selectedSoup, setSelectedSoup,
    selectedPrinciple, setSelectedPrinciple,
    selectedSalad, setSelectedSalad,
    selectedDrink, setSelectedDrink,
    selectedExtra, setSelectedExtra,
    selectedRice, setSelectedRice,
    replacements, setReplacements,
    looseItems, setLooseItems,
    orderNotes, setOrderNotes,
    packagingFee, setPackagingFee,
    packagingQuantity, setPackagingQuantity,
    hasCustomerData, setHasCustomerData,
    customerName, setCustomerName,
    customerPhone, setCustomerPhone,
    customerPhone2, setCustomerPhone2,
    deliveryAddress, setDeliveryAddress,
    address2, setAddress2,
    resetDraft, clearAll
  } = useOrderBuilderStore();

  // 2. Transiente UI State (Not persistent)
  const [searchTerm, setSearchTerm] = useState("");
  const [showDailyMenu, setShowDailyMenu] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  // 3. Sub-hooks for specialized state
  const customerLookup = useCustomerLookup();
  const { 
    // Customer search state and functions (these are local, not from store)
    searchResults,
    isSearching,
    showDropdown,
    searchCustomersByName,
    selectSearchedCustomer,
    clearSearch,
    resetCustomer,
  } = customerLookup;

  const navigate = useNavigate();

  // 4. Data Hooks
  const { data: tablesData, isLoading: tablesLoading } = useTables();
  const { data: menuItems, isLoading: itemsLoading } = useItems(true);
  const { data: categories } = useCategories();
  const dailyMenu = useDailyMenuByDate(backdatedDate || getLocalDateString(new Date()));
  
  const dailyMenuData = dailyMenu.data;
  const menuLoading = dailyMenu.isLoading;

  const { mutateAsync: createOrder, isPending: isCreating } = useCreateOrder();
  const { mutateAsync: createBatchOrders, isPending: isBatchCreating } = useBatchCreateOrders();
  const isPending = isCreating || isBatchCreating;

  const tables = tablesData?.tables || [];
  const availableTables = tables.filter((t) => t.status === "AVAILABLE");

  // 5. Pricing Logic (Encapsulated)
  const currentBasePrice = dailyMenuData ? (Number(dailyMenuData.basePrice) || 3000) : 0;
  const { lunchPrice, currentOrderTotal, tableTotal } = useOrderPricing(
    currentBasePrice,
    selectedProtein,
    looseItems,
    packagingFee,
    packagingQuantity,
    tableOrders
  );

  // 6. Effects
  useEffect(() => {
    // Proactive UI: Show daily menu options as soon as they are configured
    if (dailyMenuData && !showDailyMenu) {
      setShowDailyMenu(true);
    }
  }, [dailyMenuData, showDailyMenu, setShowDailyMenu]);

  useEffect(() => {
    // Sync packaging quantity with order type if it's currently unset (0)
    // and we are not in DINE_IN mode.
    if (selectedOrderType && selectedOrderType !== OrderType.DINE_IN && packagingQuantity === 0 && tableOrders.length === 0) {
      setPackagingQuantity(1);
    }
  }, [selectedOrderType, packagingQuantity, tableOrders.length, setPackagingQuantity]);

  useEffect(() => {
    if (dailyMenuData?.packagingFee) {
      setPackagingFee(Number(dailyMenuData.packagingFee));
    }
  }, [dailyMenuData, setPackagingFee]);

  // 7. Computed Values (Memoized)
  const popularProducts = useMemo(() => {
    if (!menuItems || !Array.isArray(menuItems) || !dailyMenuData) return [];
    
    // Categories to prioritize by keyword (Drinks and Extras)
    const priorityKeywords = ["gaseosa", "jugo", "agua", "pony", "cerveza"];

    // Return all available items, sorted by priority and name
    return menuItems
      .filter(item => item.isAvailable)
      .sort((a, b) => {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        const aHasPriority = priorityKeywords.some(key => aName.includes(key));
        const bHasPriority = priorityKeywords.some(key => bName.includes(key));
        if (aHasPriority && !bHasPriority) return -1;
        if (!aHasPriority && bHasPriority) return 1;
        return a.name.localeCompare(b.name);
      })
      .slice(0, 24) // Show more items for efficiency
      .map(item => ({
        id: item.id,
        name: item.name,
        price: parseFloat(String(item.price || 0)) || 0
      }));
  }, [menuItems, dailyMenuData]);

  const proteins = useMemo(() => {
    if (!dailyMenuData?.proteinOptions) return [];
    return dailyMenuData.proteinOptions.map((item: ProteinOption) => ({
      ...item,
      isAvailable: true,
      categoryName: dailyMenuData.proteinCategory?.name,
    }));
  }, [dailyMenuData]);

  const filteredLooseItems = useMemo(() => {
    if (!menuItems) return [];
    
    return menuItems.filter(
      (item) =>
        item.isAvailable &&
        (searchTerm === "" || item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [menuItems, searchTerm]);

  const dailyMenuDisplay = useMemo(() => {
    const defaultMenu = {
      soupOptions: [], 
      principleOptions: [], 
      saladOptions: [], 
      extraOptions: [],
      drinkOptions: [], 
      dessertOptions: [], 
      riceOptions: [], 
      riceOption: null,
      basePrice: 0, 
      isConfigured: false,
    };

    if (!dailyMenuData) return defaultMenu;
    
    // Total defensive mapping
    const soupOptions = dailyMenuData?.soupOptions || [];
    const principleOptions = dailyMenuData?.principleOptions || [];
    const saladOptions = dailyMenuData?.saladOptions || [];
    const extraOptions = dailyMenuData?.extraOptions || [];
    const drinkOptions = dailyMenuData?.drinkOptions || [];
    const dessertOptions = dailyMenuData?.dessertOptions || [];
    const riceOptions = dailyMenuData?.riceOptions || [];

    return {
      soupOptions,
      principleOptions,
      saladOptions,
      extraOptions,
      drinkOptions,
      dessertOptions,
      riceOptions,
      riceOption: riceOptions[0] || null,
      basePrice: Number(dailyMenuData?.basePrice || 0) || 3000,
      isConfigured: true,
    };
  }, [dailyMenuData]);

  const dailyMenuPrices = useMemo(() => ({
    basePrice: dailyMenuData ? (Number(dailyMenuData.basePrice) || 3000) : 0,
    isConfigured: !!dailyMenuData,
  }), [dailyMenuData]);

  // Auto-select single options
  useEffect(() => {
    if (dailyMenuDisplay.isConfigured) {
      const { soupOptions, principleOptions, saladOptions, drinkOptions, extraOptions, riceOptions } = dailyMenuDisplay;
      if (soupOptions.length === 1 && !selectedSoup) setSelectedSoup(soupOptions[0]);
      if (principleOptions.length === 1 && !selectedPrinciple) setSelectedPrinciple(principleOptions[0]);
      if (saladOptions.length === 1 && !selectedSalad) setSelectedSalad(saladOptions[0]);
      if (drinkOptions.length === 1 && !selectedDrink) setSelectedDrink(drinkOptions[0]);
      if (extraOptions.length === 1 && !selectedExtra) setSelectedExtra(extraOptions[0]);
      if (riceOptions.length === 1 && !selectedRice) setSelectedRice(riceOptions[0]);
    }
  }, [dailyMenuDisplay, selectedSoup, selectedPrinciple, selectedSalad, selectedDrink, selectedExtra, selectedRice, setSelectedSoup, setSelectedPrinciple, setSelectedSalad, setSelectedDrink, setSelectedExtra, setSelectedRice]);

  // 8. Callbacks and Handlers (Delegating to Logic)
  const validateOrder = useCallback(() => {
    return validateOrderDraft({
      selectedProtein, 
      looseItems,
      soupOptions: dailyMenuDisplay?.soupOptions || [],
      principleOptions: dailyMenuDisplay?.principleOptions || [],
      saladOptions: dailyMenuDisplay?.saladOptions || [],
      drinkOptions: dailyMenuDisplay?.drinkOptions || [],
      extraOptions: dailyMenuDisplay?.extraOptions || [],
      riceOptions: dailyMenuDisplay?.riceOptions || [],
      selectedSoup, 
      selectedPrinciple, 
      selectedSalad, 
      selectedDrink, 
      selectedExtra, 
      selectedRice,
      selectedOrderType, 
      selectedTable, 
      customerName, 
      customerPhone, 
      deliveryAddress, 
      hasCustomerData
    });
  }, [selectedProtein, looseItems, dailyMenuDisplay, selectedSoup, selectedPrinciple, selectedSalad, selectedDrink, selectedExtra, selectedRice, selectedOrderType, selectedTable, customerName, customerPhone, deliveryAddress, hasCustomerData]);

  const hasError = useCallback((field: string) => {
    return validationErrors.some(e => e.field === field) && touchedFields.has(field);
  }, [validationErrors, touchedFields]);

  const buildOrderNotes = useCallback(() => {
    return buildOrderNotesString({
      selectedOrderType, customerName, customerPhone, deliveryAddress,
      selectedProtein, replacements, manualNotes: orderNotes
    });
  }, [selectedOrderType, customerName, customerPhone, deliveryAddress, selectedProtein, replacements, orderNotes]);

  const handleAddLooseItem = useCallback((item: { id: number; name: string; price: number }) => {
    setLooseItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        if (existing.quantity <= 1) return prev.filter((i) => i.id !== item.id);
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i));
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }, [setLooseItems]);

  const handleUpdateLooseItemQuantity = useCallback((id: number, quantity: number) => {
    setLooseItems((prev) => 
      quantity <= 0 ? prev.filter((i) => i.id !== id) : prev.map((i) => (i.id === id ? { ...i, quantity } : i))
    );
  }, [setLooseItems]);

  const clearCurrentOrder = useCallback(() => {
    resetDraft();
    setSearchTerm("");
    setPackagingQuantity(selectedOrderType === OrderType.DINE_IN ? 0 : 1);
  }, [resetDraft, selectedOrderType]);

  const handleAddOrderToTable = useCallback(() => {
    setTouchedFields(new Set(["protein", "soup", "principle", "salad", "drink", "extra"]));
    const errors = validateOrder();
    
    if (errors.length > 0) {
      setValidationErrors(errors);
      toast.error("Completa los campos requeridos");
      return;
    }

    const currentLooseItems = [...looseItems];
    if (packagingQuantity > 0 && packagingFee > 0) {
      currentLooseItems.push({ id: -1, name: "Portacomida", price: packagingFee, quantity: packagingQuantity });
    }

    const lunchSelection: LunchSelection | null = selectedProtein ? {
      soup: selectedSoup, principle: selectedPrinciple, salad: selectedSalad,
      drink: selectedDrink, extra: selectedExtra, protein: selectedProtein,
      rice: selectedRice || dailyMenuDisplay.riceOption || null,
      replacements: [...replacements],
    } : null;

    const newOrder: TableOrder = {
      id: Date.now().toString(),
      protein: selectedProtein,
      lunch: lunchSelection,
      lunchPrice: lunchPrice,
      looseItems: currentLooseItems,
      total: currentOrderTotal,
      notes: buildOrderNotes(),
      createdAt: Date.now(),
    };

    setTableOrders((prev) => 
      currentOrderIndex !== null 
        ? prev.map((order, idx) => (idx === currentOrderIndex ? newOrder : order))
        : [...prev, newOrder]
    );

    toast.success(currentOrderIndex !== null ? "Pedido actualizado" : `Pedido #${tableOrders.length + 1} agregado`);
    clearCurrentOrder();
    setValidationErrors([]);
    setTouchedFields(new Set());
  }, [selectedProtein, selectedSoup, selectedPrinciple, selectedSalad, selectedDrink, selectedExtra, selectedRice, dailyMenuDisplay.riceOption, replacements, looseItems, currentOrderTotal, buildOrderNotes, currentOrderIndex, tableOrders.length, validateOrder, clearCurrentOrder, packagingFee, packagingQuantity, setTableOrders]);

  const handleEditOrder = useCallback((index: number) => {
    const order = tableOrders[index];
    if (!order) return;
    
    setCurrentOrderIndex(index);
    setSelectedProtein(order.protein);
    
    if (order.lunch && typeof order.lunch === "object" && order.lunch !== null) {
      const lunch = order.lunch as {
        soup?: unknown;
        principle?: unknown;
        salad?: unknown;
        drink?: unknown;
        extra?: unknown;
        rice?: unknown;
        replacements?: unknown;
      };
      setSelectedSoup(lunch.soup as never ?? null);
      setSelectedPrinciple(lunch.principle as never ?? null);
      setSelectedSalad(lunch.salad as never ?? null);
      setSelectedDrink(lunch.drink as never ?? null);
      setSelectedExtra(lunch.extra as never ?? null);
      setSelectedRice(lunch.rice as never ?? null);
      setReplacements(Array.isArray(lunch.replacements) ? [...lunch.replacements] : []);
    } else {
      setSelectedSoup(null);
      setSelectedPrinciple(null);
      setSelectedSalad(null);
      setSelectedDrink(null);
      setSelectedExtra(null);
      setSelectedRice(null);
      setReplacements([]);
    }
    
    const packagingItem = order.looseItems.find(i => i.name === "Portacomida");
    if (packagingItem) {
      setPackagingQuantity(packagingItem.quantity);
      setLooseItems(order.looseItems.filter(i => i.name !== "Portacomida"));
    } else {
      setPackagingQuantity(selectedOrderType === OrderType.DINE_IN ? 0 : 1);
      setLooseItems([...order.looseItems]);
    }

    setOrderNotes(extractManualNotes(order.notes || ""));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [tableOrders, selectedOrderType, setCurrentOrderIndex, setSelectedProtein, setSelectedSoup, setSelectedPrinciple, setSelectedSalad, setSelectedDrink, setSelectedExtra, setSelectedRice, setReplacements, setLooseItems, setOrderNotes]);

  const handleRemoveOrder = useCallback((index: number) => {
    setTableOrders((prev) => prev.filter((_, i) => i !== index));
    if (currentOrderIndex === index) clearCurrentOrder();
    toast.success("Pedido eliminado");
  }, [currentOrderIndex, clearCurrentOrder, setTableOrders]);

  const handleDuplicateOrder = useCallback((index: number) => {
    setTableOrders((prev) => [...prev, { ...prev[index], id: Date.now().toString(), createdAt: Date.now() }]);
    toast.success("Pedido duplicado");
  }, [setTableOrders]);

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
    const todayStr = getLocalDateString(new Date());

    const ordersPayload = tableOrders.map((order) => {
      const items: OrderItemInput[] = [];
      
      if (order.protein && order.protein.id > 0) {
        items.push({
          menuItemId: order.protein.id,
          quantity: 1,
          priceAtOrder: order.lunchPrice,
          notes: `Almuerzo: ${order.protein.name}${order.notes ? ` - ${order.notes}` : ""}`,
        });
      }

      order.looseItems.forEach((item) => {
        items.push({
          menuItemId: item.id > 0 ? item.id : undefined,
          quantity: item.quantity,
          priceAtOrder: item.price,
          notes: item.name,
        });
      });
      
      // For DINE_IN orders, force "Consumidor Final" as customer
      const isDineInOrder = selectedOrderType === OrderType.DINE_IN;
      
      return {
        type: selectedOrderType!,
        tableId: isDineInOrder ? (selectedTable ?? undefined) : undefined,
        customerId: isDineInOrder ? undefined : (hasCustomerData ? (customerId || undefined) : undefined),
        customerName: isDineInOrder ? "Consumidor Final" : (hasCustomerData ? (customerName.trim() || undefined) : "Consumidor Final"),
        customerPhone: isDineInOrder ? "0000000000" : (hasCustomerData ? (customerPhone.replace(/\D/g, "") || undefined) : "0000000000"),
        customerPhone2: isDineInOrder ? undefined : (hasCustomerData ? (customerPhone2.replace(/\D/g, "") || undefined) : undefined),
        address1: isDineInOrder ? undefined : (hasCustomerData ? (deliveryAddress.trim() || undefined) : undefined),
        address2: isDineInOrder ? undefined : (hasCustomerData ? (address2.trim() || undefined) : undefined),
        items,
        notes: order.notes,
        createdAt: (backdatedDate && backdatedDate !== todayStr) 
          ? new Date(backdatedDate).toISOString() 
          : undefined,
        status: isFastHistoricalEntry ? OrderStatus.PAID : undefined,
        itemStatus: isFastHistoricalEntry ? OrderItemStatus.DELIVERED : undefined,
      };
    }).filter(order => order.items.length > 0);

    if (ordersPayload.length === 0) {
      toast.error("No hay pedidos válidos para crear");
      return;
    }

    try {
      if (ordersPayload.length === 1 && selectedOrderType !== OrderType.DINE_IN) {
        await createOrder(ordersPayload[0]);
        if (!isFastHistoricalEntry) toast.success("Pedido creado exitosamente");
      } else {
        await createBatchOrders({
          tableId: selectedOrderType === OrderType.DINE_IN ? (selectedTable || undefined) : undefined,
          orders: ordersPayload
        });
        
        if (!isFastHistoricalEntry) {
          if (selectedOrderType === OrderType.DINE_IN && selectedTable) {
            toast.success(`${ordersPayload.length} productos agregados a Mesa ${selectedTable}`);
          } else {
            toast.success(`${ordersPayload.length} pedidos creados`);
          }
        }
      }

      if (isFastHistoricalEntry) {
        toast.success("Registro histórico guardado", { icon: "📜" });
      }

      clearAll();
      resetCustomer();
      setPackagingFee(Number(dailyMenuData?.packagingFee || 1000));
      
      // Navigate to Orders Hub after successful creation
      navigate(ROUTES.ORDERS);

    } catch (error: unknown) {
      logger.error("Order Creation Error", error instanceof Error ? error : new Error(String(error)));
      let description = "Intenta nuevamente";
      if (axios.isAxiosError(error)) description = error.response?.data?.message || error.message;
      else if (error instanceof Error) description = error.message;
      toast.error("Error al crear los pedidos", { description });
    }
  }, [selectedTable, selectedOrderType, tableOrders, createOrder, backdatedDate, clearAll, createBatchOrders, customerName, customerPhone, deliveryAddress, address2, customerPhone2, dailyMenuData, resetCustomer]);

  const handleSelectOrderType = useCallback((type: OrderType) => {
    setSelectedOrderType(type);
    // Auto-set packaging based on type
    if (type === OrderType.DINE_IN) {
      setPackagingQuantity(0);
    } else {
      setPackagingQuantity(1);
    }
    // Auto-enable customer data for delivery and take-out orders
    if (type === OrderType.DELIVERY || type === OrderType.TAKE_OUT) {
      setHasCustomerData(true);
      // Scroll to top for better UX when capturing customer data
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [setSelectedOrderType, setPackagingQuantity, setHasCustomerData]);

  const handleBackToOrderType = useCallback(() => {
    clearAll();
    resetCustomer();
    if (dailyMenuData?.packagingFee) {
      setPackagingFee(Number(dailyMenuData.packagingFee));
    }
  }, [clearAll, dailyMenuData, resetCustomer, setPackagingFee]);

  return {
    // ============================================
    // 1. LOADING STATES
    // ============================================
    isLoading: tablesLoading || itemsLoading,
    isMenuLoading: menuLoading,
    isPending,

    // ============================================
    // 2. DATA (from external APIs)
    // ============================================
    tables,
    availableTables,
    menuItems,
    dailyMenuData,

    // ============================================
    // 3. STATE VALUES (from Zustand Store)
    // ============================================
    // Order type & table
    selectedOrderType,
    selectedTable,
    // Table orders
    tableOrders,
    currentOrderIndex,
    // Historical mode
    backdatedDate,
    isHistoricalMode,
    // Customer data
    customerId,
    customerName,
    customerPhone,
    customerPhone2,
    deliveryAddress,
    address2,
    hasCustomerData,
    // Menu selections
    packagingFee,
    selectedProtein,
    looseItems,
    searchTerm,
    showDailyMenu,
    orderNotes,
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
    // Computed data from sub-hooks
    proteins,
    filteredLooseItems,
    dailyMenuDisplay,
    dailyMenuPrices,
    lunchPrice,
    currentOrderTotal,
    tableTotal,
    popularProducts,
    // Customer search (local state)
    searchResults,
    isSearching,
    showDropdown,
    // Packaging
    packagingQuantity,

    // ============================================
    // 4. SETTERS (from Zustand Store - direct, no wrappers)
    // ============================================
    // Order type & table
    setSelectedOrderType,
    setSelectedTable,
    // Search & Menu
    setSearchTerm,
    setShowDailyMenu,
    setOrderNotes,
    // Order state
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
    // Historical mode
    setBackdatedDate,
    setIsHistoricalMode,
    // Customer
    setCustomerName,
    setCustomerPhone,
    setCustomerPhone2,
    setDeliveryAddress,
    setAddress2,
    setHasCustomerData,
    // Packaging
    setPackagingQuantity,

    // ============================================
    // 5. SEARCH FUNCTIONS (from customerLookup)
    // ============================================
    searchCustomersByName,
    selectSearchedCustomer,
    clearSearch,
    resetCustomer,

    // ============================================
    // 6. HANDLERS (complex logic)
    // ============================================
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
    validateOrder,
    hasError,
    buildOrderNotes,
  };
}
