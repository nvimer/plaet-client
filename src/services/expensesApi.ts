import { axiosClient } from "./axiosClient";
import type { Expense, CreateExpenseDTO } from "../types";

/**
 * EXPENSES API - Client
 * Record-keeping for miscellaneous business expenses.
 */

export const createExpense = async (dto: CreateExpenseDTO): Promise<Expense> => {
  const { data } = await axiosClient.post("/expenses", dto);
  return data;
};

export const getExpenses = async (startDate?: string, endDate?: string): Promise<Expense[]> => {
  const { data } = await axiosClient.get("/expenses", {
    params: { startDate, endDate },
  });
  return data;
};

export const deleteExpense = async (id: string): Promise<void> => {
  await axiosClient.delete(`/expenses/${id}`);
};
