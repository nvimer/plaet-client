import { Card, Button, Badge } from "@/components";
import { type User, RoleName } from "@/types";
import { Edit2, Trash2, Mail, Phone } from "lucide-react";
import { useState } from "react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

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
 * Displays a user card with basic information and actions
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
  const primaryRole = user.roles?.[0]?.name || "Sin rol";

  // Map role to badge variant
  const getRoleVariant = (
    role: RoleName | string,
  ): "neutral" | "success" | "warning" | "info" => {
    if (role === RoleName.ADMIN) return "info";
    if (role === RoleName.WAITER) return "success";
    if (role === RoleName.KITCHEN_MANAGER) return "warning";
    return "neutral";
  };

  return (
    <>
      <Card
        variant="elevated"
        padding="lg"
        className="hover:shadow-soft-lg transition-all"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            {/* Name */}
            <h3 className="text-xl font-semibold text-carbon-900 mb-1">
              {user.firstName} {user.lastName}
            </h3>

            {/* Email */}
            <div className="flex items-center gap-2 text-carbon-600 mb-1">
              <Mail className="w-4 h-4" />
              <span className="text-sm">{user.email}</span>
            </div>

            {/* Phone */}
            {user.phone && (
              <div className="flex items-center gap-2 text-carbon-600 mb-2">
                <Phone className="w-4 h-4" />
                <span className="text-sm">{user.phone}</span>
              </div>
            )}

            {/* Role Badge */}
            <Badge variant={getRoleVariant(primaryRole)} size="sm">
              {primaryRole}
            </Badge>
          </div>
        </div>

        {/* Actions */}
        {(canEdit || canDelete) && (
          <div className="flex gap-2 pt-4 border-t border-sage-border-subtle">
            {canEdit && (
              <Button
                variant="ghost"
                size="md"
                onClick={() => onEdit(user.id)}
                className="flex-1"
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
                className="flex-1 text-red-600 hover:bg-red-50 hover:text-red-700"
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
