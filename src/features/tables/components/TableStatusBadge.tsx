import { TableStatus } from "@/types";

interface TableStatusBadgeProps {
    status: TableStatus;
}

/**
 * TableStatusBadge Component
 *
 * Displays table status with color-coded badge
 *
 * @example
 * <TableStatusBadge status={TableStatus.AVAILABLE} />
 */
export function TableStatusBadge({ status }: TableStatusBadgeProps) {
    const statusConfig = {
        [TableStatus.AVAILABLE]: {
            color: "bg-success-100 text-success-800 border-success-200",
            label: "Disponible",
        },

        [TableStatus.OCCUPIED]: {
            color: "bg-error-100 text-error-800 border-error-200",
            label: "Ocupada",
        },
        [TableStatus.NEEDS_CLEANING]: {
            color: "bg-yellow-100 text-yellow-800 border-yellow-200",
            label: "Limpieza",
        },
    };

    const config = statusConfig[status];

    return (
        <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}
        >
            {/* Status dot */}
            <span className="w-2 h-2 rounded-full bg-current mr-2" />
            {config.label}
        </span>
    );
}
