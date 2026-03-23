import { Button, Card, EmptyState, Input, Skeleton } from "@/components";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SidebarLayout } from "@/layouts/SidebarLayout";
import { useRole, useUpdateRole } from "../hooks";
import { ROUTES } from "@/app/routes";
import { toast } from "sonner";
import { ArrowLeft, Shield, Save } from "lucide-react";
import type { AxiosErrorWithResponse } from "@/types/common";

const updateRoleSchema = z.object({
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

type UpdateRoleFormData = z.infer<typeof updateRoleSchema>;

const SYSTEM_ROLES = ["SUPERADMIN", "ADMIN", "KITCHEN_MANAGER", "CASHIER", "WAITER"];

const ROLE_NAME_MAP: Record<string, string> = {
  SUPERADMIN: "Superadministrador",
  ADMIN: "Administrador",
  KITCHEN_MANAGER: "Jefe de Cocina",
  CASHIER: "Cajero",
  WAITER: "Mesero",
};

export function RoleEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const roleId = parseInt(id || "0");
  const { data: role, isLoading, error } = useRole(roleId);
  const updateRole = useUpdateRole();

  const isSystemRole = role ? SYSTEM_ROLES.includes(role.name) : false;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateRoleFormData>({
    resolver: zodResolver(updateRoleSchema),
    mode: "onChange",
    values: role
      ? {
          name: role.name,
          description: role.description || "",
        }
      : undefined,
  });

  const onSubmit = async (data: UpdateRoleFormData) => {
    try {
      await updateRole.mutateAsync({ id: roleId, data });
      navigate(ROUTES.ROLES);
    } catch (error) {
      const axiosError = error as AxiosErrorWithResponse;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Error al actualizar el rol";
      toast.error(message);
    }
  };

  if (isLoading) {
    return (
      <SidebarLayout title="Editar Rol" backRoute={ROUTES.ROLES}>
        <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6">
          <Card variant="elevated" padding="lg" className="rounded-3xl">
            <Skeleton className="h-8 w-48 mb-6" />
            <div className="space-y-4">
              <Skeleton className="h-20" />
              <Skeleton className="h-32" />
            </div>
          </Card>
        </div>
      </SidebarLayout>
    );
  }

  if (error || !role) {
    return (
      <SidebarLayout title="Editar Rol" backRoute={ROUTES.ROLES}>
        <div className="max-w-2xl mx-auto py-8 px-4">
          <EmptyState
            icon={<Shield />}
            title="Rol no encontrado"
            description="El rol que buscas no existe o fue eliminado"
            action={
              <Button variant="primary" onClick={() => navigate(ROUTES.ROLES)}>
                Volver a Roles
              </Button>
            }
          />
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout title="Editar Rol" backRoute={ROUTES.ROLES}>
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
                    Editar: {ROLE_NAME_MAP[role.name] || role.name}
                  </h2>
                  <p className="text-sm text-carbon-500">
                    {isSystemRole
                      ? "Este es un rol del sistema"
                      : "Edita la información del rol"}
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
                  disabled={isSystemRole}
                  hint={
                    isSystemRole
                      ? "Los roles del sistema no pueden cambiar su nombre"
                      : "Usualmente en mayúsculas con guiones bajos"
                  }
                />

                <div>
                  <label className="block text-sm font-medium text-carbon-700 mb-1.5">
                    Descripción (opcional)
                  </label>
                  <textarea
                    className="w-full px-4 py-3 rounded-xl border-2 border-carbon-200 bg-white text-carbon-900 placeholder-carbon-400 focus:outline-none focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20 transition-all resize-none disabled:bg-carbon-50 disabled:text-carbon-400"
                    rows={3}
                    placeholder="Describe las responsabilidades de este rol..."
                    {...register("description")}
                    disabled={isSystemRole}
                  />
                  {errors.description && (
                    <p className="mt-1.5 text-sm text-error-600">
                      {errors.description.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {isSystemRole && (
              <div className="bg-warning-50 border border-warning-200 rounded-xl p-4">
                <p className="text-sm text-warning-700">
                  <strong>Nota:</strong> Los roles del sistema tienen limitaciones
                  de edición. Solo puedes modificar sus permisos desde la matriz
                  de permisos.
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-sage-200">
              <Button
                type="button"
                variant="ghost"
                size="lg"
                onClick={() => navigate(ROUTES.ROLES)}
                disabled={updateRole.isPending}
                className="order-2 sm:order-1"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={updateRole.isPending}
                disabled={updateRole.isPending || isSystemRole}
                className="order-1 sm:order-2 flex-1"
              >
                {!updateRole.isPending && <Save className="w-5 h-5 mr-2" />}
                Guardar Cambios
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </SidebarLayout>
  );
}
