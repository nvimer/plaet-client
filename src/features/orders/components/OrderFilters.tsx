import { useState } from "react";
import { OrderStatus, OrderType } from "@/types";
import {
  FilterBar,
  FilterPills,
  FilterSearch,
  FilterSelect,
  ActiveFilterChips,
  DateFilter,
  FilterDrawer,
} from "@/components";
import type { DateFilterType, DateRange } from "@/components";
import { SlidersHorizontal, Search } from "lucide-react";
import { Button } from "@/components";

interface OrderFiltersProps {
  statusFilter: OrderStatus | "ALL";
  typeFilter: OrderType | "ALL";
  dateFilter: DateFilterType;
  customDateRange?: DateRange;
  onStatusChange: (status: OrderStatus | "ALL") => void;
  onTypeChange: (type: OrderType | "ALL") => void;
  onDateChange: (date: DateFilterType) => void;
  onCustomDateRangeChange?: (range: DateRange) => void;
  onClearFilter: (key: string) => void;
  onClearAll: () => void;
  counts: {
    all: number;
    pending: number;
    inKitchen: number;
    ready: number;
    delivered: number;
    paid: number;
    sentToCashier: number;
    cancelled: number;
  };
  resultCount?: number;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const STATUS_LABELS: Record<string, string> = {
  ALL: "Todos",
  [OrderStatus.PENDING]: "Pendientes",
  [OrderStatus.IN_KITCHEN]: "En Cocina",
  [OrderStatus.READY]: "Listos",
  [OrderStatus.DELIVERED]: "Entregados",
  [OrderStatus.PAID]: "Pagados",
  [OrderStatus.SENT_TO_CASHIER]: "En Caja",
  [OrderStatus.CANCELLED]: "Cancelados",
};

const TYPE_LABELS: Record<string, string> = {
  ALL: "Todos",
  [OrderType.DINE_IN]: "Mesa",
  [OrderType.TAKE_OUT]: "Llevar",
  [OrderType.DELIVERY]: "Domicilio",
  [OrderType.WHATSAPP]: "WhatsApp",
};

/**
 * Premium Order Filters
 * Combined quick pills + advanced drawer system.
 */
export function OrderFilters({
  statusFilter,
  typeFilter,
  dateFilter,
  customDateRange,
  onStatusChange,
  onTypeChange,
  onDateChange,
  onCustomDateRangeChange,
  onClearFilter,
  onClearAll,
  counts,
  resultCount = 0,
  searchTerm,
  onSearchChange,
}: OrderFiltersProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const statusPillOptions = [
    { value: "ALL", label: "Todos", count: counts.all },
    { value: OrderStatus.PENDING, label: "Pendientes", count: counts.pending },
    { value: OrderStatus.IN_KITCHEN, label: "En Cocina", count: counts.inKitchen },
    { value: OrderStatus.READY, label: "Listos", count: counts.ready },
    { value: OrderStatus.PAID, label: "Pagados", count: counts.paid },
  ];

  const typeSelectOptions = [
    { value: "ALL", label: "Todos los tipos" },
    { value: OrderType.DINE_IN, label: "Para comer aquí" },
    { value: OrderType.TAKE_OUT, label: "Para llevar" },
    { value: OrderType.DELIVERY, label: "Domicilio" },
    { value: OrderType.WHATSAPP, label: "WhatsApp" },
  ];

  const hasActiveFilters = statusFilter !== "ALL" || typeFilter !== "ALL" || dateFilter !== "TODAY" || searchTerm !== "";

  const activeChips = [
    ...(statusFilter !== "ALL" ? [{ key: "status", label: "Estado", value: STATUS_LABELS[statusFilter] }] : []),
    ...(typeFilter !== "ALL" ? [{ key: "type", label: "Tipo", value: TYPE_LABELS[typeFilter] }] : []),
    ...(searchTerm !== "" ? [{ key: "search", label: "Búsqueda", value: searchTerm }] : []),
    ...(dateFilter !== "TODAY" ? [{ key: "date", label: "Fecha", value: getDateLabel(dateFilter, customDateRange) }] : []),
  ];

  function getDateLabel(dateFilter: DateFilterType, customRange?: DateRange): string {
    switch (dateFilter) {
      case "TODAY": return "Hoy";
      case "YESTERDAY": return "Ayer";
      case "WEEK": return "Últimos 7 días";
      case "CUSTOM": return customRange ? `${new Date(customRange.start).toLocaleDateString("es-CO")}...` : "Personalizado";
      default: return "Hoy";
    }
  }

  return (
    <div className="space-y-6">
      <FilterBar>
        {/* Left Side: Search + Quick Pills */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-6 flex-1 min-w-0">
          <div className="w-full lg:w-72 flex-shrink-0">
            <FilterSearch
              value={searchTerm}
              onChange={onSearchChange}
              placeholder="Buscar por ID o cliente..."
              onClear={() => onSearchChange("")}
            />
          </div>
          
          <div className="flex-1 min-w-0 overflow-x-auto custom-scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0">
            <FilterPills
              options={statusPillOptions}
              value={statusFilter}
              onChange={(v) => onStatusChange(v as OrderStatus | "ALL")}
            />
          </div>
        </div>

        {/* Right Side: Advanced Toggle */}
        <div className="flex-shrink-0">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setIsDrawerOpen(true)}
            className="rounded-2xl h-12 px-6 border-sage-100 text-carbon-600 hover:border-sage-400 hover:text-carbon-900 transition-all font-bold group shadow-soft-sm bg-white"
          >
            <SlidersHorizontal className="w-4 h-4 mr-2 text-carbon-400 group-hover:text-carbon-900 transition-colors" />
            Filtros
            {hasActiveFilters && (
              <span className="ml-2 w-2 h-2 rounded-full bg-sage-500 animate-pulse" />
            )}
          </Button>
        </div>
      </FilterBar>

      <ActiveFilterChips
        chips={activeChips}
        resultCount={resultCount}
        resultLabel="pedidos"
        onClearFilter={onClearFilter}
        onClearAll={onClearAll}
      />

      {/* Advanced Filter Drawer */}
      <FilterDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onApply={() => {}} // Local state handled by parent, but could be specific logic here
        onClear={onClearAll}
        isDirty={hasActiveFilters}
        title="Refinar Pedidos"
      >
        <div className="space-y-8">
          <DateFilter
            label="Rango de Fecha"
            value={dateFilter}
            onChange={onDateChange}
            customRange={customDateRange}
            onCustomRangeChange={onCustomDateRangeChange}
          />

          <FilterSelect
            label="Tipo de Orden"
            value={typeFilter}
            onChange={(v) => onTypeChange(v as OrderType | "ALL")}
            options={typeSelectOptions}
            placeholder="Seleccionar tipo..."
          />

          <div className="pt-4 p-5 rounded-2xl bg-sage-50 border border-sage-100">
            <h4 className="text-[10px] font-black text-carbon-400 uppercase tracking-widest mb-3 ml-1">Resumen de Filtros</h4>
            <div className="text-sm font-medium text-carbon-600 leading-relaxed">
              Estás visualizando los pedidos con estado <span className="font-bold text-carbon-900">"{STATUS_LABELS[statusFilter]}"</span> 
              {typeFilter !== "ALL" && <> del tipo <span className="font-bold text-carbon-900">"{TYPE_LABELS[typeFilter]}"</span></>}.
            </div>
          </div>
        </div>
      </FilterDrawer>
    </div>
  );
}