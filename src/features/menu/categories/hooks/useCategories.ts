import { menuApi } from "@/services";
import { queryKeys } from "@/lib";
import { useQuery } from "@tanstack/react-query";

export const useCategories = () => {
    return useQuery({
        queryKey: queryKeys.categories.all,
        queryFn: async () => {
            const response = await menuApi.getCategories({ page: 1, limit: 100 });
            return response.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};
