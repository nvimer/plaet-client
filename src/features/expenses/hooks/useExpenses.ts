import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { expensesApi } from "@/services";
import type { CreateExpenseDTO } from "@/types";
import { toast } from "sonner";

/**
 * HOOK: useExpenses
 * Logic for managing business expenses.
 */
export const useExpenses = (startDate?: string, endDate?: string) => {
  const queryClient = useQueryClient();

  // Fetch expenses list
  const { data, isLoading, error: _error } = useQuery({
    queryKey: ["expenses", { startDate, endDate }],
    queryFn: () => expensesApi.getExpenses(startDate, endDate),
  });

  const expenses = Array.isArray(data) ? data : [];

  // Create expense mutation
  const createExpenseMutation = useMutation({
    mutationFn: (dto: CreateExpenseDTO) => expensesApi.createExpense(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      // Also invalidate analytics since expenses affect net balance
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
      toast.success("Gasto registrado correctamente");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error?.response?.data?.message || "Error al registrar el gasto");
    },
  });

  // Delete expense mutation
  const deleteExpenseMutation = useMutation({
    mutationFn: (id: string) => expensesApi.deleteExpense(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
      toast.success("Gasto eliminado");
    },
    onError: (_error: unknown) => {
      toast.error("Error al eliminar el gasto");
    },
  });

  return {
    expenses,
    isLoading,
    error,
    createExpense: createExpenseMutation.mutate,
    isCreating: createExpenseMutation.isPending,
    deleteExpense: deleteExpenseMutation.mutate,
    isDeleting: deleteExpenseMutation.isPending,
  };
};
