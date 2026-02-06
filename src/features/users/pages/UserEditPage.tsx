import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SidebarLayout } from "@/layouts/SidebarLayout";
import { Button, Input, Skeleton, EmptyState, Badge, Card } from "@/components";
import { useUser, useUpdateUser, useRoles } from "../hooks";
import { updateUserSchema, type UpdateUserInput } from "../schemas/userSchemas";
import { ROUTES } from "@/app/routes";
import { toast } from "sonner";
import { Check, XCircle, ArrowLeft, UserCheck } from "lucide-react";
import { useState, useEffect } from "react";
import type { UserRole, Role } from "@/types";
import { RoleName } from "@/types";
import type { AxiosErrorWithResponse } from "@/types/common";

/**
 * UserEditPage Component
 *
 * Edit a user. Uses SidebarLayout and card form design.
 * Admin only access.
 */
export function UserEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: user, isLoading, error } = useUser(id);
  const { mutate: updateUser, isPending } = useUpdateUser();
  const { data: roles } = useRoles();
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateUserInput>({
    resolver: zodResolver(updateUserSchema),
    values: user
      ? {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone || "",
        }
      : undefined,
  });

  // Update selected roles when user data loads
  useEffect(() => {
    if (user?.roles) {
      const roleIds = user.roles.map((userRoleOrRole) => {
        if ("role" in userRoleOrRole) {
          const userRole = userRoleOrRole as UserRole;
          return userRole.role.id;
        }
        const role = userRoleOrRole as Role;
        return role.id;
      });
      setSelectedRoleIds(roleIds);
    }
  }, [user]);

  // Loading state
  if (isLoading) {
    return (
      <SidebarLayout
        title="Cargando..."
        backRoute={ROUTES.USERS}
        fullWidth
        contentClassName="p-4 sm:p-6 lg:p-10"
      >
        <div className="max-w-2xl mx-auto">
          <Skeleton variant="card" height={500} />
        </div>
      </SidebarLayout>
    );
  }

  // Error state
  if (error || !user) {
    return (
      <SidebarLayout
        title="Error"
        backRoute={ROUTES.USERS}
        fullWidth
        contentClassName="p-4 sm:p-6 lg:p-10"
      >
        <div className="max-w-2xl mx-auto">
          <EmptyState
            icon={<XCircle />}
            title="Usuario no encontrado"
            description="El usuario que buscas no existe o fue eliminado"
            actionLabel="Volver a Usuarios"
            onAction={() => navigate(ROUTES.USERS)}
          />
        </div>
      </SidebarLayout>
    );
  }

  const onSubmit = (data: UpdateUserInput) => {
    updateUser(
      {
        id: user.id,
        data: {
          ...data,
          roleIds: selectedRoleIds.length > 0 ? selectedRoleIds : undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success("Usuario actualizado", {
            description: `${data.firstName || user.firstName} ${data.lastName || user.lastName} ha sido actualizado`,
            icon: "✅",
          });
          navigate(ROUTES.USERS);
        },
        onError: (error: AxiosErrorWithResponse) => {
          toast.error("Error al actualizar usuario", {
            description: error.response?.data?.message || error.message,
            icon: "❌",
          });
        },
      }
    );
  };

  const handleRoleToggle = (roleId: number) => {
    setSelectedRoleIds((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId]
    );
  };

  const getRoleVariant = (
    roleName: RoleName | string
  ): "neutral" | "success" | "warning" | "error" | "info" => {
    if (roleName === RoleName.ADMIN) return "info";
    if (roleName === RoleName.WAITER) return "success";
    if (roleName === RoleName.KITCHEN_MANAGER) return "warning";
    if (roleName === RoleName.CASHIER) return "info";
    return "neutral";
  };

  return (
    <SidebarLayout
      title="Editar Usuario"
      subtitle={`${user.firstName} ${user.lastName}`}
      backRoute={ROUTES.USERS}
      fullWidth
      contentClassName="p-4 sm:p-6 lg:p-10"
    >
      <div className="max-w-2xl mx-auto">
        <Card variant="elevated" padding="lg" className="rounded-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information Section */}
            <div>
              <h2 className="text-lg font-semibold text-carbon-900 mb-4 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-sage-600" />
                Información Personal
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* First Name */}
                <Input
                  label="Nombre"
                  type="text"
                  placeholder="Ej: Juan"
                  {...register("firstName")}
                  error={errors.firstName?.message}
                  fullWidth
                />

                {/* Last Name */}
                <Input
                  label="Apellido"
                  type="text"
                  placeholder="Ej: Pérez"
                  {...register("lastName")}
                  error={errors.lastName?.message}
                  fullWidth
                />
              </div>

              {/* Email */}
              <div className="mt-4">
                <Input
                  label="Email"
                  type="email"
                  placeholder="Ej: juan@example.com"
                  {...register("email")}
                  error={errors.email?.message}
                  fullWidth
                />
              </div>

              {/* Phone */}
              <div className="mt-4">
                <Input
                  label="Teléfono (opcional)"
                  type="tel"
                  placeholder="Ej: +57 300 123 4567"
                  {...register("phone")}
                  error={errors.phone?.message}
                  fullWidth
                />
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-sage-200" />

            {/* Roles Section */}
            {roles && roles.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-carbon-900 mb-4">
                  Roles
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {roles.map((role) => {
                    const isSelected = selectedRoleIds.includes(role.id);

                    return (
                      <label
                        key={role.id}
                        className={`
                          relative flex items-start gap-3 p-4 
                          border-2 rounded-xl cursor-pointer 
                          transition-all duration-200
                          ${
                            isSelected
                              ? "border-sage-500 bg-sage-50 shadow-md"
                              : "border-sage-200 bg-white hover:border-sage-300 hover:bg-sage-50/50"
                          }
                        `}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleRoleToggle(role.id)}
                          className="mt-1 w-5 h-5 text-sage-600 border-sage-300 rounded focus:ring-2 focus:ring-sage-300 focus:ring-offset-2 cursor-pointer"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-carbon-900">
                              {role.name}
                            </p>
                            <Badge
                              variant={getRoleVariant(role.name)}
                              size="sm"
                            >
                              {role.name}
                            </Badge>
                          </div>
                          {role.description && (
                            <p className="text-sm text-carbon-600 leading-relaxed">
                              {role.description}
                            </p>
                          )}
                        </div>
                        {isSelected && (
                          <div className="absolute top-2 right-2">
                            <div className="w-6 h-6 bg-sage-500 rounded-full flex items-center justify-center">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        )}
                      </label>
                    );
                  })}
                </div>

                {selectedRoleIds.length > 0 && (
                  <p className="mt-3 text-sm text-sage-700 font-medium">
                    {selectedRoleIds.length} rol(es) seleccionado(s)
                  </p>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-sage-200">
              <Button
                type="button"
                variant="ghost"
                size="lg"
                onClick={() => navigate(ROUTES.USERS)}
                disabled={isPending}
                className="order-2 sm:order-1"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isPending}
                disabled={isPending}
                className="order-1 sm:order-2 flex-1"
              >
                {!isPending && <Check className="w-5 h-5 mr-2" />}
                Guardar Cambios
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </SidebarLayout>
  );
}
