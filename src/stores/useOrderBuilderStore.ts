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
  
  // Actions
  setSelectedOrderType: (type: OrderType | null) => void;
  setSelectedTable: (table: number | null) => void;
  setTableOrders: (orders: TableOrder[] | ((prev: TableOrder[]) => TableOrder[])) => void;
  setCurrentOrderIndex: (index: number | null) => void;
  setBackdatedDate: (date: string | null) => void;
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

      // Actions
      setSelectedOrderType: (selectedOrderType) => set({ selectedOrderType }),
      setSelectedTable: (selectedTable) => set({ selectedTable }),
      setTableOrders: (orders) => set((state) => ({ 
        tableOrders: typeof orders === 'function' ? orders(state.tableOrders) : orders 
      })),
      setCurrentOrderIndex: (currentOrderIndex) => set({ currentOrderIndex }),
      setBackdatedDate: (backdatedDate) => set({ backdatedDate }),
      
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
      }),

      clearAll: () => set({
        selectedOrderType: null,
        selectedTable: null,
        tableOrders: [],
        currentOrderIndex: null,
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
      }),
    }),
    {
      name: "plaet-order-builder-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
