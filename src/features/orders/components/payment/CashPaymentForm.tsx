import { DollarSign } from "lucide-react";
import { motion } from "framer-motion";

interface CashPaymentFormProps {
  amount: number;
  onAmountChange: (val: number) => void;
}

export function CashPaymentForm({
  amount,
  onAmountChange,
}: CashPaymentFormProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-4"
    >
      <div className="space-y-2">
        <label className="text-[10px] font-black text-carbon-500 tracking-wide ml-1 uppercase">Monto en Efectivo</label>
        <div className="relative">
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-carbon-400 font-bold text-xl">$</span>
          <input
            type="number"
            autoFocus
            value={amount || ""}
            onChange={(e) => onAmountChange(Number(e.target.value))}
            className="w-full h-16 pl-10 pr-6 rounded-2xl border-2 border-sage-100 focus:border-carbon-900 focus:ring-0 text-2xl font-black text-carbon-900 transition-all shadow-inner bg-sage-50/30"
            placeholder="0"
          />
        </div>
      </div>
    </motion.div>
  );
}
