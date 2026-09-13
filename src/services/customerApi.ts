// CUSTOMERS API SERVICE - Supabase Edge Functions

import { FUNCTIONS_BASE } from "@/lib/supabase";
import type { ApiResponse, Customer, PaginatedResponse, PaginationParams } from "@/types";

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

export interface CustomersFilterParams extends PaginationParams {
  search?: string;
}

export const getCustomers = async (params?: CustomersFilterParams): Promise<PaginatedResponse<Customer>> => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.set("page", String(params.page));
  if (params?.limit) queryParams.set("limit", String(params.limit));
  if (params?.search) queryParams.set("search", params.search);

  const data = await authFetch(`${FUNCTIONS_BASE}/customers-list?${queryParams}`);
  return {
    success: true,
    message: data.message,
    data: data.data,
    meta: data.meta,
  };
};

export const getCustomerByPhone = async (phone: string): Promise<ApiResponse<Customer>> => {
  const data = await authFetch(`${FUNCTIONS_BASE}/customers-list?search=${phone}`);
  const customer = data.data.find((c: Customer) => c.phone === phone);
  if (!customer) throw { response: { status: 404, data: { message: "Customer not found" } } };
  return {
    success: true,
    message: "Customer fetched successfully",
    data: customer,
  };
};

export const searchCustomers = async (params: PaginationParams & { query?: string }): Promise<PaginatedResponse<Customer>> => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.set("page", String(params.page));
  if (params.limit) queryParams.set("limit", String(params.limit));
  if (params.query) queryParams.set("search", params.query);

  const data = await authFetch(`${FUNCTIONS_BASE}/customers-list?${queryParams}`);
  return {
    success: true,
    message: data.message,
    data: data.data,
    meta: data.meta,
  };
};

export const createCustomer = async (customerData: {
  firstName: string;
  lastName: string;
  phone: string;
  phone2?: string;
  email?: string;
  address1?: string;
  address2?: string;
}): Promise<ApiResponse<Customer>> => {
  const data = await authFetch(`${FUNCTIONS_BASE}/customers-create`, {
    method: "POST",
    body: JSON.stringify(customerData),
  });
  return {
    success: true,
    message: data.message,
    data: data.data,
  };
};

export const updateCustomer = async (
  id: string,
  customerData: Partial<{
    firstName: string;
    lastName: string;
    phone: string;
    phone2: string;
    email: string;
    address1: string;
    address2: string;
  }>,
): Promise<ApiResponse<Customer>> => {
  const data = await authFetch(`${FUNCTIONS_BASE}/customers-update/${id}`, {
    method: "PATCH",
    body: JSON.stringify(customerData),
  });
  return {
    success: true,
    message: data.message,
    data: data.data,
  };
};

export const customerApi = {
  getCustomers,
  getCustomerByPhone,
  searchCustomers,
  createCustomer,
  updateCustomer,
};
