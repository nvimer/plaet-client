import { BaseModal, Button } from "@/components";
import { useState, useEffect, useMemo } from "react";
import { 
  DollarSign, 
  Smartphone, 
  Ticket, 
  Check, 
  Calculator, 
  Plus
} from "lucide-react";
import { PaymentMethod, OrderStatus, type Order } from "@/types";
import { cn } from "@/utils/cn";
import { useCustomerTickets } from "../hooks/useCustomerTickets";
import { useDailyMenuToday } from "@/features/daily-menu/hooks/useDailyMenu";
import { AnimatePresence } from "framer-motion";

// Sub-components
import { CashPaymentForm } from "./payment/CashPaymentForm";
import { NequiPaymentForm } from "./payment/NequiPaymentForm";
import { TicketBookPaymentForm } from "./payment/TicketBookPaymentForm";
import { PaymentEntryItem } from "./payment/PaymentEntryItem";

export interface PaymentEntry {
  id: string;
  method: PaymentMethod;
  amount: number;
  reference?: string;
  phone?: string;
  portionCount?: number;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onConfirm: (payments: PaymentEntry[], orderIds: string[]) => void;
  isPending?: boolean;
}

export function PaymentModal({
  isOpen,
  onClose,
  orders,
  onConfirm,
  isPending = false,
}: PaymentModalProps) {
  // --- STATE ---
  const [method, setMethod] = useState<PaymentMethod>(PaymentMethod.CASH);
  const [payments, setPayments] = useState<PaymentEntry[]>([]);
  const [currentAmount, setCurrentAmount] = useState<number>(0);
  const [receivedAmount, setReceivedAmount] = useState<number>(0);
  
  // Portion logic for TicketBook
  const [portionCount, setPortionCount] = useState<number>(0);
  
  // Selection logic
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [payAll, setPayAll] = useState(true);

  // Nequi specific
  const [reference, setReference] = useState("");
  
  // TicketBook specific
  const [customerPhone, setCustomerPhone] = useState("");
  const { data: customer, isLoading: isLoadingCustomer, isError: isCustomerError } = useCustomerTickets(customerPhone);
  const { data: dailyMenu } = useDailyMenuToday();

  // --- DERIVED STATE ---
  const activeOrders = useMemo(() => {
    return payAll ? orders : orders.filter(o => selectedOrderIds.includes(o.id));
  }, [payAll, orders, selectedOrderIds]);

  // Identify "Lunches" in the current selection
  const lunchItemsInSelection = useMemo(() => {
    const lunchItems: Array<{ orderId: string; price: number }> = [];
    
    activeOrders.forEach(order => {
      // Find all protein items which represent "Lunches" in this system
      const lunchItemsInOrder = order.items?.filter(
        item => {
          const isProteinCategory = dailyMenu?.proteinCategory && item.menuItem?.categoryId === dailyMenu.proteinCategory.id;
          const isLunchByName = item.menuItem?.name?.toLowerCase().includes("almuerzo") || 
                               item.notes?.toLowerCase().includes("almuerzo");
          
          return isProteinCategory || isLunchByName;
        }
      ) || [];
      
      lunchItemsInOrder.forEach(item => {
        // Create an entry for each portion in the item quantity
        for (let i = 0; i < item.quantity; i++) {
          lunchItems.push({
            orderId: order.id,
            price: Number(item.priceAtOrder)
          });
        }
      });
    });
    
    return lunchItems;
  }, [activeOrders, dailyMenu]);

  const maxPortionsAvailable = lunchItemsInSelection.length;

  // Automatically set portionCount to max when customer is found and has tickets
  useEffect(() => {
    if (method === PaymentMethod.TICKET_BOOK && customer && hasActiveTickets && maxPortionsAvailable > 0) {
      // If we haven't set a portion count yet, or if it's 0, set it to the max available
      if (portionCount === 0) {
        const availableTickets = customer.ticketBooks
          .filter((tb) => tb.status === "active" || tb.status === "ACTIVE")
          .reduce((sum, tb) => sum + (tb.totalPortions - tb.consumedPortions), 0);
        
        setPortionCount(Math.min(availableTickets, maxPortionsAvailable));
      }
    }
  }, [customer, hasActiveTickets, maxPortionsAvailable, method, portionCount]);

  const hasActiveTickets = useMemo(() => {
    if (!customer?.ticketBooks) return false;
    return customer.ticketBooks.some((tb) => (tb.totalPortions - tb.consumedPortions) > 0);
  }, [customer]);

  const remainingAmountsPerOrder = useMemo(() => {
    return orders.reduce((acc, order) => {
      if (order.status === OrderStatus.PAID) {
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
      return Object.values(remainingAmountsPerOrder).reduce((sum, amt) => sum + amt, 0);
    }
    return selectedOrderIds.reduce((sum, id) => sum + (remainingAmountsPerOrder[id] || 0), 0);
  }, [payAll, selectedOrderIds, remainingAmountsPerOrder]);

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

  // --- EFFECTS ---
  // Reset state when modal opens
  const ordersIdsHash = orders.map(o => o.id).sort().join(",");
  useEffect(() => {
    if (isOpen) {
      setMethod(PaymentMethod.CASH);
      setReference("");
      setPayAll(true);
      setSelectedOrderIds(orders.map(o => o.id));
      setPayments([]);
      setReceivedAmount(0);
      setPortionCount(0);
      
      // Pre-fill phone if available in orders
      const firstWithPhone = orders.find(o => o.customer?.phone);
      if (firstWithPhone?.customer?.phone) {
        setCustomerPhone(firstWithPhone.customer.phone);
      } else {
        setCustomerPhone("");
      }
      
      const initialRemaining = orders.reduce((sum, o) => {
        const paid = o.payments?.reduce((s, p) => s + Number(p.amount), 0) || 0;
        return sum + Math.max(0, Number(o.totalAmount) - paid);
      }, 0);
      setCurrentAmount(initialRemaining);
    }
  }, [isOpen, ordersIdsHash]);

  // Update currentAmount when the payment method changes to the remaining balance
  useEffect(() => {
    if (isOpen && remainingToPay > 0) {
      if (method !== PaymentMethod.TICKET_BOOK) {
        setCurrentAmount(remainingToPay);
        setPortionCount(0);
      }
    }
  }, [method, isOpen, remainingToPay]);

  // Handle automatic amount calculation when portionCount changes
  useEffect(() => {
    if (method === PaymentMethod.TICKET_BOOK && portionCount > 0) {
      // Calculate total value of selected portions (starting from the most expensive lunches)
      const sortedLunches = [...lunchItemsInSelection].sort((a, b) => b.price - a.price);
      const coveredAmount = sortedLunches
        .slice(0, portionCount)
        .reduce((sum, lunch) => sum + lunch.price, 0);
      
      setCurrentAmount(coveredAmount);
    } else if (method === PaymentMethod.TICKET_BOOK) {
      setCurrentAmount(0);
    }
  }, [method, portionCount, lunchItemsInSelection]);

  // --- HANDLERS ---
  const handleToggleOrder = (orderId: string) => {
    setPayAll(false);
    const newSelected = selectedOrderIds.includes(orderId) 
      ? selectedOrderIds.filter(id => id !== orderId) 
      : [...selectedOrderIds, orderId];
    
    setSelectedOrderIds(newSelected);
    
    // Update amount to match the new selection
    const newTotal = newSelected.reduce((sum, id) => sum + (remainingAmountsPerOrder[id] || 0), 0);
    setCurrentAmount(newTotal);
  };

  const handleSelectAll = () => {
    setPayAll(true);
    setSelectedOrderIds(orders.map(o => o.id));
    setCurrentAmount(Object.values(remainingAmountsPerOrder).reduce((sum, amt) => sum + amt, 0));
  };

  const handleAddPayment = () => {
    if (!canAddPayment) return;

    const newPayment: PaymentEntry = {
      id: Date.now().toString(),
      method,
      amount: currentAmount,
      reference: method === PaymentMethod.NEQUI ? reference : undefined,
      phone: method === PaymentMethod.TICKET_BOOK ? customerPhone : undefined,
      portionCount: method === PaymentMethod.TICKET_BOOK ? portionCount : undefined,
    };

    const newPayments = [...payments, newPayment];
    setPayments(newPayments);
    
    // Reset inputs for next payment fragment
    const nextRemaining = totalToPay - newPayments.reduce((sum, p) => sum + p.amount, 0);
    setCurrentAmount(Math.max(0, nextRemaining));
    setReference("");
    setPortionCount(0);
    setMethod(PaymentMethod.CASH);
  };

  const handleRemovePayment = (id: string) => {
    setPayments(prev => {
      const filtered = prev.filter(p => p.id !== id);
      const newPaid = filtered.reduce((sum, p) => sum + p.amount, 0);
      setCurrentAmount(totalToPay - newPaid);
      return filtered;
    });
  };

  const handleConfirm = () => {
    const idsToPay = payAll ? orders.map(o => o.id) : selectedOrderIds;
    onConfirm(payments, idsToPay);
  };

  const methods = [
    { id: PaymentMethod.CASH, label: "Efectivo", icon: DollarSign },
    { id: PaymentMethod.NEQUI, label: "Nequi", icon: Smartphone },
    { id: PaymentMethod.TICKET_BOOK, label: "Tiquetera", icon: Ticket },
  ];

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Finalizar Pedido" className="max-w-xl">
      <div className="space-y-6">
        {/* 1. SELECTION (If multiple orders) */}
        {orders.length > 1 && (
          <div className="space-y-3">
            <div className="flex bg-sage-50 p-1 rounded-2xl border border-sage-100">
              <button
                onClick={handleSelectAll}
                className={cn(
                  "flex-1 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all",
                  payAll ? "bg-white shadow-sm text-carbon-900" : "text-carbon-400"
                )}
              >
                Cuenta Total
              </button>
              <button
                onClick={() => setPayAll(false)}
                className={cn(
                  "flex-1 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all",
                  !payAll ? "bg-white shadow-sm text-carbon-900" : "text-carbon-400"
                )}
              >
                Pago Individual
              </button>
            </div>

            {!payAll && (
              <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                {orders.map((order, idx) => {
                  const isSelected = selectedOrderIds.includes(order.id);
                  const remaining = remainingAmountsPerOrder[order.id];
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
          </div>
        )}

        {/* 2. SUMMARY BANNER */}
        <div className="bg-carbon-900 rounded-[2rem] p-6 text-white relative overflow-hidden shadow-soft-2xl">
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.2em] text-carbon-400 mb-1 uppercase">Total a Pagar</p>
              <h3 className="text-3xl font-black tracking-tighter">${totalToPay.toLocaleString("es-CO")}</h3>
            </div>
            {method === PaymentMethod.CASH && receivedAmount > currentAmount ? (
              <div className="text-right">
                <p className="text-[10px] font-semibold tracking-[0.2em] text-success-400 mb-1 uppercase">Cambio</p>
                <h3 className="text-2xl font-black tracking-tighter text-success-400">
                  ${(receivedAmount - currentAmount).toLocaleString("es-CO")}
                </h3>
              </div>
            ) : (
              <div className="text-right">
                <p className="text-[10px] font-semibold tracking-[0.2em] text-success-400 mb-1 uppercase">Pagado</p>
                <h3 className="text-2xl font-black tracking-tighter text-success-400">${totalPaid.toLocaleString("es-CO")}</h3>
              </div>
            )}
          </div>
          {totalPaid > 0 && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-semibold tracking-[0.2em] text-warning-400 uppercase">Pendiente</span>
                <span className="text-2xl font-black tracking-tighter text-warning-400">${remainingToPay.toLocaleString("es-CO")}</span>
              </div>
            </div>
          )}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl" />
          <Calculator className="absolute bottom-4 right-6 w-12 h-12 text-white/10" />
        </div>

        {/* 3. ADDED PAYMENTS LIST */}
        <AnimatePresence>
          {payments.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] font-black text-carbon-500 tracking-widest uppercase ml-1">Pagos Registrados</p>
              <div className="max-h-32 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {payments.map((p) => (
                  <PaymentEntryItem key={p.id} payment={p} onRemove={handleRemovePayment} />
                ))}
              </div>
            </div>
          )}
        </AnimatePresence>

        {/* 4. PAYMENT FORM */}
        {remainingToPay > 0 && (
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
                    <span className="text-[10px] font-bold uppercase tracking-wide">{m.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="min-h-[160px]">
              <AnimatePresence mode="wait">
                {method === PaymentMethod.CASH && (
                  <CashPaymentForm 
                    amount={currentAmount} 
                    onAmountChange={setCurrentAmount} 
                    receivedAmount={receivedAmount}
                    onReceivedChange={setReceivedAmount}
                  />
                )}
                {method === PaymentMethod.NEQUI && (
                  <NequiPaymentForm 
                    amount={currentAmount} 
                    reference={reference} 
                    onAmountChange={setCurrentAmount}
                    onReferenceChange={setReference}
                  />
                )}
                {method === PaymentMethod.TICKET_BOOK && (
                  <TicketBookPaymentForm 
                    portionCount={portionCount}
                    onPortionChange={setPortionCount}
                    maxPortions={maxPortionsAvailable}
                    phone={customerPhone}
                    customer={customer}
                    isLoading={isLoadingCustomer}
                    isError={isCustomerError}
                    onPhoneChange={setCustomerPhone}
                    hasActiveTickets={hasActiveTickets}
                    calculatedAmount={currentAmount}
                  />
                )}
              </AnimatePresence>
            </div>

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
          </div>
        )}

        {/* 5. FINAL ACTIONS */}
        <div className="flex gap-3 pt-2">
          <Button
            variant="ghost"
            onClick={onClose}
            className="h-14 px-6 rounded-2xl font-bold text-carbon-400 hover:bg-carbon-50"
          >
            Cerrar
          </Button>
          <Button
            variant="primary"
            fullWidth
            onClick={handleConfirm}
            isLoading={isPending}
            disabled={isPending || totalPaid < totalToPay || payments.length === 0}
            className="h-14 rounded-2xl font-black text-white shadow-xl bg-success-600 hover:bg-success-700 disabled:bg-sage-200 disabled:text-sage-400"
          >
            <Check className="w-5 h-5 mr-2" />
            CONFIRMAR TODO (${totalPaid.toLocaleString("es-CO")})
          </Button>
        </div>
      </div>
    </BaseModal>
  );
}
