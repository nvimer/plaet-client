import axiosClient from "./axiosClient";
import type { ApiResponse, Customer } from "@/types";

/**
 * GET /customers/phone/:phone
 * 
 * Busca un cliente por su número de teléfono
 */
export const getCustomerByPhone = async (phone: string) => {
  const { data } = await axiosClient.get<ApiResponse<Customer>>(`/customers/phone/${phone}`);
  return data;
};

export const customerApi = {
  getCustomerByPhone,
};
