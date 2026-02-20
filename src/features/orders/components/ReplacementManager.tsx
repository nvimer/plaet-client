import { useState, useMemo } from "react";
import { Card, Button } from "@/components";
import { cn } from "@/utils/cn";
import { X, Plus, ArrowRight, ArrowLeft, Check } from "lucide-react";

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
  drink: "Jugo",
  extra: "Extra",
  rice: "Arroz",
};

const CATEGORY_ICONS: Record<string, string> = {
  soup: "🍲",
  principle: "🥔",
  salad: "🥗",
  drink: "🥤",
  extra: "🍌",
  rice: "🍚",
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
      icon: string;
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
        name: "Jugo",
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
      <Card className="p-4 bg-carbon-50 border-carbon-200">
        <p className="text-carbon-500 text-center">
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
          <h3 className="font-bold text-carbon-900">Cambios</h3>
          <p className="text-sm text-carbon-500">¿No quieres algo? Cámbialo</p>
        </div>
        {replacements.length < replaceableCategories.length - 1 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleStartReplacement}
            className="flex items-center gap-2 min-h-[44px]"
          >
            <Plus className="w-4 h-4" />
            Agregar
          </Button>
        )}
      </div>

      {/* Active Replacements */}
      {replacements.length > 0 && (
        <div className="space-y-2">
          {replacements.map((replacement) => (
            <Card
              key={replacement.id}
              className="p-3 bg-emerald-50 border-emerald-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-xl">
                    {CATEGORY_ICONS[replacement.from]}
                  </span>
                  <ArrowRight className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="font-semibold text-carbon-900 text-sm block truncate">
                      {replacement.itemName}
                    </span>
                    <span className="text-xs text-emerald-600 block">
                      Extra {replacement.toName}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onRemoveReplacement(replacement.id)}
                  className="p-3 text-carbon-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors flex-shrink-0 ml-2"
                  aria-label="Eliminar cambio"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Empty state */}
      {replacements.length === 0 && replaceableCategories.length > 0 && (
        <button
          onClick={handleStartReplacement}
          className="w-full p-4 bg-sage-50 rounded-xl border-2 border-dashed border-sage-300 hover:border-sage-400 hover:bg-sage-100 transition-all text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
              <Plus className="w-6 h-6 text-sage-600" />
            </div>
            <div>
              <p className="font-medium text-carbon-800">Agregar cambio</p>
              <p className="text-sm text-carbon-500">Sin costo adicional</p>
            </div>
          </div>
        </button>
      )}

      {/* Bottom Sheet Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          onClick={handleCloseModal}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          {/* Sheet */}
          <div
            className="relative w-full sm:w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[85vh] flex flex-col animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-12 h-1.5 bg-carbon-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="px-4 pb-4 border-b border-carbon-100">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg text-carbon-900">
                  {currentStep === 0 && "¿Qué quitamos?"}
                  {currentStep === 1 && "¿Qué agregamos?"}
                  {currentStep === 2 && "Elige el item"}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="p-2 text-carbon-400 hover:text-carbon-600 hover:bg-carbon-100 rounded-xl"
                  aria-label="Cerrar"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Progress steps */}
              <div className="flex items-center gap-2 mt-4">
                {STEPS.map((step, index) => (
                  <div key={step.id} className="flex items-center gap-2 flex-1">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors",
                        index < currentStep
                          ? "bg-emerald-500 text-white"
                          : index === currentStep
                            ? "bg-sage-600 text-white"
                            : "bg-carbon-100 text-carbon-400",
                      )}
                    >
                      {index < currentStep ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    {index < STEPS.length - 1 && (
                      <div
                        className={cn(
                          "flex-1 h-1 rounded-full transition-colors",
                          index < currentStep
                            ? "bg-emerald-500"
                            : "bg-carbon-200",
                        )}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {/* Step 1: Select what to replace */}
              {currentStep === 0 && (
                <div className="space-y-3">
                  <div className="grid gap-3">
                    {replaceableCategories
                      .filter((cat) => !isCategoryReplaced(cat.key))
                      .map((cat) => (
                        <button
                          key={cat.key}
                          onClick={() => handleSelectFrom(cat.key)}
                          className="flex items-center gap-4 p-4 rounded-2xl border-2 border-carbon-200 bg-white hover:border-sage-400 hover:bg-sage-50 active:scale-[0.98] transition-all text-left min-h-[72px]"
                        >
                          <span className="text-3xl">{cat.icon}</span>
                          <div className="flex-1">
                            <span className="font-semibold text-carbon-900 text-lg block">
                              {cat.name}
                            </span>
                            <span className="text-sm text-carbon-500">
                              Quitar del menú
                            </span>
                          </div>
                          <ArrowRight className="w-6 h-6 text-carbon-300" />
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {/* Step 2: Select what to replace with */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  {/* Current selection */}
                  <div className="flex items-center gap-2 p-3 bg-carbon-50 rounded-xl">
                    <button
                      onClick={handleGoBack}
                      className="p-2 text-sage-600 hover:bg-sage-100 rounded-lg"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">
                        {CATEGORY_ICONS[selectedFrom!]}
                      </span>
                      <span className="text-carbon-400 line-through">
                        {CATEGORY_NAMES[selectedFrom!]}
                      </span>
                    </div>
                  </div>

                  {availableTargets.length > 0 ? (
                    <div className="grid gap-3">
                      {availableTargets.map((cat) => (
                        <button
                          key={cat.key}
                          onClick={() => handleSelectTo(cat.key)}
                          className="flex items-center gap-4 p-4 rounded-2xl border-2 border-carbon-200 bg-white hover:border-sage-400 hover:bg-sage-50 active:scale-[0.98] transition-all text-left min-h-[72px]"
                        >
                          <span className="text-3xl">{cat.icon}</span>
                          <div className="flex-1">
                            <span className="font-semibold text-carbon-900 text-lg block">
                              {cat.name}
                            </span>
                            <span className="text-sm text-carbon-500">
                              Agregar extra
                            </span>
                          </div>
                          <ArrowRight className="w-6 h-6 text-carbon-300" />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 bg-amber-50 rounded-2xl border-2 border-amber-200 text-center">
                      <p className="text-amber-700 font-medium">
                        No hay más opciones
                      </p>
                      <p className="text-amber-600 text-sm mt-1">
                        Todas las categorías están en uso
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Select specific item */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  {/* Current selections */}
                  <div className="flex items-center gap-2 p-3 bg-carbon-50 rounded-xl">
                    <button
                      onClick={handleGoBack}
                      className="p-2 text-sage-600 hover:bg-sage-100 rounded-lg"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">
                        {CATEGORY_ICONS[selectedFrom!]}
                      </span>
                      <ArrowRight className="w-4 h-4 text-carbon-400" />
                      <span className="text-xl">
                        {CATEGORY_ICONS[selectedTo!]}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {targetItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleSelectItem(item.id)}
                        className={cn(
                          "w-full p-4 rounded-2xl border-2 transition-all text-left min-h-[72px] flex items-center justify-between",
                          selectedItem === item.id
                            ? "border-emerald-500 bg-emerald-50"
                            : "border-carbon-200 bg-white hover:border-sage-400 hover:bg-sage-50 active:scale-[0.98]",
                        )}
                      >
                        <span className="font-semibold text-carbon-900 text-lg">
                          {item.name}
                        </span>
                        {selectedItem === item.id && (
                          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                            <Check className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Confirm button */}
                  {selectedItem && (
                    <div className="pt-4">
                      <Button
                        variant="primary"
                        fullWidth
                        onClick={handleConfirmReplacement}
                        className="min-h-[56px] text-lg"
                      >
                        <Check className="w-5 h-5 mr-2" />
                        Confirmar Cambio
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReplacementManager;
