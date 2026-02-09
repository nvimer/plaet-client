import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Badge } from '@/components';
import { TableStatus } from '@/types';
import type { TableFilters } from '@/types';

interface UltraCompactFilterProps {
  filters: TableFilters;
  onFilterChange: (key: keyof TableFilters, value: string | TableStatus | 'ALL') => void;
  counts: {
    all: number;
    available: number;
    occupied: number;
    cleaning: number;
  };
  onShowAdvanced?: () => void;
  className?: string;
}

/**
 * UltraCompactFilter component for mobile-first minimal space usage
 * Single search bar with filter toggle and active filter chips
 */
export const UltraCompactFilter = ({
  filters,
  onFilterChange,
  counts,
  onShowAdvanced,
  className = '',
}: UltraCompactFilterProps) => {
  const [showQuickFilters, setShowQuickFilters] = useState(false);

  const quickStatusFilters = [
    { 
      label: 'Disp.', 
      value: TableStatus.AVAILABLE, 
      count: counts.available,
      color: 'bg-sage-green-100 text-sage-green-700 border-sage-green-300'
    },
    { 
      label: 'Ocup.', 
      value: TableStatus.OCCUPIED, 
      count: counts.occupied,
      color: 'bg-red-100 text-red-700 border-red-300'
    },
  ];

  const hasActiveFilters = filters.search.trim() !== '' || filters.status !== 'ALL' || filters.location !== '';

  const clearAllFilters = () => {
    onFilterChange('search', '');
    onFilterChange('status', 'ALL');
    onFilterChange('location', '');
  };

  return (
    <div className={`bg-white rounded-lg border border-sage-border-subtle shadow-sm ${className}`}>
      <div className="p-3">
        {/* Main Search and Filter Bar */}
        <div className="flex items-center gap-2">
          {/* Compact Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-carbon-400" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => onFilterChange('search', e.target.value)}
              placeholder="Buscar mesas..."
              className="w-full pl-9 pr-8 py-2 text-sm bg-carbon-50 border border-carbon-200 rounded-lg focus:border-sage-green-400 focus:ring-1 focus:ring-sage-green-200 focus:bg-white transition-all duration-200"
            />
            {filters.search && (
              <button
                onClick={() => onFilterChange('search', '')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-carbon-400 hover:text-carbon-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowQuickFilters(!showQuickFilters)}
            className={`
              px-3 py-2 text-sm font-medium rounded-lg border transition-all duration-150 flex items-center gap-1.5
              ${hasActiveFilters 
                ? 'bg-sage-green-50 text-sage-green-700 border-sage-green-300' 
                : 'bg-white text-carbon-600 border-sage-border-subtle hover:bg-carbon-50'
              }
            `}
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filtros</span>
            {hasActiveFilters && (
              <span className="bg-sage-green-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-semibold">
                {[filters.search, filters.status !== 'ALL' ? 'status' : '', filters.location].filter(Boolean).length}
              </span>
            )}
          </button>

          {/* Advanced Filters Button */}
          {onShowAdvanced && (
            <button
              onClick={onShowAdvanced}
              className="px-3 py-2 text-sm text-carbon-600 bg-white border border-sage-border-subtle rounded-lg hover:bg-carbon-50 transition-all duration-150 lg:hidden"
            >
              Avanzado
            </button>
          )}
        </div>

        {/* Quick Status Filters - Expandable */}
        {showQuickFilters && (
          <div className="mt-3 pt-3 border-t border-sage-border-subtle animate-in fade-in duration-200">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-carbon-600 mr-1">Estado:</span>
              <button
                onClick={() => onFilterChange('status', 'ALL')}
                className={`
                  px-2 py-1 text-xs rounded-md border transition-all duration-150
                  ${filters.status === 'ALL'
                    ? 'bg-carbon-100 text-carbon-700 border-carbon-300'
                    : 'bg-white text-carbon-600 hover:bg-carbon-50 border-sage-border-subtle'
                  }
                `}
              >
                Todas
                <Badge variant="neutral" className="ml-1 scale-75 text-xs">
                  {counts.all}
                </Badge>
              </button>
              
              {quickStatusFilters.map((status) => (
                <button
                  key={status.value}
                  onClick={() => onFilterChange('status', status.value)}
                  className={`
                    px-2 py-1 text-xs rounded-md border transition-all duration-150 flex items-center gap-1
                    ${filters.status === status.value
                      ? status.color
                      : 'bg-white text-carbon-600 hover:bg-carbon-50 border-sage-border-subtle'
                    }
                  `}
                >
                  <span>{status.label}</span>
                  <Badge variant="neutral" className="scale-75 text-xs">
                    {status.count}
                  </Badge>
                </button>
              ))}

              {/* Clear Filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="ml-auto text-xs text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded-md transition-all duration-150"
                >
                  Limpiar todo
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};