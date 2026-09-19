import { callFunction, query } from "./functionsClient";
import type { Expense, CreateExpenseDTO } from "../types";

/**
 * EXPENSES API - Client
 * Record-keeping for miscellaneous business expenses.
 */

export const createExpense = async (dto: CreateExpenseDTO): Promise<Expense> => {
  const { data } = await callFunction<Expense>("expenses-create", {
    method: "POST",
    body: JSON.stringify(dto),
  });
  return data;
};

export const getExpenses = async (startDate?: string, endDate?: string): Promise<Expense[]> => {
  const { data } = await callFunction<Expense[]>(`expenses-list${query({ startDate, endDate })}`);
  return data || [];
};

export const deleteExpense = async (id: string): Promise<void> => {
  await callFunction<null>(`expenses-delete${query({ id })}`, { method: "DELETE" });
};
