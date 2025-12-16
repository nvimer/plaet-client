//  ORDERS API SERVICE

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

// =================== ORDER ITEMS ====================

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

// ============= PAYMENTS ===============

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
