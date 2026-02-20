import React, { useState } from "react";
import { BaseModal } from "@/components/ui/BaseModal/BaseModal";
import { Button } from "@/components/ui/Button/Button";
import { Input } from "@/components/ui/Input/Input";
import { useCashClosure } from "../hooks/useCashClosure";
import { CashClosure } from "@/types";

interface CloseShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentShift: CashClosure;
}

/**
 * CLOSE SHIFT MODAL
 * Tactile interface for shift closure summary and actual balance input.
 */
export const CloseShiftModal: React.FC<CloseShiftModalProps> = ({ isOpen, onClose, currentShift }) => {
  const [actualBalance, setActualBalance] = useState<string>("");
  const { closeShift, isClosing } = useCashClosure();

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

  const expected = currentShift.expectedBalance || 0;
  const difference = actualBalance ? parseFloat(actualBalance) - expected : 0;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Cerrar Turno de Caja"
      description="Confirma el balance final de caja para finalizar el turno."
    >
      <div className="space-y-6">
        <div className="p-4 bg-sage-50 rounded-xl space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-carbon-500">Monto Esperado:</span>
            <span className="text-carbon-900 font-bold">${expected.toLocaleString()}</span>
          </div>
          {actualBalance && (
            <div className="flex justify-between text-sm">
              <span className="text-carbon-500">Diferencia:</span>
              <span className={difference < 0 ? "text-error-600 font-bold" : "text-success-600 font-bold"}>
                ${difference.toLocaleString()}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-carbon-600">Efectivo Físico Actual</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-carbon-400 font-bold text-xl">$</span>
            <Input
              type="number"
              value={actualBalance}
              onChange={(e) => setActualBalance(e.target.value)}
              placeholder="0.00"
              className="pl-8 text-2xl h-16"
              autoFocus
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" onClick={onClose} disabled={isClosing}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleClose} disabled={isClosing || !actualBalance}>
            {isClosing ? "Cerrando..." : "Confirmar Cierre"}
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};
