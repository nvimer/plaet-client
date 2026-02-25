import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getRestaurants,
  searchRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
} from "@/services/restaurantApi";
import {
  type CreateRestaurantInput,
  type UpdateRestaurantInput,
  type RestaurantSearchParams,
  type PaginationParams,
} from "@/types";
import { toast } from "sonner";

export const RESTAURANT_KEYS = {
  all: ["restaurants"] as const,
  lists: () => [...RESTAURANT_KEYS.all, "list"] as const,
  list: (params: any) => [...RESTAURANT_KEYS.lists(), params] as const,
  details: () => [...RESTAURANT_KEYS.all, "detail"] as const,
  detail: (id: string) => [...RESTAURANT_KEYS.details(), id] as const,
};

export function useRestaurants(params: PaginationParams) {
  return useQuery({
    queryKey: RESTAURANT_KEYS.list(params),
    queryFn: () => getRestaurants(params),
  });
}

export function useSearchRestaurants(params: PaginationParams & RestaurantSearchParams) {
  return useQuery({
    queryKey: RESTAURANT_KEYS.list(params),
    queryFn: () => searchRestaurants(params),
    enabled: !!(params.search || params.status),
  });
}

export function useRestaurant(id: string) {
  return useQuery({
    queryKey: RESTAURANT_KEYS.detail(id),
    queryFn: () => getRestaurantById(id),
    enabled: !!id,
  });
}

export function useCreateRestaurant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRestaurantInput) => createRestaurant(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESTAURANT_KEYS.lists() });
      toast.success("Restaurante creado exitosamente");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Error al crear el restaurante");
    },
  });
}

export function useUpdateRestaurant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRestaurantInput }) =>
      updateRestaurant(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: RESTAURANT_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: RESTAURANT_KEYS.detail(variables.id) });
      toast.success("Restaurante actualizado exitosamente");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Error al actualizar el restaurante");
    },
  });
}

export function useDeleteRestaurant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteRestaurant(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESTAURANT_KEYS.lists() });
      toast.success("Restaurante eliminado exitosamente");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Error al eliminar el restaurante");
    },
  });
}
