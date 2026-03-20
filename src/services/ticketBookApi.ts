import { axiosClient } from "./axiosClient";
import type { TicketBook, SellTicketBookDTO, ApiResponse } from "@/types";

/**
 * Sell a ticket book to a customer
 */
export const sellTicketBook = async (data: SellTicketBookDTO) => {
  const response = await axiosClient.post<ApiResponse<TicketBook>>("ticket-books/sell", data);
  return response.data;
};

/**
 * Get all ticket books for a customer
 */
export const getCustomerTickets = async (customerId: string) => {
  const response = await axiosClient.get<ApiResponse<TicketBook[]>>(`ticket-books/customer/${customerId}`);
  return response.data;
};

export const ticketBookApi = {
  sellTicketBook,
  getCustomerTickets,
};
