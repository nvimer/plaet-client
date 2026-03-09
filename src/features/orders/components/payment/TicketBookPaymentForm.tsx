import { Search, User, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";

interface TicketBookPaymentFormProps {
  amount: number;
  phone: string;
  customer: any;
  isLoading: boolean;
  isError: boolean;
  onPhoneChange: (val: string) => void;
  onAmountChange: (val: number) => void;
  hasActiveTickets: boolean;
}

export function TicketBookPaymentForm({
  amount,
  phone,
  customer,
  isLoading,
  isError,
  onPhoneChange,
  onAmountChange,
  hasActiveTickets,
}: TicketBookPaymentFormProps) {
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

      <AnimatePresence>
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
                  <p className="text-[10px] font-black text-blue-600 tracking-wide uppercase">Saldo</p>
                  <p className="text-lg font-black text-blue-800">
                    {customer.ticketBooks.find((tb: any) => tb.consumedPortions < tb.totalPortions)?.totalPortions - customer.ticketBooks.find((tb: any) => tb.consumedPortions < tb.totalPortions)?.consumedPortions} Almuerzos
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
        <div className="space-y-2">
          <label className="text-[10px] font-black text-carbon-500 tracking-wide ml-1 uppercase">Monto a cargar</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-carbon-400 font-bold text-lg">$</span>
            <input
              type="number"
              value={amount || ""}
              onChange={(e) => onAmountChange(Number(e.target.value))}
              className="w-full h-14 pl-9 pr-4 rounded-2xl border-2 border-sage-100 focus:border-blue-600 focus:ring-0 text-xl font-bold text-carbon-900 shadow-inner bg-sage-50/30"
              placeholder="0"
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}
