import { useState } from "react";
import { Card } from "@/components";
import { cn } from "@/utils/cn";
import { Plus, Minus, ArrowRightLeft, Trash2 } from "lucide-react";

/**
 * PlateComponent
 */
export type PlateComponent = "sopa" | "principio" | "ensalada" | "adicional";

/**
 * Substitution
 */
export interface Substitution {
  from: PlateComponent;
  to: PlateComponent;
  quantity: number;
}

/**
 * AdditionalItem
 */
export interface AdditionalItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

/**
 * PlateCustomizer Props
 */
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

/**
 * PlateCustomizer Component
 * 
 * Permite personalizar el plato del corrientazo:
 * - Sustituciones (sin costo): cambiar sopa por más principio, etc.
 * - Adicionales (con costo): agregar productos extra
 * 
 * @example
 * ```tsx
 * <PlateCustomizer
 *   substitutions={[{ from: "sopa", to: "principio", quantity: 1 }]}
 *   additionals={[{ id: 1, name: "Huevo", price: 2000, quantity: 1 }]}
 *   onAddSubstitution={handleAddSubstitution}
 *   onAddAdditional={handleAddAdditional}
 *   availableComponents={components}
 * />
 * ```
 */
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
  const [activeTab, setActiveTab] = useState<"substitutions" | "additionals">("substitutions");
  const [selectedFrom, setSelectedFrom] = useState<PlateComponent | null>(null);

  const componentLabels: Record<PlateComponent, string> = {
    sopa: "Sopa",
    principio: "Principio",
    ensalada: "Ensalada",
    adicional: "Adicional",
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      {/* Tabs */}
      <div className="flex border-b border-sage-200">
        <button
          onClick={() => setActiveTab("substitutions")}
          className={cn(
            "flex-1 py-3 px-4 text-sm font-medium transition-colors",
            activeTab === "substitutions"
              ? "text-sage-700 border-b-2 border-sage-500 bg-sage-50"
              : "text-carbon-500 hover:text-carbon-700"
          )}
        >
          <span className="flex items-center justify-center gap-2">
            <ArrowRightLeft className="w-4 h-4" />
            Sustituciones
            {substitutions.length > 0 && (
              <span className="bg-sage-500 text-white text-xs px-2 py-0.5 rounded-full">
                {substitutions.length}
              </span>
            )}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("additionals")}
          className={cn(
            "flex-1 py-3 px-4 text-sm font-medium transition-colors",
            activeTab === "additionals"
              ? "text-sage-700 border-b-2 border-sage-500 bg-sage-50"
              : "text-carbon-500 hover:text-carbon-700"
          )}
        >
          <span className="flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" />
            Adicionales
            {additionals.length > 0 && (
              <span className="bg-sage-500 text-white text-xs px-2 py-0.5 rounded-full">
                {additionals.reduce((sum, a) => sum + a.quantity, 0)}
              </span>
            )}
          </span>
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === "substitutions" ? (
          <div className="space-y-4">
            <p className="text-sm text-carbon-600">
              Cambia un componente por otro <span className="font-semibold text-sage-700">sin costo adicional</span>
            </p>

            {/* Current substitutions */}
            {substitutions.length > 0 && (
              <div className="space-y-2">
                {substitutions.map((sub, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-sage-50 rounded-xl border border-sage-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-carbon-600">{componentLabels[sub.from]}</span>
                        <ArrowRightLeft className="w-4 h-4 text-sage-500" />
                        <span className="font-semibold text-sage-700">{componentLabels[sub.to]}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => onRemoveSubstitution(index)}
                      className="p-1.5 text-carbon-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add substitution */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-carbon-700">Nueva sustitución:</p>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-carbon-500 mb-1.5 block">Quitar:</label>
                  <select
                    value={selectedFrom || ""}
                    onChange={(e) => setSelectedFrom(e.target.value as PlateComponent || null)}
                    className="w-full p-2.5 rounded-xl border-2 border-sage-200 bg-white text-sm focus:border-sage-500 focus:outline-none"
                  >
                    <option value="">Seleccionar...</option>
                    {(Object.keys(componentLabels) as PlateComponent[]).map((comp) => (
                      <option key={comp} value={comp}>
                        {componentLabels[comp]}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="text-xs text-carbon-500 mb-1.5 block">Agregar:</label>
                  <select
                    disabled={!selectedFrom}
                    onChange={(e) => {
                      if (selectedFrom && e.target.value) {
                        onAddSubstitution(selectedFrom, e.target.value as PlateComponent);
                        setSelectedFrom(null);
                      }
                    }}
                    className="w-full p-2.5 rounded-xl border-2 border-sage-200 bg-white text-sm focus:border-sage-500 focus:outline-none disabled:opacity-50"
                  >
                    <option value="">Seleccionar...</option>
                    {(Object.keys(componentLabels) as PlateComponent[])
                      .filter((comp) => comp !== selectedFrom)
                      .map((comp) => (
                        <option key={comp} value={comp}>
                          {componentLabels[comp]}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-carbon-600">
              Agrega productos extra <span className="font-semibold text-sage-700">con costo adicional</span>
            </p>

            {/* Current additionals */}
            {additionals.length > 0 && (
              <div className="space-y-2">
                {additionals.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-white rounded-xl border border-sage-200"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-carbon-900 truncate">{item.name}</p>
                      <p className="text-sm text-sage-700">${item.price.toLocaleString("es-CO")} c/u</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onUpdateAdditionalQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="p-1.5 rounded-lg bg-sage-100 text-sage-700 hover:bg-sage-200 disabled:opacity-50"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateAdditionalQuantity(item.id, item.quantity + 1)}
                        className="p-1.5 rounded-lg bg-sage-100 text-sage-700 hover:bg-sage-200"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onRemoveAdditional(item.id)}
                        className="p-1.5 text-carbon-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors ml-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Available components to add */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-carbon-700">Productos disponibles:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {availableComponents.map((component) => (
                  <button
                    key={component.id}
                    onClick={() => onAddAdditional(component)}
                    className="flex items-center justify-between p-3 rounded-xl border-2 border-sage-200 bg-white hover:border-sage-400 hover:bg-sage-50 transition-all text-left"
                  >
                    <span className="font-medium text-carbon-900">{component.name}</span>
                    <span className="text-sm font-semibold text-sage-700">+${component.price.toLocaleString("es-CO")}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
