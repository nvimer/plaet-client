import { Button, Card, Input } from "@/components";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SidebarLayout } from "@/layouts/SidebarLayout";
import { useCreateUser, useRoles } from "../hooks";
import { createUserSchema, type CreateUserInput } from "../schemas/userSchemas";
import { ROUTES } from "@/app/routes";
import { toast } from "sonner";
import { Check, UserCheck, ArrowLeft, Shield, ShieldCheck, Cog, UserCircle } from "lucide-react";
import { useState } from "react";
import type { AxiosErrorWithResponse } from "@/types/common";
import { usePermissions } from "@/hooks";

const ROLE_NAME_MAP: Record<string, string> = {
  SUPERADMIN: "Superadministrador",
  ADMIN: "Administrador",
  KITCHEN_MANAGER: "Jefe de Cocina",
  CASHIER: "Cajero",
  WAITER: "Mesero",
};

/**
 * UserCreatePage Component
 *
 * Create a new user. Uses SidebarLayout and card form design.
 * Admin only access.
 */
export function UserCreatePage() {
  const navigate = useNavigate();
  const { isSuperAdmin } = usePermissions();
  const { mutate: createUser, isPending } = useCreateUser();
  const {
    data: roles,
    isLoading: isLoadingRoles,
    error: rolesError,
  } = useRoles();
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      roleIds: [],
    },
  });

  const onSubmit = (data: CreateUserInput) => {
    createUser(
      {
        ...data,
        roleIds: selectedRoleIds.length > 0 ? selectedRoleIds : undefined,
      },
      {
        onSuccess: () => {
          toast.success("Usuario creado", {
            description: `${data.firstName} ${data.lastName} ha sido creado exitosamente`,
            icon: "🎉",
          });
          navigate(ROUTES.USERS);
        },
        onError: (error: AxiosErrorWithResponse) => {
          const message = error.response?.data?.message || error.message;
          
          // Map backend "Email already taken" to form field
          if (message.includes("taken") || message.includes("already") || error.response?.data?.code === "EMAIL_CONFLICT") {
            setError("email", { type: "server", message: "Este correo ya está en uso" });
          } else {
            toast.error("Error al crear usuario", {
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
      title="Nuevo Usuario"
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
                  placeholder="Ej: 3001234567"
                  {...register("phone")}
                  error={errors.phone?.message}
                  fullWidth
                />
              </div>

              {/* Info about password */}
              <div className="mt-4 p-4 bg-sage-50 border border-sage-200 rounded-xl">
                <p className="text-sm text-sage-800">
                  <strong>📧 La contraseña se enviará por correo electrónico.</strong>
                  <br />
                  No es necesario establecer una contraseña ahora. El nuevo usuario recibirá sus credenciales de acceso por email.
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-sage-200" />

            {/* Roles Section */}
            <div>
              <h2 className="text-lg font-semibold text-carbon-900 mb-4">
                Roles (opcional)
              </h2>

              {isLoadingRoles && (
                <div className="text-sm text-carbon-600 py-4 bg-sage-50 rounded-xl text-center">
                  Cargando roles...
                </div>
              )}

              {rolesError && (
                <div className="text-sm text-error-600 py-4 bg-error-50 rounded-xl text-center">
                  Error al cargar roles: {rolesError.message}
                </div>
              )}

              {!isLoadingRoles && !rolesError && roles && roles.length === 0 && (
                <div className="text-sm text-carbon-600 py-6 border-2 border-dashed border-sage-border-subtle rounded-xl text-center">
                  No hay roles disponibles. Contacta al administrador del sistema.
                </div>
              )}

              {roles && roles.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  {roles
                    .filter((role) => role.name !== "SUPERADMIN" || isSuperAdmin())
                    .map((role) => {
                    const isSelected = selectedRoleIds.includes(role.id);
                    const roleNameEs = ROLE_NAME_MAP[role.name] || role.name;
                    
                    // Assign icon and color based on role
                    let RoleIcon = UserCircle;
                    
                    if (role.name === "SUPERADMIN" || role.name === "ADMIN") { RoleIcon = ShieldCheck; }
                    if (role.name === "KITCHEN_MANAGER") { RoleIcon = Cog; }
                    if (role.name === "CASHIER") { RoleIcon = Shield; }

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
              )}

              {selectedRoleIds.length > 0 && (
                <p className="mt-3 text-sm text-sage-700 font-medium">
                  {selectedRoleIds.length} rol(es) seleccionado(s)
                </p>
              )}
            </div>

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
                Crear Usuario
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </SidebarLayout>
  );
}
