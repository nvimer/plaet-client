import { queryKeys } from "@/lib";
import { paymentApi } from "@/services";
import { PaymentMethod } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface AddPaymentParams {
  orderId: string;
  paymentData: {
    method: PaymentMethod;
    amount: number;
    transactionRef?: string;
    phone?: string;
  };
}

/**
 * useAddPayment Hook
 *
 * Mutation to add a payment to an order and update relevant queries
 */
export function useAddPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, paymentData }: AddPaymentParams) => {
      const response = await paymentApi.createPayment(orderId, paymentData);
      return response.data;
    },

    onSuccess: (updatedPayment, variables) => {
      // Invalidate the specific order detail
      queryClient.invalidateQueries({
        queryKey: queryKeys.orders.detail(variables.orderId),
      });
      
      // Invalidate all orders list
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });

      // Invalidate tables since status might change
      queryClient.invalidateQueries({
        queryKey: queryKeys.tables.all,
      });
    },
  });
}
