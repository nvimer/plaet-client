import { SearchInput } from "@/components/ui/SearchInput";
import { RadioGroup } from "@/components/ui/RadioGroup";
import { FilterSection } from "./FilterSection";
import { TableStatus } from "@/types";
import type { TableFilters } from "@/types";

interface FilterPanelProps {
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
 * Main FilterPanel component containing all filter controls
 * Organized in sections with search, status, and location filters
 */
export const FilterPanel = ({
  filters,
  onFilterChange,
  counts,
  availableLocations,
  className = "",
}: FilterPanelProps) => {
  const statusOptions = [
    {
      label: "Todas las Mesas",
      value: "ALL",
      count: counts.all,
    },
    {
      label: "Disponibles",
      value: TableStatus.AVAILABLE,
      count: counts.available,
    },
    {
      label: "Ocupadas",
      value: TableStatus.OCCUPIED,
      count: counts.occupied,
    },
    {
      label: "Necesitan Limpieza",
      value: TableStatus.NEEDS_CLEANING,
      count: counts.cleaning,
    },
  ];

  const locationOptions = [
    { label: "Todas las Ubicaciones", value: "" },
    ...availableLocations.map((location) => ({
      label: location,
      value: location,
    })),
  ];

  return (
    <div
      className={`bg-white rounded-xl border border-sage-border-subtle shadow-sm ${className}`}
    >
      <div className="px-6 py-2 space-y-1">
        {/* Search Section */}
        <FilterSection
          title="Búsqueda"
          description="Buscar mesas por número o ubicación"
        >
          <SearchInput
            placeholder="Buscar por número de mesa o ubicación..."
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            onClear={() => onFilterChange("search", "")}
            fullWidth
          />
        </FilterSection>

        {/* Status Filter Section */}
        <FilterSection
          title="Estado de la Mesa"
          description="Filtrar por estado actual de la mesa"
          collapsible
        >
          <RadioGroup
            options={statusOptions}
            value={filters.status}
            onChange={(value) => onFilterChange("status", value)}
            orientation="horizontal"
            size="sm"
          />
        </FilterSection>

        {/* Location Filter Section */}
        {availableLocations.length > 0 && (
          <FilterSection
            title="Ubicación"
            description="Filtrar por ubicación del restaurante"
            collapsible
          >
            <RadioGroup
              options={locationOptions}
              value={filters.location}
              onChange={(value) => onFilterChange("location", value)}
              orientation="horizontal"
              size="sm"
            />
          </FilterSection>
        )}
      </div>
    </div>
  );
};
