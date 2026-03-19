import { useCallback } from "react";
import { toast } from "sonner";
import { customerApi } from "@/services";
import { logger } from "@/utils";
import { useOrderBuilderStore } from "@/stores/useOrderBuilderStore";

/**
 * useCustomerLookup Hook
 * Manages customer information and automatic lookup by phone number.
 * Now integrated with useOrderBuilderStore for persistent state.
 */
export function useCustomerLookup() {
  const {
    customerName,
    customerPhone,
    customerPhone2,
    deliveryAddress,
    address2,
    setCustomerName,
    setCustomerPhone,
    setCustomerPhone2,
    setDeliveryAddress,
    setAddress2,
  } = useOrderBuilderStore();

  const handleSetCustomerName = useCallback((name: string) => {
    const onlyLetters = name.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
    setCustomerName(onlyLetters);
  }, [setCustomerName]);

  const handleSetCustomerPhone = useCallback(async (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, "");
    setCustomerPhone(cleanPhone);

    if (cleanPhone.length === 10) {
      try {
        const response = await customerApi.getCustomerByPhone(cleanPhone);
        if (response.success && response.data) {
          setCustomerName(`${response.data.firstName} ${response.data.lastName}`.trim());
          setCustomerPhone2(response.data.phone2 || "");
          setDeliveryAddress(response.data.address1 || "");
          setAddress2(response.data.address2 || "");
          
          toast.success("Cliente encontrado", {
            description: `Bienvenido de nuevo, ${response.data.firstName}`,
            icon: "👤",
          });
        }
      } catch (_error) {
        logger.debug("Customer not found for phone:", cleanPhone);
      }
    }
  }, [setCustomerPhone, setCustomerName, setCustomerPhone2, setDeliveryAddress, setAddress2]);

  const handleSetCustomerPhone2 = useCallback((phone: string) => {
    setCustomerPhone2(phone.replace(/\D/g, ""));
  }, [setCustomerPhone2]);

  const resetCustomer = useCallback(() => {
    setCustomerName("");
    setCustomerPhone("");
    setCustomerPhone2("");
    setDeliveryAddress("");
    setAddress2("");
  }, [setCustomerName, setCustomerPhone, setCustomerPhone2, setDeliveryAddress, setAddress2]);

  return {
    customerName,
    customerPhone,
    customerPhone2,
    deliveryAddress,
    address2,
    handleSetCustomerName,
    handleSetCustomerPhone,
    handleSetCustomerPhone2,
    setDeliveryAddress,
    setAddress2,
    resetCustomer,
  };
}
