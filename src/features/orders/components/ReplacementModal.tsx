import { Button } from "@/components";
import React from "react";
import { X, ArrowRight, ArrowLeft, Check, ArrowRightLeft } from "lucide-react";
import { cn } from "@/utils/cn";
import type { CategoryInfo, ReplacementCategory } from "../utils/replacementConstants";

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
      className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center bg-carbon-900/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-w-lg w-full h-[85vh] sm:h-auto sm:max-h-[80vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-br from-carbon-900 to-carbon-800 px-4 sm:px-6 py-3 sm:py-5 flex-shrink-0 rounded-t-3xl sm:rounded-t-none">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shadow-inner">
                <ArrowRightLeft className="w-5 h-5 text-warning-400" />
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
                  <span className="text-carbon-400 text-[10px] font-semibold tracking-wide uppercase">
                    Paso {currentStep + 1} de 3
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-carbon-400 hover:text-white transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 sm:p-5 bg-sage-50/30 scrollbar-hide">
          {currentStep === 0 && (
            <div className="grid gap-2">
              {replaceableCategories
                .filter((cat) => !isCategoryReplaced(cat.key))
                .map((cat) => {
                  const StepIcon = cat.icon;
                  return (
                    <button
                      key={cat.key}
                      onClick={() => onSelectFrom(cat.key)}
                      className="flex items-center gap-3 p-3.5 rounded-xl border-2 border-white bg-white hover:border-warning-400 hover:shadow-soft-md active:scale-[0.98] transition-all text-left shadow-sm group"
                    >
                      <div className="w-11 h-11 rounded-xl bg-warning-50 flex items-center justify-center text-warning-600 group-hover:scale-105 transition-transform">
                        <StepIcon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <span className="font-black text-carbon-900 text-base block tracking-tight leading-tight">
                          {cat.name}
                        </span>
                        <span className="text-[10px] font-bold text-warning-600 uppercase tracking-wide">
                          Quitar del almuerzo
                        </span>
                      </div>
                      <ArrowRight className="w-5 h-5 text-carbon-200 group-hover:text-warning-400 transition-colors" />
                    </button>
                  );
                })}
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-3 -mt-2">
              <div className="flex items-center justify-between p-3 bg-white rounded-xl border-2 border-warning-100 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-warning-50 flex items-center justify-center text-warning-600 opacity-50">
                    {CategoryIcon && React.createElement(CategoryIcon, { className: "w-4 h-4" })}
                  </div>
                  <span className="text-carbon-400 font-bold tracking-wide text-[10px] line-through uppercase">
                    {selectedFrom && CATEGORY_NAMES[selectedFrom as ReplacementCategory]}
                  </span>
                </div>
                <button
                  onClick={onGoBack}
                  className="flex items-center gap-1.5 text-[10px] font-black text-sage-600 hover:text-white hover:bg-sage-600 bg-sage-50 px-2.5 py-1.5 rounded-lg transition-all uppercase"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Volver
                </button>
              </div>

              {availableTargets.length > 0 ? (
                <div className="grid gap-2">
                  {availableTargets.map((cat) => {
                    const StepIcon = cat.icon;
                    return (
                      <button
                        key={cat.key}
                        onClick={() => onSelectTo(cat.key)}
                        className="flex items-center gap-3 p-3.5 rounded-xl border-2 border-white bg-white hover:border-sage-400 hover:shadow-soft-md active:scale-[0.98] transition-all text-left shadow-sm group"
                      >
                        <div className="w-11 h-11 rounded-xl bg-sage-50 flex items-center justify-center text-sage-600 group-hover:scale-105 transition-transform">
                          <StepIcon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <span className="font-black text-carbon-900 text-base block tracking-tight leading-tight">
                            {cat.name}
                          </span>
                          <span className="text-[10px] font-bold text-sage-600 uppercase tracking-wide">
                            Agregar como extra
                          </span>
                        </div>
                        <ArrowRight className="w-5 h-5 text-carbon-200 group-hover:text-sage-400 transition-colors" />
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 bg-warning-50 rounded-2xl border-2 border-dashed border-warning-200 text-center">
                  <p className="text-warning-700 font-bold tracking-wide text-sm">
                    No hay más opciones
                  </p>
                  <p className="text-warning-600/70 text-[10px] font-medium mt-1">
                    Todas las categorías disponibles ya están en uso.
                  </p>
                </div>
              )}
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white rounded-xl border-2 border-sage-100 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="text-carbon-400 font-bold tracking-wide text-[9px] line-through uppercase">
                    {selectedFrom && CATEGORY_NAMES[selectedFrom as ReplacementCategory]}
                  </span>
                  <ArrowRightLeft className="w-3 h-3 text-carbon-300" />
                  <span className="text-sage-600 font-black tracking-wide text-[9px] uppercase">
                    EXTRA {selectedTo && CATEGORY_NAMES[selectedTo as ReplacementCategory]}
                  </span>
                </div>
                <button
                  onClick={onGoBack}
                  className="text-[10px] font-black text-sage-600 bg-sage-50 px-2.5 py-1.5 rounded-lg uppercase"
                >
                  Cambiar
                </button>
              </div>

              <div className="grid gap-2">
                {targetItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onSelectItem(item.id)}
                    className={cn(
                      "w-full p-4 rounded-xl border-2 transition-all text-left min-h-[60px] flex items-center justify-between group",
                      selectedItem === item.id
                        ? "border-success-500 bg-success-50 shadow-md"
                        : "border-white bg-white hover:border-sage-200 shadow-sm",
                    )}
                  >
                    <span className={cn(
                      "font-bold text-base tracking-tight",
                      selectedItem === item.id ? "text-success-900" : "text-carbon-900"
                    )}>
                      {item.name}
                    </span>
                    {selectedItem === item.id && (
                      <div className="w-7 h-7 rounded-full bg-success-500 flex items-center justify-center shadow-lg animate-in zoom-in-50">
                        <Check className="w-4 h-4 text-white stroke-[3px]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-white border-t border-carbon-100">
          {currentStep === 2 && selectedItem ? (
            <Button
              variant="primary"
              fullWidth
              onClick={onConfirm}
              className="rounded-xl h-12 sm:h-14 bg-carbon-900 hover:bg-carbon-800 text-white font-black text-base shadow-lg shadow-carbon-200"
            >
              <Check className="w-5 h-5 mr-2 stroke-[3px]" />
              Confirmar Cambio
            </Button>
          ) : (
            <Button
              variant="ghost"
              fullWidth
              onClick={onClose}
              className="rounded-xl h-12 font-bold text-carbon-400"
            >
              Cancelar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
