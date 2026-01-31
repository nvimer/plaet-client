import { useState } from 'react';
import { Button } from '@/components';
import { Layout, LayoutGrid } from 'lucide-react';
import { CompactFilterPanel } from './CompactFilterPanel';
import { FilterPanel } from './FilterPanel';
import type { TableFilters } from '@/types';

interface FilterContainerProps {
  filters: TableFilters;
  onFilterChange: (key: keyof TableFilters, value: any) => void;
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
 * FilterContainer that allows toggling between normal and compact filter layouts
 * Provides users with choice between detailed and space-efficient views
 */
export const FilterContainer = ({
  filters,
  onFilterChange,
  counts,
  availableLocations,
  className = '',
}: FilterContainerProps) => {
  const [isCompact, setIsCompact] = useState(false);

  return (
    <div className={className}>
      {/* Toggle Button */}
      <div className="flex justify-end mb-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCompact(!isCompact)}
          className="text-carbon-600 hover:text-carbon-900 text-xs"
        >
          {isCompact ? (
            <>
              <Layout className="w-4 h-4 mr-1.5" />
              Vista Normal
            </>
          ) : (
            <>
              <LayoutGrid className="w-4 h-4 mr-1.5" />
              Vista Compacta
            </>
          )}
        </Button>
      </div>

      {/* Filter Panel */}
      {isCompact ? (
        <CompactFilterPanel
          filters={filters}
          onFilterChange={onFilterChange}
          counts={counts}
          availableLocations={availableLocations}
        />
      ) : (
        <FilterPanel
          filters={filters}
          onFilterChange={onFilterChange}
          counts={counts}
          availableLocations={availableLocations}
        />
      )}
    </div>
  );
};