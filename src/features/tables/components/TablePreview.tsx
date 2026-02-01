import { MapPin, Eye } from "lucide-react";
import { TableStatus } from "@/types";
import { cn } from "@/utils/cn";

interface TablePreviewProps {
  tableData: {
    number: string;
    location?: string;
    status?: TableStatus;
  };
  className?: string;
  /** Compact mode for smaller spaces */
  compact?: boolean;
}

// Status configurations
const STATUS_CONFIG: Record<
  TableStatus,
  {
    label: string;
    badge: string;
    bg: string;
    dot: string;
  }
> = {
  [TableStatus.AVAILABLE]: {
    label: "Disponible",
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
    bg: "bg-emerald-50",
    dot: "bg-emerald-500",
  },
  [TableStatus.OCCUPIED]: {
    label: "Ocupada",
    badge: "bg-rose-100 text-rose-700 border-rose-200",
    bg: "bg-rose-50",
    dot: "bg-rose-500",
  },
  [TableStatus.NEEDS_CLEANING]: {
    label: "Limpieza",
    badge: "bg-amber-100 text-amber-700 border-amber-200",
    bg: "bg-amber-50",
    dot: "bg-amber-500",
  },
};

/**
 * TablePreview Component
 *
 * Real-time preview of table data.
 * Updates instantly as form values change.
 */
export function TablePreview({
  tableData,
  className,
  compact = false,
}: TablePreviewProps) {
  // Get status config with fallback
  const currentStatus = tableData.status || TableStatus.AVAILABLE;
  const statusConfig =
    STATUS_CONFIG[currentStatus] || STATUS_CONFIG[TableStatus.AVAILABLE];
  const hasNumber = Boolean(tableData.number?.trim());

  return (
    <div className={cn("space-y-3", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-carbon-400" />
          <span className="text-sm font-medium text-carbon-600">
            Vista Previa
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "w-2 h-2 rounded-full animate-pulse",
              statusConfig.dot
            )}
          />
          <span className="text-xs text-carbon-400">En vivo</span>
        </div>
      </div>

      {/* Preview Card */}
      <div
        className={cn(
          "rounded-xl border overflow-hidden",
          "bg-white shadow-sm",
          "transition-all duration-200"
        )}
      >
        {/* Table Visual */}
        <div
          className={cn(
            "flex flex-col items-center justify-center",
            "transition-all duration-200",
            statusConfig.bg,
            compact ? "py-8 px-4" : "py-12 px-6"
          )}
        >
          {/* Table Number */}
          <div
            className={cn(
              "font-bold tracking-tight transition-all duration-200",
              compact ? "text-4xl" : "text-5xl",
              hasNumber ? "text-carbon-800" : "text-carbon-300"
            )}
          >
            {hasNumber ? tableData.number : "—"}
          </div>

          {/* Location */}
          {tableData.location && (
            <div className="flex items-center gap-1 mt-2 text-carbon-500">
              <MapPin className="w-3.5 h-3.5" />
              <span className="text-sm">{tableData.location}</span>
            </div>
          )}
        </div>

        {/* Status Bar */}
        <div className="px-4 py-3 bg-white border-t border-sage-100">
          <div className="flex items-center justify-between">
            <span className="text-xs text-carbon-500">Estado</span>
            <span
              className={cn(
                "px-2.5 py-1 rounded-full text-xs font-medium border",
                "transition-all duration-200",
                statusConfig.badge
              )}
            >
              {statusConfig.label}
            </span>
          </div>
        </div>
      </div>

      {/* Status Message */}
      <div className="text-center">
        {!hasNumber ? (
          <p className="text-xs text-carbon-400">
            Ingresa un número de mesa
          </p>
        ) : (
          <p className="text-xs text-emerald-600 font-medium">
            ✓ Listo para crear
          </p>
        )}
      </div>
    </div>
  );
}
