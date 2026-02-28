import { useState } from "react";
import { OrderStatus, OrderType, PaymentMethod } from "@/types";
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
import { SlidersHorizontal, Search, Wallet } from "lucide-react";
import { Button } from "@/components";

interface OrderFiltersProps {

  typeFilter: OrderType | "ALL";

  paymentMethodFilter?: PaymentMethod | "ALL";

  dateFilter: DateFilterType;

  customDateRange?: DateRange;

  onTypeChange: (type: OrderType | "ALL") => void;

  onPaymentMethodChange?: (method: PaymentMethod | "ALL") => void;

  onDateChange: (date: DateFilterType) => void;

  onCustomDateRangeChange?: (range: DateRange) => void;

  onClearFilter: (key: string) => void;

  onClearAll: () => void;

  resultCount?: number;

  searchTerm: string;

  onSearchChange: (value: string) => void;

}



const TYPE_LABELS: Record<string, string> = {

  ALL: "Todos",

  [OrderType.DINE_IN]: "Mesa",

  [OrderType.TAKE_OUT]: "Llevar",

  [OrderType.DELIVERY]: "Domicilio",

  [OrderType.WHATSAPP]: "WhatsApp",

};



const PAYMENT_LABELS: Record<string, string> = {

  ALL: "Todos",

  [PaymentMethod.CASH]: "Efectivo",

  [PaymentMethod.NEQUI]: "Nequi",

  [PaymentMethod.TICKET_BOOK]: "Tiquetera",

};



/**

 * Premium Order Filters

 * Search and advanced drawer system.

 */

export function OrderFilters({

  typeFilter,

  paymentMethodFilter = "ALL",

  dateFilter,

  customDateRange,

  onTypeChange,

  onPaymentMethodChange,

  onDateChange,

  onCustomDateRangeChange,

  onClearFilter,

  onClearAll,

  resultCount = 0,

  searchTerm,

  onSearchChange,

}: OrderFiltersProps) {

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);



  const typeSelectOptions = [

    { value: "ALL", label: "Todos los tipos" },

    { value: OrderType.DINE_IN, label: "Para comer aquí" },

    { value: OrderType.TAKE_OUT, label: "Para llevar" },

    { value: OrderType.DELIVERY, label: "Domicilio" },

    { value: OrderType.WHATSAPP, label: "WhatsApp" },

  ];



  const paymentSelectOptions = [

    { value: "ALL", label: "Todos los medios" },

    { value: PaymentMethod.CASH, label: "Efectivo" },

    { value: PaymentMethod.NEQUI, label: "Nequi" },

    { value: PaymentMethod.TICKET_BOOK, label: "Tiquetera / Vales" },

  ];



  const hasActiveFilters = 

    typeFilter !== "ALL" || 

    paymentMethodFilter !== "ALL" ||

    dateFilter !== "TODAY" || 

    searchTerm !== "";



  const activeChips = [

    ...(typeFilter !== "ALL" ? [{ key: "type", label: "Tipo", value: TYPE_LABELS[typeFilter] }] : []),

    ...(paymentMethodFilter !== "ALL" ? [{ key: "payment", label: "Pago", value: PAYMENT_LABELS[paymentMethodFilter] }] : []),

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

        {/* Left Side: Search (Now has full space to breathe) */}

        <div className="flex-1 w-full lg:w-auto lg:max-w-md">

          <FilterSearch

            value={searchTerm}

            onChange={onSearchChange}

            placeholder="Buscar por ID o cliente..."

            onClear={() => onSearchChange("")}

          />

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

        onApply={() => {}} // Local state handled by parent

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



          <FilterSelect

            label="Medio de Pago"

            value={paymentMethodFilter}

            onChange={(v) => onPaymentMethodChange?.(v as PaymentMethod | "ALL")}

            options={paymentSelectOptions}

            placeholder="Seleccionar pago..."

          />



          <div className="pt-4 p-5 rounded-2xl bg-sage-50 border border-sage-100">

            <h4 className="text-[10px] font-black text-carbon-400 uppercase tracking-widest mb-3 ml-1">Resumen de Filtros</h4>

            <div className="text-sm font-medium text-carbon-600 leading-relaxed">

              Estás visualizando los pedidos

              {typeFilter !== "ALL" ? <> del tipo <span className="font-bold text-carbon-900">"{TYPE_LABELS[typeFilter]}"</span></> : " de todos los tipos"}

              {paymentMethodFilter !== "ALL" && <>, pagados con <span className="font-bold text-carbon-900">"{PAYMENT_LABELS[paymentMethodFilter]}"</span></>}.

            </div>

          </div>

        </div>

      </FilterDrawer>

    </div>

  );

}
