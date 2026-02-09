import { useState, useEffect } from 'react';
import { FilterPanel, CompactFilterPanel, UltraCompactFilter } from './index';
import type { TableFilters } from '@/types';
import type { TableStatus } from '@/types';

interface AdaptiveFilterPanelProps {
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
 * AdaptiveFilterPanel that automatically selects the best filter layout
 * based on screen size and user preferences
 * 
 * Breakpoints:
 * - Mobile (< 768px): UltraCompact (single bar)
 * - Tablet (768px - 1024px): Compact (horizontal layout)
 * - Desktop (> 1024px): Full (vertical sections with descriptions)
 */
export const AdaptiveFilterPanel = ({
  filters,
  onFilterChange,
  counts,
  availableLocations,
  className = '',
}: AdaptiveFilterPanelProps) => {
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    const updateScreenSize = () => {
      if (window.innerWidth < 768) {
        setScreenSize('mobile');
      } else if (window.innerWidth < 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  const [showAdvanced, setShowAdvanced] = useState(false);

  // Choose the appropriate filter panel based on screen size
  const renderFilterPanel = () => {
    switch (screenSize) {
      case 'mobile':
        return (
          <UltraCompactFilter
            filters={filters}
            onFilterChange={onFilterChange}
            counts={counts}
            onShowAdvanced={() => setShowAdvanced(true)}
          />
        );
      
      case 'tablet':
        return (
          <CompactFilterPanel
            filters={filters}
            onFilterChange={onFilterChange}
            counts={counts}
            availableLocations={availableLocations}
          />
        );
      
      case 'desktop':
      default:
        return (
          <FilterPanel
            filters={filters}
            onFilterChange={onFilterChange}
            counts={counts}
            availableLocations={availableLocations}
          />
        );
    }
  };

  // Advanced filter modal for mobile (overlay)
  const renderAdvancedModal = () => {
    if (!showAdvanced || screenSize !== 'mobile') return null;

    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-start justify-center pt-4 px-4">
        <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-sage-border-subtle p-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-carbon-900">Filtros Avanzados</h3>
            <button
              onClick={() => setShowAdvanced(false)}
              className="text-carbon-400 hover:text-carbon-600 p-1"
            >
              ×
            </button>
          </div>
          
          <div className="p-4">
            <FilterPanel
              filters={filters}
              onFilterChange={onFilterChange}
              counts={counts}
              availableLocations={availableLocations}
            />
          </div>
          
          <div className="sticky bottom-0 bg-white border-t border-sage-border-subtle p-4">
            <button
              onClick={() => setShowAdvanced(false)}
              className="w-full py-2 bg-sage-green-500 text-white rounded-lg hover:bg-sage-green-600 transition-colors duration-200"
            >
              Aplicar Filtros
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={className}>
      {renderFilterPanel()}
      {renderAdvancedModal()}
    </div>
  );
};