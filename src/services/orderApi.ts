// ORDERS API SERVICE - Supabase Edge Functions

import { FUNCTIONS_BASE } from "@/lib/supabase";
import {
  type Order,
  OrderStatus,
  type PaginatedResponse,
  type PaginationParams,
  type ApiResponse,
  type CreateOrderInput,
  type UpdateOrderStatusInput,
  type OrderItem,
  type OrderItemStatus,
} from "@/types";

const FUNCTION_HEADERS = {
  "Content-Type": "application/json",
  apikey: import.meta.env.VITE_DB_ANON_KEY,
};

async function authFetch(url: string, options: RequestInit = {}) {
  const res = await fetch(url, {
    ...options,
    credentials: "include",
    headers: { ...FUNCTION_HEADERS, ...options.headers },
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw { response: { status: res.status, data } };
  }
  return data;
}

// =================== CORE ENDPOINTS ===================

export interface OrdersFilterParams extends PaginationParams {
  status?: OrderStatus;
  type?: string;
  tableId?: number;
  waiterId?: string;
  date?: string;
}

export const getOrders = async (params?: OrdersFilterParams): Promise<PaginatedResponse<Order>> => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.set("page", String(params.page));
  if (params?.limit) queryParams.set("limit", String(params.limit));
  if (params?.status) queryParams.set("status", params.status);
  if (params?.type) queryParams.set("type", params.type);
  if (params?.tableId) queryParams.set("tableId", String(params.tableId));
  if (params?.waiterId) queryParams.set("waiterId", params.waiterId);
  if (params?.date) queryParams.set("date", params.date);

  const data = await authFetch(`${FUNCTIONS_BASE}/orders-list?${queryParams}`);
  return {
    success: true,
    message: data.message,
    data: data.data,
    meta: data.meta,
  };
};

export const getOrderById = async (id: string): Promise<ApiResponse<Order>> => {
  const data = await authFetch(`${FUNCTIONS_BASE}/orders-get/${id}`);
  return {
    success: true,
    message: data.message,
    data: data.data,
  };
};

export const createOrder = async (orderData: CreateOrderInput): Promise<ApiResponse<Order>> => {
  const data = await authFetch(`${FUNCTIONS_BASE}/orders-create`, {
    method: "POST",
    body: JSON.stringify(orderData),
  });
  return {
    success: true,
    message: data.message,
    data: data.data,
  };
};

export const updateOrderStatus = async (
  id: string,
  statusData: UpdateOrderStatusInput,
): Promise<ApiResponse<Order>> => {
  const data = await authFetch(`${FUNCTIONS_BASE}/orders-update-status/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify(statusData),
  });
  return {
    success: true,
    message: data.message,
    data: data.data,
  };
};

export const cancelOrder = async (orderId: string): Promise<ApiResponse<Order>> => {
  const data = await authFetch(`${FUNCTIONS_BASE}/orders-cancel/${orderId}`, {
    method: "DELETE",
  });
  return {
    success: true,
    message: data.message,
    data: data.data,
  };
};

// =================== ORDER ITEMS ===================

export const updateOrderItemStatus = async (
  orderId: string,
  itemId: number,
  status: OrderItemStatus,
): Promise<ApiResponse<OrderItem>> => {
  const data = await authFetch(
    `${FUNCTIONS_BASE}/orders-update-item-status/${orderId}/items/${itemId}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }
  );
  return {
    success: true,
    message: data.message,
    data: data.data,
  };
};

// =================== KITCHEN ===================

export const getKitchenOrders = async (_status?: string) => {
  const data = await authFetch(`${FUNCTIONS_BASE}/orders-list?status=PAID&limit=100`);
  return {
    success: true,
    data: data.data,
    message: "Orders retrieved successfully",
  };
};

// =================== SEARCH ===================

export const searchOrders = async (params: { q: string; status?: OrderStatus; type?: string }) => {
  const queryParams = new URLSearchParams();
  if (params.q) queryParams.set("search", params.q);
  if (params.status) queryParams.set("status", params.status);
  if (params.type) queryParams.set("type", params.type);

  const data = await authFetch(`${FUNCTIONS_BASE}/orders-list?${queryParams}`);
  return {
    success: true,
    data: data.data,
    meta: data.meta,
  };
};

// =================== BATCH OPERATIONS ===================

export interface BatchStatusUpdateInput {
  orderIds: string[];
  status: OrderStatus;
}

export const updateBatchOrderStatus = async (batchData: BatchStatusUpdateInput) => {
  const results = await Promise.all(
    batchData.orderIds.map((id) =>
      authFetch(`${FUNCTIONS_BASE}/orders-update-status/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: batchData.status }),
      })
    )
  );
  return {
    success: true,
    data: results.map((r) => r.data),
    message: `${batchData.orderIds.length} orders updated`,
  };
};

// =================== STUBS (not yet implemented) ===================

export const createBatchOrders = async (_batchData: unknown) => {
  throw new Error("Batch orders not yet implemented in Edge Functions");
};

export const updateOrder = async (_id: string, _orderData: unknown) => {
  throw new Error("Update order not yet implemented in Edge Functions");
};

export const deleteOrder = async (_id: string) => {
  throw new Error("Delete order not yet implemented in Edge Functions");
};

export const addOrderItem = async (_orderId: string, _itemData: unknown) => {
  throw new Error("Add order item not yet implemented in Edge Functions");
};

export const removeOrderItem = async (_orderId: string, _itemId: number) => {
  throw new Error("Remove order item not yet implemented in Edge Functions");
};

export const updateOrderItem = async (_orderId: string, _itemId: number, _updateData: unknown) => {
  throw new Error("Update order item not yet implemented in Edge Functions");
};

export const getDailySales = async (_date: string) => {
  throw new Error("Daily sales not yet implemented in Edge Functions");
};

export const duplicateOrder = async (_orderId: string, _options?: unknown) => {
  throw new Error("Duplicate order not yet implemented in Edge Functions");
};

export const validateOrder = async (_orderData: CreateOrderInput) => {
  return { success: true, data: { valid: true, errors: [], warnings: [] } };
};

export const getTableAvailability = async (_tableId: number, _datetime?: string) => {
  throw new Error("Table availability not yet implemented in Edge Functions");
};

// =================== EXPORTS ===================

export const orderApi = {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  updateOrderItemStatus,
  updateBatchOrderStatus,
  getKitchenOrders,
  searchOrders,
  createBatchOrders,
  updateOrder,
  deleteOrder,
  addOrderItem,
  removeOrderItem,
  updateOrderItem,
  getDailySales,
  duplicateOrder,
  validateOrder,
  getTableAvailability,
};
