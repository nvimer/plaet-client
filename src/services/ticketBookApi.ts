import { callFunction, query } from "./functionsClient";
import type { TicketBook, SellTicketBookDTO } from "@/types";

/**
 * Sell a ticket book to a customer
 */
export const sellTicketBook = async (data: SellTicketBookDTO) => {
  return await callFunction<TicketBook>("ticket-books-sell", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

/**
 * Get all ticket books for a customer
 */
export const getCustomerTickets = async (customerId: string) => {
  return await callFunction<TicketBook[]>(`ticket-books-by-customer${query({ customerId })}`);
};

export const ticketBookApi = {
  sellTicketBook,
  getCustomerTickets,
};
