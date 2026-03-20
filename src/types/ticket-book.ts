export interface TicketBook {
  id: string;
  customerId: string;
  purchaseDate: string;
  expiryDate: string;
  totalPortions: number;
  consumedPortions: number;
  purchasePrice: number;
  status: "active" | "exhausted" | "expired";
  createdAt: string;
  updatedAt: string;
}

export interface SellTicketBookDTO {
  customerId: string;
  totalPortions: number;
  purchasePrice: number;
  expiryDays?: number;
}

export interface TicketBookUsage {
  id: string;
  ticketBookId: string;
  paymentId: string;
  portionCount: number;
  createdAt: string;
}
