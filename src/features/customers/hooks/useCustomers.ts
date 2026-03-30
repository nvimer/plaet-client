import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { customerApi } from "@/services";
import { toast } from "sonner";
import type { CustomerSearchParams, AxiosErrorWithResponse } from "@/types";

/**
 * Hook to fetch paginated and searchable customers
 */
export function useCustomers(params: CustomerSearchParams) {
  return useQuery({
    queryKey: ["customers", params],
    queryFn: () => customerApi.searchCustomers(params),
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Hook to fetch a single customer by ID
 */
export function useCustomer(id: string | null) {
  return useQuery({
    queryKey: ["customer", id],
    queryFn: () => (id ? customerApi.getCustomerById(id) : null),
    enabled: !!id,
  });
}

/**
 * Hook to create a new customer
 */
export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => customerApi.createCustomer(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Cliente creado correctamente", {
        description: `${response.data?.firstName} ha sido registrado.`
      });
    },
    onError: (error: AxiosErrorWithResponse) => {
      toast.error(error.response?.data?.message || "Error al crear el cliente");
    },
  });
}

/**
 * Hook to update an existing customer
 */
export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      customerApi.updateCustomer(id, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["customer", response.data?.id] });
      toast.success("Cliente actualizado");
    },
    onError: (error: AxiosErrorWithResponse) => {
      toast.error(error.response?.data?.message || "Error al actualizar el cliente");
    },
  });
}

/**
 * Hook to delete a customer
 */
export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => customerApi.deleteCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Cliente eliminado correctamente");
    },
    onError: (error: AxiosErrorWithResponse) => {
      toast.error(error.response?.data?.message || "Error al eliminar el cliente");
    },
  });
}
