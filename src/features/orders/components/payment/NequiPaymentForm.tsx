import { Smartphone } from "lucide-react";
import { motion } from "framer-motion";

interface NequiPaymentFormProps {
  amount: number;
  reference: string;
  onAmountChange: (val: number) => void;
  onReferenceChange: (val: string) => void;
}

export function NequiPaymentForm({
  amount,
  reference,
  onAmountChange,
  onReferenceChange,
}: NequiPaymentFormProps) {
  return (
    <motion.div
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-carbon-500 tracking-wide ml-1 uppercase">Monto</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-carbon-400 font-bold text-lg">$</span>
            <input
              type="number"
              value={amount || ""}
              onChange={(e) => onAmountChange(Number(e.target.value))}
              className="w-full h-14 pl-9 pr-4 rounded-2xl border-2 border-sage-100 focus:border-info-600 focus:ring-0 text-xl font-bold text-carbon-900 shadow-inner bg-sage-50/30"
              placeholder="0"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-carbon-500 tracking-wide ml-1 uppercase">Referencia (Opcional)</label>
          <input
            type="text"
            value={reference}
            onChange={(e) => onReferenceChange(e.target.value)}
            className="w-full h-14 px-4 rounded-2xl border-2 border-sage-100 focus:border-info-600 focus:ring-0 text-lg font-bold text-carbon-900 shadow-inner bg-sage-50/30"
            placeholder="Ej: 123456"
          />
        </div>
      </div>
    </motion.div>
  );
}
