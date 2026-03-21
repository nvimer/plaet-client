import axiosClient from "./axiosClient";
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

export const customerApi = {
  getCustomerByPhone,
  searchCustomers,
};
