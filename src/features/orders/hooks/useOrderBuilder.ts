/**
 * useOrderBuilder Hook
 * Manages order creation state and logic
 */

import { useState, useMemo, useEffect, useCallback } from "react";
import { toast } from "sonner";
import axios from "axios";
import { getLocalDateString } from "@/utils/dateUtils";
import { useCreateOrder, useBatchCreateOrders } from "./useCreateOrder";
import { useTables, useUpdateTableStatus } from "@/features/tables";
import { useItems } from "@/features/menu";
import { useDailyMenuToday, useDailyMenuByDate } from "@/features/daily-menu/hooks";
import { OrderType, TableStatus, OrderStatus, PaymentMethod, OrderItemStatus } from "@/types";
import { paymentApi, orderApi, customerApi } from "@/services";
import type { Order } from "@/types";
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
  isMenuLoading: boolean;
  isPending: boolean;
  
  // Data
  tables: Array<{ id: number; status: string }>;
  availableTables: Array<{ id: number; status: string }>;
  menuItems: Array<{ id: number; name: string; price: string; isAvailable: boolean }> | undefined;
  dailyMenuData: any;
  
  // Order type and table state
  selectedOrderType: OrderType | null;
  selectedTable: number | null;
  tableOrders: TableOrder[];
  currentOrderIndex: number | null;
  backdatedDate: string | null;
  
  // Customer info for non-table orders
  customerName: string;
  customerPhone: string;
  customerPhone2: string;
  deliveryAddress: string;
  address2: string;
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
  setCustomerPhone2: (phone: string) => void;
  setDeliveryAddress: (address: string) => void;
  setAddress2: (address: string) => void;
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
  // Order type and table state
  const [selectedOrderType, setSelectedOrderType] = useState<OrderType | null>(null);
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [tableOrders, setTableOrders] = useState<TableOrder[]>([]);
  const [currentOrderIndex, setCurrentOrderIndex] = useState<number | null>(null);
  const [backdatedDate, setBackdatedDate] = useState<string | null>(getLocalDateString(new Date()));

  // Customer info state
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerPhone2, setCustomerPhone2] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState(""); // This is address1
  const [address2, setAddress2] = useState("");

  // Handler for customer name with validation (only letters and spaces)
  const handleSetCustomerName = useCallback((name: string) => {
    // Regex allows letters (including accented ones and ñ) and spaces
    const onlyLetters = name.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
    setCustomerName(onlyLetters);
  }, []);

  // Handler for customer phone with auto-lookup
  const handleSetCustomerPhone = useCallback(async (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, "");
    setCustomerPhone(cleanPhone);

    // If phone has 10 digits, attempt to lookup customer
    if (cleanPhone.length === 10) {
      try {
        const response = await customerApi.getCustomerByPhone(cleanPhone);
        if (response.success && response.data) {
          setCustomerName(`${response.data.firstName} ${response.data.lastName}`.trim());
          setCustomerPhone2(response.data.phone2 || "");
          setDeliveryAddress(response.data.address1 || "");
          setAddress2(response.data.address2 || "");
          
          toast.success("Cliente encontrado", {
            description: `Bienvenido de nuevo, ${response.data.firstName}`,
            icon: "👤",
          });
        }
      } catch (error) {
        // Silent error if customer not found
        console.debug("Customer not found for phone:", cleanPhone);
      }
    }
  }, []);

  const handleSetCustomerPhone2 = useCallback((phone: string) => {
    setCustomerPhone2(phone.replace(/\D/g, ""));
  }, []);
  const [packagingFee, setPackagingFee] = useState(1000);
  const [packagingQuantity, setPackagingQuantity] = useState(0);

  // Data hooks
  const { data: tablesData, isLoading: tablesLoading } = useTables();
  const { data: menuItems, isLoading: itemsLoading } = useItems();
  
  // Daily Menu Data fetching logic
  const dailyMenu = useDailyMenuByDate(backdatedDate || getLocalDateString(new Date()));
  
  const dailyMenuData = dailyMenu.data;
  const menuLoading = dailyMenu.isLoading;

  // Set default quantity when order type changes
  useEffect(() => {
    if (selectedOrderType === OrderType.TAKE_OUT || selectedOrderType === OrderType.DELIVERY) {
      setPackagingQuantity(1);
    } else {
      setPackagingQuantity(0);
    }
  }, [selectedOrderType]);

  // Update packagingFee when dailyMenuData changes
  useEffect(() => {
    if (dailyMenuData?.packagingFee) {
      setPackagingFee(Number(dailyMenuData.packagingFee));
    }
  }, [dailyMenuData]);
  
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

  const popularProducts = useMemo(() => {
    if (!menuItems || !Array.isArray(menuItems)) return [];
    
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

  const dailyMenuPrices = useMemo(() => ({
    basePrice: dailyMenuData?.basePrice || 0,
    isConfigured: !!dailyMenuData,
  }), [dailyMenuData]);

  const proteins = useMemo(() => {
    if (!dailyMenuData?.proteinOptions || dailyMenuData.proteinOptions.length === 0) {
      return [];
    }
    
    return dailyMenuData.proteinOptions.map((item: any) => ({
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

  const lunchPrice = useMemo(() => {
    if (!selectedProtein) return 0;
    return Number(dailyMenuPrices.basePrice) + Number(selectedProtein.price);
  }, [selectedProtein, dailyMenuPrices]);

  const currentOrderTotal = useMemo(() => {
    let total = 0;
    total += lunchPrice;
    looseItems.forEach((item) => {
      total += item.price * item.quantity;
    });
    
    // Add packaging fee based on manual quantity
    if (packagingQuantity > 0 && packagingFee > 0) {
      total += packagingFee * packagingQuantity;
    }
    
    return total;
  }, [lunchPrice, looseItems, packagingFee, packagingQuantity]);

  const tableTotal = useMemo(() => {
    return tableOrders.reduce((sum, order) => sum + order.total, 0);
  }, [tableOrders]);

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

  const buildOrderNotes = useCallback((): string => {
    const sections: string[] = [];

    // 1. Customer Info Section
    if (selectedOrderType === OrderType.TAKE_OUT || selectedOrderType === OrderType.DELIVERY) {
      let customerInfo = `👤 CLIENTE: ${customerName} | 📞 TEL: ${customerPhone}`;
      if (selectedOrderType === OrderType.DELIVERY && deliveryAddress) {
        customerInfo += ` | 📍 DIR: ${deliveryAddress}`;
      }
      sections.push(customerInfo);
    }
    
    // 2. Replacements Section (Dynamic)
    if (selectedProtein && replacements.length > 0) {
      const replText = replacements
        .map(r => `[-] Sin ${r.fromName} [+] Extra ${r.itemName}`)
        .join(" | ");
      sections.push(`🔄 CAMBIOS: ${replText}`);
    }
    
    // 3. Manual User Notes
    if (orderNotes.trim()) {
      // If we are editing, we might have previous auto-notes in the string. 
      // We should ideally only have the manual part here.
      sections.push(`📝 NOTAS: ${orderNotes.trim()}`);
    }
    
    return sections.join("\n-------------------\n");
  }, [selectedProtein, replacements, orderNotes, selectedOrderType, customerName, customerPhone, deliveryAddress]);

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
    setPackagingQuantity(selectedOrderType === OrderType.DINE_IN ? 0 : 1);
  }, [selectedOrderType]);

  const handleAddOrderToTable = useCallback(() => {
    setTouchedFields(new Set(["protein", "soup", "principle", "salad", "drink", "extra"]));
    const errors = validateOrder();
    
    if (errors.length > 0) {
      setValidationErrors(errors);
      toast.error("Completa los campos requeridos");
      return;
    }

    const currentLooseItems = [...looseItems];
    
    // Add Packaging Fee with manual quantity if specified
    if (packagingQuantity > 0 && packagingFee > 0) {
      currentLooseItems.push({
        id: -1,
        name: "Portacomida",
        price: packagingFee,
        quantity: packagingQuantity
      });
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
  }, [selectedProtein, selectedSoup, selectedPrinciple, selectedSalad, selectedDrink, selectedExtra, selectedRice, dailyMenuDisplay.riceOption, replacements, looseItems, currentOrderTotal, buildOrderNotes, currentOrderIndex, tableOrders.length, validateOrder, clearCurrentOrder, packagingFee, packagingQuantity, selectedOrderType]);

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
    
    // Extract packaging quantity if it exists in looseItems
    const packagingItem = order.looseItems.find(i => i.name === "Portacomida");
    if (packagingItem) {
      setPackagingQuantity(packagingItem.quantity);
      setLooseItems(order.looseItems.filter(i => i.name !== "Portacomida"));
    } else {
      setPackagingQuantity(selectedOrderType === OrderType.DINE_IN ? 0 : 1);
      setLooseItems([...order.looseItems]);
    }

    // Extract manual notes by stripping automated sections
    let manualNotes = order.notes || "";
    
    // Split by the divider we use
    const sections = manualNotes.split("\n-------------------\n");
    
    // Filter out sections that start with our automated prefixes
    const manualParts = sections.filter(s => 
      !s.includes("👤 CLIENTE:") && 
      !s.includes("🔄 CAMBIOS:") &&
      !s.startsWith("📝 NOTAS:")
    );

    // Also look for the "📝 NOTAS:" prefix within a section and strip it
    const cleanManualNotes = sections
      .find(s => s.includes("📝 NOTAS:"))
      ?.replace("📝 NOTAS:", "")
      .trim() || manualParts.join("\n").trim();

    setOrderNotes(cleanManualNotes);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [tableOrders, selectedOrderType]);

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

    const todayStr = getLocalDateString(new Date());

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
        customerId: undefined,
        customerName: customerName || undefined,
        customerPhone: customerPhone || undefined,
        customerPhone2: customerPhone2 || undefined,
        address1: deliveryAddress || undefined,
        address2: address2 || undefined,
        items,
        notes: order.notes,
        createdAt: (backdatedDate && backdatedDate !== todayStr) 
          ? new Date(backdatedDate).toISOString() 
          : undefined,
      };
    }).filter(order => order.items.length > 0);

    if (ordersPayload.length === 0) {
      toast.error("No hay pedidos válidos para crear");
      return;
    }

    try {
      let createdOrdersList: Order[] = [];
      
      if (ordersPayload.length === 1 && selectedOrderType !== OrderType.DINE_IN) {
        const res = await createOrder(ordersPayload[0]);
        createdOrdersList = [res];
        if (!isFastHistoricalEntry) toast.success("Pedido creado exitosamente");
      } else {
        const res = await createBatchOrders({
          tableId: selectedOrderType === OrderType.DINE_IN ? (selectedTable || undefined) : undefined,
          orders: ordersPayload as any
        });
        
        createdOrdersList = res && (res as any).orders ? (res as any).orders : [];
        
        if (!isFastHistoricalEntry) {
          if (selectedOrderType === OrderType.DINE_IN && selectedTable) {
            toast.success(`${ordersPayload.length} productos agregados a Mesa ${selectedTable}`);
          } else {
            toast.success(`${ordersPayload.length} pedidos creados`);
          }
        }
      }

      if (isFastHistoricalEntry && createdOrdersList && createdOrdersList.length > 0) {
        await Promise.all(createdOrdersList.map(async (createdOrder) => {
          try {
            await paymentApi.createPayment(createdOrder.id, {
              method: PaymentMethod.CASH,
              amount: Number(createdOrder.totalAmount)
            });

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
      
      setTableOrders([]);
      setSelectedTable(null);
      setCustomerName("");
      setCustomerPhone("");
      setDeliveryAddress("");
      setPackagingFee(Number(dailyMenuData?.packagingFee || 1000));
      clearCurrentOrder();
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
  }, [selectedTable, selectedOrderType, tableOrders, createOrder, backdatedDate, updateTableStatus, clearCurrentOrder, createBatchOrders, customerName, customerPhone, deliveryAddress]);

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
    setPackagingFee(Number(dailyMenuData?.packagingFee || 1000));
    clearCurrentOrder();
  }, [clearCurrentOrder, dailyMenuData]);

  return {
    isLoading: tablesLoading || itemsLoading,
    isMenuLoading: menuLoading,
    isPending,
    tables,
    availableTables,
    menuItems,
    dailyMenuData,
    selectedOrderType,
    selectedTable,
    tableOrders,
    currentOrderIndex,
    backdatedDate,
    customerName,
    customerPhone,
    customerPhone2,
    deliveryAddress,
    address2,
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
    showSummaryModal,
    validationErrors,
    touchedFields,
    proteins,
    filteredLooseItems,
    dailyMenuDisplay,
    dailyMenuPrices,
    lunchPrice,
    currentOrderTotal,
    tableTotal,
    popularProducts,
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
    setCustomerName: handleSetCustomerName,
    setCustomerPhone: handleSetCustomerPhone,
    setCustomerPhone2: handleSetCustomerPhone2,
    setDeliveryAddress,
    setAddress2,
    packagingQuantity,
    setPackagingQuantity,
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
