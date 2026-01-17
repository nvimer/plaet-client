import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FullScreenLayout } from "@/layouts/FullScreenLayout";
import { Button, Input, Skeleton } from "@/components";
import { useAuth } from "@/hooks";
import { profileApi } from "@/services";
import { updateProfileSchema, type UpdateProfileInput } from "../schemas/userSchemas";
import { ROUTES } from "@/app/routes";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import type { UserRole, Role } from "@/types";
import type { AxiosErrorWithResponse } from "@/types/common";

/**
 * ProfilePage Component
 * 
 * Full-screen page for editing own profile
 * Users can edit their own information but NOT roles
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

  // Loading state
  if (!user) {
    return (
      <FullScreenLayout title="Cargando..." backRoute={ROUTES.DASHBOARD}>
        <div className="max-w-2xl mx-auto space-y-6">
          <Skeleton variant="card" height={400} />
        </div>
      </FullScreenLayout>
    );
  }

  return (
    <FullScreenLayout
      title="Mi Perfil"
      subtitle="Actualiza tu información personal"
      backRoute={ROUTES.DASHBOARD}
    >
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

          {/* Email */}
          <Input
            label="Email"
            type="email"
            placeholder="Ej: juan@example.com"
            {...register("email")}
            error={errors.email?.message}
            fullWidth
          />

          {/* Phone */}
          <Input
            label="Teléfono (opcional)"
            type="tel"
            placeholder="Ej: +57 300 123 4567"
            {...register("phone")}
            error={errors.phone?.message}
            fullWidth
          />

          {/* Current Roles (Read-only) */}
          {user.roles && user.roles.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-carbon-700 mb-2">
                Roles (no se pueden modificar)
              </label>
              <div className="space-y-2">
                {user.roles.map((userRoleOrRole, index) => {
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
                      className="p-3 border-2 border-sage-border-subtle rounded-xl bg-sage-50"
                    >
                      <p className="font-medium text-carbon-900">{role.name}</p>
                      {role.description && (
                        <p className="text-sm text-carbon-600">
                          {role.description}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-carbon-500 mt-2">
                Contacta a un administrador para cambiar tus roles
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 pt-6">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isUpdating}
              disabled={isUpdating}
              fullWidth
            >
              {!isUpdating && <Check className="w-5 h-5 mr-2" />}
              Guardar Cambios
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="lg"
              onClick={() => reset()}
              disabled={isUpdating}
              fullWidth
            >
              Restablecer
            </Button>
          </div>
        </form>
      </div>
    </FullScreenLayout>
  );
}
