import { SearchInput } from '@/components/ui/SearchInput';
import { Filter } from 'lucide-react';
import { Badge } from '@/components';
import { TableStatus } from '@/types';
import type { TableFilters } from '@/types';

interface CompactFilterPanelProps {
  filters: TableFilters;
  onFilterChange: (key: keyof TableFilters, value: string | TableStatus | 'ALL') => void;
  counts: {
    all: number;
    available: number;
    occupied: number;
    cleaning: number;
  };
  availableLocations: string[];
  className?: string;
}

/**
 * Compact FilterPanel component with optimized space usage
 * Horizontal layout with minimal visual footprint
 */
export const CompactFilterPanel = ({
  filters,
  onFilterChange,
  counts,
  availableLocations,
  className = '',
}: CompactFilterPanelProps) => {
  
  const statusButtons = [
    { 
      label: 'Todas', 
      value: 'ALL', 
      count: counts.all,
      color: 'bg-carbon-100 text-carbon-700 hover:bg-carbon-200 border-carbon-200'
    },
    { 
      label: 'Disponibles', 
      value: TableStatus.AVAILABLE, 
      count: counts.available,
      color: 'bg-sage-green-50 text-sage-green-700 hover:bg-sage-green-100 border-sage-green-200'
    },
    { 
      label: 'Ocupadas', 
      value: TableStatus.OCCUPIED, 
      count: counts.occupied,
      color: 'bg-red-50 text-red-700 hover:bg-red-100 border-red-200'
    },
    { 
      label: 'Limpieza', 
      value: TableStatus.NEEDS_CLEANING, 
      count: counts.cleaning,
      color: 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border-yellow-200'
    },
  ];

  const handleStatusClick = (value: string) => {
    onFilterChange('status', value);
  };

  const clearFilter = (key: keyof TableFilters) => {
    if (key === 'search') onFilterChange('search', '');
    else if (key === 'status') onFilterChange('status', 'ALL');
    else if (key === 'location') onFilterChange('location', '');
  };

  const hasActiveFilters = filters.search.trim() !== '' || filters.status !== 'ALL' || filters.location !== '';

  return (
    <div className={`bg-white rounded-lg border border-sage-border-subtle shadow-sm ${className}`}>
      <div className="p-4">
        {/* Main compact filter bar */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          
          {/* Search Input - Compact */}
          <div className="flex-1 min-w-0 lg:max-w-md">
            <SearchInput
              placeholder="Buscar mesas..."
              value={filters.search}
              onChange={(e) => onFilterChange('search', e.target.value)}
              onClear={() => onFilterChange('search', '')}
              fullWidth
              className="py-2 text-sm"
            />
          </div>

          {/* Status Filter Buttons - Compact */}
          <div className="flex flex-wrap gap-1.5">
            {statusButtons.map((status) => {
              const isActive = filters.status === status.value;
              return (
                <button
                  key={status.value}
                  onClick={() => handleStatusClick(status.value)}
                  className={`
                    inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all duration-150
                    ${isActive 
                      ? status.color + ' ring-2 ring-offset-1 ring-sage-green-500' 
                      : 'bg-white text-carbon-600 hover:bg-carbon-50 border-sage-border-subtle'
                    }
                  `}
                >
                  <span>{status.label}</span>
                  <Badge 
                    variant={isActive ? 'neutral' : 'info'}
                    className="scale-75 origin-center text-xs"
                  >
                    {status.count}
                  </Badge>
                </button>
              );
            })}
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={() => {
                clearFilter('search');
                clearFilter('status');
                clearFilter('location');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-carbon-600 hover:text-red-600 hover:bg-red-50 rounded-lg border border-sage-border-subtle transition-all duration-150"
            >
              <Filter className="w-3 h-3" />
              <span>Limpiar</span>
            </button>
          )}
        </div>

        {/* Location Filter - Only if available and collapsed */}
        {availableLocations.length > 0 && (
          <div className="mt-3 pt-3 border-t border-sage-border-subtle">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-carbon-600">Ubicación:</span>
              <div className="flex flex-wrap gap-1">
                <button
                  onClick={() => onFilterChange('location', '')}
                  className={`
                    px-2 py-1 text-xs rounded border transition-all duration-150
                    ${filters.location === ''
                      ? 'bg-carbon-100 text-carbon-700 border-carbon-300'
                      : 'bg-white text-carbon-600 hover:bg-carbon-50 border-sage-border-subtle'
                    }
                  `}
                >
                  Todas
                </button>
                {availableLocations.map((location) => (
                  <button
                    key={location}
                    onClick={() => onFilterChange('location', location)}
                    className={`
                      px-2 py-1 text-xs rounded border transition-all duration-150
                      ${filters.location === location
                        ? 'bg-carbon-100 text-carbon-700 border-carbon-300'
                        : 'bg-white text-carbon-600 hover:bg-carbon-50 border-sage-border-subtle'
                      }
                    `}
                  >
                    {location}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};