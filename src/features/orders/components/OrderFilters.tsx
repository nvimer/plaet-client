import { OrderStatus, OrderType } from "@/types";
import { FilterBar, FilterPills, FilterSelect, ActiveFilterChips } from "@/components";

interface OrderFiltersProps {
  statusFilter: OrderStatus | "ALL";
  typeFilter: OrderType | "ALL";
  onStatusChange: (status: OrderStatus | "ALL") => void;
  onTypeChange: (type: OrderType | "ALL") => void;
  onClearFilter: (key: string) => void;
  onClearAll: () => void;
  counts: {
    all: number;
    pending: number;
    inKitchen: number;
    ready: number;
    delivered: number;
  };
}

const STATUS_LABELS: Record<string, string> = {
  ALL: "Todos",
  [OrderStatus.PENDING]: "Pendientes",
  [OrderStatus.IN_KITCHEN]: "En Cocina",
  [OrderStatus.READY]: "Listos",
  [OrderStatus.DELIVERED]: "Entregados",
  [OrderStatus.PAID]: "Pagados",
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
 * Filtros unificados con diseño consistente (FilterBar, FilterPills, ActiveFilterChips).
 * Touch-friendly y responsive.
 */
export function OrderFilters({
  statusFilter,
  typeFilter,
  onStatusChange,
  onTypeChange,
  onClearFilter,
  onClearAll,
  counts,
}: OrderFiltersProps) {
  const statusPillOptions = [
    { value: "ALL", label: "Todos", count: counts.all },
    { value: OrderStatus.PENDING, label: "Pendientes", count: counts.pending },
    { value: OrderStatus.IN_KITCHEN, label: "En Cocina", count: counts.inKitchen },
    { value: OrderStatus.READY, label: "Listos", count: counts.ready },
    { value: OrderStatus.DELIVERED, label: "Entregados", count: counts.delivered },
  ];

  const typeSelectOptions = [
    { value: "ALL", label: "Todos los tipos" },
    { value: OrderType.DINE_IN, label: "Para comer aquí" },
    { value: OrderType.TAKE_OUT, label: "Para llevar" },
    { value: OrderType.DELIVERY, label: "Domicilio" },
    { value: OrderType.WHATSAPP, label: "WhatsApp" },
  ];

  const hasActiveFilters = statusFilter !== "ALL" || typeFilter !== "ALL";

  const activeChips = [
    ...(statusFilter !== "ALL" ? [{ key: "status", label: "Estado", value: STATUS_LABELS[statusFilter] }] : []),
    ...(typeFilter !== "ALL" ? [{ key: "type", label: "Tipo", value: TYPE_LABELS[typeFilter] }] : []),
  ];

  return (
    <div className="space-y-4">
      <FilterBar>
        <div className="flex flex-wrap items-end gap-4 [&>div]:min-w-0">
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
          resultCount={0} // Se actualizará desde el padre
          resultLabel="pedidos"
          onClearFilter={onClearFilter}
          onClearAll={onClearAll}
        />
      )}
    </div>
  );
}
