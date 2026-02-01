import { MapPin } from "lucide-react";
import { TableStatus } from "@/types";
import { cn } from "@/utils/cn";

interface TablePreviewProps {
  tableData: {
    number: string;
    location?: string;
    status?: TableStatus;
  };
  className?: string;
}

// Status configurations
const STATUS_CONFIG = {
  [TableStatus.AVAILABLE]: {
    label: "Disponible",
    color: "bg-sage-green-100 text-sage-green-700 border-sage-green-300",
    tableColor: "bg-sage-green-50 border-sage-green-200",
    dot: "bg-sage-green-500",
  },
  [TableStatus.OCCUPIED]: {
    label: "Ocupada",
    color: "bg-red-50 text-red-700 border-red-200",
    tableColor: "bg-red-50 border-red-200",
    dot: "bg-red-500",
  },
  [TableStatus.NEEDS_CLEANING]: {
    label: "Limpieza",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    tableColor: "bg-amber-50 border-amber-200",
    dot: "bg-amber-500",
  },
};

/**
 * TablePreview Component
 *
 * Real-time preview of table creation.
 */
export function TablePreview({ tableData, className }: TablePreviewProps) {
  // Get status config with fallback to AVAILABLE
  const currentStatus = tableData.status || TableStatus.AVAILABLE;
  const status = STATUS_CONFIG[currentStatus] || STATUS_CONFIG[TableStatus.AVAILABLE];
  const hasNumber = tableData.number?.trim() !== "";

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header - Minimal */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-carbon-500">Vista Previa</span>
        <div className="flex items-center gap-2">
          <span className={cn("w-2 h-2 rounded-full animate-pulse", status.dot)} />
          <span className="text-xs text-carbon-400">En tiempo real</span>
        </div>
      </div>

      {/* Preview Card - Sage Japanese style */}
      <div
        className={cn(
          "rounded-2xl border-2 overflow-hidden",
          "bg-white shadow-sm",
          "transition-all duration-300"
        )}
      >
        {/* Table Visual */}
        <div
          className={cn(
            "aspect-[4/3] flex flex-col items-center justify-center",
            "p-8 transition-all duration-300",
            status.tableColor
          )}
        >
          {/* Table Number - Large, centered */}
          <div
            className={cn(
              "text-6xl lg:text-7xl font-bold tracking-tight",
              "transition-all duration-300",
              hasNumber ? "text-carbon-800" : "text-carbon-300"
            )}
          >
            {hasNumber ? tableData.number : "—"}
          </div>

          {/* Location - Subtle */}
          {tableData.location && (
            <div className="flex items-center gap-1.5 mt-4 text-carbon-500">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-light">{tableData.location}</span>
            </div>
          )}
        </div>

        {/* Status Bar - Bottom */}
        <div className="px-6 py-4 bg-sage-50/50 border-t border-sage-200/50">
          <div className="flex items-center justify-between">
            <span className="text-sm text-carbon-600">Estado</span>
            <span
              className={cn(
                "px-3 py-1 rounded-full text-sm font-medium border",
                "transition-all duration-300",
                status.color
              )}
            >
              {status.label}
            </span>
          </div>
        </div>
      </div>

      {/* Empty State Message */}
      {!hasNumber && (
        <p className="text-center text-sm text-carbon-400 font-light">
          Ingresa un número para ver la vista previa
        </p>
      )}

      {/* Ready Message */}
      {hasNumber && (
        <div className="text-center">
          <p className="text-sm text-sage-green-600 font-medium">
            ✓ Listo para crear
          </p>
        </div>
      )}
    </div>
  );
}
