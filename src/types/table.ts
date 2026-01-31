import { TableStatus } from "./enums";

export interface Table {
  id: number;
  number: string; // Number of Table
  status: TableStatus;
  location?: string;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
  deletedAt?: string;
}

/**
 * Data for creating a table
 * Used in POST /tables
 */
export interface CreateTableInput {
  number: string;
  status?: TableStatus;
  location?: string;
}

/**
 * Data for creating a table
 * Used in PATCH /tables/:id
 */
export interface UpdateTableInput {
  number?: string;
  status?: TableStatus;
  location?: string;
}

/**
 * Data for update only the state of the table
 * Used in the PATCH /tables/:id/status
 */
export interface UpdateTableStatusInput {
  status: TableStatus;
}

/**
 * Table filters interface for advanced filtering
 */
export interface TableFilters {
  search: string;
  status: TableStatus | 'ALL';
  location?: string;
}

/**
 * Active filter chip configuration
 */
export interface ActiveFilterChip {
  key: keyof TableFilters;
  label: string;
  value: string;
  onRemove: () => void;
}

/**
 * Filter configuration for dynamic filter generation
 */
export interface FilterConfig {
  key: keyof TableFilters;
  label: string;
  type: 'text' | 'select' | 'multiselect';
  options?: Array<{ label: string; value: any }>;
}
