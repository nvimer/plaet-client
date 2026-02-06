import { Card, Button, Badge } from "@/components";
import {
  type User,
  RoleName,
  type UserRole,
  type Role,
} from "@/types";
import { Edit2, Trash2, Mail, Phone } from "lucide-react";
import { useState } from "react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog/ConfirmDialog";

interface UserCardProps {
  user: User;
  onEdit: (userId: string) => void;
  onDelete?: (userId: string) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

/**
 * UserCard Component
 *
 * Displays a user card with improved visuals, avatar, and actions.
 * Consistent with the unified design system.
 */
export function UserCard({
  user,
  onEdit,
  onDelete,
  canEdit = true,
  canDelete = false,
}: UserCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Get user's primary role (first role or "Sin rol")
  const getPrimaryRole = (): { name: string; isMultiRole: boolean } => {
    if (!user.roles || user.roles.length === 0) {
      return { name: "Sin rol", isMultiRole: false };
    }

    const firstRole = user.roles[0];
    let roleName: string;

    // Check if it's UserRole structure (has role property)
    if ("role" in firstRole) {
      const userRole = firstRole as UserRole;
      roleName = userRole.role?.name || "Sin rol";
    } else {
      // Direct Role structure
      const role = firstRole as Role;
      roleName = role?.name || "Sin rol";
    }

    return {
      name: roleName,
      isMultiRole: user.roles.length > 1,
    };
  };

  const { name: primaryRole, isMultiRole } = getPrimaryRole();

  // Get initials for avatar
  const getInitials = () => {
    const firstInitial = user.firstName?.[0] || "";
    const lastInitial = user.lastName?.[0] || "";
    return `${firstInitial}${lastInitial}`.toUpperCase() || "U";
  };

  // Map role to badge variant and colors
  const getRoleStyles = (
    role: RoleName | string
  ): { variant: "neutral" | "success" | "warning" | "info"; bgColor: string; textColor: string } => {
    switch (role) {
      case RoleName.ADMIN:
        return { variant: "info", bgColor: "bg-blue-100", textColor: "text-blue-700" };
      case RoleName.WAITER:
        return { variant: "success", bgColor: "bg-emerald-100", textColor: "text-emerald-700" };
      case RoleName.KITCHEN_MANAGER:
        return { variant: "warning", bgColor: "bg-amber-100", textColor: "text-amber-700" };
      case RoleName.CASHIER:
        return { variant: "neutral", bgColor: "bg-purple-100", textColor: "text-purple-700" };
      default:
        return { variant: "neutral", bgColor: "bg-sage-100", textColor: "text-carbon-600" };
    }
  };

  const roleStyles = getRoleStyles(primaryRole);

  return (
    <>
      <Card
        variant="elevated"
        padding="lg"
        className="hover:shadow-soft-lg transition-all group"
      >
        {/* Header with Avatar and Role */}
        <div className="flex items-start gap-4 mb-4">
          {/* Avatar */}
          <div
            className={`w-14 h-14 rounded-2xl ${roleStyles.bgColor} ${roleStyles.textColor} flex items-center justify-center text-lg font-bold flex-shrink-0`}
          >
            {getInitials()}
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            {/* Name */}
            <h3 className="text-lg font-semibold text-carbon-900 mb-0.5 truncate">
              {user.firstName} {user.lastName}
            </h3>

            {/* Role Badge with Multi-role indicator */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={roleStyles.variant} size="sm">
                {primaryRole}
              </Badge>
              {isMultiRole && (
                <span className="text-xs text-carbon-500">
                  +{user.roles!.length - 1} más
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 mb-4">
          {/* Email */}
          <div className="flex items-center gap-2 text-carbon-600">
            <Mail className="w-4 h-4 text-carbon-400 flex-shrink-0" />
            <span className="text-sm truncate">{user.email}</span>
          </div>

          {/* Phone */}
          {user.phone ? (
            <div className="flex items-center gap-2 text-carbon-600">
              <Phone className="w-4 h-4 text-carbon-400 flex-shrink-0" />
              <span className="text-sm">{user.phone}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-carbon-400">
              <Phone className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm italic">Sin teléfono</span>
            </div>
          )}
        </div>

        {/* Actions */}
        {(canEdit || canDelete) && (
          <div className="flex gap-2 pt-4 border-t border-sage-border-subtle">
            {canEdit && (
              <Button
                variant="ghost"
                size="md"
                onClick={() => onEdit(user.id)}
                className="flex-1 min-h-[44px]"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Editar
              </Button>
            )}

            {canDelete && onDelete && (
              <Button
                variant="ghost"
                size="md"
                onClick={() => setShowDeleteConfirm(true)}
                className="flex-1 text-red-600 hover:bg-red-50 hover:text-red-700 min-h-[44px]"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar
              </Button>
            )}
          </div>
        )}
      </Card>

      {/* Delete Confirmation */}
      {canDelete && onDelete && (
        <ConfirmDialog
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={() => {
            onDelete(user.id);
            setShowDeleteConfirm(false);
          }}
          title="Eliminar Usuario"
          message={`¿Estás seguro de que deseas eliminar a ${user.firstName} ${user.lastName}? Esta acción no se puede deshacer.`}
          confirmText="Eliminar"
          cancelText="Cancelar"
          variant="danger"
        />
      )}
    </>
  );
}
