import { useState } from "react";
import { Card } from "@/components";
import { cn } from "@/utils/cn";
import { Plus, Minus, X, ArrowRightLeft, Soup, Leaf, Salad, CircleDot } from "lucide-react";

export type PlateComponent = "sopa" | "principio" | "ensalada" | "adicional";

export interface Substitution {
  from: PlateComponent;
  to: PlateComponent;
  quantity: number;
}

export interface AdditionalItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface PlateCustomizerProps {
  substitutions: Substitution[];
  additionals: AdditionalItem[];
  onAddSubstitution: (from: PlateComponent, to: PlateComponent) => void;
  onRemoveSubstitution: (index: number) => void;
  onAddAdditional: (item: Omit<AdditionalItem, "quantity">) => void;
  onUpdateAdditionalQuantity: (id: number, quantity: number) => void;
  onRemoveAdditional: (id: number) => void;
  availableComponents: Array<{
    id: number;
    name: string;
    type: PlateComponent;
    price: number;
  }>;
  className?: string;
}

const componentConfig: Record<PlateComponent, { label: string; icon: typeof Soup; color: string }> = {
  sopa: { label: "Sopa", icon: Soup, color: "bg-amber-50 border-amber-200 text-amber-700" },
  principio: { label: "Principio", icon: Leaf, color: "bg-emerald-50 border-emerald-200 text-emerald-700" },
  ensalada: { label: "Ensalada", icon: Salad, color: "bg-green-50 border-green-200 text-green-700" },
  adicional: { label: "Adicional", icon: CircleDot, color: "bg-sage-50 border-sage-200 text-sage-700" },
};

export function PlateCustomizer({
  substitutions,
  additionals,
  onAddSubstitution,
  onRemoveSubstitution,
  onAddAdditional,
  onUpdateAdditionalQuantity,
  onRemoveAdditional,
  availableComponents,
  className,
}: PlateCustomizerProps) {
  const [removingComponent, setRemovingComponent] = useState<PlateComponent | null>(null);

  const getComponentStatus = (component: PlateComponent) => {
    const subIndex = substitutions.findIndex((s) => s.from === component);
    const hasSubstitution = subIndex !== -1;
    const isRemoved = hasSubstitution;
    const isAdded = substitutions.some((s) => s.to === component);
    const additionalItems = additionals.filter((a) => 
      availableComponents.find((c) => c.id === a.id)?.type === component
    );
    
    return {
      isRemoved,
      isAdded,
      isSubstituted: hasSubstitution,
      substitution: hasSubstitution ? substitutions[subIndex] : null,
      subIndex,
      additionalItems,
    };
  };

  const handleRemoveClick = (component: PlateComponent) => {
    setRemovingComponent(component);
  };

  const handleSubstituteSelect = (to: PlateComponent) => {
    if (removingComponent) {
      onAddSubstitution(removingComponent, to);
      setRemovingComponent(null);
    }
  };

  const handleCancelRemove = () => {
    setRemovingComponent(null);
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className="bg-gradient-to-r from-sage-600 to-sage-500 px-4 py-3">
        <h3 className="text-white font-semibold text-base flex items-center gap-2">
          <ArrowRightLeft className="w-5 h-5" />
          Personalizar Plato
        </h3>
        <p className="text-sage-100 text-xs mt-0.5">
          Toca "−" para sustituir, "+" para agregar extras
        </p>
      </div>

      <div className="p-4 space-y-3">
        {/* Visual Plate Components */}
        {(Object.keys(componentConfig) as PlateComponent[]).map((component) => {
          const config = componentConfig[component];
          const Icon = config.icon;
          const status = getComponentStatus(component);

          return (
            <div
              key={component}
              className={cn(
                "relative rounded-xl border-2 p-3 transition-all",
                status.isRemoved
                  ? "bg-rose-50 border-rose-200 opacity-75"
                  : status.isAdded
                  ? "bg-emerald-50 border-emerald-400"
                  : "bg-white border-sage-200"
              )}
            >
              <div className="flex items-center justify-between">
                {/* Left: Icon and Label */}
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    config.color
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className={cn(
                      "font-semibold",
                      status.isRemoved ? "text-rose-700 line-through" : "text-carbon-900"
                    )}>
                      {config.label}
                    </p>
                    {status.isRemoved && status.substitution && (
                      <p className="text-xs text-emerald-600 font-medium">
                        → Sustituido por {componentConfig[status.substitution.to].label}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2">
                  {/* Remove/Undo button */}
                  {status.isRemoved ? (
                    <button
                      onClick={() => onRemoveSubstitution(status.subIndex!)}
                      className="p-2 rounded-lg bg-rose-100 text-rose-600 hover:bg-rose-200 transition-colors"
                      title="Deshacer sustitución"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleRemoveClick(component)}
                      className="p-2 rounded-lg bg-sage-100 text-sage-600 hover:bg-sage-200 transition-colors"
                      title="Quitar y sustituir"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  )}

                  {/* Add additional button */}
                  <button
                    onClick={() => {
                      const items = availableComponents.filter((c) => c.type === component && c.price > 0);
                      if (items.length > 0) {
                        onAddAdditional(items[0]);
                      }
                    }}
                    className="p-2 rounded-lg bg-sage-100 text-sage-600 hover:bg-sage-200 transition-colors"
                    title="Agregar extra"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Show additional items for this component */}
              {status.additionalItems.length > 0 && (
                <div className="mt-2 pt-2 border-t border-sage-200 space-y-1">
                  {status.additionalItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <span className="text-carbon-700">
                        + {item.name} (${item.price.toLocaleString("es-CO")})
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onUpdateAdditionalQuantity(item.id, item.quantity - 1)}
                          className="p-1 rounded bg-white text-carbon-600 hover:bg-sage-100"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateAdditionalQuantity(item.id, item.quantity + 1)}
                          className="p-1 rounded bg-white text-carbon-600 hover:bg-sage-100"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => onRemoveAdditional(item.id)}
                          className="p-1 rounded text-carbon-400 hover:text-rose-500 ml-1"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Substitution Selector Modal (inline) */}
        {removingComponent && (
          <div className="mt-4 p-4 bg-sage-50 rounded-xl border-2 border-sage-300">
            <p className="text-sm font-medium text-carbon-900 mb-3">
              ¿Por qué quieres sustituir {componentConfig[removingComponent].label.toLowerCase()}?
            </p>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(componentConfig) as PlateComponent[])
                .filter((comp) => comp !== removingComponent)
                .map((comp) => {
                  const config = componentConfig[comp];
                  const Icon = config.icon;
                  return (
                    <button
                      key={comp}
                      onClick={() => handleSubstituteSelect(comp)}
                      className="flex items-center gap-2 p-3 rounded-xl border-2 border-sage-200 bg-white hover:border-sage-500 hover:bg-sage-50 transition-all text-left"
                    >
                      <Icon className="w-4 h-4 text-sage-600" />
                      <span className="font-medium text-carbon-900">{config.label}</span>
                    </button>
                  );
                })}
            </div>
            <button
              onClick={handleCancelRemove}
              className="mt-3 w-full py-2 text-sm text-carbon-500 hover:text-carbon-700"
            >
              Cancelar
            </button>
          </div>
        )}

        {/* Quick Add Section */}
        <div className="pt-3 border-t border-sage-200">
          <p className="text-xs font-medium text-carbon-500 mb-2 uppercase tracking-wide">
            Agregar rápido
          </p>
          <div className="flex flex-wrap gap-2">
            {availableComponents
              .filter((c) => c.price > 0)
              .slice(0, 4)
              .map((component) => (
                <button
                  key={component.id}
                  onClick={() => onAddAdditional(component)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-sage-100 text-sage-700 hover:bg-sage-200 transition-colors text-sm"
                >
                  <Plus className="w-3 h-3" />
                  {component.name}
                  <span className="text-xs font-semibold">+${component.price.toLocaleString("es-CO")}</span>
                </button>
              ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
