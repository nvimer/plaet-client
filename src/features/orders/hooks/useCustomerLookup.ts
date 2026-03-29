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
    customerId, setCustomerId,
    customerName, setCustomerName,
    customerPhone, setCustomerPhone,
    customerPhone2, setCustomerPhone2,
    deliveryAddress, setDeliveryAddress,
    address2, setAddress2,
  } = useOrderBuilderStore();

  const handleSetCustomerName = useCallback((name: string) => {
    // Allow letters, numbers and some common characters for names like "Consumidor Final 01"
    const allowedChars = name.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s.\-]/g, "");
    setCustomerName(allowedChars);
  }, [setCustomerName]);

  const identifyAsGenericCustomer = useCallback(async () => {
    const genericPhone = "0000000000";
    setCustomerPhone(genericPhone);
    setCustomerName("Consumidor Final");
    
    try {
      const response = await customerApi.getCustomerByPhone(genericPhone);
      if (response.success && response.data) {
        setCustomerId(response.data.id);
        setCustomerPhone2(response.data.phone2 || "");
        setDeliveryAddress(response.data.address1 || "");
        setAddress2(response.data.address2 || "");
      } else {
        setCustomerId(null);
      }
    } catch (_error) {
      setCustomerId(null);
    }
  }, [setCustomerPhone, setCustomerName, setCustomerId, setCustomerPhone2, setDeliveryAddress, setAddress2]);

  const handleSetCustomerPhone = useCallback(async (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, "");
    setCustomerPhone(cleanPhone);

    if (cleanPhone.length === 10) {
      try {
        const response = await customerApi.getCustomerByPhone(cleanPhone);
        if (response.success && response.data) {
          setCustomerId(response.data.id);
          setCustomerName(`${response.data.firstName} ${response.data.lastName}`.trim());
          setCustomerPhone2(response.data.phone2 || "");
          setDeliveryAddress(response.data.address1 || "");
          setAddress2(response.data.address2 || "");
          
          toast.success("Cliente encontrado", {
            description: `Bienvenido de nuevo, ${response.data.firstName}`,
            icon: "👤",
          });
        } else {
          setCustomerId(null);
        }
      } catch (_error) {
        logger.debug("Customer not found for phone:", cleanPhone);
        setCustomerId(null);
      }
    } else {
      setCustomerId(null);
    }
  }, [setCustomerPhone, setCustomerId, setCustomerName, setCustomerPhone2, setDeliveryAddress, setAddress2]);

  const handleSetCustomerPhone2 = useCallback((phone: string) => {
    setCustomerPhone2(phone.replace(/\D/g, ""));
  }, [setCustomerPhone2]);

  const resetCustomer = useCallback(() => {
    setCustomerId(null);
    setCustomerName("");
    setCustomerPhone("");
    setCustomerPhone2("");
    setDeliveryAddress("");
    setAddress2("");
  }, [setCustomerId, setCustomerName, setCustomerPhone, setCustomerPhone2, setDeliveryAddress, setAddress2]);

  return {
    customerId,
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
    identifyAsGenericCustomer,
  };
}
