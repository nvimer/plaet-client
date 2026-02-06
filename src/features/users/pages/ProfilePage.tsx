import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SidebarLayout } from "@/layouts/SidebarLayout";
import { Button, Input, Skeleton, Card, Badge } from "@/components";
import { useAuth } from "@/hooks";
import { profileApi } from "@/services";
import { updateProfileSchema, type UpdateProfileInput } from "../schemas/userSchemas";
import { ROUTES } from "@/app/routes";
import { toast } from "sonner";
import { Check, ArrowLeft, User, Shield } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import type { UserRole, Role } from "@/types";
import { RoleName } from "@/types";
import type { AxiosErrorWithResponse } from "@/types/common";

/**
 * ProfilePage Component
 *
 * User profile editing page. Uses SidebarLayout and card form design.
 * Users can edit their own information but NOT roles.
 */
export function ProfilePage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    values: user
      ? {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone || "",
        }
      : undefined,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: UpdateProfileInput) => {
      if (!user) throw new Error("Usuario no autenticado");
      const response = await profileApi.updateProfile(user.id, data);
      return response.data;
    },
    onSuccess: (updatedUser) => {
      // Update auth context user
      queryClient.setQueryData(["profile", "me"], updatedUser);
      toast.success("Perfil actualizado", {
        description: "Tu información ha sido actualizada exitosamente",
        icon: "✅",
      });
      setIsUpdating(false);
    },
    onError: (error: AxiosErrorWithResponse) => {
      toast.error("Error al actualizar perfil", {
        description: error.response?.data?.message || error.message,
        icon: "❌",
      });
      setIsUpdating(false);
    },
  });

  const onSubmit = (data: UpdateProfileInput) => {
    setIsUpdating(true);
    updateProfileMutation.mutate(data);
  };

  // Get initials for avatar
  const getInitials = () => {
    if (!user) return "U";
    const firstInitial = user.firstName?.[0] || "";
    const lastInitial = user.lastName?.[0] || "";
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  // Map role to badge variant
  const getRoleVariant = (
    roleName: RoleName | string
  ): "neutral" | "success" | "warning" | "info" => {
    if (roleName === RoleName.ADMIN) return "info";
    if (roleName === RoleName.WAITER) return "success";
    if (roleName === RoleName.KITCHEN_MANAGER) return "warning";
    if (roleName === RoleName.CASHIER) return "info";
    return "neutral";
  };

  // Loading state
  if (!user) {
    return (
      <SidebarLayout
        title="Cargando..."
        backRoute={ROUTES.DASHBOARD}
        fullWidth
        contentClassName="p-4 sm:p-6 lg:p-10"
      >
        <div className="max-w-2xl mx-auto">
          <Skeleton variant="card" height={500} />
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout
      title="Mi Perfil"
      subtitle="Actualiza tu información personal"
      backRoute={ROUTES.DASHBOARD}
      fullWidth
      contentClassName="p-4 sm:p-6 lg:p-10"
    >
      <div className="max-w-2xl mx-auto">
        {/* User Header Card */}
        <Card variant="elevated" padding="lg" className="rounded-2xl mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-sage-100 text-sage-700 flex items-center justify-center text-2xl font-bold">
              {getInitials()}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-carbon-900">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-carbon-500">{user.email}</p>
            </div>
          </div>
        </Card>

        {/* Edit Form Card */}
        <Card variant="elevated" padding="lg" className="rounded-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information Section */}
            <div>
              <h3 className="text-lg font-semibold text-carbon-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-sage-600" />
                Información Personal
              </h3>

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

            {/* Current Roles (Read-only) */}
            {user.roles && user.roles.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-carbon-900 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-sage-600" />
                  Roles
                </h3>
                <div className="space-y-3">
                  {user.roles.map((userRoleOrRole) => {
                    // Handle nested role structure (UserRole) or direct Role
                    let role: Role;
                    let roleId: number | string;

                    if ("role" in userRoleOrRole) {
                      const userRole = userRoleOrRole as UserRole;
                      role = userRole.role;
                      roleId = role.id;
                    } else {
                      role = userRoleOrRole as Role;
                      roleId = role.id;
                    }

                    return (
                      <div
                        key={roleId}
                        className="flex items-center justify-between p-4 border-2 border-sage-200 rounded-xl bg-sage-50/50"
                      >
                        <div>
                          <p className="font-medium text-carbon-900">{role.name}</p>
                          {role.description && (
                            <p className="text-sm text-carbon-600">
                              {role.description}
                            </p>
                          )}
                        </div>
                        <Badge variant={getRoleVariant(role.name)} size="sm">
                          {role.name}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-carbon-500 mt-3">
                  Contacta a un administrador para cambiar tus roles
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-sage-200">
              <Button
                type="button"
                variant="ghost"
                size="lg"
                onClick={() => reset()}
                disabled={isUpdating}
                className="order-2 sm:order-1"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Restablecer
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isUpdating}
                disabled={isUpdating}
                className="order-1 sm:order-2 flex-1"
              >
                {!isUpdating && <Check className="w-5 h-5 mr-2" />}
                Guardar Cambios
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </SidebarLayout>
  );
}
