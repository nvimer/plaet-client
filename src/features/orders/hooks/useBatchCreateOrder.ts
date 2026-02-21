import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orderApi } from "@/services";
import type { BatchCreateOrderInput } from "@/types";

export function useBatchCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (batchData: BatchCreateOrderInput) => {
      const response = await orderApi.createBatchOrders(batchData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["tables"] });
    },
  });
}
