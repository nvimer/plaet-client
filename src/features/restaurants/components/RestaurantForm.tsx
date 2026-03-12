import { Button, Input, Select } from "@/components";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { restaurantFormSchema, type RestaurantFormValues } from "../schemas/restaurant.schema";
import { Save, User, Building2, MailCheck, Settings2 } from "lucide-react";
import { RestaurantStatus } from "@/types";

interface RestaurantFormProps {
  onSubmit: (data: RestaurantFormValues) => void;
  isLoading?: boolean;
  initialData?: Partial<RestaurantFormValues>;
}

export function RestaurantForm({ onSubmit, isLoading, initialData }: RestaurantFormProps) {
  const isEditing = !!initialData?.name;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RestaurantFormValues>({
    resolver: zodResolver(restaurantFormSchema),
    defaultValues: initialData || {},
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Sección: Información del Restaurante */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-carbon-900 tracking-wide flex items-center gap-2">
          <Building2 className="w-4 h-4 text-primary-600" />
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

        {isEditing && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Estado del Restaurante"
              {...register("status")}
              error={errors.status?.message}
              options={[
                { label: "Activo", value: RestaurantStatus.ACTIVE },
                { label: "En Prueba", value: RestaurantStatus.TRIAL },
                { label: "Suspendido", value: RestaurantStatus.SUSPENDED },
                { label: "Vencido", value: RestaurantStatus.PAST_DUE },
              ]}
            />
          </div>
        )}
      </div>

      {!isEditing && (
        <>
          <hr className="border-carbon-100" />

          {/* Sección: Usuario Administrador */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-carbon-900 tracking-wide flex items-center gap-2">
              <User className="w-4 h-4 text-primary-600" />
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
            </div>

            {/* Notificación de Credenciales */}
            <div className="bg-primary-50 border border-primary-100 rounded-2xl p-4 flex items-start gap-3 mt-4 animate-fade-in">
              <div className="bg-white p-2 rounded-xl shadow-soft-sm">
                <MailCheck className="w-5 h-5 text-primary-600" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-primary-900">Entrega Automática de Credenciales</p>
                <p className="text-xs text-primary-700 leading-relaxed">
                  Al registrar el restaurante, el sistema generará una contraseña segura automáticamente y la enviará junto con las instrucciones de acceso al correo electrónico proporcionado arriba.
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="flex justify-end gap-3 pt-6">
        <Button type="submit" isLoading={isLoading} className="w-full md:w-auto px-8">
          {isEditing ? (
            <>
              <Settings2 className="w-4 h-4 mr-2" />
              Guardar Cambios
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Registrar Restaurante
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
