import { useState, useEffect, useMemo } from "react";
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
  AlertCircle,
  Plus,
  Trash2
} from "lucide-react";
import { PaymentMethod, OrderStatus, type Order } from "@/types";
import { cn } from "@/utils/cn";
import { useCustomerTickets } from "../hooks/useCustomerTickets";
import { motion, AnimatePresence } from "framer-motion";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onConfirm: (method: PaymentMethod, amount: number, orderIds: string[], options?: { reference?: string; phone?: string }) => void;
  isPending?: boolean;
}

interface PaymentEntry {
  id: string;
  method: PaymentMethod;
  amount: number;
  reference?: string;
  phone?: string;
}

// Payment modal with combined payments support
export function PaymentModal({
  isOpen,
  onClose,
  orders,
  onConfirm,
  isPending = false,
}: PaymentModalProps) {
  const [method, setMethod] = useState<PaymentMethod>(PaymentMethod.CASH);
  
  // Selection logic
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [payAll, setPayAll] = useState(true);

  // Combined payments logic
  const [payments, setPayments] = useState<PaymentEntry[]>([]);
  const [currentAmount, setCurrentAmount] = useState<number>(0);
  
  // Cash logic
  const [cashReceived, setCashReceived] = useState<number>(0);
  
  // Nequi logic
  const [reference, setReference] = useState("");
  
  // TicketBook logic
  const [customerPhone, setCustomerPhone] = useState("");
  const { data: customer, isLoading: isLoadingCustomer, isError: isCustomerError } = useCustomerTickets(customerPhone);

  // Calculate totals based on selection
  const remainingAmounts = useMemo(() => {
    return orders.reduce((acc, order) => {
      // In Master-Detail, an order is either PAID or not.
      const isAlreadyPaid = order.status === OrderStatus.PAID;
      
      if (isAlreadyPaid) {
        acc[order.id] = 0;
      } else {
        const paid = order.payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;
        acc[order.id] = Math.max(0, Number(order.totalAmount) - paid);
      }
      return acc;
    }, {} as Record<string, number>);
  }, [orders]);

  const totalToPay = useMemo(() => {
    if (payAll) {
      return Object.values(remainingAmounts).reduce((sum, amt) => sum + amt, 0);
    }
    return selectedOrderIds.reduce((sum, id) => sum + (remainingAmounts[id] || 0), 0);
  }, [payAll, selectedOrderIds, remainingAmounts]);

  const totalPaid = useMemo(() => {
    return payments.reduce((sum, p) => sum + p.amount, 0);
  }, [payments]);

  const remainingToPay = useMemo(() => {
    return Math.max(0, totalToPay - totalPaid);
  }, [totalToPay, totalPaid]);

  const canAddPayment = useMemo(() => {
    if (currentAmount <= 0) return false;
    if (method === PaymentMethod.TICKET_BOOK && !hasActiveTickets) return false;
    return true;
  }, [currentAmount, method, hasActiveTickets]);

  const change = Math.max(0, cashReceived - remainingToPay);

  // Sync currentAmount when remainingToPay changes
  useEffect(() => {
    if (isOpen && remainingToPay > 0 && currentAmount > remainingToPay) {
      setCurrentAmount(remainingToPay);
    }
  }, [remainingToPay, isOpen]);

  // Use a ref to track the last orders set and only reset when the actual group of orders changes
  const ordersIdsHash = orders.map(o => o.id).sort().join(",");
  
  useEffect(() => {
    if (isOpen) {
      setMethod(PaymentMethod.CASH);
      setCashReceived(0);
      setReference("");
      setCustomerPhone("");
      setPayAll(true);
      setSelectedOrderIds(orders.map(o => o.id));
      setPayments([]);
      setCurrentAmount(remainingToPay > 0 ? remainingToPay : 0);
    }
  }, [isOpen, ordersIdsHash, remainingToPay]);

  const handleToggleOrder = (orderId: string) => {
    setPayAll(false);
    setCashReceived(0);
    setSelectedOrderIds(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId) 
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    setPayAll(true);
    setCashReceived(0);
    setSelectedOrderIds(orders.map(o => o.id));
  };

  const handleAddPayment = () => {
    const newPayment: PaymentEntry = {
      id: Date.now().toString(),
      method,
      amount: currentAmount,
      reference: method === PaymentMethod.NEQUI ? reference : undefined,
      phone: method === PaymentMethod.TICKET_BOOK ? customerPhone : undefined,
    };
    setPayments([...payments, newPayment]);
    setCurrentAmount(remainingToPay - currentAmount);
    setReference("");
    setCashReceived(0);
    setMethod(PaymentMethod.CASH);
  };

  const handleRemovePayment = (id: string) => {
    const payment = payments.find(p => p.id === id);
    if (payment) {
      setCurrentAmount(currentAmount + payment.amount);
      setPayments(payments.filter(p => p.id !== id));
    }
  };

  const handleConfirm = () => {
    const idsToPay = payAll ? orders.map(o => o.id) : selectedOrderIds;
    
    // Process all payments in sequence
    payments.forEach(payment => {
      onConfirm(payment.method, payment.amount, idsToPay, {
        reference: payment.reference,
        phone: payment.phone
      });
    });
  };

  const methods = [
    { id: PaymentMethod.CASH, label: "Efectivo", icon: DollarSign, color: "emerald" },
    { id: PaymentMethod.NEQUI, label: "Nequi", icon: Smartphone, color: "purple" },
    { id: PaymentMethod.TICKET_BOOK, label: "Tiquetera", icon: Ticket, color: "blue" },
  ];

  const hasActiveTickets = customer?.ticketBooks && customer.ticketBooks.some((tb: any) => tb.consumedPortions < tb.totalPortions);

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Finalizar Pedido" className="max-w-xl">
      <div className="space-y-6">
        {/* Selection Toggle */}
        {orders.length > 1 && (
          <div className="flex bg-sage-50 p-1 rounded-2xl border border-sage-100">
            <button
              onClick={handleSelectAll}
              className={cn(
                "flex-1 py-2 rounded-xl text-[10px] font-semibold tracking-wide transition-all",
                payAll ? "bg-white shadow-sm text-carbon-900" : "text-carbon-400"
              )}
            >
              Cuenta Total
            </button>
            <button
              onClick={() => setPayAll(false)}
              className={cn(
                "flex-1 py-2 rounded-xl text-[10px] font-semibold tracking-wide transition-all",
                !payAll ? "bg-white shadow-sm text-carbon-900" : "text-carbon-400"
              )}
            >
              Pago Individual
            </button>
          </div>
        )}

        {/* Individual Selection List */}
        {!payAll && orders.length > 1 && (
          <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
            {orders.map((order, idx) => {
              const isSelected = selectedOrderIds.includes(order.id);
              const remaining = remainingAmounts[order.id];
              if (remaining <= 0) return null;

              return (
                <button
                  key={order.id}
                  onClick={() => handleToggleOrder(order.id)}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-xl border-2 transition-all",
                    isSelected ? "border-carbon-900 bg-carbon-50" : "border-sage-100 bg-white"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all",
                      isSelected ? "bg-carbon-900 border-carbon-900" : "border-sage-200"
                    )}>
                      {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[4px]" />}
                    </div>
                    <span className="text-xs font-bold text-carbon-700">Pedido #{idx + 1} ({order.id.slice(-4).toUpperCase()})</span>
                  </div>
                  <span className="text-sm font-black text-carbon-900">${remaining.toLocaleString("es-CO")}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Payment Summary Banner */}
        <div className="bg-carbon-900 rounded-[2rem] p-6 text-white relative overflow-hidden shadow-soft-2xl">
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.2em] text-carbon-400 mb-1">Total a Pagar</p>
              <h3 className="text-3xl font-black tracking-tighter">${totalToPay.toLocaleString("es-CO")}</h3>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-semibold tracking-[0.2em] text-success-400 mb-1">Pagado</p>
              <h3 className="text-2xl font-black tracking-tighter text-success-400">${totalPaid.toLocaleString("es-CO")}</h3>
            </div>
          </div>
          {totalPaid > 0 && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-semibold tracking-[0.2em] text-warning-400">Pendiente</span>
                <span className="text-2xl font-black tracking-tighter text-warning-400">${remainingToPay.toLocaleString("es-CO")}</span>
              </div>
            </div>
          )}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl" />
          <Calculator className="absolute bottom-4 right-6 w-12 h-12 text-white/10" />
        </div>

        {/* Added Payments List */}
        {payments.length > 0 && (
          <div className="space-y-2">
            <p className="text-[10px] font-black text-carbon-500 tracking-wide ml-1">Pagos Registrados</p>
            <div className="max-h-32 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {payments.map((payment) => {
                const methodInfo = methods.find(m => m.id === payment.method);
                const Icon = methodInfo?.icon || DollarSign;
                return (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-sage-50 border border-sage-100"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-carbon-500" />
                      <span className="text-xs font-bold text-carbon-700">{methodInfo?.label}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-black text-carbon-900">${payment.amount.toLocaleString("es-CO")}</span>
                      <button
                        onClick={() => handleRemovePayment(payment.id)}
                        className="w-6 h-6 rounded-full bg-error-100 flex items-center justify-center text-error-600 hover:bg-error-200"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Method Selectors and Payment Input */}
        {remainingToPay > 0 && (
          <>
            <div className="space-y-4">
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
                      <span className="text-[10px] font-semibold tracking-wide">{m.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="min-h-[180px]">
                <AnimatePresence mode="wait">
                  {/* CASH FLOW */}
                  {method === PaymentMethod.CASH && (
                    <motion.div
                      key="cash"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-carbon-500 tracking-wide ml-1">Monto en Efectivo</label>
                        <div className="relative">
                          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-carbon-400 font-bold text-xl">$</span>
                          <input
                            type="number"
                            autoFocus
                            value={currentAmount || ""}
                            onChange={(e) => setCurrentAmount(Number(e.target.value))}
                            className="w-full h-16 pl-10 pr-6 rounded-2xl border-2 border-sage-100 focus:border-carbon-900 focus:ring-0 text-2xl font-black text-carbon-900 transition-all shadow-inner bg-sage-50/30"
                            placeholder="0"
                          />
                        </div>
                      </div>

                      {currentAmount > 0 && (
                        <div className={cn(
                          "p-4 rounded-2xl border-2 transition-all flex items-center justify-between",
                          currentAmount >= remainingToPay ? "bg-success-50 border-success-100" : "bg-warning-50 border-warning-100"
                        )}>
                          <div>
                            <p className="text-[10px] font-semibold tracking-wide text-carbon-500">Cambio</p>
                            <p className={cn(
                              "text-2xl font-black tracking-tighter",
                              currentAmount >= remainingToPay ? "text-success-700" : "text-warning-700"
                            )}>
                              ${Math.max(0, currentAmount - remainingToPay).toLocaleString("es-CO")}
                            </p>
                          </div>
                          {currentAmount >= remainingToPay ? (
                            <div className="w-10 h-10 rounded-full bg-success-600 text-white flex items-center justify-center">
                              <Check className="w-5 h-5 stroke-[3px]" />
                            </div>
                          ) : null}
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
                      <div className="bg-info-50 p-4 rounded-2xl border-2 border-info-100 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-info-600 text-white flex items-center justify-center">
                          <Smartphone className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-info-900 text-sm">Transferencia Nequi</h4>
                          <p className="text-xs text-info-600 font-medium italic">Confirma la recepción en tu App</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-carbon-500 tracking-wide ml-1">Monto</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-carbon-400 font-bold text-lg">$</span>
                          <input
                            type="number"
                            value={currentAmount || ""}
                            onChange={(e) => setCurrentAmount(Number(e.target.value))}
                            className="w-full h-14 pl-9 pr-4 rounded-2xl border-2 border-sage-100 focus:border-info-600 focus:ring-0 text-xl font-bold text-carbon-900 shadow-inner bg-sage-50/30"
                            placeholder="0"
                          />
                        </div>
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
                        <label className="text-[10px] font-black text-carbon-500 tracking-wide ml-1">Celular del Cliente</label>
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
                                  <p className="text-[10px] font-black text-blue-600 tracking-wide">Saldo</p>
                                  <p className="text-lg font-black text-blue-800">{customer.ticketBooks.find((tb: any) => tb.consumedPortions < tb.totalPortions)?.totalPortions - customer.ticketBooks.find((tb: any) => tb.consumedPortions < tb.totalPortions)?.consumedPortions} Almuerzos</p>
                                </div>
                              )}
                            </div>
                            
                            {!hasActiveTickets && (
                              <div className="flex items-center gap-2 text-error-600 text-xs font-bold mt-1">
                                <AlertCircle className="w-4 h-4" />
                                No tiene tiqueteras activas
                              </div>
                            )}
                          </motion.div>
                        )}
                        {isCustomerError && (
                          <div className="text-center p-3 text-error-600 font-bold text-xs bg-error-50 rounded-xl border border-error-100">
                            Cliente no encontrado
                          </div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Add Payment Button */}
            <Button
              variant="outline"
              fullWidth
              onClick={handleAddPayment}
              disabled={!canAddPayment}
              className="h-12 rounded-2xl font-bold border-2 border-sage-300 text-sage-700 hover:bg-sage-50"
            >
              <Plus className="w-5 h-5 mr-2" />
              AGREGAR PAGO
            </Button>
          </>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            variant="ghost"
            onClick={onClose}
            className="h-14 px-5 rounded-2xl font-bold text-carbon-400 hover:bg-carbon-50"
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
              totalPaid < totalToPay
            }
            className="h-14 rounded-2xl font-black text-white shadow-xl bg-success-600 hover:bg-success-700"
          >
            <Check className="w-5 h-5 mr-2" />
            CONFIRMAR PAGO (${totalPaid.toLocaleString("es-CO")})
          </Button>
        </div>
      </div>
    </BaseModal>
  );
}