import { menuApi } from "@/services";
import { queryKeys } from "@/lib";
import type { CreateMenuItemInput } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InventoryType } from "@/types";

export function useCreateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateMenuItemInput) => {
      const transformedData = {
        ...data,
        price: parseFloat(data.price),
        isAvailable: data.isAvailable ?? true,
        autoMarkUnavailable: data.autoMarkUnavailable ?? true,
        inventoryType: data.inventoryType ?? InventoryType.UNLIMITED,
      };

      const response = await menuApi.createMenuItem(transformedData);
      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.menu.all });
    },
  });
}
