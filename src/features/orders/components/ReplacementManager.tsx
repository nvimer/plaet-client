import React, { useState, useMemo } from "react";
import { Card, Button } from "@/components";
import { cn } from "@/utils/cn";
import { X, Plus, ArrowRight, ArrowLeft, Check, Soup, Salad, CupSoda, IceCream, Utensils, CircleOff, ArrowRightLeft, PackageCheck, Trash2, type LucideIcon } from "lucide-react";

interface MenuOption {
  id: number;
  name: string;
}

export interface Replacement {
  id: string;
  from: "soup" | "principle" | "salad" | "drink" | "extra";
  fromName: string;
  to: "soup" | "principle" | "salad" | "drink" | "extra" | "rice";
  toName: string;
  itemId: number;
  itemName: string;
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

const CATEGORY_NAMES: Record<string, string> = {
  soup: "Sopa",
  principle: "Principio",
  salad: "Ensalada",
  drink: "Bebida",
  extra: "Extra",
  rice: "Arroz",
};

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  soup: Soup,
  principle: Utensils,
  salad: Salad,
  drink: CupSoda,
  extra: IceCream,
  rice: PackageCheck,
};

const STEPS = [
  { id: "select", label: "Quitar" },
  { id: "replace", label: "Agregar" },
  { id: "item", label: "Elegir" },
];

export function ReplacementManager({
  availableItems,
  replacements,
  onAddReplacement,
  onRemoveReplacement,
  disabled = false,
}: ReplacementManagerProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedFrom, setSelectedFrom] = useState<string | null>(null);
  const [selectedTo, setSelectedTo] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  const replaceableCategories = useMemo(() => {
    const categories: Array<{
      key: string;
      name: string;
      icon: any;
      hasItems: boolean;
    }> = [
      {
        key: "soup",
        name: "Sopa",
        icon: CATEGORY_ICONS.soup,
        hasItems: availableItems.soup.length > 0,
      },
      {
        key: "principle",
        name: "Principio",
        icon: CATEGORY_ICONS.principle,
        hasItems: availableItems.principle.length > 0,
      },
      {
        key: "salad",
        name: "Ensalada",
        icon: CATEGORY_ICONS.salad,
        hasItems: availableItems.salad.length > 0,
      },
      {
        key: "drink",
        name: "Bebida",
        icon: CATEGORY_ICONS.drink,
        hasItems: availableItems.drink.length > 0,
      },
      {
        key: "extra",
        name: "Extra",
        icon: CATEGORY_ICONS.extra,
        hasItems: availableItems.extra.length > 0,
      },
    ];
    return categories.filter((c) => c.hasItems);
  }, [availableItems]);

  const availableTargets = useMemo(() => {
    if (!selectedFrom) return [];

    return replaceableCategories.filter(
      (cat) =>
        cat.key !== selectedFrom &&
        !replacements.some((r) => r.from === selectedFrom && r.to === cat.key),
    );
  }, [selectedFrom, replaceableCategories, replacements]);

  const targetItems = useMemo(() => {
    if (!selectedTo) return [];
    return (availableItems as Record<string, MenuOption[]>)[selectedTo] || [];
  }, [selectedTo, availableItems]);

  const handleStartReplacement = () => {
    setShowAddModal(true);
    setCurrentStep(0);
    setSelectedFrom(null);
    setSelectedTo(null);
    setSelectedItem(null);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setCurrentStep(0);
    setSelectedFrom(null);
    setSelectedTo(null);
    setSelectedItem(null);
  };

  const handleSelectFrom = (categoryKey: string) => {
    setSelectedFrom(categoryKey);
    setCurrentStep(1);
  };

  const handleSelectTo = (categoryKey: string) => {
    setSelectedTo(categoryKey);
    setCurrentStep(2);
  };

  const handleSelectItem = (itemId: number) => {
    setSelectedItem(itemId);
  };

  const handleGoBack = () => {
    if (currentStep === 2) {
      setSelectedItem(null);
      setCurrentStep(1);
    } else if (currentStep === 1) {
      setSelectedTo(null);
      setCurrentStep(0);
    }
  };

  const handleConfirmReplacement = () => {
    if (!selectedFrom || !selectedTo || !selectedItem) return;

    const fromName = CATEGORY_NAMES[selectedFrom];
    const toName = CATEGORY_NAMES[selectedTo];
    const item = targetItems.find((i) => i.id === selectedItem);

    if (!item) return;

    const newReplacement: Replacement = {
      id: Date.now().toString(),
      from: selectedFrom as Replacement["from"],
      fromName,
      to: selectedTo as Replacement["to"],
      toName,
      itemId: item.id,
      itemName: item.name,
    };

    onAddReplacement(newReplacement);
    handleCloseModal();
  };

  const isCategoryReplaced = (categoryKey: string) => {
    return replacements.some((r) => r.from === categoryKey);
  };

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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-black text-carbon-900 tracking-tight uppercase text-sm">Cambios Personalizados</h3>
          <p className="text-xs text-carbon-500 font-bold uppercase tracking-widest mt-0.5">Gestión de reemplazos</p>
        </div>
        {replacements.length < replaceableCategories.length - 1 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleStartReplacement}
            className="flex items-center gap-2 min-h-[44px] rounded-xl border-sage-200 text-sage-700"
          >
            <Plus className="w-4 h-4" />
            Nuevo Cambio
          </Button>
        )}
      </div>

      {/* Active Replacements */}
      {replacements.length > 0 && (
        <div className="space-y-3">
          {replacements.map((replacement) => {
            const FromIcon = CATEGORY_ICONS[replacement.from];
            return (
              <Card
                key={replacement.id}
                className="p-4 bg-white border-2 border-amber-100 rounded-2xl shadow-sm overflow-hidden relative group"
              >
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                      <FromIcon className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-amber-600">
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
                    className="p-2.5 bg-rose-50 text-rose-500 hover:bg-rose-100 rounded-xl transition-all active:scale-90"
                    aria-label="Eliminar cambio"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="absolute top-0 left-0 w-1 h-full bg-amber-400" />
              </Card>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {replacements.length === 0 && replaceableCategories.length > 0 && (
        <button
          onClick={handleStartReplacement}
          className="w-full p-6 bg-sage-50/50 rounded-2xl border-2 border-dashed border-sage-200 hover:border-sage-400 hover:bg-sage-50 transition-all text-left group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform text-sage-600">
              <Plus className="w-6 h-6" />
            </div>
            <div>
              <p className="font-black text-carbon-800 uppercase tracking-tight">Agregar cambio</p>
              <p className="text-xs text-carbon-500 font-medium mt-0.5 tracking-wide">Sin costo adicional en el menú</p>
            </div>
          </div>
        </button>
      )}

      {/* Professional Bottom Sheet Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-carbon-900/60 backdrop-blur-sm"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-w-lg w-full h-[85vh] sm:h-auto sm:max-h-[85vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header - Matching OrderSummaryModal */}
            <div className="bg-gradient-to-br from-carbon-900 to-carbon-800 px-6 py-5 sm:py-6 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shadow-inner">
                    <ArrowRightLeft className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-black text-lg sm:text-xl tracking-tight">
                      {currentStep === 0 && "¿Qué quitamos?"}
                      {currentStep === 1 && "¿Qué agregamos?"}
                      {currentStep === 2 && "Selecciona el item"}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex gap-1">
                        {[0, 1, 2].map((s) => (
                          <div key={s} className={cn("w-2 h-2 rounded-full transition-colors", s === currentStep ? "bg-amber-400" : "bg-white/20")} />
                        ))}
                      </div>
                      <span className="text-carbon-400 text-[10px] font-black uppercase tracking-widest">
                        Paso {currentStep + 1} de 3
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-2.5 bg-white/5 hover:bg-white/10 rounded-2xl text-carbon-400 hover:text-white transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-sage-50/30">
              {/* Step 1: Select what to replace */}
              {currentStep === 0 && (
                <div className="grid gap-3">
                  {replaceableCategories
                    .filter((cat) => !isCategoryReplaced(cat.key))
                    .map((cat) => {
                      const StepIcon = cat.icon;
                      return (
                        <button
                          key={cat.key}
                          onClick={() => handleSelectFrom(cat.key)}
                          className="flex items-center gap-4 p-5 rounded-2xl border-2 border-white bg-white hover:border-amber-400 hover:shadow-soft-md active:scale-[0.98] transition-all text-left shadow-sm group"
                        >
                          <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                            <StepIcon className="w-7 h-7" />
                          </div>
                          <div className="flex-1">
                            <span className="font-black text-carbon-900 text-lg block tracking-tight">
                              {cat.name}
                            </span>
                            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">
                              Quitar del almuerzo
                            </span>
                          </div>
                          <ArrowRight className="w-6 h-6 text-carbon-200 group-hover:text-amber-400 transition-colors" />
                        </button>
                      );
                    })}
                </div>
              )}

              {/* Step 2: Select what to replace with */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  {/* Current selection breadcrumb */}
                  <div className="flex items-center justify-between p-4 bg-white rounded-2xl border-2 border-amber-100 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 opacity-50">
                        {React.createElement(CATEGORY_ICONS[selectedFrom!], { className: "w-5 h-5" })}
                      </div>
                      <span className="text-carbon-400 font-black uppercase tracking-widest text-xs line-through">
                        {CATEGORY_NAMES[selectedFrom!]}
                      </span>
                    </div>
                    <button
                      onClick={handleGoBack}
                      className="flex items-center gap-2 text-xs font-black text-sage-600 hover:text-sage-700 bg-sage-50 px-3 py-2 rounded-lg transition-colors"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      VOLVER
                    </button>
                  </div>

                  {availableTargets.length > 0 ? (
                    <div className="grid gap-3">
                      {availableTargets.map((cat) => {
                        const StepIcon = cat.icon;
                        return (
                          <button
                            key={cat.key}
                            onClick={() => handleSelectTo(cat.key)}
                            className="flex items-center gap-4 p-5 rounded-2xl border-2 border-white bg-white hover:border-sage-400 hover:shadow-soft-md active:scale-[0.98] transition-all text-left shadow-sm group"
                          >
                            <div className="w-14 h-14 rounded-2xl bg-sage-50 flex items-center justify-center text-sage-600 group-hover:scale-110 transition-transform">
                              <StepIcon className="w-7 h-7" />
                            </div>
                            <div className="flex-1">
                              <span className="font-black text-carbon-900 text-lg block tracking-tight">
                                {cat.name}
                              </span>
                              <span className="text-xs font-bold text-sage-600 uppercase tracking-widest">
                                Agregar como extra
                              </span>
                            </div>
                            <ArrowRight className="w-6 h-6 text-carbon-200 group-hover:text-sage-400 transition-colors" />
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-10 bg-amber-50 rounded-3xl border-2 border-dashed border-amber-200 text-center">
                      <p className="text-amber-700 font-black uppercase tracking-widest text-sm">
                        No hay más opciones
                      </p>
                      <p className="text-amber-600/70 text-xs font-medium mt-2">
                        Todas las categorías disponibles ya están en uso para este cambio.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Select specific item */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  {/* Summary breadcrumb */}
                  <div className="flex items-center justify-between p-4 bg-white rounded-2xl border-2 border-sage-100 shadow-sm">
                    <div className="flex items-center gap-3">
                      <span className="text-carbon-400 font-black uppercase tracking-widest text-[10px] line-through">
                        {CATEGORY_NAMES[selectedFrom!]}
                      </span>
                      <ArrowRightLeft className="w-3.5 h-3.5 text-carbon-300" />
                      <span className="text-sage-600 font-black uppercase tracking-widest text-[10px]">
                        EXTRA {CATEGORY_NAMES[selectedTo!]}
                      </span>
                    </div>
                    <button
                      onClick={handleGoBack}
                      className="text-xs font-black text-sage-600"
                    >
                      CAMBIAR
                    </button>
                  </div>

                  <div className="grid gap-2">
                    {targetItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleSelectItem(item.id)}
                        className={cn(
                          "w-full p-5 rounded-2xl border-2 transition-all text-left min-h-[72px] flex items-center justify-between group",
                          selectedItem === item.id
                            ? "border-emerald-500 bg-emerald-50 shadow-md"
                            : "border-white bg-white hover:border-sage-200 shadow-sm",
                        )}
                      >
                        <span className={cn(
                          "font-black text-lg tracking-tight",
                          selectedItem === item.id ? "text-emerald-900" : "text-carbon-900"
                        )}>
                          {item.name}
                        </span>
                        {selectedItem === item.id && (
                          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg animate-in zoom-in-50">
                            <Check className="w-5 h-5 text-white stroke-[3px]" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer - Fixed Bottom */}
            <div className="p-6 bg-white border-t border-carbon-100">
              {currentStep === 2 && selectedItem ? (
                <Button
                  variant="primary"
                  fullWidth
                  onClick={handleConfirmReplacement}
                  className="rounded-2xl h-14 sm:h-16 bg-carbon-900 hover:bg-carbon-800 text-white font-black text-lg shadow-xl shadow-carbon-200"
                >
                  <Check className="w-6 h-6 mr-2 stroke-[3px]" />
                  Confirmar Cambio
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  fullWidth
                  onClick={handleCloseModal}
                  className="rounded-2xl h-14 font-bold text-carbon-400"
                >
                  Cancelar
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReplacementManager;
