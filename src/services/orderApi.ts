// ORDERS API SERVICE - Enhanced with missing endpoints

import {
  type Order,
  OrderStatus,
  OrderType,
  type PaginatedResponse,
  type PaginationParams,
  type ApiResponse,
  type CreateOrderInput,
  type UpdateOrderStatusInput,
  type CreateOrderItemInput,
  type CreatePaymentInput,
  type Payment,
  type UpdateOrderInput,
} from "@/types";
import axiosClient from "./axiosClient";

// =================== EXISTING ENDPOINTS ===================

/**
 * GET /orders
 *
 * Get paginated list of orders with optional filters
 *
 * @param params - Pagination and filter params
 * @return Paginated list of orders
 */
export interface OrdersFilterParams extends PaginationParams {
  status?: OrderStatus;
  type?: OrderType;
  tableId?: number;
  waiterId?: string;
  fromDate?: string;
  toDate?: string;
}

export const getOrders = async (params?: OrdersFilterParams) => {
  const { data } = await axiosClient.get<PaginatedResponse<Order>>("/orders", {
    params,
  });
  return data;
};

/**
 * GET /orders/:id
 *
 * Get single order with all details (items, payments, etc...)
 *
 * @param id - Order ID
 * @return Order with full details
 */
export const getOrderById = async (id: string) => {
  const { data } = await axiosClient.get<ApiResponse<Order>>(`/orders/${id}`);
  return data;
};

/**
 * POST /orders
 *
 * Create a new order
 *
 * @param orderData - Order data
 * @return Created order
 */
export const createOrder = async (orderData: CreateOrderInput) => {
  const { data } = await axiosClient.post<ApiResponse<Order>>(
    "/orders",
    orderData,
  );
  return data;
};

/**
 * PATCH /orders/:id
 *
 * Update an existing order
 *
 * @param id - Order ID
 * @param orderData - Data to update
 * @return Updated order
 */
export const updateOrder = async (id: string, orderData: UpdateOrderInput) => {
  const { data } = await axiosClient.patch<ApiResponse<Order>>(
    `/orders/${id}`,
    orderData,
  );
  return data;
};

/**
 * PATCH /orders/:id/status
 *
 * Update only the order status (optimized endpoint)
 *
 * @param id - Order ID
 * @param statusData - New status
 * @returns Updated order
 */
export const updateOrderStatus = async (
  id: string,
  statusData: UpdateOrderStatusInput,
) => {
  const { data } = await axiosClient.patch<ApiResponse<Order>>(
    `/orders/${id}/status`,
    statusData,
  );
  return data;
};

/**
 * DELETE /orders/:id
 *
 * Delete an order (soft delete)
 *
 * @param id - Order ID
 */
export const deleteOrder = async (id: string) => {
  const { data } = await axiosClient.delete<ApiResponse<null>>(`/orders/${id}`);
  return data;
};

// =================== ORDER ITEMS ===================

/**
 * POST /orders/:id/items
 *
 * Add item to an existing order
 *
 * @param orderId - Order ID
 * @param itemData - Item data
 * @returns Updated order
 */
export const addOrderItem = async (
  orderId: string,
  itemData: CreateOrderItemInput,
) => {
  const { data } = await axiosClient.post<ApiResponse<Order>>(
    `/orders/${orderId}/items`,
    itemData,
  );
  return data;
};

/**
 * DELETE /orders/:orderId/items/:itemId
 *
 * Remove item from order
 *
 * @param orderId - Order ID
 * @param itemId - Item ID
 * @returns Updated order
 */
export const removeOrderItem = async (orderId: string, itemId: number) => {
  const { data } = await axiosClient.delete<ApiResponse<Order>>(
    `/orders/${orderId}/items/${itemId}`,
  );
  return data;
};

// =================== NEW ENDPOINTS ===================

/**
 * PATCH /orders/:orderId/items/:itemId
 *
 * Update order item quantity and details
 *
 * @param orderId - Order ID
 * @param itemId - Item ID
 * @param updateData - Update data
 * @returns Updated order
 */
export interface UpdateOrderItemInput {
  quantity?: number;
  notes?: string;
  isFreeSubstitution?: boolean;
}

export const updateOrderItem = async (
  orderId: string,
  itemId: number,
  updateData: UpdateOrderItemInput,
) => {
  const { data } = await axiosClient.patch<ApiResponse<Order>>(
    `/orders/${orderId}/items/${itemId}`,
    updateData,
  );
  return data;
};

/**
 * POST /orders/batch-status
 *
 * Update status for multiple orders at once
 *
 * @param batchData - Batch update data
 * @returns Updated orders
 */
export interface BatchStatusUpdateInput {
  orderIds: string[];
  status: OrderStatus;
}

export const updateBatchOrderStatus = async (batchData: BatchStatusUpdateInput) => {
  const { data } = await axiosClient.patch<ApiResponse<Order[]>>(
    "/orders/batch-status",
    batchData,
  );
  return data;
};

/**
 * GET /orders
 *
 * Get orders for kitchen view using existing endpoint with status filtering
 * Makes multiple calls to fetch orders with different statuses
 *
 * @param status - Status filter (currently not used, fetches all kitchen statuses)
 * @returns Orders for kitchen (PENDING, IN_KITCHEN, READY)
 */
export const getKitchenOrders = async (_status?: string) => {
  // Fetch orders with each status in parallel
  const [pendingResponse, inKitchenResponse, readyResponse] = await Promise.all([
    axiosClient.get<PaginatedResponse<Order>>("/orders", {
      params: { status: OrderStatus.PENDING, limit: 100 },
    }),
    axiosClient.get<PaginatedResponse<Order>>("/orders", {
      params: { status: OrderStatus.IN_KITCHEN, limit: 100 },
    }),
    axiosClient.get<PaginatedResponse<Order>>("/orders", {
      params: { status: OrderStatus.READY, limit: 100 },
    }),
  ]);

  // Combine all orders
  const allOrders = [
    ...pendingResponse.data.data,
    ...inKitchenResponse.data.data,
    ...readyResponse.data.data,
  ];

  return { 
    success: true, 
    data: allOrders,
    message: "Orders retrieved successfully"
  };
};

/**
 * GET /orders/daily-sales
 *
 * Get daily sales summary and statistics
 *
 * @param date - Date for sales summary (YYYY-MM-DD)
 * @returns Daily sales data
 */
export interface DailySalesResponse {
  totalOrders: number;
  totalRevenue: number;
  ordersByStatus: Record<OrderStatus, number>;
  averageOrderValue: number;
  peakHour?: {
    hour: number;
    orderCount: number;
  };
}

export const getDailySales = async (date: string) => {
  const { data } = await axiosClient.get<ApiResponse<DailySalesResponse>>(
    "/orders/daily-sales",
    { params: { date } }
  );
  return data;
};

/**
 * GET /orders/search
 *
 * Full-text search for orders
 *
 * @param query - Search query
 * @param params - Additional search params
 * @returns Search results
 */
export interface OrderSearchParams {
  q: string;
  limit?: number;
  offset?: number;
  status?: OrderStatus;
  type?: OrderType;
}

export const searchOrders = async (params: OrderSearchParams) => {
  const { data } = await axiosClient.get<PaginatedResponse<Order>>(
    "/orders/search",
    { params }
  );
  return data;
};

/**
 * POST /orders/:id/duplicate
 *
 * Duplicate an existing order
 *
 * @param orderId - Order ID to duplicate
 * @param options - Duplication options
 * @returns New duplicated order
 */
export interface DuplicateOrderOptions {
  tableId?: number; // Optional: change table
  notes?: string; // Optional: add notes
}

export const duplicateOrder = async (
  orderId: string,
  options?: DuplicateOrderOptions,
) => {
  const { data } = await axiosClient.post<ApiResponse<Order>>(
    `/orders/${orderId}/duplicate`,
    options || {}
  );
  return data;
};

/**
 * POST /orders/validate
 *
 * Validate order data before creation
 *
 * @param orderData - Order data to validate
 * @returns Validation result
 */
export interface OrderValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  estimatedTotal?: number;
}

export const validateOrder = async (orderData: CreateOrderInput) => {
  const { data } = await axiosClient.post<ApiResponse<OrderValidationResult>>(
    "/orders/validate",
    orderData
  );
  return data;
};

/**
 * GET /orders/table-availability/:tableId
 *
 * Check table availability for specific datetime
 *
 * @param tableId - Table ID
 * @param datetime - DateTime to check (ISO string)
 * @returns Availability information
 */
export interface TableAvailabilityResponse {
  available: boolean;
  nextAvailable?: string;
  currentOrders?: Order[];
  conflictingOrders?: Order[];
}

export const getTableAvailability = async (
  tableId: number,
  datetime?: string
) => {
  const { data } = await axiosClient.get<ApiResponse<TableAvailabilityResponse>>(
    `/orders/table-availability/${tableId}`,
    { params: { datetime } }
  );
  return data;
};

/**
 * PATCH /orders/:id/cancel
 *
 * Cancel order with reason
 *
 * @param orderId - Order ID
 * @param cancelData - Cancellation data
 * @returns Updated order
 */
export interface CancelOrderInput {
  reason: string;
  refundAmount?: number;
}

export const cancelOrder = async (
  orderId: string,
  cancelData: CancelOrderInput
) => {
  const { data } = await axiosClient.patch<ApiResponse<Order>>(
    `/orders/${orderId}/cancel`,
    cancelData
  );
  return data;
};

// =================== PAYMENTS ===================

/**
 * POST /orders/:id/payments
 *
 * Register a payment for an order
 *
 * @param orderId - Order ID
 * @param paymentData - Payment data
 * @returns Created payment
 */
export const addPayment = async (
  orderId: string,
  paymentData: Omit<CreatePaymentInput, "orderId">,
) => {
  const { data } = await axiosClient.post<ApiResponse<Payment>>(
    `/orders/${orderId}/payments`,
    paymentData,
  );
  return data;
};

/**
 * GET /orders/:id/payments
 *
 * Get all payments for an order
 *
 * @param orderId - Order ID
 * @returns Order payments
 */
export const getOrderPayments = async (orderId: string) => {
  const { data } = await axiosClient.get<ApiResponse<Payment[]>>(
    `/orders/${orderId}/payments`
  );
  return data;
};

// =================== EXPORTS ===================

export const orderApi = {
  // Core operations
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
  
  // Order items
  addOrderItem,
  removeOrderItem,
  updateOrderItem,
  
  // Batch operations
  updateBatchOrderStatus,
  
  // Kitchen & Status
  getKitchenOrders,
  
  // Reports & Analytics
  getDailySales,
  
  // Search
  searchOrders,
  
  // Actions
  duplicateOrder,
  validateOrder,
  cancelOrder,
  
  // Utilities
  getTableAvailability,
  
  // Payments
  addPayment,
  getOrderPayments,
};