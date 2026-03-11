import { Button, Card, Input } from "@/components";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SidebarLayout } from "@/layouts/SidebarLayout";
import { useCreateRole } from "../hooks";
import { ROUTES } from "@/app/routes";
import { toast } from "sonner";
import { Check, ArrowLeft, Shield } from "lucide-react";
import type { AxiosErrorWithResponse } from "@/types/common";

const createRoleSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede exceder 50 caracteres")
    .regex(
      /^[a-zA-Z_]+$/,
      "Solo letras y guiones bajos (sin espacios)"
    ),
  description: z
    .string()
    .max(200, "La descripción no puede exceder 200 caracteres")
    .optional()
    .or(z.literal("")),
});

type CreateRoleFormData = z.infer<typeof createRoleSchema>;

export function RoleCreatePage() {
  const navigate = useNavigate();
  const createRole = useCreateRole();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateRoleFormData>({
    resolver: zodResolver(createRoleSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: CreateRoleFormData) => {
    try {
      await createRole.mutateAsync(data);
      navigate(ROUTES.ROLES);
    } catch (error) {
      const axiosError = error as AxiosErrorWithResponse;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Error al crear el rol";
      toast.error(message);
    }
  };

  return (
    <SidebarLayout title="Nuevo Rol" backRoute={ROUTES.ROLES}>
      <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6">
        <Card variant="elevated" padding="lg" className="rounded-3xl border-none shadow-smooth-lg">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-sage-100 text-sage-600">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-carbon-900">
                    Información del Rol
                  </h2>
                  <p className="text-sm text-carbon-500">
                    Define el nombre y descripción del nuevo rol
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <Input
                  label="Nombre del Rol"
                  placeholder="Ej: GERENTE_RESTAURANTE"
                  {...register("name")}
                  error={errors.name?.message}
                  fullWidth
                  hint="Usualmente en mayúsculas con guiones bajos"
                />

                <div>
                  <label className="block text-sm font-medium text-carbon-700 mb-1.5">
                    Descripción (opcional)
                  </label>
                  <textarea
                    className="w-full px-4 py-3 rounded-xl border-2 border-carbon-200 bg-white text-carbon-900 placeholder-carbon-400 focus:outline-none focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20 transition-all resize-none"
                    rows={3}
                    placeholder="Describe las responsabilidades de este rol..."
                    {...register("description")}
                  />
                  {errors.description && (
                    <p className="mt-1.5 text-sm text-error-600">
                      {errors.description.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-sage-200">
              <Button
                type="button"
                variant="ghost"
                size="lg"
                onClick={() => navigate(ROUTES.ROLES)}
                disabled={createRole.isPending}
                className="order-2 sm:order-1"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={createRole.isPending}
                disabled={createRole.isPending}
                className="order-1 sm:order-2 flex-1"
              >
                {!createRole.isPending && <Check className="w-5 h-5 mr-2" />}
                Crear Rol
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </SidebarLayout>
  );
}
