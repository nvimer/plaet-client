import { TouchableCard } from "@/components";
import { TableStatusBadge } from "./TableStatusBadge";
import type { Table } from "@/types";

/**
 * TableSelector Props
 */
export interface TableSelectorProps {
  tables: Table[];
  onSelect: (table: Table) => void;
  selectedTableId?: number;
  showOnlyAvailable?: boolean;
}

/**
 * TableSelector Component
 * 
 * Optimized table selection grid for order creation.
 * Responsive design with proportional button sizes.
 * 
 * Features:
 * - Responsive grid (3-4-6 columns based on screen size)
 * - Proportional button sizes (not oversized)
 * - Clear visual hierarchy
 * - Touch-friendly but not overwhelming
 * - Status indicators
 * 
 * @example
 * ```tsx
 * <TableSelector
 *   tables={availableTables}
 *   onSelect={handleTableSelect}
 *   selectedTableId={selectedTable?.id}
 * />
 * ```
 */
export function TableSelector({
  tables,
  onSelect,
  selectedTableId,
  showOnlyAvailable = false,
}: TableSelectorProps) {
  const filteredTables = showOnlyAvailable
    ? tables.filter((table) => table.status === "AVAILABLE")
    : tables;

  if (filteredTables.length === 0) {
    return (
      <div className="p-6 bg-amber-50 border-2 border-amber-200 rounded-2xl text-center">
        <p className="text-sm text-amber-800 font-medium">
          No hay mesas disponibles
        </p>
        <p className="text-xs text-amber-600 mt-1">
          Todas las mesas están ocupadas o en limpieza
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-3">
      {filteredTables.map((table) => {
        const isSelected = selectedTableId === table.id;
        const isAvailable = table.status === "AVAILABLE";

        return (
          <TouchableCard
            key={table.id}
            onPress={() => onSelect(table)}
            size="small"
            hapticFeedback
            selected={isSelected}
            disabled={!isAvailable && !isSelected}
            className={`
              ${isSelected 
                ? "bg-sage-50 border-2 border-sage-400" 
                : "bg-white border-2 border-sage-200 hover:border-sage-300"
              }
              ${!isAvailable && !isSelected ? "opacity-60" : ""}
            `}
          >
            <div className="flex flex-col items-center justify-center py-2">
              {/* Table Number - Proportional size */}
              <span className={`
                text-2xl sm:text-3xl font-bold mb-1
                ${isSelected ? "text-sage-700" : "text-carbon-800"}
              `}>
                {table.number}
              </span>

              {/* Compact Status Badge */}
              <div className="scale-90 origin-center">
                <TableStatusBadge status={table.status} />
              </div>

              {/* Location - Compact */}
              {table.location && (
                <span className="text-xs text-carbon-500 mt-1 truncate max-w-full px-1">
                  {table.location}
                </span>
              )}

              {/* Selected indicator - Subtle */}
              {isSelected && (
                <span className="text-xs text-sage-600 font-medium mt-1">
                  ✓ Seleccionada
                </span>
              )}
            </div>
          </TouchableCard>
        );
      })}
    </div>
  );
}
