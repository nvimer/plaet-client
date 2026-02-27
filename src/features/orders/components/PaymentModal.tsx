import { useState, useEffect } from "react";
import { BaseModal } from "@/components/ui/BaseModal/BaseModal";
import { Button } from "@/components/ui/Button/Button";
import { 
  DollarSign, 
  Smartphone, 
  Ticket, 
  Check, 
  X, 
  Calculator, 
  User, 
  Search,
  AlertCircle
} from "lucide-react";
import { PaymentMethod } from "@/types";
import { cn } from "@/utils/cn";
import { useCustomerTickets } from "../hooks/useCustomerTickets";
import { motion, AnimatePresence } from "framer-motion";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderTotal: number;
  remainingAmount: number;
  onConfirm: (method: PaymentMethod, amount: number, options?: { reference?: string; phone?: string }) => void;
  isPending?: boolean;
}

export function PaymentModal({
  isOpen,
  onClose,
  remainingAmount,
  onConfirm,
  isPending = false,
}: PaymentModalProps) {
  const [method, setMethod] = useState<PaymentMethod>(PaymentMethod.CASH);
  const [amount, setAmount] = useState<number>(remainingAmount);
  
  // Cash logic
  const [cashReceived, setCashReceived] = useState<number>(0);
  
  // Nequi logic
  const [reference, setReference] = useState("");
  
  // TicketBook logic
  const [customerPhone, setCustomerPhone] = useState("");
  const { data: customer, isLoading: isLoadingCustomer, isError: isCustomerError } = useCustomerTickets(customerPhone);

  const change = Math.max(0, cashReceived - amount);

  useEffect(() => {
    if (isOpen) {
      setAmount(remainingAmount);
      setMethod(PaymentMethod.CASH);
      setCashReceived(0);
      setReference("");
      setCustomerPhone("");
    }
  }, [isOpen, remainingAmount]);

  const handleConfirm = () => {
    onConfirm(method, amount, {
      reference: method === PaymentMethod.NEQUI ? reference : undefined,
      phone: method === PaymentMethod.TICKET_BOOK ? customerPhone : undefined
    });
  };

  const methods = [
    { id: PaymentMethod.CASH, label: "Efectivo", icon: DollarSign, color: "emerald" },
    { id: PaymentMethod.NEQUI, label: "Nequi", icon: Smartphone, color: "purple" },
    { id: PaymentMethod.TICKET_BOOK, label: "Tiquetera", icon: Ticket, color: "blue" },
  ];

  const hasActiveTickets = customer?.ticketBooks && customer.ticketBooks.some((tb: any) => tb.consumedPortions < tb.totalPortions);

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Finalizar Pedido" className="max-w-md">
      <div className="space-y-6">
        {/* Payment Summary Banner */}
        <div className="bg-carbon-900 rounded-[2rem] p-6 text-white relative overflow-hidden shadow-soft-2xl">
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-carbon-400 mb-1">Total a Pagar</p>
            <h3 className="text-4xl font-black tracking-tighter">${remainingAmount.toLocaleString("es-CO")}</h3>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl" />
          <Calculator className="absolute bottom-4 right-6 w-12 h-12 text-white/10" />
        </div>

        {/* Method Selectors */}
        <div className="grid grid-cols-3 gap-3">
          {methods.map((m) => {
            const Icon = m.icon;
            const isActive = method === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setMethod(m.id)}
                className={cn(
                  "flex flex-col items-center justify-center p-4 rounded-3xl border-2 transition-all duration-300 gap-2 active:scale-95",
                  isActive 
                    ? "border-carbon-900 bg-carbon-900 text-white shadow-soft-lg" 
                    : "border-sage-100 bg-white text-carbon-500 hover:border-sage-300 hover:bg-sage-50/50"
                )}
              >
                <Icon className={cn("w-6 h-6", isActive ? "text-white" : "text-carbon-400")} />
                <span className="text-[10px] font-black uppercase tracking-widest">{m.label}</span>
              </button>
            );
          })}
        </div>

        <div className="min-h-[220px]">
          <AnimatePresence mode="wait">
            {/* CASH FLOW */}
            {method === PaymentMethod.CASH && (
              <motion.div
                key="cash"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-5"
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-carbon-500 uppercase tracking-widest ml-1">Efectivo Recibido</label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-carbon-400 font-bold text-xl">$</span>
                    <input
                      type="number"
                      autoFocus
                      value={cashReceived || ""}
                      onChange={(e) => setCashReceived(Number(e.target.value))}
                      className="w-full h-16 pl-10 pr-6 rounded-2xl border-2 border-sage-100 focus:border-carbon-900 focus:ring-0 text-2xl font-black text-carbon-900 transition-all shadow-inner bg-sage-50/30"
                      placeholder="0"
                    />
                  </div>
                </div>

                {cashReceived > 0 && (
                  <div className={cn(
                    "p-5 rounded-3xl border-2 transition-all flex items-center justify-between",
                    cashReceived >= amount ? "bg-emerald-50 border-emerald-100" : "bg-amber-50 border-amber-100"
                  )}>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-carbon-500">Devuelta</p>
                      <p className={cn(
                        "text-3xl font-black tracking-tighter",
                        cashReceived >= amount ? "text-emerald-700" : "text-amber-700"
                      )}>
                        ${change.toLocaleString("es-CO")}
                      </p>
                    </div>
                    {cashReceived >= amount ? (
                      <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg">
                        <Check className="w-6 h-6 stroke-[3px]" />
                      </div>
                    ) : (
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-amber-600 uppercase">Faltan</p>
                        <p className="text-sm font-black text-amber-700">${(amount - cashReceived).toLocaleString("es-CO")}</p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {/* NEQUI FLOW */}
            {method === PaymentMethod.NEQUI && (
              <motion.div
                key="nequi"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="bg-purple-50 p-5 rounded-3xl border-2 border-purple-100 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-purple-900">Transferencia Nequi</h4>
                    <p className="text-xs text-purple-600 font-medium italic">Confirma la recepción en tu App</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-carbon-500 uppercase tracking-widest ml-1">Referencia (Opcional)</label>
                  <input
                    type="text"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    className="w-full h-14 px-5 rounded-2xl border-2 border-sage-100 focus:border-purple-600 focus:ring-0 text-lg font-bold text-carbon-900 shadow-inner bg-sage-50/30 transition-all"
                    placeholder="Eje: 123456"
                  />
                </div>
              </motion.div>
            )}

            {/* TICKET BOOK FLOW */}
            {method === PaymentMethod.TICKET_BOOK && (
              <motion.div
                key="ticket"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-carbon-500 uppercase tracking-widest ml-1">Celular del Cliente</label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-carbon-400 w-5 h-5" />
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full h-14 pl-12 pr-6 rounded-2xl border-2 border-sage-100 focus:border-blue-600 focus:ring-0 text-lg font-bold text-carbon-900 shadow-inner bg-sage-50/30 transition-all"
                      placeholder="Buscar por número..."
                    />
                    {isLoadingCustomer && (
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
                        "p-5 rounded-3xl border-2 flex flex-col gap-3",
                        hasActiveTickets ? "bg-blue-50 border-blue-100" : "bg-rose-50 border-rose-100"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-blue-600">
                            <User className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-carbon-900">{customer.firstName} {customer.lastName}</p>
                            <p className="text-[10px] font-bold text-carbon-400 uppercase tracking-widest">{customer.phone}</p>
                          </div>
                        </div>
                        {hasActiveTickets && (
                          <div className="text-right">
                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Saldo</p>
                            <p className="text-xl font-black text-blue-800">{customer.ticketBooks.find((tb: any) => tb.consumedPortions < tb.totalPortions)?.totalPortions - customer.ticketBooks.find((tb: any) => tb.consumedPortions < tb.totalPortions)?.consumedPortions} Almuerzos</p>
                          </div>
                        )}
                      </div>
                      
                      {!hasActiveTickets && (
                        <div className="flex items-center gap-2 text-rose-600 text-xs font-bold mt-1">
                          <AlertCircle className="w-4 h-4" />
                          No tiene tiqueteras activas o disponibles
                        </div>
                      )}
                    </motion.div>
                  )}
                  {isCustomerError && (
                    <div className="text-center p-4 text-rose-600 font-bold text-sm bg-rose-50 rounded-2xl border border-rose-100">
                      Cliente no encontrado
                    </div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="ghost"
            onClick={onClose}
            className="h-16 px-6 rounded-2xl font-bold text-carbon-400 hover:bg-carbon-50"
          >
            <X className="w-5 h-5" />
          </Button>
          <Button
            variant="primary"
            fullWidth
            onClick={handleConfirm}
            isLoading={isPending}
            disabled={
              isPending || 
              (method === PaymentMethod.CASH && cashReceived < amount) ||
              (method === PaymentMethod.TICKET_BOOK && !hasActiveTickets)
            }
            className={cn(
              "h-16 rounded-3xl font-black text-white shadow-xl transition-all active:scale-95",
              method === PaymentMethod.CASH ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100" :
              method === PaymentMethod.NEQUI ? "bg-purple-600 hover:bg-purple-700 shadow-purple-100" :
              "bg-blue-600 hover:bg-blue-700 shadow-blue-100"
            )}
          >
            <Check className="w-6 h-6 mr-2 stroke-[3px]" />
            CONFIRMAR PAGO
          </Button>
        </div>
      </div>
    </BaseModal>
  );
}