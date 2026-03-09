import { X, DollarSign, Smartphone, Ticket } from "lucide-react";
import { PaymentMethod } from "@/types";

interface PaymentEntry {
  id: string;
  method: PaymentMethod;
  amount: number;
  reference?: string;
  phone?: string;
}

interface PaymentEntryItemProps {
  payment: PaymentEntry;
  onRemove: (id: string) => void;
}

const methodConfigs = {
  [PaymentMethod.CASH]: { label: "Efectivo", icon: DollarSign, color: "text-emerald-600" },
  [PaymentMethod.NEQUI]: { label: "Nequi", icon: Smartphone, color: "text-purple-600" },
  [PaymentMethod.TICKET_BOOK]: { label: "Tiquetera", icon: Ticket, color: "text-blue-600" },
};

export function PaymentEntryItem({ payment, onRemove }: PaymentEntryItemProps) {
  const config = methodConfigs[payment.method];
  const Icon = config.icon;

  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-sage-50 border border-sage-100 hover:bg-sage-100/50 transition-colors">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center ${config.color}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <span className="text-xs font-bold text-carbon-700">{config.label}</span>
          {payment.reference && (
            <p className="text-[10px] text-carbon-400 font-medium">Ref: {payment.reference}</p>
          )}
          {payment.phone && (
            <p className="text-[10px] text-carbon-400 font-medium">Cel: {payment.phone}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm font-black text-carbon-900">
          ${payment.amount.toLocaleString("es-CO")}
        </span>
        <button
          onClick={() => onRemove(payment.id)}
          className="w-8 h-8 rounded-full bg-error-50 flex items-center justify-center text-error-600 hover:bg-error-100 transition-colors"
          title="Eliminar pago"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
