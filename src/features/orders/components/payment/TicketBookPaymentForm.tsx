import { Search, User, AlertCircle, Plus, Minus, Ticket } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import type { Customer } from "@/types/order";

interface TicketBook {
  id: string;
  consumedPortions: number;
  totalPortions: number;
  status: string;
}

interface CustomerWithTickets extends Customer {
  ticketBooks: TicketBook[];
}

interface TicketBookPaymentFormProps {
  portionCount: number;
  onPortionChange: (val: number) => void;
  maxPortions: number;
  phone: string;
  customer: CustomerWithTickets | null;
  isLoading: boolean;
  isError: boolean;
  onPhoneChange: (val: string) => void;
  hasActiveTickets: boolean;
  calculatedAmount: number;
}

export function TicketBookPaymentForm({
  portionCount,
  onPortionChange,
  maxPortions,
  phone,
  customer,
  isLoading,
  isError,
  onPhoneChange,
  hasActiveTickets,
  calculatedAmount,
}: TicketBookPaymentFormProps) {
  
  const activeTicketBook = customer?.ticketBooks.find((tb) => tb.consumedPortions < tb.totalPortions);
  const availableBalance = activeTicketBook ? activeTicketBook.totalPortions - activeTicketBook.consumedPortions : 0;
  
  const maxAllowed = Math.min(availableBalance, maxPortions);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-4"
    >
      <div className="space-y-2">
        <label className="text-[10px] font-black text-carbon-500 tracking-wide ml-1 uppercase">Celular del Cliente</label>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-carbon-400 w-5 h-5" />
          <input
            type="tel"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            className="w-full h-14 pl-12 pr-6 rounded-2xl border-2 border-sage-100 focus:border-blue-600 focus:ring-0 text-lg font-bold text-carbon-900 shadow-inner bg-sage-50/30 transition-all"
            placeholder="Buscar por número..."
          />
          {isLoading && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent" />
            </div>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {customer && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
              "p-4 rounded-2xl border-2 flex flex-col gap-3",
              hasActiveTickets ? "bg-blue-50 border-blue-100" : "bg-error-50 border-error-100"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-blue-600">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-carbon-900">{customer.firstName} {customer.lastName}</p>
                  <p className="text-[10px] font-bold text-carbon-400 tracking-wide">{customer.phone}</p>
                </div>
              </div>
              {hasActiveTickets && (
                <div className="text-right">
                  <p className="text-[10px] font-black text-blue-600 tracking-wide uppercase">Saldo disponible</p>
                  <p className="text-lg font-black text-blue-800">
                    {availableBalance} Almuerzos
                  </p>
                </div>
              )}
            </div>
            
            {!hasActiveTickets && (
              <div className="flex items-center gap-2 text-error-600 text-xs font-bold mt-1">
                <AlertCircle className="w-4 h-4" />
                No tiene tiqueteras activas o disponibles
              </div>
            )}
          </motion.div>
        )}
        {isError && (
          <div className="text-center p-3 text-error-600 font-bold text-xs bg-error-50 rounded-xl border border-error-100">
            Cliente no encontrado o error en la búsqueda
          </div>
        )}
      </AnimatePresence>

      {hasActiveTickets && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white border-2 border-blue-100 rounded-2xl shadow-soft-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Ticket className="w-4 h-4 text-blue-600" />
                <p className="text-xs font-black text-carbon-900 uppercase tracking-tight">Tiquetes a usar</p>
              </div>
              <p className="text-[10px] text-carbon-400 font-bold uppercase">
                {maxPortions > 0 
                  ? `Pedido contiene ${maxPortions} ${maxPortions === 1 ? 'almuerzo' : 'almuerzos'}` 
                  : "No se detectan almuerzos en el pedido"}
              </p>
            </div>

            <div className="flex items-center justify-center gap-4 bg-blue-50 p-1.5 rounded-xl border border-blue-100 shadow-inner">
              <button
                onClick={() => onPortionChange(Math.max(0, portionCount - 1))}
                className="w-9 h-9 flex items-center justify-center bg-white border border-blue-200 rounded-lg text-blue-600 hover:bg-blue-50 active:scale-90 transition-all shadow-sm"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-black text-blue-900 text-lg">
                {portionCount}
              </span>
              <button
                onClick={() => onPortionChange(Math.min(maxAllowed, portionCount + 1))}
                disabled={portionCount >= maxAllowed}
                className="w-9 h-9 flex items-center justify-center bg-white border border-blue-200 rounded-lg text-blue-600 hover:bg-blue-50 active:scale-90 transition-all shadow-sm disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <AnimatePresence>
            {portionCount > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between px-2"
              >
                <span className="text-[10px] font-bold text-success-600 uppercase tracking-widest">Monto Cubierto</span>
                <span className="text-lg font-black text-success-700">${calculatedAmount.toLocaleString("es-CO")}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
