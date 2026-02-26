import { useState, useEffect } from "react";
import { BaseModal } from "@/components/ui/BaseModal/BaseModal";
import { Button } from "@/components/ui/Button/Button";
import { DollarSign, Smartphone, Ticket, Check, X, Calculator } from "lucide-react";
import { PaymentMethod } from "@/types";
import { cn } from "@/utils/cn";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderTotal: number;
  remainingAmount: number;
  onConfirm: (method: PaymentMethod, amount: number, reference?: string) => void;
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
  const [reference, setReference] = useState("");

  // Sync amount when remainingAmount changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setAmount(remainingAmount);
      setReference("");
    }
  }, [isOpen, remainingAmount]);

  const methods = [
    {
      id: PaymentMethod.CASH,
      label: "Efectivo",
      icon: DollarSign,
      color: "bg-emerald-100 text-emerald-700",
      activeColor: "bg-emerald-600 text-white border-emerald-600",
    },
    {
      id: PaymentMethod.NEQUI,
      label: "Nequi",
      icon: Smartphone,
      color: "bg-purple-100 text-purple-700",
      activeColor: "bg-purple-600 text-white border-purple-600",
    },
    {
      id: PaymentMethod.TICKET_BOOK,
      label: "Voucher / Vale",
      icon: Ticket,
      color: "bg-blue-100 text-blue-700",
      activeColor: "bg-blue-600 text-white border-blue-600",
    },
  ];

  const handleConfirm = () => {
    onConfirm(method, amount, reference);
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Registrar Pago">
      <div className="space-y-6">
        {/* Summary */}
        <div className="bg-carbon-50 p-4 rounded-2xl border border-carbon-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-carbon-400 uppercase tracking-widest">Monto Pendiente</p>
            <p className="text-2xl font-black text-carbon-900">${remainingAmount.toLocaleString("es-CO")}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
            <Calculator className="w-6 h-6 text-sage-500" />
          </div>
        </div>

        {/* Method Selection */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-carbon-700 ml-1">Método de Pago</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {methods.map((m) => {
              const Icon = m.icon;
              const isActive = method === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  className={cn(
                    "flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 gap-2",
                    isActive ? m.activeColor : "bg-white border-carbon-100 text-carbon-500 hover:border-sage-200"
                  )}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-xs font-bold uppercase">{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Amount Input */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-carbon-700 ml-1">Monto a Pagar</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-carbon-400 font-bold">$</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full h-14 pl-8 pr-4 rounded-2xl border-2 border-carbon-100 focus:border-sage-500 focus:ring-0 text-xl font-black text-carbon-900 transition-all"
              placeholder="0"
            />
          </div>
        </div>

        {/* Reference (Optional) */}
        {method !== PaymentMethod.CASH && (
          <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <label className="text-sm font-bold text-carbon-700 ml-1">
              Referencia / Celular {method === PaymentMethod.NEQUI ? "(Opcional)" : ""}
            </label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border-2 border-carbon-100 focus:border-sage-500 focus:ring-0 text-sm font-medium transition-all"
              placeholder={method === PaymentMethod.NEQUI ? "Número de celular o transacción" : "Número de vale"}
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button
            variant="ghost"
            fullWidth
            onClick={onClose}
            className="h-14 rounded-2xl font-bold text-carbon-400"
          >
            <X className="w-5 h-5 mr-2" />
            Cancelar
          </Button>
          <Button
            variant="primary"
            fullWidth
            onClick={handleConfirm}
            isLoading={isPending}
            disabled={amount <= 0 || isPending}
            className="h-14 rounded-2xl font-black bg-carbon-900 hover:bg-carbon-800 text-white shadow-xl shadow-carbon-200"
          >
            <Check className="w-5 h-5 mr-2 stroke-[3px]" />
            Confirmar Pago
          </Button>
        </div>
      </div>
    </BaseModal>
  );
}
