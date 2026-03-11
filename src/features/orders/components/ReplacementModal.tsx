import { Button } from "@/components";
import React from "react";
import { X, ArrowRight, ArrowLeft, Check, ArrowRightLeft } from "lucide-react";
import { cn } from "@/utils/cn";
import type { CategoryInfo, ReplacementCategory } from "./replacementConstants";

interface ReplacementModalProps {
  showAddModal: boolean;
  currentStep: number;
  replaceableCategories: CategoryInfo[];
  availableTargets: CategoryInfo[];
  targetItems: { id: number; name: string }[];
  selectedFrom: string | null;
  selectedTo: string | null;
  selectedItem: number | null;
  isCategoryReplaced: (categoryKey: string) => boolean;
  onClose: () => void;
  onSelectFrom: (categoryKey: string) => void;
  onSelectTo: (categoryKey: string) => void;
  onSelectItem: (itemId: number) => void;
  onGoBack: () => void;
  onConfirm: () => void;
  CATEGORY_NAMES: Record<ReplacementCategory, string>;
  CATEGORY_ICONS: Record<ReplacementCategory, React.ComponentType<{ className?: string }>>;
}

export function ReplacementModal({
  showAddModal,
  currentStep,
  replaceableCategories,
  availableTargets,
  targetItems,
  selectedFrom,
  selectedTo,
  selectedItem,
  isCategoryReplaced,
  onClose,
  onSelectFrom,
  onSelectTo,
  onSelectItem,
  onGoBack,
  onConfirm,
  CATEGORY_NAMES,
  CATEGORY_ICONS,
}: ReplacementModalProps) {
  if (!showAddModal) return null;

  const CategoryIcon = (CATEGORY_ICONS as Record<string, React.ComponentType<{ className?: string }>>)[selectedFrom!];

  return (
    <div
      className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-carbon-900/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-w-lg w-full h-[85vh] sm:h-auto sm:max-h-[85vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-br from-carbon-900 to-carbon-800 px-6 py-5 sm:py-6 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shadow-inner">
                <ArrowRightLeft className="w-6 h-6 text-warning-400" />
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
                      <div key={s} className={cn("w-2 h-2 rounded-full transition-colors", s === currentStep ? "bg-warning-400" : "bg-white/20")} />
                    ))}
                  </div>
                  <span className="text-carbon-400 text-[10px] font-semibold tracking-wide">
                    Paso {currentStep + 1} de 3
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2.5 bg-white/5 hover:bg-white/10 rounded-2xl text-carbon-400 hover:text-white transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-sage-50/30">
          {currentStep === 0 && (
            <div className="grid gap-3">
              {replaceableCategories
                .filter((cat) => !isCategoryReplaced(cat.key))
                .map((cat) => {
                  const StepIcon = cat.icon;
                  return (
                    <button
                      key={cat.key}
                      onClick={() => onSelectFrom(cat.key)}
                      className="flex items-center gap-4 p-5 rounded-2xl border-2 border-white bg-white hover:border-warning-400 hover:shadow-soft-md active:scale-[0.98] transition-all text-left shadow-sm group"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-warning-50 flex items-center justify-center text-warning-600 group-hover:scale-110 transition-transform">
                        <StepIcon className="w-7 h-7" />
                      </div>
                      <div className="flex-1">
                        <span className="font-black text-carbon-900 text-lg block tracking-tight">
                          {cat.name}
                        </span>
                        <span className="text-xs font-bold text-warning-600 tracking-wide">
                          Quitar del almuerzo
                        </span>
                      </div>
                      <ArrowRight className="w-6 h-6 text-carbon-200 group-hover:text-warning-400 transition-colors" />
                    </button>
                  );
                })}
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white rounded-2xl border-2 border-warning-100 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-warning-50 flex items-center justify-center text-warning-600 opacity-50">
                    {CategoryIcon && React.createElement(CategoryIcon, { className: "w-5 h-5" })}
                  </div>
                  <span className="text-carbon-400 font-semibold tracking-wide text-xs line-through">
                    {selectedFrom && CATEGORY_NAMES[selectedFrom as ReplacementCategory]}
                  </span>
                </div>
                <button
                  onClick={onGoBack}
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
                        onClick={() => onSelectTo(cat.key)}
                        className="flex items-center gap-4 p-5 rounded-2xl border-2 border-white bg-white hover:border-sage-400 hover:shadow-soft-md active:scale-[0.98] transition-all text-left shadow-sm group"
                      >
                        <div className="w-14 h-14 rounded-2xl bg-sage-50 flex items-center justify-center text-sage-600 group-hover:scale-110 transition-transform">
                          <StepIcon className="w-7 h-7" />
                        </div>
                        <div className="flex-1">
                          <span className="font-black text-carbon-900 text-lg block tracking-tight">
                            {cat.name}
                          </span>
                          <span className="text-xs font-bold text-sage-600 tracking-wide">
                            Agregar como extra
                          </span>
                        </div>
                        <ArrowRight className="w-6 h-6 text-carbon-200 group-hover:text-sage-400 transition-colors" />
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="p-10 bg-warning-50 rounded-3xl border-2 border-dashed border-warning-200 text-center">
                  <p className="text-warning-700 font-semibold tracking-wide text-sm">
                    No hay más opciones
                  </p>
                  <p className="text-warning-600/70 text-xs font-medium mt-2">
                    Todas las categorías disponibles ya están en uso para este cambio.
                  </p>
                </div>
              )}
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white rounded-2xl border-2 border-sage-100 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="text-carbon-400 font-semibold tracking-wide text-[10px] line-through">
                    {selectedFrom && CATEGORY_NAMES[selectedFrom as ReplacementCategory]}
                  </span>
                  <ArrowRightLeft className="w-3.5 h-3.5 text-carbon-300" />
                  <span className="text-sage-600 font-semibold tracking-wide text-[10px]">
                    EXTRA {selectedTo && CATEGORY_NAMES[selectedTo as ReplacementCategory]}
                  </span>
                </div>
                <button
                  onClick={onGoBack}
                  className="text-xs font-black text-sage-600"
                >
                  CAMBIAR
                </button>
              </div>

              <div className="grid gap-2">
                {targetItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onSelectItem(item.id)}
                    className={cn(
                      "w-full p-5 rounded-2xl border-2 transition-all text-left min-h-[72px] flex items-center justify-between group",
                      selectedItem === item.id
                        ? "border-success-500 bg-success-50 shadow-md"
                        : "border-white bg-white hover:border-sage-200 shadow-sm",
                    )}
                  >
                    <span className={cn(
                      "font-black text-lg tracking-tight",
                      selectedItem === item.id ? "text-success-900" : "text-carbon-900"
                    )}>
                      {item.name}
                    </span>
                    {selectedItem === item.id && (
                      <div className="w-8 h-8 rounded-full bg-success-500 flex items-center justify-center shadow-lg animate-in zoom-in-50">
                        <Check className="w-5 h-5 text-white stroke-[3px]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-white border-t border-carbon-100">
          {currentStep === 2 && selectedItem ? (
            <Button
              variant="primary"
              fullWidth
              onClick={onConfirm}
              className="rounded-2xl h-14 sm:h-16 bg-carbon-900 hover:bg-carbon-800 text-white font-black text-lg shadow-xl shadow-carbon-200"
            >
              <Check className="w-6 h-6 mr-2 stroke-[3px]" />
              Confirmar Cambio
            </Button>
          ) : (
            <Button
              variant="ghost"
              fullWidth
              onClick={onClose}
              className="rounded-2xl h-14 font-bold text-carbon-400"
            >
              Cancelar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
