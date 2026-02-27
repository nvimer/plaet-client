import { axiosClient } from "./axiosClient";
import { PaymentMethod } from "@/types";

export interface CreatePaymentData {
  method: PaymentMethod;
  amount: number;
  transactionRef?: string;
  phone?: string;
}

/**
 * Register a payment for an order
 */
export const createPayment = async (orderId: string, data: CreatePaymentData) => {
  return await axiosClient.post(`/payments/${orderId}`, data);
};

/**
 * Search customer and their tickets by phone
 */
export const getCustomerTickets = async (phone: string) => {
  const response = await axiosClient.get(`/customers/phone/${phone}/tickets`);
  return response.data;
};
