import React, { useState } from "react";
import { BaseModal } from "@/components/ui/BaseModal/BaseModal";
import { Button } from "@/components/ui/Button/Button";
import { useCashClosure } from "../hooks/useCashClosure";
import type { CashClosure } from "@/types";
import { DollarSign, ArrowDownCircle, ArrowUpCircle, Calculator, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/utils/cn";

interface CloseShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentShift: CashClosure;
}

/**
 * CLOSE SHIFT MODAL
 * Enhanced with detailed financial breakdown.
 */
export const CloseShiftModal: React.FC<CloseShiftModalProps> = ({ isOpen, onClose, currentShift }) => {
  const [actualBalance, setActualBalance] = useState<string>("");
  const { closeShift, isClosing, summary } = useCashClosure();

  const handleClose = () => {
    const amount = parseFloat(actualBalance);
    if (isNaN(amount)) return;
    
    closeShift({ 
      id: currentShift.id, 
      dto: { actualBalance: amount } 
    }, {
      onSuccess: () => onClose()
    });
  };

  const expected = summary?.expectedBalance || 0;
  const difference = actualBalance ? parseFloat(actualBalance) - expected : 0;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Cerrar Turno de Caja"
    >
      <div className="space-y-6">
        {/* Detailed Breakdown */}
        <div className="bg-carbon-900 text-white rounded-2xl p-5 shadow-xl relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <h4 className="text-[10px] font-bold text-carbon-400 uppercase tracking-widest flex items-center gap-2">
              <Calculator className="w-3.5 h-3.5" />
              Cálculo del Sistema
            </h4>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2 text-carbon-300">
                  <ArrowUpCircle className="w-4 h-4" />
                  <span>Base Apertura</span>
                </div>
                <span className="font-bold">${summary?.openingBalance.toLocaleString("es-CO")}</span>
              </div>
              
              <div className="flex justify-between items-center text-sm text-success-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Ventas Efectivo</span>
                </div>
                <span className="font-bold">+ ${summary?.cashSales.toLocaleString("es-CO")}</span>
              </div>

              <div className="flex justify-between items-center text-sm text-error-400">
                <div className="flex items-center gap-2">
                  <ArrowDownCircle className="w-4 h-4" />
                  <span>Gastos / Salidas</span>
                </div>
                <span className="font-bold">- ${summary?.totalExpenses.toLocaleString("es-CO")}</span>
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-between items-end">
                <span className="text-xs font-bold uppercase tracking-wider text-carbon-400">Balance Esperado</span>
                <span className="text-2xl font-black text-white tracking-tight">
                  ${expected.toLocaleString("es-CO")}
                </span>
              </div>
            </div>
          </div>
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl" />
        </div>

        {/* Physical Cash Input */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <label className="text-sm font-bold text-carbon-700">Efectivo Físico en Caja</label>
            {actualBalance && (
              <span className={cn(
                "text-[10px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1 animate-in zoom-in-95 duration-200",
                difference === 0 ? "bg-success-100 text-success-700" :
                difference > 0 ? "bg-info-100 text-info-700" : "bg-error-100 text-error-700"
              )}>
                {difference === 0 ? "Caja Cuadrada" : difference > 0 ? "Sobra Dinero" : "Falta Dinero"}
              </span>
            )}
          </div>
          
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-carbon-400 font-bold text-xl">$</span>
            <input
              type="number"
              value={actualBalance}
              onChange={(e) => setActualBalance(e.target.value)}
              placeholder="0"
              className="w-full h-16 pl-10 pr-4 rounded-2xl border-2 border-carbon-100 focus:border-carbon-900 focus:ring-0 text-3xl font-black text-carbon-900 transition-all"
              autoFocus
            />
          </div>

          {actualBalance && Math.abs(difference) > 0 && (
            <div className={cn(
              "flex items-center gap-2 p-3 rounded-xl border animate-in slide-in-from-top-2 duration-200",
              difference > 0 ? "bg-info-50 border-info-100 text-info-700" : "bg-error-50 border-error-100 text-error-700"
            )}>
              <AlertCircle className="w-4 h-4 shrink-0" />
              <p className="text-xs font-bold">
                Hay una diferencia de ${Math.abs(difference).toLocaleString("es-CO")}
              </p>
            </div>
          )}
        </div>
        
        <div className="flex gap-3 pt-2">
          <Button 
            variant="ghost" 
            fullWidth
            onClick={onClose} 
            disabled={isClosing}
            className="h-14 rounded-2xl font-bold text-carbon-400"
          >
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            fullWidth
            onClick={handleClose} 
            disabled={isClosing || !actualBalance}
            className="h-14 rounded-2xl font-black bg-carbon-900 hover:bg-carbon-800 text-white shadow-xl shadow-carbon-200"
          >
            {isClosing ? "Cerrando..." : "Confirmar Cierre"}
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};
