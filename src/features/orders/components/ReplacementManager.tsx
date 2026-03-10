import React from "react";
import { Card, Button } from "@/components";
import { ArrowRight, Trash2 } from "lucide-react";
import type { Replacement } from "./ReplacementManager";
import { useReplacementWizard } from "../utils/useReplacementWizard";
import { ReplacementModal } from "./ReplacementModal";
import { CATEGORY_NAMES, CATEGORY_ICONS, type ReplacementCategory } from "../utils/replacementConstants";

interface MenuOption {
  id: number;
  name: string;
}

interface ReplacementManagerProps {
  availableItems: {
    soup: MenuOption[];
    principle: MenuOption[];
    salad: MenuOption[];
    drink: MenuOption[];
    extra: MenuOption[];
    rice?: MenuOption[];
  };
  replacements: Replacement[];
  onAddReplacement: (replacement: Replacement) => void;
  onRemoveReplacement: (id: string) => void;
  disabled?: boolean;
}

export function ReplacementManager({
  availableItems,
  replacements,
  onAddReplacement,
  onRemoveReplacement,
  disabled = false,
}: ReplacementManagerProps) {
  const {
    replaceableCategories,
    availableTargets,
    targetItems,
    selectedFrom,
    selectedTo,
    selectedItem,
    currentStep,
    showAddModal,
    isCategoryReplaced,
    handleStartReplacement,
    handleCloseModal,
    handleSelectFrom,
    handleSelectTo,
    handleSelectItem,
    handleGoBack,
    handleConfirmReplacement,
  } = useReplacementWizard({
    availableItems,
    replacements,
    onAddReplacement,
  });

  if (disabled) {
    return (
      <Card className="p-4 bg-carbon-50 border-carbon-200 rounded-2xl">
        <p className="text-carbon-500 text-center font-medium">
          Configura el almuerzo primero
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-carbon-900 text-lg">Cambios personalizados</h3>
          <p className="text-sm text-carbon-500 mt-0.5">Gestión de reemplazos</p>
        </div>
        {replacements.length < replaceableCategories.length - 1 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleStartReplacement}
            className="flex items-center gap-2 min-h-[44px] rounded-xl border-sage-200 text-sage-700"
          >
            <span className="w-4 h-4">+</span>
            Nuevo Cambio
          </Button>
        )}
      </div>

      {replacements.length > 0 && (
        <div className="space-y-3">
          {replacements.map((replacement) => {
            const FromIcon = CATEGORY_ICONS[replacement.from as ReplacementCategory];
            return (
              <Card
                key={replacement.id}
                className="p-4 bg-white border-2 border-warning-100 rounded-2xl shadow-sm overflow-hidden relative group"
              >
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-warning-50 flex items-center justify-center text-warning-600">
                      <FromIcon className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 text-[10px] font-semibold tracking-wide text-warning-600">
                        <span>Sin {replacement.fromName}</span>
                        <ArrowRight className="w-3 h-3 opacity-50" />
                        <span>Extra {replacement.toName}</span>
                      </div>
                      <span className="font-black text-carbon-900 text-base">
                        {replacement.itemName}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveReplacement(replacement.id)}
                    className="p-2.5 bg-error-50 text-error-500 hover:bg-error-100 rounded-xl transition-all active:scale-90"
                    aria-label="Eliminar cambio"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="absolute top-0 left-0 w-1 h-full bg-warning-400" />
              </Card>
            );
          })}
        </div>
      )}

      {replacements.length === 0 && replaceableCategories.length > 0 && (
        <button
          onClick={handleStartReplacement}
          className="w-full p-6 bg-sage-50/50 rounded-2xl border-2 border-dashed border-sage-200 hover:border-sage-400 hover:bg-sage-50 transition-all text-left group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform text-sage-600">
              <span className="text-2xl">+</span>
            </div>
            <div>
              <p className="font-semibold text-carbon-800 text-lg">Agregar cambio</p>
              <p className="text-sm text-carbon-500 mt-0.5">Sin costo adicional en el menú</p>
            </div>
          </div>
        </button>
      )}

      <ReplacementModal
        showAddModal={showAddModal}
        currentStep={currentStep}
        replaceableCategories={replaceableCategories}
        availableTargets={availableTargets}
        targetItems={targetItems}
        selectedFrom={selectedFrom}
        selectedTo={selectedTo}
        selectedItem={selectedItem}
        isCategoryReplaced={isCategoryReplaced}
        onClose={handleCloseModal}
        onSelectFrom={handleSelectFrom}
        onSelectTo={handleSelectTo}
        onSelectItem={handleSelectItem}
        onGoBack={handleGoBack}
        onConfirm={handleConfirmReplacement}
        CATEGORY_NAMES={CATEGORY_NAMES}
        CATEGORY_ICONS={CATEGORY_ICONS}
      />
    </div>
  );
}

export default ReplacementManager;
