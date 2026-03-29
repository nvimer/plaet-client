import { motion } from "framer-motion";
import { DollarSign, ArrowRightLeft } from "lucide-react";
import { cn } from "@/utils/cn";

interface CashPaymentFormProps {
  amount: number;
  onAmountChange: (val: number) => void;
  receivedAmount: number;
  onReceivedChange: (val: number) => void;
}

export function CashPaymentForm({
  amount,
  onAmountChange,
  receivedAmount,
  onReceivedChange,
}: CashPaymentFormProps) {
  const change = Math.max(0, receivedAmount - amount);
  const hasReceivedEnough = receivedAmount >= amount && amount > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-4"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-carbon-500 tracking-wide ml-1 uppercase italic">Monto a Registrar</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-carbon-400 font-bold">$</span>
            <input
              type="number"
              value={amount || ""}
              onChange={(e) => onAmountChange(Number(e.target.value))}
              className="w-full h-14 pl-8 pr-4 rounded-2xl border-2 border-sage-100 focus:border-carbon-900 focus:ring-0 text-xl font-black text-carbon-900 transition-all shadow-inner bg-sage-50/30"
              placeholder="0"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-carbon-500 tracking-wide ml-1 uppercase italic">Dinero Recibido</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-carbon-400 font-bold">$</span>
            <input
              type="number"
              autoFocus
              value={receivedAmount || ""}
              onChange={(e) => onReceivedChange(Number(e.target.value))}
              className={cn(
                "w-full h-14 pl-8 pr-4 rounded-2xl border-2 transition-all shadow-inner",
                receivedAmount > 0 
                  ? (hasReceivedEnough ? "border-success-500 bg-success-50/10" : "border-warning-400 bg-warning-50/10")
                  : "border-sage-100 bg-sage-50/30",
                "focus:border-carbon-900 focus:ring-0 text-xl font-black text-carbon-900"
              )}
              placeholder="0"
            />
          </div>
        </div>
      </div>

      {/* Visual Change Indicator */}
      {receivedAmount > 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn(
            "p-4 rounded-2xl border-2 flex items-center justify-between transition-all",
            hasReceivedEnough 
              ? "bg-carbon-900 border-carbon-900 text-white shadow-soft-lg" 
              : "bg-warning-50 border-warning-200 text-warning-700"
          )}
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center shadow-inner",
              hasReceivedEnough ? "bg-white/10" : "bg-warning-100"
            )}>
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <p className={cn(
                "text-[10px] font-black uppercase tracking-widest",
                hasReceivedEnough ? "text-carbon-400" : "text-warning-600"
              )}>
                {hasReceivedEnough ? "Cambio a devolver" : "Faltante"}
              </p>
              <p className="text-xl font-black">
                ${(hasReceivedEnough ? change : (amount - receivedAmount)).toLocaleString("es-CO")}
              </p>
            </div>
          </div>
          
          {hasReceivedEnough && (
            <div className="w-10 h-10 rounded-full bg-success-500 flex items-center justify-center shadow-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
