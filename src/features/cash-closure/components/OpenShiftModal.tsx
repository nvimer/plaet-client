import React, { useState } from "react";
import { BaseModal } from "@/components/ui/BaseModal/BaseModal";
import { Button } from "@/components/ui/Button/Button";
import { Input } from "@/components/ui/Input/Input";
import { useCashClosure } from "../hooks/useCashClosure";

interface OpenShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * OPEN SHIFT MODAL
 * Tactile interface for entering the initial cash base.
 */
export const OpenShiftModal: React.FC<OpenShiftModalProps> = ({ isOpen, onClose }) => {
  const [openingBalance, setOpeningBalance] = useState<string>("");
  const { openShift, isOpening } = useCashClosure();

  const handleOpen = () => {
    const amount = parseFloat(openingBalance);
    if (isNaN(amount) || amount < 0) return;
    
    openShift({ openingBalance: amount }, {
      onSuccess: () => onClose()
    });
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Abrir Turno de Caja"
      description="Ingresa el monto base de apertura (efectivo inicial)."
    >
      <div className="space-y-6">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-carbon-400 font-bold text-xl">$</span>
          <Input
            type="number"
            value={openingBalance}
            onChange={(e) => setOpeningBalance(e.target.value)}
            placeholder="0.00"
            className="pl-8 text-2xl h-16"
            autoFocus
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" onClick={onClose} disabled={isOpening}>
            Cancelar
          </Button>
          <Button onClick={handleOpen} disabled={isOpening || !openingBalance}>
            {isOpening ? "Abriendo..." : "Confirmar Apertura"}
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};
