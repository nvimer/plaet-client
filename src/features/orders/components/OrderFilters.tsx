import { OrderStatus, OrderType } from "@/types";
import { FilterBar, FilterPills, FilterSelect, ActiveFilterChips, DateFilter } from "@/components";
import type { DateFilterType, DateRange } from "@/components";

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
  [OrderType.DINE_IN]: "Para comer aquí",
  [OrderType.TAKE_OUT]: "Para llevar",
  [OrderType.DELIVERY]: "Domicilio",
  [OrderType.WHATSAPP]: "WhatsApp",
};

/**
 * OrderFilters Component
 *
 * Filtros unificados con diseño consistente (FilterBar, FilterPills, ActiveFilterChips, DateFilter).
 * Touch-friendly y responsive.
 * 
 * Enhanced with date filtering support for better order management.
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
}: OrderFiltersProps) {
  const statusPillOptions = [
    { value: "ALL", label: "Todos", count: counts.all },
    { value: OrderStatus.PENDING, label: "Pendientes", count: counts.pending },
    { value: OrderStatus.IN_KITCHEN, label: "En Cocina", count: counts.inKitchen },
    { value: OrderStatus.READY, label: "Listos", count: counts.ready },
    { value: OrderStatus.DELIVERED, label: "Entregados", count: counts.delivered },
    { value: OrderStatus.PAID, label: "Pagados", count: counts.paid },
    { value: OrderStatus.SENT_TO_CASHIER, label: "En Caja", count: counts.sentToCashier },
  ];

  const typeSelectOptions = [
    { value: "ALL", label: "Todos los tipos" },
    { value: OrderType.DINE_IN, label: "Para comer aquí" },
    { value: OrderType.TAKE_OUT, label: "Para llevar" },
    { value: OrderType.DELIVERY, label: "Domicilio" },
    { value: OrderType.WHATSAPP, label: "WhatsApp" },
  ];

  const hasActiveFilters = statusFilter !== "ALL" || typeFilter !== "ALL" || dateFilter !== "TODAY";

  const activeChips = [
    ...(statusFilter !== "ALL" ? [{ key: "status", label: "Estado", value: STATUS_LABELS[statusFilter] }] : []),
    ...(typeFilter !== "ALL" ? [{ key: "type", label: "Tipo", value: TYPE_LABELS[typeFilter] }] : []),
    ...(dateFilter !== "TODAY" ? [{ key: "date", label: "Fecha", value: getDateLabel(dateFilter, customDateRange) }] : []),
  ];

  function getDateLabel(dateFilter: DateFilterType, customRange?: DateRange): string {
    switch (dateFilter) {
      case "TODAY":
        return "Hoy";
      case "YESTERDAY":
        return "Ayer";
      case "WEEK":
        return "Últimos 7 días";
      case "CUSTOM":
        if (customRange) {
          return `${new Date(customRange.start).toLocaleDateString("es-CO")} - ${new Date(customRange.end).toLocaleDateString("es-CO")}`;
        }
        return "Personalizado";
      default:
        return "Hoy";
    }
  }

  return (
    <div className="space-y-4">
      <FilterBar>
        <div className="flex flex-wrap items-end gap-4 [&>div]:min-w-0">
          {/* Date Filter - New */}
          <div className="flex-shrink-0 w-full sm:w-auto min-w-0">
            <DateFilter
              value={dateFilter}
              onChange={onDateChange}
              customRange={customDateRange}
              onCustomRangeChange={onCustomDateRangeChange}
            />
          </div>
          
          <div className="flex-shrink-0 w-full sm:w-auto min-w-0">
            <FilterPills
              label="Estado"
              options={statusPillOptions}
              value={statusFilter}
              onChange={(v) => onStatusChange(v as OrderStatus | "ALL")}
              aria-label="Filtrar por estado"
            />
          </div>
          <div className="w-full sm:max-w-[240px] flex-shrink-0 basis-full sm:basis-auto">
            <FilterSelect
              label="Tipo de pedido"
              value={typeFilter}
              onChange={(v) => onTypeChange(v as OrderType | "ALL")}
              options={typeSelectOptions}
              placeholder="Todos los tipos"
              aria-label="Filtrar por tipo"
            />
          </div>
        </div>
      </FilterBar>

      {hasActiveFilters && (
        <ActiveFilterChips
          chips={activeChips}
          resultCount={resultCount}
          resultLabel="pedidos"
          onClearFilter={onClearFilter}
          onClearAll={onClearAll}
        />
      )}
    </div>
  );
}
