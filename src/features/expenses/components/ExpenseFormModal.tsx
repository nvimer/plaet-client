import React, { useState } from "react";
import { BaseModal } from "@/components/ui/BaseModal/BaseModal";
import { Button } from "@/components/ui/Button/Button";
import { Input } from "@/components/ui/Input/Input";
import { useExpenses } from "../hooks/useExpenses";

interface ExpenseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * EXPENSE FORM MODAL
 * Simplified form to record a new business expense.
 */
export const ExpenseFormModal: React.FC<ExpenseFormModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    category: "Otros",
  });
  const { createExpense, isCreating } = useExpenses();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0 || !formData.description) return;
    
    createExpense({
      amount,
      description: formData.description,
      category: formData.category,
    }, {
      onSuccess: () => {
        setFormData({ amount: "", description: "", category: "Otros" });
        onClose();
      }
    });
  };

  const categories = ["Insumos", "Servicios", "Nómina", "Mantenimiento", "Otros"];

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Registrar Gasto"
      description="Ingresa los detalles del egreso de dinero."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-carbon-600">Monto</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-carbon-400 font-bold text-xl">$</span>
            <Input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              placeholder="0.00"
              className="pl-8 text-xl h-14"
              autoFocus
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-carbon-600">Descripción</label>
          <Input
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Ej: Compra de verduras, Pago de luz..."
            className="h-14"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-carbon-600">Categoría</label>
          <div className="grid grid-cols-3 gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, category: cat }))}
                className={`py-2 px-3 rounded-xl text-sm font-medium border transition-all ${
                  formData.category === cat
                    ? "bg-primary-50 border-primary-200 text-primary-700 shadow-sm ring-1 ring-primary-100"
                    : "bg-white border-sage-100 text-carbon-500 hover:border-sage-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-4">
          <Button variant="outline" type="button" onClick={onClose} disabled={isCreating}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isCreating || !formData.amount || !formData.description}>
            {isCreating ? "Registrando..." : "Guardar Gasto"}
          </Button>
        </div>
      </form>
    </BaseModal>
  );
};
