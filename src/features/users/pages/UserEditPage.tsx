import { Button, Card, EmptyState, Input, Skeleton } from "@/components";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SidebarLayout } from "@/layouts/SidebarLayout";
import { useUser, useUpdateUser, useRoles } from "../hooks";
import { updateUserSchema, type UpdateUserInput } from "../schemas/userSchemas";
import { ROUTES } from "@/app/routes";
import { toast } from "sonner";
import { Check, XCircle, ArrowLeft, UserCheck, Shield, ShieldCheck, Cog, UserCircle } from "lucide-react";
import { useState, useEffect } from "react";
import type { UserRole, Role } from "@/types";
import { RoleName } from "@/types";
import type { AxiosErrorWithResponse } from "@/types/common";
import { useAuth } from "@/hooks";

const ROLE_NAME_MAP: Record<string, string> = {
  SUPERADMIN: "Superadministrador",
  ADMIN: "Administrador",
  KITCHEN_MANAGER: "Jefe de Cocina",
  CASHIER: "Cajero",
  WAITER: "Mesero",
};

/**
 * UserEditPage Component
 *
 * Edit a user. Uses SidebarLayout and card form design.
 * Admin only access.
 */
export function UserEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { data: user, isLoading, error } = useUser(id!);
  const { mutate: updateUser, isPending } = useUpdateUser();
  const { data: roles } = useRoles();
  const isSuperadmin = currentUser?.roles?.some((r) => r.name === "SUPERADMIN") ?? false;
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setError,
  } = useForm<UpdateUserInput>({
    resolver: zodResolver(updateUserSchema),
    mode: "onChange",
    values: user
      ? {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone || "",
        }
      : undefined,
  });

  const originalValues = user
    ? {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || "",
      }
    : undefined;

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
          const message = error.response?.data?.message || error.message;
          
          // Map backend "Email already taken" to form field
          if (message.includes("taken") || message.includes("already") || error.response?.data?.code === "EMAIL_CONFLICT") {
            setError("email", { type: "server", message: "Este correo ya está en uso" });
          } else {
            toast.error("Error al actualizar usuario", {
              description: message,
              icon: "❌",
            });
          }
        },
      }
    );
  };

  return (
    <SidebarLayout
      title="Editar Usuario"
      subtitle={`${user.firstName} ${user.lastName}`}
      backRoute={ROUTES.USERS}
    >
      <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6">
        <Card variant="elevated" padding="lg" className="rounded-3xl border-none shadow-smooth-lg">
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
                  originalValue={originalValues?.firstName}
                />

                {/* Last Name */}
                <Input
                  label="Apellido"
                  type="text"
                  placeholder="Ej: Pérez"
                  {...register("lastName")}
                  error={errors.lastName?.message}
                  fullWidth
                  originalValue={originalValues?.lastName}
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
                  originalValue={originalValues?.email}
                />
              </div>

              {/* Phone */}
              <div className="mt-4">
                <Input
                  label="Teléfono (opcional)"
                  type="tel"
                  placeholder="Ej: 3001234567"
                  {...register("phone")}
                  error={errors.phone?.message}
                  fullWidth
                  originalValue={originalValues?.phone}
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  {roles
                    .filter((role) => role.name !== "SUPERADMIN" || isSuperadmin)
                    .map((role) => {
                    const isSelected = selectedRoleIds.includes(role.id);
                    const roleNameEs = ROLE_NAME_MAP[role.name] || role.name;
                    
                    // Assign icon and color based on role
                    let RoleIcon = UserCircle;
                    if (role.name === RoleName.SUPERADMIN || role.name === RoleName.ADMIN) { RoleIcon = ShieldCheck; }
                    if (role.name === RoleName.KITCHEN_MANAGER) { RoleIcon = Cog; }
                    if (role.name === RoleName.CASHIER) { RoleIcon = Shield; }

                    return (
                      <label
                        key={role.id}
                        className={`
                          relative flex flex-col p-5 border-2 rounded-2xl cursor-pointer 
                          transition-all duration-200 h-full group
                          ${
                            isSelected
                              ? "border-sage-500 bg-sage-50/50 shadow-sm"
                              : "border-sage-200 hover:border-sage-300 hover:bg-sage-50/30 bg-white"
                          }
                        `}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-sage-200 text-sage-700' : 'bg-sage-100 text-sage-500 group-hover:bg-sage-200'}`}>
                            <RoleIcon className="w-5 h-5" />
                          </div>
                          <div
                            className={`
                              w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                              ${
                                isSelected
                                  ? "bg-sage-600 border-sage-600"
                                  : "border-carbon-300"
                              }
                            `}
                          >
                            {isSelected && (
                              <Check className="w-3.5 h-3.5 text-white" />
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-semibold text-base ${isSelected ? "text-carbon-900" : "text-carbon-700"}`}>
                            {roleNameEs}
                          </h3>
                        </div>
                        
                        <p className="text-sm text-carbon-500 leading-relaxed mt-1">
                          {role.description || "Sin descripción adicional"}
                        </p>

                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedRoleIds((prev) => [...prev, role.id]);
                            } else {
                              setSelectedRoleIds((prev) =>
                                prev.filter((id) => id !== role.id)
                              );
                            }
                          }}
                        />
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
                disabled={isPending || !isDirty}
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
