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
 * - Responsive grid (3-4-5-6 columns based on screen size)
 * - Proportional button sizes (not oversized)
 * - Clear visual hierarchy
 * - Touch-friendly but not overwhelming
 * - Status indicators
 * 
 * Grid breakpoints:
 * - Mobile (<640px): 3 columns
 * - Tablet (640px+): 4 columns  
 * - Desktop (1024px+): 5 columns
 * - Large Desktop (1280px+): 6 columns
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
    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 lg:gap-4">
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
              lg:p-5 xl:p-6
              ${isSelected 
                ? "bg-sage-50 border-2 border-sage-400 lg:border-[3px]" 
                : "bg-white border-2 border-sage-200 hover:border-sage-300"
              }
              ${!isAvailable && !isSelected ? "opacity-60" : ""}
            `}
          >
            <div className="flex flex-col items-center justify-center py-1 sm:py-2 lg:py-3">
              {/* Table Number - Larger on big screens */}
              <span className={`
                text-xl sm:text-2xl lg:text-4xl xl:text-5xl font-bold mb-0.5 sm:mb-1 lg:mb-2
                ${isSelected ? "text-sage-700" : "text-carbon-800"}
              `}>
                {table.number}
              </span>

              {/* Status Badge - Normal size on large screens */}
              <div className="scale-75 sm:scale-75 lg:scale-90 xl:scale-100 origin-center">
                <TableStatusBadge status={table.status} />
              </div>

              {/* Location - Visible on all screens on large displays */}
              {table.location && (
                <span className="hidden sm:block lg:block text-xs lg:text-sm text-carbon-500 mt-1 lg:mt-2 truncate max-w-full px-1">
                  {table.location}
                </span>
              )}

              {/* Selected indicator - More prominent on large screens */}
              {isSelected && (
                <span className="text-xs lg:text-sm text-sage-600 font-medium mt-1 lg:mt-2">
                  <span className="hidden lg:inline">✓ Seleccionada</span>
                  <span className="lg:hidden">✓</span>
                </span>
              )}
            </div>
          </TouchableCard>
        );
      })}
    </div>
  );
}
