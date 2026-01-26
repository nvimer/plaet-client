import { useState, useEffect, useMemo } from 'react';
import type { TableFilters, Table } from '@/types';
import { TableStatus } from '@/types';

const DEFAULT_FILTERS: TableFilters = {
  search: '',
  status: 'ALL',
  location: '',
};

/**
 * Custom hook for managing table filters with persistence and optimizations
 */
export const useTableFilters = (tables?: Table[]) => {
  // Load persisted filters or use defaults
  const [filters, setFilters] = useState<TableFilters>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('table-filters');
      return saved ? { ...DEFAULT_FILTERS, ...JSON.parse(saved) } : DEFAULT_FILTERS;
    }
    return DEFAULT_FILTERS;
  });

  // Persist filters to localStorage
  useEffect(() => {
    localStorage.setItem('table-filters', JSON.stringify(filters));
  }, [filters]);

  // Filter tables based on current filters
  const filteredTables = useMemo(() => {
    if (!tables) return [];

    return tables.filter((table) => {
      // Search filter (case-insensitive, searches number and location)
      if (filters.search.trim()) {
        const searchLower = filters.search.toLowerCase().trim();
        const matchesSearch = 
          table.number.toLowerCase().includes(searchLower) ||
          (table.location?.toLowerCase().includes(searchLower) || false);
        if (!matchesSearch) return false;
      }
      
      // Status filter
      if (filters.status !== 'ALL' && table.status !== filters.status) {
        return false;
      }
      
      // Location filter
      if (filters.location && table.location !== filters.location) {
        return false;
      }
      
      return true;
    });
  }, [tables, filters]);

  // Get unique locations from tables
  const availableLocations = useMemo(() => {
    if (!tables) return [];
    const locations = [...new Set(tables.map(table => table.location).filter(Boolean))];
    return locations.sort();
  }, [tables]);

  // Calculate counts for each status
  const counts = useMemo(() => {
    if (!tables) return { all: 0, available: 0, occupied: 0, cleaning: 0 };
    
    return {
      all: tables.length,
      available: tables.filter(t => t.status === TableStatus.AVAILABLE).length,
      occupied: tables.filter(t => t.status === TableStatus.OCCUPIED).length,
      cleaning: tables.filter(t => t.status === TableStatus.NEEDS_CLEANING).length,
    };
  }, [tables]);

  // Update a single filter
  const updateFilter = (key: keyof TableFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  // Check if any filters are active (excluding default values)
  const hasActiveFilters = useMemo(() => {
    return (
      filters.search.trim() !== '' ||
      filters.status !== 'ALL' ||
      (filters.location && filters.location !== '')
    );
  }, [filters]);

  // Get active filter chips for display
  const activeFilterChips = useMemo(() => {
    const chips = [];

    if (filters.search.trim()) {
      chips.push({
        key: 'search' as keyof TableFilters,
        label: 'Search',
        value: filters.search,
        onRemove: () => updateFilter('search', ''),
      });
    }

    if (filters.status !== 'ALL') {
      chips.push({
        key: 'status' as keyof TableFilters,
        label: 'Status',
        value: filters.status,
        onRemove: () => updateFilter('status', 'ALL'),
      });
    }

    if (filters.location) {
      chips.push({
        key: 'location' as keyof TableFilters,
        label: 'Location',
        value: filters.location,
        onRemove: () => updateFilter('location', ''),
      });
    }

    return chips;
  }, [filters]);

  return {
    filters,
    filteredTables,
    counts,
    availableLocations,
    hasActiveFilters,
    activeFilterChips,
    updateFilter,
    clearFilters,
  };
};