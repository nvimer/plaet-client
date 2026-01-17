import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FullScreenLayout } from "@/layouts/FullScreenLayout";
import { Button, Input, Badge } from "@/components";
import { useCreateUser, useRoles } from "../hooks";
import { createUserSchema, type CreateUserInput } from "../schemas/userSchemas";
import { ROUTES } from "@/app/routes";
import { toast } from "sonner";
import { Check, UserCheck } from "lucide-react";
import { useState } from "react";
import { RoleName } from "@/types";

/**
 * UserCreatePage Component
 *
 * Full-screen page for creating a new user (Admin only)
 */
export function UserCreatePage() {
  const navigate = useNavigate();
  const { mutate: createUser, isPending } = useCreateUser();
  const {
    data: roles,
    isLoading: isLoadingRoles,
    error: rolesError,
  } = useRoles();
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);

  // Extract roles array if it's wrapped in PaginatedResponse
  let rolesArray: any[] = [];
  if (Array.isArray(roles)) {
    rolesArray = roles;
  } else if (roles?.data) {
    if (Array.isArray(roles.data)) {
      rolesArray = roles.data;
    } else if (roles.data.data && Array.isArray(roles.data.data)) {
      rolesArray = roles.data.data;
    } else if (roles.data.roles && Array.isArray(roles.data.roles)) {
      rolesArray = roles.data.roles;
    }
  }

  // Debug: Log roles data
  console.log("🔍 UserCreatePage - roles (raw):", roles);
  console.log("🔍 UserCreatePage - rolesArray:", rolesArray);
  console.log("🔍 UserCreatePage - isLoadingRoles:", isLoadingRoles);
  console.log("🔍 UserCreatePage - rolesError:", rolesError);
  console.log("🔍 UserCreatePage - rolesArray length:", rolesArray.length);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
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
        onError: (error: any) => {
          toast.error("Error al crear usuario", {
            description: error.response?.data?.message || error.message,
            icon: "❌",
          });
        },
      },
    );
  };

  const handleRoleToggle = (roleId: number) => {
    setSelectedRoleIds((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId],
    );
  };

  return (
    <FullScreenLayout
      title="Nuevo Usuario"
      subtitle="Completa los datos para crear un nuevo usuario"
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

          {/* Password */}
          <Input
            label="Contraseña"
            type="password"
            placeholder="Mínimo 8 caracteres"
            {...register("password")}
            error={errors.password?.message}
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
          <div>
            <label className="block text-sm font-medium text-carbon-700 mb-3 flex items-center gap-2">
              <UserCheck className="w-4 h-4" />
              Asignar Roles (opcional)
            </label>

            {isLoadingRoles && (
              <div className="text-sm text-carbon-600 py-4">
                Cargando roles...
              </div>
            )}

            {rolesError && (
              <div className="text-sm text-red-600 py-4">
                Error al cargar roles: {rolesError.message}
              </div>
            )}

            {!isLoadingRoles && !rolesError && rolesArray && rolesArray.length === 0 && (
              <div className="text-sm text-carbon-600 py-4 border-2 border-dashed border-sage-border-subtle rounded-xl p-4 text-center">
                No hay roles disponibles. Contacta al administrador del sistema.
              </div>
            )}

            {rolesArray && Array.isArray(rolesArray) && rolesArray.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {rolesArray.map((role: any) => {
                  console.log("🔍 Rendering role:", role);
                    const isSelected = selectedRoleIds.includes(role.id);
                    const getRoleVariant = (
                      roleName: RoleName | string,
                    ): "neutral" | "success" | "warning" | "error" | "info" => {
                      if (roleName === RoleName.ADMIN) return "info";
                      if (roleName === RoleName.WAITER) return "success";
                      if (roleName === RoleName.KITCHEN_MANAGER)
                        return "warning";
                      if (roleName === RoleName.CASHIER) return "info";
                      return "neutral";
                    };

                    return (
                      <label
                        key={role.id}
                        className={`
                        relative flex items-start gap-3 p-4 
                        border-2 rounded-xl cursor-pointer 
                        transition-all duration-200
                        ${isSelected
                            ? "border-sage-green-500 bg-sage-green-50 shadow-md"
                            : "border-sage-border-subtle bg-white hover:border-sage-green-300 hover:bg-sage-green-50/50"
                          }
                      `}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleRoleToggle(role.id)}
                          className="mt-1 w-5 h-5 text-sage-green-600 border-sage-border-subtle rounded focus:ring-2 focus:ring-sage-green-300 focus:ring-offset-2 cursor-pointer"
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
                            <div className="w-6 h-6 bg-sage-green-500 rounded-full flex items-center justify-center">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        )}
                      </label>
                    );
                  })}
              </div>
            ) : (
              !isLoadingRoles && !rolesError && (
                <div className="text-sm text-carbon-600 py-4">
                  No se pudieron cargar los roles. Verifica la consola para más detalles.
                </div>
              )
            )}

            {selectedRoleIds.length > 0 && (
              <p className="mt-2 text-sm text-sage-green-700 font-medium">
                {selectedRoleIds.length} rol(es) seleccionado(s)
              </p>
            )}
          </div>

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
              Crear Usuario
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
