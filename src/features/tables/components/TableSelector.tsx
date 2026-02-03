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
 * Responsive design with FEWER columns on large screens for bigger cards.
 * 
 * Features:
 * - Responsive grid with FEWER columns on large screens (cards get bigger)
 * - Mobile: 3 columns (compact)
 * - Tablet: 3 columns (medium)
 * - Desktop: 3 columns (large cards)
 * - Large Desktop: 4 columns (extra large cards)
 * - Clear visual hierarchy
 * - Touch-friendly
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
    <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
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
                ? "bg-sage-50 border-2 border-sage-400 lg:border-[3px]" 
                : "bg-white border-2 border-sage-200 hover:border-sage-300"
              }
              ${!isAvailable && !isSelected ? "opacity-60" : ""}
            `}
          >
            <div className="flex flex-col items-center justify-center py-2 sm:py-3 lg:py-4">
              {/* Table Number - Gets much bigger on large screens */}
              <span className={`
                text-2xl sm:text-3xl lg:text-5xl xl:text-6xl font-bold mb-1 sm:mb-2 lg:mb-3
                ${isSelected ? "text-sage-700" : "text-carbon-800"}
              `}>
                {table.number}
              </span>

              {/* Status Badge - Full size on all screens */}
              <div className="scale-90 sm:scale-90 lg:scale-100 origin-center">
                <TableStatusBadge status={table.status} />
              </div>

              {/* Location - Always visible on sm+, bigger on large screens */}
              {table.location && (
                <span className="text-xs sm:text-sm lg:text-base text-carbon-500 mt-1 sm:mt-2 lg:mt-3 truncate max-w-full px-1">
                  {table.location}
                </span>
              )}

              {/* Selected indicator */}
              {isSelected && (
                <span className="text-xs sm:text-sm lg:text-base text-sage-600 font-medium mt-1 sm:mt-2 lg:mt-3">
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
