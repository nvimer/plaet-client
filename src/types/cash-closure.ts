export enum CashClosureStatus {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
}

export interface CashClosure {
  id: string;
  openedById: string;
  closedById?: string;
  openingDate: string;
  closingDate?: string;
  openingBalance: number;
  expectedBalance: number;
  actualBalance?: number;
  difference?: number;
  status: CashClosureStatus;
  notes?: string;
  openedBy?: { name: string };
  closedBy?: { name: string };
}

export interface CreateCashClosureDTO {
  openingBalance: number;
}

export interface CloseCashClosureDTO {
  actualBalance: number;
  notes?: string;
}
