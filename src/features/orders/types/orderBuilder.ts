/**
 * Order Builder Types
 * Types for the order creation flow
 */

import type { Replacement } from "../components";

/**
 * Menu option selection
 */
export interface MenuOption {
  id: number;
  name: string;
}

/**
 * Protein option for lunch
 */
export interface ProteinOption {
  id: number;
  name: string;
  price: number;
  icon?: "beef" | "fish" | "chicken" | "pork" | "other";
  isAvailable: boolean;
  categoryName?: string;
}

/**
 * Loose item (individual product)
 */
export interface LooseItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

/**
 * Complete lunch selection
 */
export interface LunchSelection {
  soup: MenuOption | null;
  principle: MenuOption | null;
  salad: MenuOption | null;
  drink: MenuOption | null;
  extra: MenuOption | null;
  protein: ProteinOption | null;
  rice: MenuOption | null;
  replacements: Replacement[];
}

/**
 * Order for a table
 */
export interface TableOrder {
  id: string;
  protein: ProteinOption | null;
  lunch: LunchSelection | null;
  looseItems: LooseItem[];
  total: number;
  notes?: string;
  createdAt: number;
}

/**
 * Validation error
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Order item input for API
 */
export interface OrderItemInput {
  menuItemId: number;
  quantity: number;
  priceAtOrder: number;
  notes: string;
}
