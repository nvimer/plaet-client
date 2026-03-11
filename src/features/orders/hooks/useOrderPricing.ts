import { useMemo } from "react";
import type { 
  ProteinOption, 
  LooseItem, 
  TableOrder 
} from "../types/orderBuilder";
import { 
  calculateLunchPrice, 
  calculateCurrentOrderTotal, 
  calculateTableTotal 
} from "../logic/pricingLogic";

/**
 * useOrderPricing Hook
 * Encapsulates pricing calculations for the order builder.
 */
export function useOrderPricing(
  dailyMenuBasePrice: number,
  selectedProtein: ProteinOption | null,
  looseItems: LooseItem[],
  packagingFee: number,
  packagingQuantity: number,
  tableOrders: TableOrder[]
) {
  const lunchPrice = useMemo(() => 
    calculateLunchPrice(dailyMenuBasePrice, selectedProtein),
  [dailyMenuBasePrice, selectedProtein]);

  const currentOrderTotal = useMemo(() => 
    calculateCurrentOrderTotal(lunchPrice, looseItems, packagingFee, packagingQuantity),
  [lunchPrice, looseItems, packagingFee, packagingQuantity]);

  const tableTotal = useMemo(() => 
    calculateTableTotal(tableOrders),
  [tableOrders]);

  return {
    lunchPrice,
    currentOrderTotal,
    tableTotal,
  };
}
