import { useState } from "react";
import { Card } from "@/components";
import { cn } from "@/utils/cn";
import { Plus, Minus, X, ArrowRightLeft, Soup, Leaf, Salad, CircleDot, RefreshCcw, ChevronRight } from "lucide-react";

export type PlateComponent = "soup" | "principle" | "salad" | "additional";

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

const componentConfig: Record<PlateComponent, { label: string; icon: typeof Soup; color: string; bgColor: string }> = {
  soup: { 
    label: "Soup", 
    icon: Soup, 
    color: "text-amber-700",
    bgColor: "bg-amber-50 border-amber-200"
  },
  principle: { 
    label: "Principle", 
    icon: Leaf, 
    color: "text-emerald-700",
    bgColor: "bg-emerald-50 border-emerald-200"
  },
  salad: { 
    label: "Salad", 
    icon: Salad, 
    color: "text-green-700",
    bgColor: "bg-green-50 border-green-200"
  },
  additional: { 
    label: "Additional", 
    icon: CircleDot, 
    color: "text-slate-700",
    bgColor: "bg-slate-50 border-slate-200"
  },
};

const statusStyles = {
  removed: {
    container: "bg-rose-50 border-rose-300",
    label: "text-rose-700 line-through",
    badge: "bg-rose-100 text-rose-700",
  },
  added: {
    container: "bg-emerald-50 border-emerald-400 shadow-sm",
    label: "text-emerald-800",
    badge: "bg-emerald-100 text-emerald-700",
  },
  default: {
    container: "bg-white border-sage-200 hover:border-sage-300",
    label: "text-slate-900",
    badge: "bg-sage-100 text-sage-700",
  },
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
  const [activeSubstitution, setActiveSubstitution] = useState<PlateComponent | null>(null);

  const getComponentStatus = (component: PlateComponent) => {
    const subIndex = substitutions.findIndex((s) => s.from === component);
    const hasSubstitution = subIndex !== -1;
    const isAdded = substitutions.some((s) => s.to === component);
    const additionalItems = additionals.filter((a) => 
      availableComponents.find((c) => c.id === a.id)?.type === component
    );
    
    return {
      isRemoved: hasSubstitution,
      isAdded,
      substitution: hasSubstitution ? substitutions[subIndex] : null,
      subIndex,
      additionalItems,
    };
  };

  const handleRemoveClick = (component: PlateComponent) => {
    setActiveSubstitution(component);
  };

  const handleSubstituteSelect = (to: PlateComponent) => {
    if (activeSubstitution) {
      onAddSubstitution(activeSubstitution, to);
      setActiveSubstitution(null);
    }
  };

  const handleCancelSubstitution = () => {
    setActiveSubstitution(null);
  };

  const formatPrice = (price: number) => `$${price.toLocaleString("en-US")}`;

  return (
    <Card className={cn("overflow-hidden shadow-lg", className)}>
      <div className="bg-gradient-to-r from-sage-600 to-sage-500 px-5 py-4">
        <h3 className="text-white font-semibold text-lg flex items-center gap-2">
          <ArrowRightLeft className="w-5 h-5" aria-hidden="true" />
          Customize Plate
        </h3>
        <p className="text-sage-100 text-sm mt-1">
          Tap "−" to substitute, "+" to add extras
        </p>
      </div>

      <div className="p-5 space-y-4">
        {/* Visual Plate Components */}
        {(Object.keys(componentConfig) as PlateComponent[]).map((component) => {
          const config = componentConfig[component];
          const Icon = config.icon;
          const status = getComponentStatus(component);
          const style = status.isRemoved 
            ? statusStyles.removed 
            : status.isAdded 
            ? statusStyles.added 
            : statusStyles.default;

          return (
            <div
              key={component}
              className={cn(
                "relative rounded-xl border-2 p-4 transition-all duration-300 ease-out",
                style.container,
                !status.isRemoved && "hover:shadow-md"
              )}
              role="group"
              aria-label={`${config.label} section`}
            >
              <div className="flex items-center justify-between">
                {/* Left: Icon and Label */}
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-300",
                    config.bgColor,
                    (status.isAdded || status.isRemoved) && "scale-105"
                  )}>
                    <Icon className={cn("w-5 h-5", config.color)} aria-hidden="true" />
                  </div>
                  <div className="flex flex-col">
                    <span className={cn(
                      "font-semibold text-base transition-all duration-300",
                      style.label
                    )}>
                      {config.label}
                    </span>
                    {status.isRemoved && status.substitution && (
                      <span className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-0.5 animate-in fade-in slide-in-from-left-2 duration-300">
                        <RefreshCcw className="w-3 h-3" aria-hidden="true" />
                        Swapped for {componentConfig[status.substitution.to].label}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2">
                  {/* Remove/Undo button */}
                  {status.isRemoved ? (
                    <button
                      onClick={() => onRemoveSubstitution(status.subIndex!)}
                      className="p-2.5 rounded-xl bg-rose-100 text-rose-600 hover:bg-rose-200 active:scale-95 transition-all duration-200"
                      aria-label={`Undo ${config.label} substitution`}
                      title="Undo substitution"
                    >
                      <X className="w-4 h-4" aria-hidden="true" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleRemoveClick(component)}
                      className="p-2.5 rounded-xl bg-sage-100 text-sage-600 hover:bg-sage-200 active:scale-95 transition-all duration-200"
                      aria-label={`Substitute ${config.label}`}
                      title="Substitute"
                    >
                      <Minus className="w-4 h-4" aria-hidden="true" />
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
                    className="p-2.5 rounded-xl bg-sage-100 text-sage-600 hover:bg-sage-200 active:scale-95 transition-all duration-200"
                    aria-label={`Add extra ${config.label}`}
                    title="Add extra"
                  >
                    <Plus className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>

              {/* Additional items for this component */}
              {status.additionalItems.length > 0 && (
                <div className="mt-3 pt-3 border-t border-sage-200/60 space-y-2">
                  {status.additionalItems.map((item, idx) => (
                    <div 
                      key={item.id} 
                      className="flex items-center justify-between text-sm animate-in fade-in slide-in-from-top-1 duration-300"
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <span className="text-slate-700 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-sage-400" aria-hidden="true" />
                        {item.name}
                        <span className="text-sage-600 font-medium">
                          {formatPrice(item.price)}
                        </span>
                      </span>
                      <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm">
                        <button
                          onClick={() => onUpdateAdditionalQuantity(item.id, Math.max(0, item.quantity - 1))}
                          className="p-1.5 rounded-md hover:bg-sage-100 text-slate-600 active:scale-95 transition-all"
                          aria-label={`Decrease ${item.name} quantity`}
                        >
                          <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                        <span className="w-6 text-center font-semibold text-slate-800" aria-live="polite">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateAdditionalQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 rounded-md hover:bg-sage-100 text-slate-600 active:scale-95 transition-all"
                          aria-label={`Increase ${item.name} quantity`}
                        >
                          <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                        <button
                          onClick={() => onRemoveAdditional(item.id)}
                          className="p-1.5 rounded-md text-slate-400 hover:text-rose-500 hover:bg-rose-50 ml-1 transition-colors"
                          aria-label={`Remove ${item.name}`}
                        >
                          <X className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Substitution Selector */}
        {activeSubstitution && (
          <div 
            className="mt-4 p-5 bg-sage-50 rounded-xl border-2 border-sage-300 animate-in fade-in zoom-in-95 duration-300"
            role="dialog"
            aria-label="Select substitution"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-slate-900">
                Replace {componentConfig[activeSubstitution].label} with:
              </p>
              <button
                onClick={handleCancelSubstitution}
                className="p-1.5 rounded-lg hover:bg-sage-200 text-slate-500 transition-colors"
                aria-label="Cancel substitution"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {(Object.keys(componentConfig) as PlateComponent[])
                .filter((comp) => comp !== activeSubstitution)
                .map((comp) => {
                  const config = componentConfig[comp];
                  const Icon = config.icon;
                  return (
                    <button
                      key={comp}
                      onClick={() => handleSubstituteSelect(comp)}
                      className="group flex items-center justify-between p-3.5 rounded-xl border-2 border-sage-200 bg-white hover:border-sage-500 hover:bg-sage-50 active:scale-[0.98] transition-all duration-200 text-left"
                      aria-label={`Substitute with ${config.label}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-sage-600 group-hover:text-sage-700" aria-hidden="true" />
                        <span className="font-medium text-slate-900">{config.label}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-sage-500 group-hover:translate-x-0.5 transition-all" aria-hidden="true" />
                    </button>
                  );
                })}
            </div>
            <button
              onClick={handleCancelSubstitution}
              className="mt-4 w-full py-2.5 text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-sage-100 rounded-lg transition-all"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Quick Add Section */}
        <div className="pt-4 border-t border-sage-200">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-sage-500 to-sage-600 flex items-center justify-center">
              <Plus className="w-3.5 h-3.5 text-white" aria-hidden="true" />
            </div>
            <p className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              Quick Add
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {availableComponents
              .filter((c) => c.price > 0)
              .slice(0, 4)
              .map((component) => (
                <button
                  key={component.id}
                  onClick={() => onAddAdditional(component)}
                  className="group flex items-center justify-between px-4 py-3 rounded-xl bg-gradient-to-r from-sage-50 to-white border border-sage-200 hover:border-sage-400 hover:shadow-md active:scale-[0.98] transition-all duration-200"
                  aria-label={`Add ${component.name} for ${formatPrice(component.price)}`}
                >
                  <span className="font-medium text-slate-700 group-hover:text-slate-900">
                    {component.name}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full group-hover:bg-emerald-200 transition-colors">
                    {formatPrice(component.price)}
                  </span>
                </button>
              ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
