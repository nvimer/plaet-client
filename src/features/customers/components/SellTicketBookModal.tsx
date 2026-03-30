import { BaseModal, Button, Input, PriceInput } from "@/components";
import React, { useState } from "react";
import { useTicketBooks } from "../hooks/useTicketBooks";
import { Ticket, Calendar, Check, Calculator } from "lucide-react";

interface SellTicketBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerId: string;
  customerName: string;
}

export const SellTicketBookModal: React.FC<SellTicketBookModalProps> = ({
  isOpen,
  onClose,
  customerId,
  customerName,
}) => {
  const { sellTicketBook, isSelling } = useTicketBooks(customerId);
  const [totalPortions, setTotalPortions] = useState("30");
  const [purchasePrice, setPurchasePrice] = useState("250000");
  const [expiryDays, setExpiryDays] = useState("45");

  const handleSell = () => {
    const portions = parseInt(totalPortions);
    const price = parseFloat(purchasePrice);
    const days = parseInt(expiryDays);

    if (isNaN(portions) || isNaN(price) || isNaN(days)) return;

    sellTicketBook({
      customerId,
      totalPortions: portions,
      purchasePrice: price,
      expiryDays: days,
    }, {
      onSuccess: () => onClose()
    });
  };

  const unitPrice = parseFloat(purchasePrice) / (parseInt(totalPortions) || 1);

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Vender Tiquetera"
    >
      <div className="space-y-5 sm:space-y-6">
        <div className="bg-sage-50 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-sage-100 flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-white flex items-center justify-center text-sage-600 shadow-sm">
            <Ticket className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-sage-600 uppercase tracking-widest">Cliente</p>
            <p className="text-base sm:text-lg font-bold text-carbon-900 leading-tight">{customerName}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <Input
            label="Número de Almuerzos"
            type="number"
            value={totalPortions}
            onChange={(e) => setTotalPortions(e.target.value)}
            placeholder="30"
            required
          />
          <Input
            label="Días de Vigencia"
            type="number"
            value={expiryDays}
            onChange={(e) => setExpiryDays(e.target.value)}
            placeholder="45"
            required
          />
        </div>

        <PriceInput
          label="Precio de Venta Total"
          value={purchasePrice}
          onChange={setPurchasePrice}
          required
        />

        <div className="bg-carbon-900 text-white p-4 sm:p-5 rounded-xl sm:rounded-2xl shadow-lg space-y-3">
          <div className="flex items-center gap-2 text-carbon-400">
            <Calculator className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wide">Resumen Financiero</span>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] text-carbon-400 font-medium">Precio por Almuerzo</p>
              <p className="text-lg sm:text-xl font-black">${unitPrice.toLocaleString("es-CO")}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-carbon-400 font-medium">Vence en</p>
              <div className="flex items-center gap-1.5 text-sm font-bold">
                <Calendar className="w-4 h-4 text-warning-400" />
                <span>{expiryDays} días</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 sm:gap-3 pt-2">
          <Button
            variant="ghost"
            fullWidth
            onClick={onClose}
            disabled={isSelling}
            className="h-11 sm:h-14 rounded-xl sm:rounded-2xl font-bold text-carbon-400"
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            fullWidth
            onClick={handleSell}
            disabled={isSelling || !totalPortions || !purchasePrice}
            className="h-11 sm:h-14 rounded-xl sm:rounded-2xl font-black bg-carbon-900 hover:bg-carbon-800 text-white shadow-xl shadow-carbon-200"
          >
            <span className="text-xs sm:text-sm">{isSelling ? "Registrando..." : "Confirmar"}</span>
            <Check className="w-4 h-4 sm:w-5 sm:h-5 ml-1.5 sm:ml-2" />
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};
