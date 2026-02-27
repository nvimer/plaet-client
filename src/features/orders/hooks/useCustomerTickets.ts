import { paymentApi } from "@/services";
import { useQuery } from "@tanstack/react-query";

/**
 * useCustomerTickets Hook
 * 
 * Fetches customer data and their active ticket books by phone number.
 */
export function useCustomerTickets(phone: string) {
  return useQuery({
    queryKey: ["customer-tickets", phone],
    queryFn: async () => {
      if (!phone || phone.length < 7) return null;
      const response = await paymentApi.getCustomerTickets(phone);
      return response.data;
    },
    enabled: phone.length >= 7,
    retry: false,
    staleTime: 30000, // 30 seconds
  });
}
