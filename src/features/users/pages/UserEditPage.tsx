import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FullScreenLayout } from "@/layouts/FullScreenLayout";
import { Button, Input, Skeleton, EmptyState } from "@/components";
import { useUser, useUpdateUser, useRoles } from "../hooks";
import { updateUserSchema, type UpdateUserInput } from "../schemas/userSchemas";
import { ROUTES, getUserEditRoute } from "@/app/routes";
import { toast } from "sonner";
import { Check, XCircle } from "lucide-react";
import { useState, useEffect } from "react";
import type { UserRole, Role } from "@/types";
import type { AxiosErrorWithResponse } from "@/types/common";

/**
 * UserEditPage Component
 * 
 * Full-screen page for editing a user (Admin only)
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
    reset,
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
  // Backend returns UserRole relation: { roleId, userId, role: { id, name, ... } }
  useEffect(() => {
    if (user?.roles) {
      const roleIds = user.roles.map((userRoleOrRole) => {
        // Handle nested role structure (UserRole) or direct Role
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
      <FullScreenLayout title="Cargando..." backRoute={ROUTES.USERS}>
        <div className="max-w-2xl mx-auto space-y-6">
          <Skeleton variant="card" height={400} />
        </div>
      </FullScreenLayout>
    );
  }

  // Error state
  if (error || !user) {
    return (
      <FullScreenLayout title="Error" backRoute={ROUTES.USERS}>
        <EmptyState
          icon={<XCircle />}
          title="Usuario no encontrado"
          description="El usuario que buscas no existe o fue eliminado"
          actionLabel="Volver a Usuarios"
          onAction={() => navigate(ROUTES.USERS)}
        />
      </FullScreenLayout>
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

  return (
    <FullScreenLayout
      title={`Editar Usuario`}
      subtitle={`${user.firstName} ${user.lastName}`}
      backRoute={ROUTES.USERS}
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

          {/* Roles Selection */}
          {roles && roles.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-carbon-700 mb-2">
                Roles
              </label>
              <div className="space-y-2">
                {roles.map((role) => (
                  <label
                    key={role.id}
                    className="flex items-center gap-3 p-3 border-2 border-sage-border-subtle rounded-xl cursor-pointer hover:border-sage-green-300 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedRoleIds.includes(role.id)}
                      onChange={() => handleRoleToggle(role.id)}
                      className="w-4 h-4 text-sage-green-600 border-sage-border-subtle rounded focus:ring-sage-green-300"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-carbon-900">{role.name}</p>
                      {role.description && (
                        <p className="text-sm text-carbon-600">
                          {role.description}
                        </p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 pt-6">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isPending}
              disabled={isPending}
              fullWidth
            >
              {!isPending && <Check className="w-5 h-5 mr-2" />}
              Guardar Cambios
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="lg"
              onClick={() => navigate(ROUTES.USERS)}
              disabled={isPending}
              fullWidth
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </FullScreenLayout>
  );
}
