import { menuApi } from "@/services";
import { queryKeys } from "@/lib";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateMenuCategoryInput } from "@/types";

/**
 * useUpdateCategory Hook
 *
 * Updates an existing category (name, description, order).
 */
export function useUpdateCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            ...data
        }: UpdateMenuCategoryInput & { id: number }) => {
            const response = await menuApi.updateCategory(id, data);
            return response.data;
        },
        // On Success: invalidate specific category and all categories cache
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
            queryClient.invalidateQueries({
                queryKey: queryKeys.categories.detail(data.id),
            });
        },
    });
}
