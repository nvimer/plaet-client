import { X, Filter } from 'lucide-react';
import type { ActiveFilterChip } from '@/types';

interface FilterChipsProps {
  filters: ActiveFilterChip[];
  resultCount: number;
  onClearFilter: (key: string) => void;
  onClearAll: () => void;
  className?: string;
}

/**
 * FilterChips component for displaying active filters with remove functionality
 * Material Design inspired chip layout with clear all option
 */
export const FilterChips = ({
  filters,
  resultCount,
  onClearFilter,
  onClearAll,
  className = '',
}: FilterChipsProps) => {
  if (filters.length === 0) {
    return null;
  }

  return (
    <div className={`bg-sage-green-50 border border-sage-green-200 rounded-xl p-4 ${className}`}>
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* Filter chips */}
        <div className="flex items-center flex-wrap gap-2 flex-1">
          <div className="flex items-center gap-2 text-sm text-sage-green-700 font-medium mr-2">
            <Filter className="w-4 h-4" />
            <span>Filtros Activos:</span>
          </div>
          
          {filters.map((filter) => (
            <div
              key={filter.key}
              className="inline-flex items-center gap-1.5 bg-white border border-sage-green-300 rounded-full px-3 py-1 text-sm text-carbon-700 group hover:border-sage-green-400 transition-colors duration-150"
            >
              <span className="font-medium">{filter.label}:</span>
              <span className="text-sage-green-600 font-semibold">
                {filter.value}
              </span>
              <button
                type="button"
                onClick={() => onClearFilter(filter.key)}
                className="ml-1 text-carbon-400 hover:text-red-500 transition-colors duration-150 p-0.5 rounded-full hover:bg-red-50"
                aria-label={`Eliminar filtro ${filter.label}`}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        {/* Clear all button and result count */}
        <div className="flex items-center gap-3">
          {/* Result count */}
          <div className="text-sm text-sage-green-700">
            <span className="font-semibold">{resultCount}</span>
            <span className="ml-1">
              {resultCount === 1 ? 'resultado' : 'resultados'}
            </span>
          </div>

          {/* Clear all button */}
          <button
            type="button"
            onClick={onClearAll}
            className="text-sm text-sage-green-600 hover:text-sage-green-800 font-medium hover:underline transition-colors duration-150"
          >
            Limpiar todos
          </button>
        </div>
      </div>
    </div>
  );
};