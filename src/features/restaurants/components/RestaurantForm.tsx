import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { restaurantFormSchema, RestaurantFormValues } from "../schemas/restaurant.schema";
import { Button } from "@/components/ui/Button/Button";
import { Input } from "@/components/ui/Input/Input";
import { Save, User, Building2, Globe, Phone, Mail, Lock } from "lucide-react";

interface RestaurantFormProps {
  onSubmit: (data: RestaurantFormValues) => void;
  isLoading?: boolean;
  initialData?: any;
}

export function RestaurantForm({ onSubmit, isLoading, initialData }: RestaurantFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RestaurantFormValues>({
    resolver: zodResolver(restaurantFormSchema),
    defaultValues: initialData || {
      currency: "COP",
      timezone: "America/Bogota",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Sección: Información del Restaurante */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-carbon-900 uppercase tracking-wider flex items-center gap-2">
          <Building2 className="w-4 h-4 text-sage-600" />
          Información del Restaurante
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nombre del Restaurante"
            placeholder="Ej. Sazonarte"
            {...register("name")}
            error={errors.name?.message}
            required
          />
          <Input
            label="NIT / Identificación"
            placeholder="Ej. 123.456.789-0"
            {...register("nit")}
            error={errors.nit?.message}
          />
          <Input
            label="Dirección"
            placeholder="Calle 123 #45-67"
            {...register("address")}
            error={errors.address?.message}
          />
          <Input
            label="Teléfono"
            placeholder="300 123 4567"
            {...register("phone")}
            error={errors.phone?.message}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Moneda"
            placeholder="COP"
            {...register("currency")}
            error={errors.currency?.message}
          />
          <Input
            label="Zona Horaria"
            placeholder="America/Bogota"
            {...register("timezone")}
            error={errors.timezone?.message}
          />
        </div>
      </div>

      <hr className="border-carbon-100" />

      {/* Sección: Usuario Administrador */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-carbon-900 uppercase tracking-wider flex items-center gap-2">
          <User className="w-4 h-4 text-sage-600" />
          Primer Usuario Administrador
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nombre"
            placeholder="Juan"
            {...register("adminFirstName")}
            error={errors.adminFirstName?.message}
            required
          />
          <Input
            label="Apellido"
            placeholder="Pérez"
            {...register("adminLastName")}
            error={errors.adminLastName?.message}
            required
          />
          <Input
            label="Correo Electrónico"
            type="email"
            placeholder="admin@restaurante.com"
            {...register("adminEmail")}
            error={errors.adminEmail?.message}
            required
          />
          <Input
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            {...register("adminPassword")}
            error={errors.adminPassword?.message}
            required
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6">
        <Button type="submit" isLoading={isLoading} className="w-full md:w-auto px-8">
          <Save className="w-4 h-4 mr-2" />
          Registrar Restaurante
        </Button>
      </div>
    </form>
  );
}
