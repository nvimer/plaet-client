/**
 * QuickStockModal Component
 *
 * A tactile-friendly modal for rapid stock adjustments.
 * Optimized for touchscreen use with large buttons.
 */

import { useState } from "react";
import { 
  Package, 
  Plus, 
  Minus, 
  History, 
  Save, 
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { 
  BaseModal, 
  Button, 
  Input 
} from "@/components";
import { useAddStock, useRemoveStock, useStockHistory } from "../hooks";
import { toast } from "sonner";
import type { MenuItem } from "@/types";
import { cn } from "@/utils/cn";

interface QuickStockModalProps {
  item: MenuItem;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickStockModal({ item, isOpen, onClose }: QuickStockModalProps) {
  const [adjustment, setAdjustment] = useState<number>(0);
  const [reason, setReason] = useState<string>("");
  const [viewHistory, setViewHistory] = useState(false);

  const { mutateAsync: addStock, isPending: isAdding } = useAddStock();
  const { mutateAsync: removeStock, isPending: isRemoving } = useRemoveStock();
  const { data: history } = useStockHistory(item.id, { limit: 5 });

  const handleAdjust = (amount: number) => {
    setAdjustment(prev => prev + amount);
  };

  const handleSave = async () => {
    if (adjustment === 0) {
      toast.error("Sin cambios", { description: "Ingresa una cantidad para ajustar" });
      return;
    }

    try {
      if (adjustment > 0) {
        await addStock({
          id: item.id,
          stockData: { quantity: adjustment, reason: reason || "Ajuste rápido" }
        });
      } else {
        const removeQty = Math.abs(adjustment);
        if ((item.stockQuantity || 0) < removeQty) {
          toast.error("Stock insuficiente", { description: "No puedes remover más de lo que hay" });
          return;
        }
        await removeStock({
          id: item.id,
          stockData: { quantity: removeQty, reason: reason || "Ajuste rápido" }
        });
      }
      
      toast.success("Stock actualizado", { 
        description: `${adjustment > 0 ? 'Agregadas' : 'Removidas'} ${Math.abs(adjustment)} unidades` 
      });
      setAdjustment(0);
      setReason("");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar stock");
    }
  };

  const isPending = isAdding || isRemoving;
  const currentStock = item.stockQuantity || 0;
  const resultStock = currentStock + adjustment;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Stock: ${item.name}`}
      maxWidth="md"
    >
      <div className="space-y-6">
        {/* Status Header */}
        <div className="flex items-center justify-between p-4 bg-sage-50 rounded-2xl border border-sage-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-soft-sm">
              <Package className="w-6 h-6 text-sage-600" />
            </div>
            <div>
              <p className="text-xs text-carbon-500 font-bold uppercase tracking-wider">Stock Actual</p>
              <p className="text-2xl font-black text-carbon-900">{currentStock}</p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-xs text-carbon-400 font-bold uppercase tracking-wider">Resultado</p>
            <p className={cn(
              "text-2xl font-black",
              adjustment > 0 ? "text-emerald-600" : adjustment < 0 ? "text-rose-600" : "text-carbon-400"
            )}>
              {resultStock}
            </p>
          </div>
        </div>

        {/* Tactile Adjuster */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="ghost"
              className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 hover:bg-rose-100 p-0"
              onClick={() => handleAdjust(-10)}
            >
              <span className="text-lg font-black">-10</span>
            </Button>
            <Button
              variant="ghost"
              className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 hover:bg-rose-100 p-0"
              onClick={() => handleAdjust(-1)}
            >
              <Minus className="w-6 h-6" />
            </Button>
            
            <div className="w-24 text-center">
              <span className={cn(
                "text-4xl font-black",
                adjustment > 0 ? "text-emerald-600" : adjustment < 0 ? "text-rose-600" : "text-carbon-900"
              )}>
                {adjustment > 0 ? `+${adjustment}` : adjustment}
              </span>
            </div>

            <Button
              variant="ghost"
              className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 p-0"
              onClick={() => handleAdjust(1)}
            >
              <Plus className="w-6 h-6" />
            </Button>
            <Button
              variant="ghost"
              className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 p-0"
              onClick={() => handleAdjust(10)}
            >
              <span className="text-lg font-black">+10</span>
            </Button>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full text-carbon-400 hover:text-carbon-600"
            onClick={() => setAdjustment(0)}
          >
            Reiniciar ajuste
          </Button>
        </div>

        {/* Reason Input */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-carbon-500 uppercase px-1">Nota del ajuste</label>
          <Input
            placeholder="Ej: Reposición de inventario..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            fullWidth
          />
        </div>

        {/* Recent History Toggle */}
        <div className="pt-2">
          <button
            onClick={() => setViewHistory(!viewHistory)}
            className="flex items-center gap-2 text-sm font-semibold text-sage-600 hover:text-sage-700 transition-colors"
          >
            <History className="w-4 h-4" />
            {viewHistory ? "Ocultar historial" : "Ver últimos movimientos"}
          </button>
          
          {viewHistory && (
            <div className="mt-3 space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
              {history && history.length > 0 ? (
                history.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between p-2 rounded-lg bg-carbon-50 text-xs border border-carbon-100">
                    <div className="flex items-center gap-2">
                      {entry.type === 'ADD' ? 
                        <TrendingUp className="w-3 h-3 text-emerald-500" /> : 
                        <TrendingDown className="w-3 h-3 text-rose-500" />
                      }
                      <span className="font-bold text-carbon-700">{entry.quantity} ud.</span>
                      <span className="text-carbon-400 truncate max-w-[120px]">{entry.reason}</span>
                    </div>
                    <span className="text-carbon-400">
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-carbon-400 text-center py-4 italic">Sin movimientos recientes</p>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-carbon-100">
          <Button
            variant="ghost"
            fullWidth
            onClick={onClose}
            disabled={isPending}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            fullWidth
            onClick={handleSave}
            isLoading={isPending}
            disabled={adjustment === 0}
          >
            <Save className="w-4 h-4 mr-2" />
            Guardar Ajuste
          </Button>
        </div>
      </div>
    </BaseModal>
  );
}
