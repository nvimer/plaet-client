/**
 * OrderForm Component
 * Left column of order creation with lunch configuration
 */

import { Card, Input, Button } from "@/components";
import { 
  DailyMenuSection, 
  ProteinSelector, 
  MenuItemSelector,
  ReplacementManager,
  type Replacement 
} from "./";
import { 
  Plus, X, ChevronDown, ChevronUp, ChefHat, 
  UtensilsCrossed, Receipt, Sparkles, ShoppingBag, Search
} from "lucide-react";
import { cn } from "@/utils/cn";
import type { MenuOption, ProteinOption, LooseItem, ValidationError } from "../types/orderBuilder";

interface OrderFormProps {
  // Order state
  currentOrderIndex: number | null;
  tableOrdersLength: number;
  
  // Daily menu state
  showDailyMenu: boolean;
  setShowDailyMenu: (show: boolean) => void;
  dailyMenuDisplay: {
    soupOptions: MenuOption[];
    principleOptions: MenuOption[];
    saladOptions: MenuOption[];
    extraOptions: MenuOption[];
    drinkOptions: MenuOption[];
    dessertOptions?: MenuOption[];
    riceOption: MenuOption | null;
    basePrice: number;
    isConfigured: boolean;
  };
  dailyMenuPrices: {
    basePrice: number;
    isConfigured: boolean;
  };
  
  // Lunch selections
  selectedSoup: MenuOption | null;
  setSelectedSoup: (soup: MenuOption | null) => void;
  selectedPrinciple: MenuOption | null;
  setSelectedPrinciple: (principle: MenuOption | null) => void;
  selectedSalad: MenuOption | null;
  setSelectedSalad: (salad: MenuOption | null) => void;
  selectedDrink: MenuOption | null;
  setSelectedDrink: (drink: MenuOption | null) => void;
  selectedExtra: MenuOption | null;
  setSelectedExtra: (extra: MenuOption | null) => void;
  selectedRice: MenuOption | null;
  
  // Protein
  proteins: ProteinOption[];
  selectedProtein: ProteinOption | null;
  setSelectedProtein: (protein: ProteinOption | null) => void;
  
  // Replacements
  replacements: Replacement[];
  setReplacements: (replacements: Replacement[]) => void;
  
  // Loose items
  looseItems: LooseItem[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredLooseItems: Array<{ id: number; name: string; price: string; isAvailable: boolean }>;
  popularProducts: Array<{ id: number; name: string; price: number }>;
  handleAddLooseItem: (item: { id: number; name: string; price: number }) => void;
  handleUpdateLooseItemQuantity: (id: number, quantity: number) => void;
  
  // Order notes
  orderNotes: string;
  setOrderNotes: (notes: string) => void;
  
  // Validation
  validationErrors: ValidationError[];
  hasError: (field: string) => boolean;
  
  // Actions
  onAddToTable: () => void;
  onCancelEdit: () => void;
  
  // Loading
  isLoading: boolean;
}

export function OrderForm({
  currentOrderIndex,
  tableOrdersLength,
  showDailyMenu,
  setShowDailyMenu,
  dailyMenuDisplay,
  dailyMenuPrices,
  selectedSoup,
  setSelectedSoup,
  selectedPrinciple,
  setSelectedPrinciple,
  selectedSalad,
  setSelectedSalad,
  selectedDrink,
  setSelectedDrink,
  selectedExtra,
  setSelectedExtra,
  selectedRice,
  setSelectedRice,
  proteins,
  selectedProtein,
  setSelectedProtein,
  lunchPrice,
  replacements,
  setReplacements,
  looseItems,
  searchTerm,
  setSearchTerm,
  filteredLooseItems,
  popularProducts,
  handleAddLooseItem,
  handleUpdateLooseItemQuantity,
  orderNotes,
  setOrderNotes,
  validationErrors,
  hasError,
  onAddToTable,
  onCancelEdit,
  isLoading,
}: OrderFormProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card 
        variant="elevated" 
        className={cn(
          "overflow-hidden rounded-2xl",
          currentOrderIndex !== null 
            ? "bg-gradient-to-r from-amber-500 to-amber-400" 
            : "bg-gradient-to-r from-sage-600 to-sage-500"
        )}
      >
        <div className="px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center",
              currentOrderIndex !== null ? "bg-white/20" : "bg-white/20"
            )}>
              {currentOrderIndex !== null ? (
                <Sparkles className="w-6 h-6 text-white" />
              ) : (
                <Plus className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <h2 className="text-white font-semibold text-lg">
                {currentOrderIndex !== null 
                  ? `Editando Pedido #${currentOrderIndex + 1}` 
                  : `Nuevo Pedido #${tableOrdersLength + 1}`}
              </h2>
              <p className="text-white/80 text-sm">
                {currentOrderIndex !== null 
                  ? "Modifica los detalles" 
                  : "Configura el pedido"}
              </p>
            </div>
          </div>
          {currentOrderIndex !== null && (
            <button
              onClick={onCancelEdit}
              className="p-3 bg-white/20 hover:bg-white/30 rounded-xl text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>
      </Card>

      {/* Collapsible daily menu */}
      <Card variant="elevated" className="overflow-hidden rounded-2xl">
        <button
          onClick={() => setShowDailyMenu(!showDailyMenu)}
          className="w-full bg-gradient-to-r from-amber-500 to-amber-400 px-6 py-4 flex items-center justify-between hover:from-amber-600 hover:to-amber-500 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <span className="text-white font-semibold block text-lg">Menú del Día</span>
              <span className="text-amber-100 text-sm hidden sm:inline">
                {dailyMenuDisplay.isConfigured 
                  ? `${dailyMenuDisplay.soupOptions.length} sopas, ${dailyMenuDisplay.drinkOptions.length} bebidas`
                  : "Usando configuración por defecto"
                }
              </span>
            </div>
          </div>
          {showDailyMenu ? (
            <ChevronUp className="w-6 h-6 text-white" />
          ) : (
            <ChevronDown className="w-6 h-6 text-white" />
          )}
        </button>
        {showDailyMenu && (
          <DailyMenuSection
            soupOptions={dailyMenuDisplay.soupOptions}
            principleOptions={dailyMenuDisplay.principleOptions}
            saladOptions={dailyMenuDisplay.saladOptions}
            extraOptions={dailyMenuDisplay.extraOptions}
            drinkOptions={dailyMenuDisplay.drinkOptions}
            dessertOptions={dailyMenuDisplay.dessertOptions}
            basePrice={dailyMenuDisplay.basePrice}
          />
        )}
      </Card>

      {/* Daily Menu Prices Info */}
      {dailyMenuPrices.isConfigured && (
        <div className="flex items-center justify-between p-4 bg-sage-50 rounded-xl border border-sage-200">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-sage-600" />
            <span className="text-sm font-medium text-carbon-700">Margen base del almuerzo:</span>
          </div>
          <div className="text-sm">
            <span className="text-carbon-600">
              <strong className="text-carbon-900">${dailyMenuPrices.basePrice.toLocaleString()}</strong>
              <span className="text-carbon-400 ml-2">(se suma al precio de la proteína)</span>
            </span>
          </div>
        </div>
      )}

      {/* Lunch configuration - Conditional selectors */}
      <Card variant="elevated" className="p-6 rounded-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 text-amber-600 flex items-center justify-center">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-carbon-900">Configurar Almuerzo</h3>
            <p className="text-sm text-carbon-500">Selecciona los elementos del menú</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Soup - Show selector only if 2+ options */}
          {dailyMenuDisplay.soupOptions.length >= 2 && (
            <MenuItemSelector
              label="Sopa"
              options={dailyMenuDisplay.soupOptions}
              selectedOption={selectedSoup}
              onSelect={setSelectedSoup}
              required={true}
              error={hasError("soup") ? validationErrors.find(e => e.field === "soup")?.message : undefined}
              icon="🍲"
              color="amber"
            />
          )}

          {/* Principle - Show selector only if 2+ options */}
          {dailyMenuDisplay.principleOptions.length >= 2 && (
            <MenuItemSelector
              label="Principio"
              options={dailyMenuDisplay.principleOptions}
              selectedOption={selectedPrinciple}
              onSelect={setSelectedPrinciple}
              required={true}
              error={hasError("principle") ? validationErrors.find(e => e.field === "principle")?.message : undefined}
              icon="🥔"
              color="emerald"
            />
          )}

          {/* Salad - Show selector only if 2+ options */}
          {dailyMenuDisplay.saladOptions.length >= 2 && (
            <MenuItemSelector
              label="Ensalada"
              options={dailyMenuDisplay.saladOptions}
              selectedOption={selectedSalad}
              onSelect={setSelectedSalad}
              required={true}
              error={hasError("salad") ? validationErrors.find(e => e.field === "salad")?.message : undefined}
              icon="🥗"
              color="sage"
            />
          )}

          {/* Drink - Show selector only if 2+ options */}
          {dailyMenuDisplay.drinkOptions.length >= 2 && (
            <MenuItemSelector
              label="Jugo"
              options={dailyMenuDisplay.drinkOptions}
              selectedOption={selectedDrink}
              onSelect={setSelectedDrink}
              required={true}
              error={hasError("drink") ? validationErrors.find(e => e.field === "drink")?.message : undefined}
              icon="🥤"
              color="blue"
            />
          )}

          {/* Extra - Show selector only if 2+ options */}
          {dailyMenuDisplay.extraOptions.length >= 2 && (
            <MenuItemSelector
              label="Extra"
              options={dailyMenuDisplay.extraOptions}
              selectedOption={selectedExtra}
              onSelect={setSelectedExtra}
              required={true}
              error={hasError("extra") ? validationErrors.find(e => e.field === "extra")?.message : undefined}
              icon="🍌"
              color="purple"
              showRiceInfo={true}
              riceName={dailyMenuDisplay.riceOption?.name}
            />
          )}

          {/* Modern auto-configured menu display */}
          {dailyMenuDisplay.soupOptions.length <= 1 &&
           dailyMenuDisplay.principleOptions.length <= 1 &&
           dailyMenuDisplay.saladOptions.length <= 1 &&
           dailyMenuDisplay.drinkOptions.length <= 1 &&
           dailyMenuDisplay.extraOptions.length <= 1 && (
            <div className="bg-gradient-to-br from-sage-50 via-white to-amber-50 rounded-2xl border border-sage-200 overflow-hidden">
              <div className="bg-gradient-to-r from-sage-600 to-sage-500 px-4 py-3">
                <h4 className="text-white font-semibold text-sm flex items-center gap-2">
                  <span className="text-lg">🍽️</span>
                  Menú del Día
                </h4>
              </div>
              <div className="p-4 space-y-3">
                {/* Soup */}
                {dailyMenuDisplay.soupOptions.length === 1 && (
                  <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-amber-100 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-xl">
                      🍲
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-amber-600 font-medium uppercase tracking-wider">Sopa</p>
                      <p className="text-carbon-900 font-semibold">{dailyMenuDisplay.soupOptions[0].name}</p>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                      <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                )}
                
                {/* Principle */}
                {dailyMenuDisplay.principleOptions.length === 1 && (
                  <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-emerald-100 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-xl">
                      🥔
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-emerald-600 font-medium uppercase tracking-wider">Principio</p>
                      <p className="text-carbon-900 font-semibold">{dailyMenuDisplay.principleOptions[0].name}</p>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                      <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                )}
                
                {/* Salad */}
                {dailyMenuDisplay.saladOptions.length === 1 && (
                  <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-sage-100 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-sage-100 flex items-center justify-center text-xl">
                      🥗
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-sage-600 font-medium uppercase tracking-wider">Ensalada</p>
                      <p className="text-carbon-900 font-semibold">{dailyMenuDisplay.saladOptions[0].name}</p>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                      <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                )}
                
                {/* Drink */}
                {dailyMenuDisplay.drinkOptions.length === 1 && (
                  <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-blue-100 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-xl">
                      🥤
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-blue-600 font-medium uppercase tracking-wider">Jugo</p>
                      <p className="text-carbon-900 font-semibold">{dailyMenuDisplay.drinkOptions[0].name}</p>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                      <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                )}
                
                {/* Extra */}
                {dailyMenuDisplay.extraOptions.length === 1 && (
                  <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-purple-100 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-xl">
                      🍌
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-purple-600 font-medium uppercase tracking-wider">Extra</p>
                      <p className="text-carbon-900 font-semibold">{dailyMenuDisplay.extraOptions[0].name}</p>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                      <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                )}
                
                {/* Rice */}
                {dailyMenuDisplay.riceOption && (
                  <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-amber-100 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-xl">
                      🍚
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-amber-600 font-medium uppercase tracking-wider">Arroz</p>
                      <p className="text-carbon-900 font-semibold">{dailyMenuDisplay.riceOption.name}</p>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                      <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Protein selector */}
      <Card variant="elevated" className="p-6 rounded-2xl">
        <ProteinSelector
          proteins={proteins}
          selectedProteinId={selectedProtein?.id}
          onSelect={setSelectedProtein}
          basePrice={dailyMenuPrices.basePrice}
        />
        {hasError("protein") && (
          <p className="mt-2 text-sm text-error-500">
            {validationErrors.find(e => e.field === "protein")?.message}
          </p>
        )}
      </Card>

      {/* Quick add-ons - Only when protein is selected */}
      {selectedProtein && (
        <Card variant="elevated" className="p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 text-amber-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-carbon-900">Adiciones Rápidas</h4>
              <p className="text-xs text-carbon-500">Agrega extras al almuerzo</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {popularProducts.map((product) => {
              const existing = looseItems.find((i) => i.id === product.id);
              return (
                <button
                  key={product.id}
                  onClick={() => handleAddLooseItem(product)}
                  className={cn(
                    "p-3 rounded-xl border-2 transition-all duration-200 text-left",
                    existing
                      ? "border-amber-400 bg-amber-50"
                      : "border-sage-200 bg-white hover:border-amber-300 hover:bg-amber-50/50"
                  )}
                >
                  <p className="font-semibold text-carbon-900 text-sm">{product.name}</p>
                  <p className="text-xs text-carbon-500">${product.price.toLocaleString()}</p>
                  {existing && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-amber-400 text-white text-xs rounded-full">
                      {existing.quantity}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </Card>
      )}

      {/* Replacement manager */}
      <Card variant="elevated" className="p-6 rounded-2xl">
        <ReplacementManager
          selectedItems={{
            soup: selectedSoup,
            principle: selectedPrinciple,
            salad: selectedSalad,
            drink: selectedDrink,
            extra: selectedExtra,
            rice: selectedRice,
          }}
          replacements={replacements}
          onReplacementsChange={setReplacements}
          availableItems={filteredLooseItems}
        />
      </Card>

      {/* Loose products search & selection */}
      <Card variant="elevated" className="p-6 rounded-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 flex items-center justify-center">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-carbon-900">Buscar Producto</h4>
            <p className="text-xs text-carbon-500">Agregar producto individual</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <Input
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="w-5 h-5" />}
          />
          
          {searchTerm && filteredLooseItems.length > 0 && (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {filteredLooseItems.slice(0, 10).map((item) => {
                const existing = looseItems.find((i) => i.id === item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleAddLooseItem({ id: item.id, name: item.name, price: parseFloat(item.price) })}
                    className={cn(
                      "w-full p-3 rounded-xl border-2 transition-all duration-200 flex items-center justify-between",
                      existing
                        ? "border-amber-400 bg-amber-50"
                        : "border-sage-200 bg-white hover:border-amber-300 hover:bg-amber-50/50"
                    )}
                  >
                    <div className="text-left">
                      <p className="font-semibold text-carbon-900">{item.name}</p>
                      <p className="text-sm text-carbon-500">${parseFloat(item.price).toLocaleString()}</p>
                    </div>
                    {existing ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateLooseItemQuantity(item.id, existing.quantity - 1);
                          }}
                          className="w-8 h-8 rounded-lg bg-amber-200 text-amber-700 flex items-center justify-center hover:bg-amber-300"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-semibold">{existing.quantity}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateLooseItemQuantity(item.id, existing.quantity + 1);
                          }}
                          className="w-8 h-8 rounded-lg bg-amber-200 text-amber-700 flex items-center justify-center hover:bg-amber-300"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <Plus className="w-5 h-5 text-sage-400" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
          
          {searchTerm && filteredLooseItems.length === 0 && (
            <p className="text-center text-carbon-500 py-4">No se encontraron productos</p>
          )}
          
          {/* Selected loose items */}
          {looseItems.length > 0 && (
            <div className="border-t border-sage-200 pt-4">
              <h5 className="font-semibold text-carbon-900 mb-3">Productos agregados:</h5>
              <div className="space-y-2">
                {looseItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-xl border border-amber-200">
                    <div>
                      <p className="font-semibold text-carbon-900">{item.name}</p>
                      <p className="text-sm text-carbon-500">${item.price.toLocaleString()} c/u</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateLooseItemQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-lg bg-amber-200 text-amber-700 flex items-center justify-center hover:bg-amber-300"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateLooseItemQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-lg bg-amber-200 text-amber-700 flex items-center justify-center hover:bg-amber-300"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Order notes */}
      <Card variant="elevated" className="p-6 rounded-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600 flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <div>
            <h4 className="font-bold text-carbon-900">Notas del Pedido</h4>
            <p className="text-xs text-carbon-500">Instrucciones especiales (opcional)</p>
          </div>
        </div>
        
        <textarea
          value={orderNotes}
          onChange={(e) => setOrderNotes(e.target.value)}
          placeholder="Ej: Sin sal, bien cocido, alérgenos..."
          className="w-full p-4 rounded-xl border-2 border-sage-200 focus:border-sage-400 focus:outline-none resize-none"
          rows={3}
        />
      </Card>

      {/* Add/update button */}
      <Button
        onClick={onAddToTable}
        size="lg"
        className="w-full"
      >
        {currentOrderIndex !== null ? "Actualizar Pedido" : "Agregar a la Orden"}
      </Button>
    </div>
  );
}
