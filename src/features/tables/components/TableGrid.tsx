import { TouchableCard } from "@/components";
import { TableStatusBadge } from "./TableStatusBadge";
import type { Table } from "@/types";

/**
 * TableGrid Props
 */
export interface TableGridProps {
  tables: Table[];
  onSelect: (table: Table) => void;
  selectedTableId?: number;
  showOnlyAvailable?: boolean;
}

/**
 * TableGrid Component
 * 
 * Visual grid of tables optimized for touch selection.
 * Large, táctil cards for easy table selection.
 * 
 * Features:
 * - Large touch targets
 * - Clear table numbers
 * - Status indicators
 * - Visual selection state
 * 
 * @example
 * ```tsx
 * <TableGrid
 *   tables={availableTables}
 *   onSelect={handleTableSelect}
 *   selectedTableId={selectedTable?.id}
 * />
 * ```
 */
export function TableGrid({
  tables,
  onSelect,
  selectedTableId,
  showOnlyAvailable = false,
}: TableGridProps) {
  const filteredTables = showOnlyAvailable
    ? tables.filter((table) => table.status === "AVAILABLE")
    : tables;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {filteredTables.map((table) => {
        const isSelected = selectedTableId === table.id;

        return (
          <TouchableCard
            key={table.id}
            onPress={() => onSelect(table)}
            size="large"
            hapticFeedback
            selected={isSelected}
            disabled={table.status !== "AVAILABLE" && !isSelected}
          >
            <div className="flex flex-col items-center justify-center h-full">
              {/* Table Number - Large and prominent */}
              <span className="text-5xl font-bold text-carbon-900 mb-3">
                {table.number}
              </span>

              {/* Status Badge */}
              <TableStatusBadge status={table.status} />

              {/* Location if available */}
              {table.location && (
                <span className="text-xs text-carbon-500 mt-2 text-center">
                  {table.location}
                </span>
              )}

              {/* Selected indicator */}
              {isSelected && (
                <span className="text-xs text-sage-green-600 font-semibold mt-2">
                  Seleccionada
                </span>
              )}
            </div>
          </TouchableCard>
        );
      })}
    </div>
  );
}
