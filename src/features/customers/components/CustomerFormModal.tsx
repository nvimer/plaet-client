import { BaseModal, Button, Input } from "@/components";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Customer } from "@/types";
import { User, Phone, MapPin, Mail, Save } from "lucide-react";

const customerFormSchema = z.object({
  firstName: z.string().min(1, "Nombre requerido").max(50),
  lastName: z.string().max(50).optional(),
  phone: z.string().min(10, "Mínimo 10 dígitos").max(15),
  phone2: z.string().optional(),
  address1: z.string().max(255).optional(),
  address2: z.string().max(255).optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
});

type CustomerFormData = z.infer<typeof customerFormSchema>;

interface CustomerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CustomerFormData) => void;
  isPending: boolean;
  customer?: Customer | null;
}

export function CustomerFormModal({
  isOpen,
  onClose,
  onSubmit,
  isPending,
  customer,
}: CustomerFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      phone2: "",
      address1: "",
      address2: "",
      email: "",
    },
  });

  useEffect(() => {
    if (customer) {
      reset({
        firstName: customer.firstName,
        lastName: customer.lastName || "",
        phone: customer.phone,
        phone2: customer.phone2 || "",
        address1: customer.address1 || "",
        address2: customer.address2 || "",
        email: customer.email || "",
      });
    } else {
      reset({
        firstName: "",
        lastName: "",
        phone: "",
        phone2: "",
        address1: "",
        address2: "",
        email: "",
      });
    }
  }, [customer, reset, isOpen]);

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={customer ? "Editar Cliente" : "Nuevo Cliente"}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-[10px] font-black text-carbon-500 uppercase tracking-widest ml-1">Primer Nombre</label>
            <div className="relative">
              <User className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-carbon-400 w-4 h-4" />
              <Input
                {...register("firstName")}
                placeholder="Ej: Juan"
                className="pl-10 sm:pl-11"
                error={errors.firstName?.message}
                fullWidth
              />
            </div>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-[10px] font-black text-carbon-500 uppercase tracking-widest ml-1">Apellido (Opcional)</label>
            <div className="relative">
              <User className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-carbon-400 w-4 h-4 opacity-50" />
              <Input
                {...register("lastName")}
                placeholder="Ej: Pérez"
                className="pl-10 sm:pl-11"
                error={errors.lastName?.message}
                fullWidth
              />
            </div>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-[10px] font-black text-carbon-500 uppercase tracking-widest ml-1">Teléfono Principal</label>
            <div className="relative">
              <Phone className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-carbon-400 w-4 h-4" />
              <Input
                {...register("phone")}
                placeholder="Ej: 3001234567"
                className="pl-10 sm:pl-11"
                error={errors.phone?.message}
                fullWidth
              />
            </div>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-[10px] font-black text-carbon-500 uppercase tracking-widest ml-1">Teléfono Secundario</label>
            <div className="relative">
              <Phone className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-carbon-400 w-4 h-4 opacity-50" />
              <Input
                {...register("phone2")}
                placeholder="Otro número..."
                className="pl-10 sm:pl-11"
                error={errors.phone2?.message}
                fullWidth
              />
            </div>
          </div>

          <div className="sm:col-span-2 space-y-1.5 sm:space-y-2">
            <label className="text-[10px] font-black text-carbon-500 uppercase tracking-widest ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-carbon-400 w-4 h-4" />
              <Input
                {...register("email")}
                type="email"
                placeholder="juan@ejemplo.com"
                className="pl-10 sm:pl-11"
                error={errors.email?.message}
                fullWidth
              />
            </div>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-[10px] font-black text-carbon-500 uppercase tracking-widest ml-1">Dirección 1</label>
            <div className="relative">
              <MapPin className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-carbon-400 w-4 h-4" />
              <Input
                {...register("address1")}
                placeholder="Calle 123..."
                className="pl-10 sm:pl-11"
                error={errors.address1?.message}
                fullWidth
              />
            </div>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-[10px] font-black text-carbon-500 uppercase tracking-widest ml-1">Dirección 2 (Opcional)</label>
            <div className="relative">
              <MapPin className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-carbon-400 w-4 h-4 opacity-50" />
              <Input
                {...register("address2")}
                placeholder="Apto, Oficina..."
                className="pl-10 sm:pl-11"
                error={errors.address2?.message}
                fullWidth
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 sm:gap-3 pt-2 sm:pt-4">
          <Button variant="ghost" type="button" onClick={onClose} disabled={isPending} className="h-10 sm:h-11">
            Cancelar
          </Button>
          <Button variant="primary" type="submit" isLoading={isPending} disabled={!isDirty || isPending} className="px-4 sm:px-8 h-10 sm:h-11">
            <Save className="w-4 h-4 mr-1.5 sm:mr-2" />
            <span className="text-xs sm:text-sm">{customer ? "Guardar" : "Crear"}</span>
          </Button>
        </div>
      </form>
    </BaseModal>
  );
}
