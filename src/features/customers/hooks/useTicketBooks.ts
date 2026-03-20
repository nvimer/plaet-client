import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ticketBookApi } from "@/services";
import type { SellTicketBookDTO, AxiosErrorWithResponse } from "@/types";
import { toast } from "sonner";

/**
 * useTicketBooks Hook
 * 
 * Manages customer ticket books (purchasing and querying).
 */
export function useTicketBooks(customerId?: string) {
  const queryClient = useQueryClient();

  // Query: Get customer's ticket books
  const { data: tickets, isLoading, error } = useQuery({
    queryKey: ["customer-tickets", customerId],
    queryFn: () => ticketBookApi.getCustomerTickets(customerId!),
    enabled: !!customerId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Mutation: Sell a ticket book
  const sellTicketBookMutation = useMutation({
    mutationFn: (dto: SellTicketBookDTO) => ticketBookApi.sellTicketBook(dto),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["customer-tickets", customerId] });
      queryClient.invalidateQueries({ queryKey: ["cash-closure"] });
      toast.success("Tiquetera vendida", {
        description: `Se han abonado ${response.data.totalPortions} almuerzos.`,
      });
    },
    onError: (error: AxiosErrorWithResponse) => {
      toast.error(error.response?.data?.message || "Error al vender tiquetera");
    },
  });

  return {
    tickets: tickets?.data || [],
    isLoading,
    error,
    sellTicketBook: sellTicketBookMutation.mutate,
    isSelling: sellTicketBookMutation.isPending,
  };
}
