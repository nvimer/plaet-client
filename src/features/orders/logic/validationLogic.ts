import { OrderType } from "@/types";
import type { 
  ProteinOption, 
  LooseItem, 
  MenuOption, 
  ValidationError 
} from "../types/orderBuilder";

interface ValidationParams {
  selectedProtein: ProteinOption | null;
  looseItems: LooseItem[];
  soupOptions: MenuOption[];
  principleOptions: MenuOption[];
  saladOptions: MenuOption[];
  drinkOptions: MenuOption[];
  extraOptions: MenuOption[];
  selectedSoup: MenuOption | null;
  selectedPrinciple: MenuOption | null;
  selectedSalad: MenuOption | null;
  selectedDrink: MenuOption | null;
  selectedExtra: MenuOption | null;
  selectedOrderType: OrderType | null;
  selectedTable: number | null;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
}

/**
 * Validates the current order draft and returns a list of errors.
 */
export const validateOrderDraft = ({
  selectedProtein,
  looseItems,
  soupOptions,
  principleOptions,
  saladOptions,
  drinkOptions,
  extraOptions,
  selectedSoup,
  selectedPrinciple,
  selectedSalad,
  selectedDrink,
  selectedExtra,
  selectedOrderType,
  selectedTable,
  customerName,
  customerPhone,
  deliveryAddress,
}: ValidationParams): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  if (!selectedProtein && looseItems.length === 0) {
    errors.push({ field: "protein", message: "Selecciona una proteína o agrega productos" });
  }
  
  if (selectedProtein) {
    if (soupOptions.length > 0 && !selectedSoup) {
      errors.push({ field: "soup", message: "Selecciona una sopa" });
    }
    if (principleOptions.length > 0 && !selectedPrinciple) {
      errors.push({ field: "principle", message: "Selecciona un principio" });
    }
    if (saladOptions.length > 0 && !selectedSalad) {
      errors.push({ field: "salad", message: "Selecciona una ensalada" });
    }
    if (drinkOptions.length > 0 && !selectedDrink) {
      errors.push({ field: "drink", message: "Selecciona un jugo" });
    }
    if (extraOptions.length > 0 && !selectedExtra) {
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
};
