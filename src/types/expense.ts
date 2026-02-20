export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  registeredById: string;
  registeredBy?: { name: string };
}

export interface CreateExpenseDTO {
  amount: number;
  description: string;
  category: string;
}
