import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { OrderType } from "@/types";
import type { 
  ProteinOption, 
  LooseItem, 
  TableOrder, 
  MenuOption 
} from "../features/orders/types/orderBuilder";
import type { Replacement } from "../features/orders/components";

interface OrderBuilderState {
  // Order type and table
  selectedOrderType: OrderType | null;
  selectedTable: number | null;
  tableOrders: TableOrder[];
  currentOrderIndex: number | null;
  backdatedDate: string | null;
  isHistoricalMode: boolean;
  
  // Customer info
  customerId: string | null;
  customerName: string;
  customerPhone: string;
  customerPhone2: string;
  deliveryAddress: string;
  address2: string;
  hasCustomerData: boolean;
  
  // Current draft selections
  selectedProtein: ProteinOption | null;
  selectedSoup: MenuOption | null;
  selectedPrinciple: MenuOption | null;
  selectedSalad: MenuOption | null;
  selectedDrink: MenuOption | null;
  selectedExtra: MenuOption | null;
  selectedRice: MenuOption | null;
  replacements: Replacement[];
  looseItems: LooseItem[];
  orderNotes: string;
  packagingFee: number;
  packagingQuantity: number;
  
  // Actions
  setSelectedOrderType: (type: OrderType | null) => void;
  setSelectedTable: (table: number | null) => void;
  setTableOrders: (orders: TableOrder[] | ((prev: TableOrder[]) => TableOrder[])) => void;
  setCurrentOrderIndex: (index: number | null) => void;
  setBackdatedDate: (date: string | null) => void;
  setIsHistoricalMode: (isHistorical: boolean) => void;
  
  setCustomerId: (id: string | null) => void;
  setCustomerName: (name: string) => void;
  setCustomerPhone: (phone: string) => void;
  setCustomerPhone2: (phone: string) => void;
  setDeliveryAddress: (address: string) => void;
  setAddress2: (address: string) => void;
  setHasCustomerData: (hasData: boolean) => void;
  
  setSelectedProtein: (protein: ProteinOption | null) => void;
  setSelectedSoup: (soup: MenuOption | null) => void;
  setSelectedPrinciple: (principle: MenuOption | null) => void;
  setSelectedSalad: (salad: MenuOption | null) => void;
  setSelectedDrink: (drink: MenuOption | null) => void;
  setSelectedExtra: (extra: MenuOption | null) => void;
  setSelectedRice: (rice: MenuOption | null) => void;
  setReplacements: (replacements: Replacement[]) => void;
  setLooseItems: (items: LooseItem[] | ((prev: LooseItem[]) => LooseItem[])) => void;
  setOrderNotes: (notes: string) => void;
  setPackagingFee: (fee: number) => void;
  setPackagingQuantity: (qty: number) => void;
  resetDraft: () => void;
  clearAll: () => void;
}

export const useOrderBuilderStore = create<OrderBuilderState>()(
  persist(
    (set) => ({
      // Initial State
      selectedOrderType: null,
      selectedTable: null,
      tableOrders: [],
      currentOrderIndex: null,
      backdatedDate: null,
      isHistoricalMode: false,
      
      customerId: null,
      customerName: "",
      customerPhone: "",
      customerPhone2: "",
      deliveryAddress: "",
      address2: "",
      hasCustomerData: false,
      
      selectedProtein: null,
      selectedSoup: null,
      selectedPrinciple: null,
      selectedSalad: null,
      selectedDrink: null,
      selectedExtra: null,
      selectedRice: null,
      replacements: [],
      looseItems: [],
      orderNotes: "",
      packagingFee: 1000,
      packagingQuantity: 0,

      // Actions
      setSelectedOrderType: (selectedOrderType) => set({ selectedOrderType }),
      setSelectedTable: (selectedTable) => set({ selectedTable }),
      setTableOrders: (orders) => set((state) => ({ 
        tableOrders: typeof orders === 'function' ? orders(state.tableOrders) : orders 
      })),
      setCurrentOrderIndex: (currentOrderIndex) => set({ currentOrderIndex }),
      setBackdatedDate: (backdatedDate) => set({ backdatedDate }),
      setIsHistoricalMode: (isHistoricalMode) => set({ isHistoricalMode }),
      
      setCustomerId: (customerId) => set({ customerId }),
      setCustomerName: (customerName) => set({ customerName }),
      setCustomerPhone: (customerPhone) => set({ customerPhone }),
      setCustomerPhone2: (customerPhone2) => set({ customerPhone2 }),
      setDeliveryAddress: (deliveryAddress) => set({ deliveryAddress }),
      setAddress2: (address2) => set({ address2 }),
      setHasCustomerData: (hasCustomerData) => set({ hasCustomerData }),
      
      setSelectedProtein: (selectedProtein) => set({ selectedProtein }),
      setSelectedSoup: (selectedSoup) => set({ selectedSoup }),
      setSelectedPrinciple: (selectedPrinciple) => set({ selectedPrinciple }),
      setSelectedSalad: (selectedSalad) => set({ selectedSalad }),
      setSelectedDrink: (selectedDrink) => set({ selectedDrink }),
      setSelectedExtra: (selectedExtra) => set({ selectedExtra }),
      setSelectedRice: (selectedRice) => set({ selectedRice }),
      setReplacements: (replacements) => set({ replacements }),
      setLooseItems: (items) => set((state) => ({ 
        looseItems: typeof items === 'function' ? items(state.looseItems) : items 
      })),
      setOrderNotes: (orderNotes) => set({ orderNotes }),
      setPackagingFee: (packagingFee) => set({ packagingFee }),
      setPackagingQuantity: (packagingQuantity) => set({ packagingQuantity }),
      
      resetDraft: () => set({
        selectedProtein: null,
        selectedSoup: null,
        selectedPrinciple: null,
        selectedSalad: null,
        selectedDrink: null,
        selectedExtra: null,
        selectedRice: null,
        replacements: [],
        looseItems: [],
        orderNotes: "",
        currentOrderIndex: null,
        packagingQuantity: 0,
      }),

      clearAll: () => set({
        selectedOrderType: null,
        selectedTable: null,
        tableOrders: [],
        currentOrderIndex: null,
        customerId: null,
        customerName: "",
        customerPhone: "",
        customerPhone2: "",
        deliveryAddress: "",
        address2: "",
        hasCustomerData: false,
        selectedProtein: null,
        selectedSoup: null,
        selectedPrinciple: null,
        selectedSalad: null,
        selectedDrink: null,
        selectedExtra: null,
        selectedRice: null,
        replacements: [],
        looseItems: [],
        orderNotes: "",
        packagingQuantity: 0,
      }),
    }),
    {
      name: "plaet-order-builder-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist items that matter for continuity
        selectedTable: state.selectedTable,
        tableOrders: state.tableOrders,
        customerId: state.customerId,
        customerName: state.customerName,
        customerPhone: state.customerPhone,
        customerPhone2: state.customerPhone2,
        deliveryAddress: state.deliveryAddress,
        address2: state.address2,
        hasCustomerData: state.hasCustomerData,
        selectedProtein: state.selectedProtein,
        selectedSoup: state.selectedSoup,
        selectedPrinciple: state.selectedPrinciple,
        selectedSalad: state.selectedSalad,
        selectedDrink: state.selectedDrink,
        selectedExtra: state.selectedExtra,
        selectedRice: state.selectedRice,
        replacements: state.replacements,
        looseItems: state.looseItems,
        orderNotes: state.orderNotes,
        packagingFee: state.packagingFee,
        packagingQuantity: state.packagingQuantity,
        backdatedDate: state.backdatedDate,
        isHistoricalMode: state.isHistoricalMode,
        // NOT persisted: selectedOrderType, currentOrderIndex
        // These should reset when user returns to create new order
      }),
      onRehydrateStorage: () => (state) => {
        // Reset transient UI state after hydration to prevent stale data persistence
        if (state) {
          state.setSelectedOrderType(null);
          state.setCurrentOrderIndex(null);
        }
      },
    }
  )
);
