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
  openingBalance: number; // Base de caja
  expectedBalance: number; // Calculado por el sistema
  actualBalance?: number; // Ingresado por el usuario al cerrar
  difference?: number; // Sobrante/Faltante
  status: CashClosureStatus;
  notes?: string;
  
  // Relations (opcionales para el frontend)
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
