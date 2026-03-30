import { axiosClient } from "./axiosClient";
import type { ApiResponse, Customer, PaginatedResponse, PaginationParams } from "@/types";

/**
 * GET /customers/phone/:phone
 * 
 * Busca un cliente por su número de teléfono
 */
export const getCustomerByPhone = async (phone: string) => {
  const { data } = await axiosClient.get<ApiResponse<Customer>>(`customers/phone/${phone}`);
  return data;
};

/**
 * GET /customers/search
 * 
 * Busca clientes por nombre o teléfono con paginación
 */
export const searchCustomers = async (params: PaginationParams & { query?: string }) => {
  const { data } = await axiosClient.get<PaginatedResponse<Customer>>("customers/search", { params });
  return data;
};

/**
 * GET /customers
 */
export const getCustomers = async (params: PaginationParams) => {
  const { data } = await axiosClient.get<PaginatedResponse<Customer>>("customers", { params });
  return data;
};

/**
 * GET /customers/:id
 */
export const getCustomerById = async (id: string) => {
  const { data } = await axiosClient.get<ApiResponse<Customer>>(`customers/${id}`);
  return data;
};

/**
 * POST /customers
 */
export const createCustomer = async (customerData: any) => {
  const { data } = await axiosClient.post<ApiResponse<Customer>>("customers", customerData);
  return data;
};

/**
 * PATCH /customers/:id
 */
export const updateCustomer = async (id: string, customerData: any) => {
  const { data } = await axiosClient.patch<ApiResponse<Customer>>(`customers/${id}`, customerData);
  return data;
};

/**
 * DELETE /customers/:id
 */
export const deleteCustomer = async (id: string) => {
  const { data } = await axiosClient.delete<ApiResponse<Customer>>(`customers/${id}`);
  return data;
};

export const customerApi = {
  getCustomerByPhone,
  searchCustomers,
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
