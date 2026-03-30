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
  Bike,
  DollarSign
} from "lucide-react";
import { cn } from "@/utils/cn";

interface CloseShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentShift: CashClosure;
}

/**
 * CLOSE SHIFT MODAL
 * Refactored to include split delivery income before final cash count.
 */
export const CloseShiftModal: React.FC<CloseShiftModalProps> = ({ isOpen, onClose, currentShift }) => {
  const [actualBalance, setActualBalance] = useState<string>("");
  const [deliveryCash, setDeliveryCash] = useState<string>("0");
  const [deliveryNequi, setDeliveryNequi] = useState<string>("0");
  const { closeShift, isClosing, summary } = useCashClosure();

  const handleClose = () => {
    const amount = parseFloat(actualBalance);
    const dCash = parseFloat(deliveryCash) || 0;
    const dNequi = parseFloat(deliveryNequi) || 0;
    
    if (isNaN(amount)) return;
    
    closeShift({ 
      id: currentShift.id, 
      dto: { 
        actualBalance: amount,
        totalDelivery: dCash + dNequi,
        deliveryCash: dCash,
        deliveryNequi: dNequi
      } 
    }, {
      onSuccess: () => onClose()
    });
  };

  const dCashIncome = parseFloat(deliveryCash) || 0;
  const dNequiIncome = parseFloat(deliveryNequi) || 0;
  
  // Final expected cash in drawer includes normal sales + cash from deliveries - expenses
  const expectedCashInDrawer = (summary?.expectedBalance || 0) + dCashIncome;
  
  const difference = actualBalance ? parseFloat(actualBalance) - expectedCashInDrawer : 0;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Cerrar Turno de Caja"
      className="max-w-2xl"
    >
      <div className="space-y-6">
        
        {/* 1. DELIVERY INCOME INPUTS (Must be filled first) */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <Bike className="w-4 h-4 text-warning-600" />
            <h3 className="text-[10px] font-black text-carbon-900 uppercase tracking-widest">Ingresos por Domicilio</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-carbon-400 uppercase ml-1">Efectivo Domicilios</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-carbon-400 font-bold">$</span>
                <input
                  type="number"
                  value={deliveryCash}
                  onChange={(e) => setDeliveryCash(e.target.value)}
                  className="w-full h-12 pl-8 pr-4 rounded-xl border-2 border-sage-100 focus:border-warning-500 focus:ring-0 font-bold text-carbon-900 bg-warning-50/10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-carbon-400 uppercase ml-1">Nequi Domicilios</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-carbon-400 font-bold">$</span>
                <input
                  type="number"
                  value={deliveryNequi}
                  onChange={(e) => setDeliveryNequi(e.target.value)}
                  className="w-full h-12 pl-8 pr-4 rounded-xl border-2 border-sage-100 focus:border-info-500 focus:ring-0 font-bold text-carbon-900 bg-info-50/10"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2. SYSTEM CALCULATION SUMMARY */}
        <div className="bg-carbon-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-bold text-carbon-400 tracking-widest flex items-center gap-2 uppercase">
                <Calculator className="w-3.5 h-3.5" />
                Resumen de Cierre
              </h4>
              {dNequiIncome > 0 && (
                <span className="text-[9px] bg-info-500/20 text-info-300 px-2 py-0.5 rounded-full font-bold">
                  + ${dNequiIncome.toLocaleString()} Nequi Dom.
                </span>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-carbon-400">Base + Ventas</span>
                <span className="font-bold">${((summary?.openingBalance || 0) + (summary?.cashSales || 0)).toLocaleString("es-CO")}</span>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-carbon-400">Gastos</span>
                <span className="font-bold text-error-400">- ${summary?.totalExpenses.toLocaleString("es-CO")}</span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-carbon-400">Efectivo Domicilios</span>
                <span className="font-bold text-success-400">+ ${dCashIncome.toLocaleString("es-CO")}</span>
              </div>

              <div className="flex justify-between items-center text-sm pt-2 border-t border-white/5 sm:border-none sm:pt-0">
                <span className="text-carbon-400 font-medium">Total Nequi</span>
                <span className="font-bold text-info-400">${((summary?.nequiSales || 0) + dNequiIncome).toLocaleString("es-CO")}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-between items-end">
              <div>
                <p className="text-[10px] font-bold text-carbon-400 uppercase tracking-widest mb-1">Efectivo esperado en caja</p>
                <span className="text-3xl font-black text-white tracking-tighter">
                  ${expectedCashInDrawer.toLocaleString("es-CO")}
                </span>
              </div>
              <div className="text-right pb-1">
                <p className="text-[9px] font-bold text-carbon-500 uppercase">Tiqueteras</p>
                <p className="text-xs font-bold text-carbon-300">${(summary?.totalVouchers || 0).toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl" />
        </div>

        {/* 3. PHYSICAL CASH INPUT */}
        <div className="space-y-3 p-6 bg-sage-50/30 rounded-[2rem] border-2 border-dashed border-sage-100">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-primary-600" />
              <label className="text-[10px] font-black text-carbon-900 uppercase tracking-widest">Conteo Físico de Efectivo</label>
            </div>
            <span className="text-[9px] text-carbon-400 font-bold uppercase italic">Dinero real en el cajón</span>
          </div>
          
          <div className="relative">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-carbon-400 font-black text-2xl">$</span>
            <input
              type="number"
              value={actualBalance}
              onChange={(e) => setActualBalance(e.target.value)}
              placeholder="0"
              className="w-full h-20 pl-12 pr-6 rounded-2xl border-2 border-carbon-900 focus:ring-0 text-4xl font-black text-carbon-900 transition-all shadow-inner bg-white"
              autoFocus
            />
          </div>
        </div>

        {actualBalance && Math.abs(difference) > 0 && (
          <div className={cn(
            "flex items-center gap-3 p-4 rounded-2xl border-2 animate-in slide-in-from-top-2 duration-200",
            difference > 0 ? "bg-info-50 border-info-200 text-info-700" : "bg-error-50 border-error-200 text-error-700"
          )}>
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
              difference > 0 ? "bg-info-500 text-white" : "bg-error-500 text-white"
            )}>
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-tight">Diferencia Detectada</p>
              <p className="text-lg font-black leading-none mt-1">
                ${Math.abs(difference).toLocaleString("es-CO")} {difference > 0 ? "Sobrante" : "Faltante"}
              </p>
            </div>
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
            className="h-14 rounded-2xl font-black bg-carbon-900 hover:bg-carbon-800 text-white shadow-xl shadow-carbon-100 disabled:bg-sage-200"
          >
            {isClosing ? "Procesando..." : "Confirmar y Cerrar Caja"}
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};
