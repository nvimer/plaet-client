import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FullScreenLayout } from "@/layouts/FullScreenLayout";
import { Button, Input } from "@/components";
import { useCreateUser, useRoles } from "../hooks";
import { createUserSchema, type CreateUserInput } from "../schemas/userSchemas";
import { ROUTES } from "@/app/routes";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { useState } from "react";

/**
 * UserCreatePage Component
 * 
 * Full-screen page for creating a new user (Admin only)
 */
export function UserCreatePage() {
  const navigate = useNavigate();
  const { mutate: createUser, isPending } = useCreateUser();
  const { data: roles } = useRoles();
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);

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
          {roles && roles.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-carbon-700 mb-2">
                Roles (opcional)
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
