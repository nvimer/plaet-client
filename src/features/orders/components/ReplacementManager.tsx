import { useState, useMemo } from "react";
import { Card, Button } from "@/components";
import { cn } from "@/utils/cn";
import { X, Plus, ArrowRight, AlertCircle } from "lucide-react";

interface MenuOption {
  id: number;
  name: string;
}

export interface Replacement {
  id: string;
  from: 'soup' | 'principle' | 'salad' | 'drink' | 'extra';
  fromName: string;
  to: 'soup' | 'principle' | 'salad' | 'drink' | 'extra' | 'rice';
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

export function ReplacementManager({
  availableItems,
  replacements,
  onAddReplacement,
  onRemoveReplacement,
  disabled = false,
}: ReplacementManagerProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedFrom, setSelectedFrom] = useState<string | null>(null);
  const [selectedTo, setSelectedTo] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  // Calculate which categories can be replaced (have items configured)
  const replaceableCategories = useMemo(() => {
    const categories: Array<{ key: string; name: string; icon: string; hasItems: boolean }> = [
      { key: "soup", name: "Sopa", icon: CATEGORY_ICONS.soup, hasItems: availableItems.soup.length > 0 },
      { key: "principle", name: "Principio", icon: CATEGORY_ICONS.principle, hasItems: availableItems.principle.length > 0 },
      { key: "salad", name: "Ensalada", icon: CATEGORY_ICONS.salad, hasItems: availableItems.salad.length > 0 },
      { key: "drink", name: "Jugo", icon: CATEGORY_ICONS.drink, hasItems: availableItems.drink.length > 0 },
      { key: "extra", name: "Extra", icon: CATEGORY_ICONS.extra, hasItems: availableItems.extra.length > 0 },
    ];
    return categories.filter((c) => c.hasItems);
  }, [availableItems]);

  // Calculate which categories can receive replacements
  const availableTargets = useMemo(() => {
    if (!selectedFrom) return [];
    
    return replaceableCategories.filter(
      (cat) => cat.key !== selectedFrom && !replacements.some((r) => r.from === selectedFrom && r.to === cat.key)
    );
  }, [selectedFrom, replaceableCategories, replacements]);

  // Get items for selected target category
  const targetItems = useMemo(() => {
    if (!selectedTo) return [];
    return (availableItems as Record<string, MenuOption[]>)[selectedTo] || [];
  }, [selectedTo, availableItems]);

  const handleStartReplacement = () => {
    setShowAddModal(true);
    setSelectedFrom(null);
    setSelectedTo(null);
    setSelectedItem(null);
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
    setShowAddModal(false);
    setSelectedFrom(null);
    setSelectedTo(null);
    setSelectedItem(null);
  };

  // Check if a category has already been replaced
  const isCategoryReplaced = (categoryKey: string) => {
    return replacements.some((r) => r.from === categoryKey);
  };

  if (disabled) {
    return (
      <Card className="p-4 bg-carbon-50 border-carbon-200">
        <p className="text-carbon-500 text-center">Configura el almuerzo primero para ver reemplazos</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-carbon-900">Reemplazos Gratuitos</h3>
          <p className="text-sm text-carbon-500">¿No quieres algo? Cámbialo por otro elemento</p>
        </div>
        {replacements.length < replaceableCategories.length - 1 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleStartReplacement}
            className="flex items-center gap-2"
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
              className="p-3 bg-emerald-50 border-emerald-200 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{CATEGORY_ICONS[replacement.from]}</span>
                  <span className="text-carbon-500 line-through text-sm">{replacement.fromName}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-600" />
                <div className="flex items-center gap-2">
                  <span className="text-lg">{CATEGORY_ICONS[replacement.to]}</span>
                  <div>
                    <span className="font-semibold text-carbon-900">{replacement.itemName}</span>
                    <span className="text-xs text-emerald-600 block">+ {replacement.toName} extra</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => onRemoveReplacement(replacement.id)}
                className="p-2 text-carbon-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </Card>
          ))}
        </div>
      )}

      {/* Available replacements hint */}
      {replacements.length === 0 && replaceableCategories.length > 0 && (
        <div className="p-4 bg-sage-50 rounded-xl border border-dashed border-sage-300">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-sage-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-carbon-700">¿No te gusta algo del menú?</p>
              <p className="text-sm text-carbon-500 mt-1">
                Puedes reemplazar cualquier elemento por otro del mismo menú sin costo adicional.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {replaceableCategories.slice(0, 3).map((cat) => (
                  <span
                    key={cat.key}
                    className={cn(
                      "text-xs px-2 py-1 rounded-full",
                      isCategoryReplaced(cat.key)
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-white text-carbon-600 border border-sage-200"
                    )}
                  >
                    {cat.icon} {cat.name}
                  </span>
                ))}
                {replaceableCategories.length > 3 && (
                  <span className="text-xs px-2 py-1 rounded-full bg-white text-carbon-600 border border-sage-200">
                    +{replaceableCategories.length - 3} más
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Replacement Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-sage-200">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg text-carbon-900">Nuevo Reemplazo</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 text-carbon-400 hover:text-carbon-600 hover:bg-sage-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-carbon-500 mt-1">
                Selecciona qué no quieres y por qué lo quieres cambiar
              </p>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto max-h-[60vh]">
              {/* Step 1: Select what to replace */}
              {!selectedFrom && (
                <div className="space-y-3">
                  <p className="font-medium text-carbon-700">¿Qué no quieres?</p>
                  <div className="grid grid-cols-2 gap-2">
                    {replaceableCategories
                      .filter((cat) => !isCategoryReplaced(cat.key))
                      .map((cat) => (
                        <button
                          key={cat.key}
                          onClick={() => setSelectedFrom(cat.key)}
                          className="p-3 rounded-xl border-2 border-sage-200 bg-white hover:border-sage-400 hover:bg-sage-50 transition-all text-left"
                        >
                          <span className="text-2xl block mb-1">{cat.icon}</span>
                          <span className="font-medium text-carbon-900">{cat.name}</span>
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {/* Step 2: Select what to replace with */}
              {selectedFrom && !selectedTo && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-carbon-500">
                    <button
                      onClick={() => setSelectedFrom(null)}
                      className="text-sage-600 hover:underline"
                    >
                      ← Volver
                    </button>
                    <span>|</span>
                    <span>
                      No quiero: <strong>{CATEGORY_NAMES[selectedFrom]}</strong>
                    </span>
                  </div>
                  <p className="font-medium text-carbon-700">¿Por qué lo quieres cambiar?</p>
                  {availableTargets.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {availableTargets.map((cat) => (
                        <button
                          key={cat.key}
                          onClick={() => setSelectedTo(cat.key)}
                          className="p-3 rounded-xl border-2 border-sage-200 bg-white hover:border-sage-400 hover:bg-sage-50 transition-all text-left"
                        >
                          <span className="text-2xl block mb-1">{cat.icon}</span>
                          <span className="font-medium text-carbon-900">{cat.name}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                      <p className="text-amber-700 text-sm">
                        No hay más opciones disponibles para reemplazar.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Select specific item */}
              {selectedFrom && selectedTo && !selectedItem && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-carbon-500">
                    <button
                      onClick={() => setSelectedTo(null)}
                      className="text-sage-600 hover:underline"
                    >
                      ← Volver
                    </button>
                    <span>|</span>
                    <span>
                      No quiero: <strong>{CATEGORY_NAMES[selectedFrom]}</strong> → Quiero:{" "}
                      <strong>{CATEGORY_NAMES[selectedTo]}</strong>
                    </span>
                  </div>
                  <p className="font-medium text-carbon-700">Selecciona el {CATEGORY_NAMES[selectedTo]}:</p>
                  <div className="space-y-2">
                    {targetItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setSelectedItem(item.id)}
                        className="w-full p-4 rounded-xl border-2 border-sage-200 bg-white hover:border-sage-400 hover:bg-sage-50 transition-all text-left flex items-center justify-between"
                      >
                        <span className="font-semibold text-carbon-900">{item.name}</span>
                        <span className="text-sm text-sage-600">Opción {targetItems.indexOf(item) + 1}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Confirmation */}
              {selectedFrom && selectedTo && selectedItem && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-carbon-500">
                    <button
                      onClick={() => setSelectedItem(null)}
                      className="text-sage-600 hover:underline"
                    >
                      ← Volver
                    </button>
                  </div>
                  
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                    <p className="font-medium text-carbon-900 mb-3">Confirmar reemplazo:</p>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{CATEGORY_ICONS[selectedFrom]}</span>
                        <span className="text-carbon-500 line-through">{CATEGORY_NAMES[selectedFrom]}</span>
                      </div>
                      <ArrowRight className="w-5 h-5 text-emerald-600" />
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{CATEGORY_ICONS[selectedTo]}</span>
                        <span className="font-bold text-carbon-900">
                          {targetItems.find((i) => i.id === selectedItem)?.name}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    fullWidth
                    onClick={handleConfirmReplacement}
                    className="min-h-[48px]"
                  >
                    Confirmar Reemplazo
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

export default ReplacementManager;
