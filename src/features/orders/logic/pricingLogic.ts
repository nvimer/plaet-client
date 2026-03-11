import type { 
  ProteinOption, 
  LooseItem, 
  TableOrder 
} from "../types/orderBuilder";

/**
 * Calculates the price of a single lunch based on base price and selected protein.
 */
export const calculateLunchPrice = (
  basePrice: number,
  selectedProtein: ProteinOption | null
): number => {
  if (!selectedProtein) return 0;
  return Number(basePrice) + Number(selectedProtein.price);
};

/**
 * Calculates the total for the current order draft.
 */
export const calculateCurrentOrderTotal = (
  lunchPrice: number,
  looseItems: LooseItem[],
  packagingFee: number,
  packagingQuantity: number
): number => {
  let total = lunchPrice;
  
  looseItems.forEach((item) => {
    total += item.price * item.quantity;
  });
  
  if (packagingQuantity > 0 && packagingFee > 0) {
    total += packagingFee * packagingQuantity;
  }
  
  return total;
};

/**
 * Calculates the accumulated total for all orders on a table.
 */
export const calculateTableTotal = (tableOrders: TableOrder[]): number => {
  return tableOrders.reduce((sum, order) => sum + order.total, 0);
};
