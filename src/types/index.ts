/**
 * EXPORTACIÓN CENTRALIZADA DE TIPOS
 *
 * Este archivo permite importar todos los tipos desde un solo lugar:
 * import { Order, MenuItem, User } from '@/types'
 *
 * Todos estos tipos están sincronizados con tu backend de Prisma.
 */

// Common types
export type {
  ApiResponse,
  ApiError,
  PaginationParams,
  PaginatedResponse,
  LoadingState,
  ApiErrorResponse,
  AxiosErrorWithResponse,
} from "./common";
export { isApiErrorResponse } from "./common";

// Enums (exported as values)
export * from "./enums";

// Domain types
export type {
  Restaurant,
  CreateRestaurantInput,
  UpdateRestaurantInput,
  RestaurantSearchParams,
} from "./restaurant";
export type {
  User,
  Profile,
  Role,
  UserRole,
  Permission,
  UserWithRolesAndPermissions,
  RegisterInput,
  LoginInput,
  AuthResponse,
  UpdateUserInput,
  ProfileMeResponse,
} from "./user";
export type {
  Table,
  CreateTableInput,
  UpdateTableInput,
  UpdateTableStatusInput,
  TableFilters,
  ActiveFilterChip,
  FilterConfig,
} from "./table";
export type {
  MenuItem,
  MenuCategory,
  CreateMenuCategoryInput,
  UpdateMenuCategoryInput,
  CreateMenuItemInput,
  UpdateMenuItemInput,
  AddStockInput,
  RemoveStockInput,
  StockHistoryEntry,
  DailyStockResetInput,
  InventoryTypeInput,
} from "./menu";
export { InventoryType } from "./menu";
export type {
  Order,
  OrderItem,
  Customer,
  Payment,
  CreateOrderInput,
  CreateOrderItemInput,
  UpdateOrderInput,
  UpdateOrderStatusInput,
  CreatePaymentInput,
} from "./order";

// Analytics types
export type { SalesSummary, TopProduct, DailyAnalytics } from "./analytics";

// Cash Closure types
export type {
  CashClosure,
  CreateCashClosureDTO,
  CloseCashClosureDTO,
} from "./cash-closure";
export { CashClosureStatus } from "./cash-closure";

// Expense types
export type { Expense, CreateExpenseDTO } from "./expense";
