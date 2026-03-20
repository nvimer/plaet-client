import { BaseModal, Button } from "@/components";
import React, { useState } from "react";
import { useCashClosure } from "../hooks/useCashClosure";
import type { CashClosure } from "@/types";
import { 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Calculator, 
  AlertCircle, 
  CheckCircle2,
  Smartphone,
  Ticket,
  Bike
} from "lucide-react";
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
  const [totalDelivery, setTotalDelivery] = useState<string>("0");
  const { closeShift, isClosing, summary } = useCashClosure();

  const handleClose = () => {
    const amount = parseFloat(actualBalance);
    const deliveryAmount = parseFloat(totalDelivery) || 0;
    if (isNaN(amount)) return;
    
    closeShift({ 
      id: currentShift.id, 
      dto: { 
        actualBalance: amount,
        totalDelivery: deliveryAmount
      } 
    }, {
      onSuccess: () => onClose()
    });
  };

  const deliveryIncome = parseFloat(totalDelivery) || 0;
  const expected = (summary?.expectedBalance || 0) + deliveryIncome;
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
            <h4 className="text-[10px] font-bold text-carbon-400 tracking-wide flex items-center gap-2">
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

              {deliveryIncome > 0 && (
                <div className="flex justify-between items-center text-sm text-warning-400">
                  <div className="flex items-center gap-2">
                    <Bike className="w-4 h-4" />
                    <span>Extras Domicilio</span>
                  </div>
                  <span className="font-bold">+ ${deliveryIncome.toLocaleString("es-CO")}</span>
                </div>
              )}

              {/* Informational only fields */}
              <div className="pt-2 mt-2 border-t border-white/5 space-y-2">
                <div className="flex justify-between items-center text-[11px] text-carbon-400">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Nequi / Digital (Informativo)</span>
                  </div>
                  <span className="font-medium">${summary?.nequiSales.toLocaleString("es-CO")}</span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-carbon-400">
                  <div className="flex items-center gap-2">
                    <Ticket className="w-3.5 h-3.5" />
                    <span>Tiqueteras (Informativo)</span>
                  </div>
                  <span className="font-medium">${(summary?.totalVouchers || 0).toLocaleString("es-CO")}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-between items-end">
                <span className="text-xs font-medium tracking-wide text-carbon-400">Balance Esperado</span>
                <span className="text-2xl font-black text-white tracking-tight">
                  ${expected.toLocaleString("es-CO")}
                </span>
              </div>
            </div>
          </div>
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl" />
        </div>

        {/* Manual Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Physical Cash Input */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <label className="text-[10px] font-black text-carbon-500 uppercase tracking-widest">Efectivo en Caja</label>
            </div>
            
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-carbon-400 font-bold text-lg">$</span>
              <input
                type="number"
                value={actualBalance}
                onChange={(e) => setActualBalance(e.target.value)}
                placeholder="0"
                className="w-full h-14 pl-10 pr-4 rounded-2xl border-2 border-carbon-100 focus:border-carbon-900 focus:ring-0 text-2xl font-black text-carbon-900 transition-all"
                autoFocus
              />
            </div>
          </div>

          {/* Delivery Income Input */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <label className="text-[10px] font-black text-carbon-500 uppercase tracking-widest">Ingresos Domicilio</label>
            </div>
            
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-carbon-400 font-bold text-lg">$</span>
              <input
                type="number"
                value={totalDelivery}
                onChange={(e) => setTotalDelivery(e.target.value)}
                placeholder="0"
                className="w-full h-14 pl-10 pr-4 rounded-2xl border-2 border-carbon-100 focus:border-warning-500 focus:ring-0 text-2xl font-black text-carbon-900 transition-all bg-warning-50/20"
              />
            </div>
          </div>
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
