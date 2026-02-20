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
  type Replacement,
} from "./";
import {
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  ChefHat,
  UtensilsCrossed,
  Receipt,
  Sparkles,
  ShoppingBag,
  Search,
} from "lucide-react";
import { cn } from "@/utils/cn";
import type {
  MenuOption,
  ProteinOption,
  LooseItem,
  ValidationError,
} from "../types/orderBuilder";

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
  filteredLooseItems: Array<{
    id: number;
    name: string;
    price: string;
    isAvailable: boolean;
  }>;
  popularProducts: Array<{ id: number; name: string; price: number }>;
  handleAddLooseItem: (item: {
    id: number;
    name: string;
    price: number;
  }) => void;
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
  _setSelectedRice,
  proteins,
  selectedProtein,
  setSelectedProtein,
  _lunchPrice,
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
            : "bg-gradient-to-r from-sage-600 to-sage-500",
        )}
      >
        <div className="px-4 py-4 sm:px-6 sm:py-5 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center bg-white/20">
              {currentOrderIndex !== null ? (
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              ) : (
                <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              )}
            </div>
            <div>
              <h2 className="text-white font-bold text-base sm:text-lg">
                {currentOrderIndex !== null
                  ? `Editando Pedido #${currentOrderIndex + 1}`
                  : `Nuevo Pedido #${tableOrdersLength + 1}`}
              </h2>
              <p className="text-white/80 text-xs sm:text-sm">
                {currentOrderIndex !== null
                  ? "Modifica los detalles"
                  : "Configura el pedido"}
              </p>
            </div>
          </div>
          {currentOrderIndex !== null && (
            <button
              onClick={onCancelEdit}
              className="p-2 sm:p-3 bg-white/20 hover:bg-white/30 rounded-lg sm:rounded-xl text-white transition-colors"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
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
              <span className="text-white font-semibold block text-lg">
                Menú del Día
              </span>
              <span className="text-amber-100 text-sm hidden sm:inline">
                {dailyMenuDisplay.isConfigured
                  ? `${dailyMenuDisplay.soupOptions.length} sopas, ${dailyMenuDisplay.drinkOptions.length} bebidas`
                  : "Usando configuración por defecto"}
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
            <span className="text-sm font-medium text-carbon-700">
              Margen base del almuerzo:
            </span>
          </div>
          <div className="text-sm">
            <span className="text-carbon-600">
              <strong className="text-carbon-900">
                ${dailyMenuPrices.basePrice.toLocaleString()}
              </strong>
              <span className="text-carbon-400 ml-2">
                (se suma al precio de la proteína)
              </span>
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
            <h3 className="text-lg font-bold text-carbon-900">
              Configurar Almuerzo
            </h3>
            <p className="text-sm text-carbon-500">
              Selecciona los elementos del menú
            </p>
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
              error={
                hasError("soup")
                  ? validationErrors.find((e) => e.field === "soup")?.message
                  : undefined
              }
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
              error={
                hasError("principle")
                  ? validationErrors.find((e) => e.field === "principle")
                      ?.message
                  : undefined
              }
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
              error={
                hasError("salad")
                  ? validationErrors.find((e) => e.field === "salad")?.message
                  : undefined
              }
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
              error={
                hasError("drink")
                  ? validationErrors.find((e) => e.field === "drink")?.message
                  : undefined
              }
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
              error={
                hasError("extra")
                  ? validationErrors.find((e) => e.field === "extra")?.message
                  : undefined
              }
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
                        <p className="text-xs text-amber-600 font-medium uppercase tracking-wider">
                          Sopa
                        </p>
                        <p className="text-carbon-900 font-semibold">
                          {dailyMenuDisplay.soupOptions[0].name}
                        </p>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-emerald-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
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
                        <p className="text-xs text-emerald-600 font-medium uppercase tracking-wider">
                          Principio
                        </p>
                        <p className="text-carbon-900 font-semibold">
                          {dailyMenuDisplay.principleOptions[0].name}
                        </p>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-emerald-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
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
                        <p className="text-xs text-sage-600 font-medium uppercase tracking-wider">
                          Ensalada
                        </p>
                        <p className="text-carbon-900 font-semibold">
                          {dailyMenuDisplay.saladOptions[0].name}
                        </p>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-emerald-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
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
                        <p className="text-xs text-blue-600 font-medium uppercase tracking-wider">
                          Jugo
                        </p>
                        <p className="text-carbon-900 font-semibold">
                          {dailyMenuDisplay.drinkOptions[0].name}
                        </p>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-emerald-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
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
                        <p className="text-xs text-purple-600 font-medium uppercase tracking-wider">
                          Extra
                        </p>
                        <p className="text-carbon-900 font-semibold">
                          {dailyMenuDisplay.extraOptions[0].name}
                        </p>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-emerald-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
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
                        <p className="text-xs text-amber-600 font-medium uppercase tracking-wider">
                          Arroz
                        </p>
                        <p className="text-carbon-900 font-semibold">
                          {dailyMenuDisplay.riceOption.name}
                        </p>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-emerald-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
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
            {validationErrors.find((e) => e.field === "protein")?.message}
          </p>
        )}
      </Card>

      {/* Quick add-ons - Only when protein is selected */}
      {selectedProtein && (
        <Card variant="elevated" className="p-5 rounded-2xl">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-100 to-amber-200 text-amber-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-carbon-900">
                Adiciones Rápidas
              </h4>
              <p className="text-xs text-carbon-500">Extras al almuerzo</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {popularProducts.map((product) => {
              const existing = looseItems.find((i) => i.id === product.id);

              return (
                <button
                  key={product.id}
                  onClick={() => handleAddLooseItem(product)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-lg border transition-all duration-200 active:scale-95",
                    existing
                      ? "bg-sage-50 border-sage-400 text-sage-800 shadow-sm"
                      : "bg-white border-carbon-200 hover:border-sage-400 hover:bg-sage-50/50",
                  )}
                >
                  {existing ? (
                    <span className="w-5 h-5 rounded-full bg-sage-600 text-white flex items-center justify-center text-xs font-bold">
                      {existing.quantity}
                    </span>
                  ) : (
                    <Plus className="w-3.5 h-3.5 text-sage-500" />
                  )}
                  <span className="text-xs font-medium text-carbon-800">
                    {product.name}
                  </span>
                  <span className="text-xs font-semibold text-carbon-500">
                    ${product.price.toLocaleString()}
                  </span>
                </button>
              );
            })}
          </div>
        </Card>
      )}

      {/* Replacement manager */}
      <Card variant="elevated" className="p-6 rounded-2xl">
        <ReplacementManager
          availableItems={{
            soup: selectedSoup ? [selectedSoup] : [],
            principle: selectedPrinciple ? [selectedPrinciple] : [],
            salad: selectedSalad ? [selectedSalad] : [],
            drink: selectedDrink ? [selectedDrink] : [],
            extra: selectedExtra ? [selectedExtra] : [],
            rice: selectedRice ? [selectedRice] : [],
          }}
          replacements={replacements}
          onAddReplacement={(replacement) =>
            setReplacements([...replacements, replacement])
          }
          onRemoveReplacement={(id) =>
            setReplacements(replacements.filter((r) => r.id !== id))
          }
        />
      </Card>

      {/* Loose products search & selection */}
      <Card variant="elevated" className="p-6 rounded-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-carbon-900">
              Buscar Producto
            </h3>
            <p className="text-sm text-carbon-500">
              {selectedProtein
                ? "Agregar extra al almuerzo"
                : "Agregar producto individual"}
            </p>
          </div>
        </div>

        {/* Added products with quantity controls - shown first */}
        {looseItems.length > 0 && (
          <div className="mb-4 p-4 bg-sage-50 rounded-xl border border-sage-200">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-carbon-700">
                Productos ({looseItems.reduce((sum, i) => sum + i.quantity, 0)})
              </p>
              <p className="text-sm font-bold text-sage-700">
                +$
                {looseItems
                  .reduce((sum, i) => sum + i.price * i.quantity, 0)
                  .toLocaleString()}
              </p>
            </div>
            <div className="space-y-2">
              {looseItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2 bg-white rounded-lg border border-sage-100"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-sm font-medium text-carbon-800 truncate">
                      {item.name}
                    </span>
                    <span className="text-xs text-sage-600">
                      ${item.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        handleUpdateLooseItemQuantity(
                          item.id,
                          item.quantity - 1,
                        )
                      }
                      className="w-8 h-8 rounded-lg bg-sage-100 text-sage-700 hover:bg-sage-200 flex items-center justify-center transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 12H4"
                        />
                      </svg>
                    </button>
                    <span className="w-8 text-center font-bold text-carbon-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        handleUpdateLooseItemQuantity(
                          item.id,
                          item.quantity + 1,
                        )
                      }
                      className="w-8 h-8 rounded-lg bg-sage-100 text-sage-700 hover:bg-sage-200 flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search input with icon */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-carbon-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Buscar producto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 py-3"
            fullWidth
          />
        </div>

        {/* Products grid - show all or filtered */}
        {filteredLooseItems.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4 max-h-96 overflow-y-auto scroll-smooth">
            {filteredLooseItems.map((item) => {
              const addedItem = looseItems.find((i) => i.id === item.id);
              return (
                <button
                  key={item.id}
                  onClick={() =>
                    handleAddLooseItem({
                      id: item.id,
                      name: item.name,
                      price: Number(item.price),
                    })
                  }
                  className={cn(
                    "group relative p-4 rounded-xl border-2 transition-all text-left min-h-[80px]",
                    addedItem
                      ? "border-sage-500 bg-sage-50"
                      : "border-sage-200 bg-white hover:border-sage-400 hover:bg-sage-50",
                  )}
                >
                  {addedItem && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-sage-500 flex items-center justify-center shadow-md">
                      <span className="text-xs font-bold text-white">
                        {addedItem.quantity}
                      </span>
                    </div>
                  )}
                  <p
                    className={cn(
                      "font-medium text-sm line-clamp-2 group-hover:text-sage-700 transition-colors",
                      addedItem ? "text-sage-900" : "text-carbon-900",
                    )}
                  >
                    {item.name}
                  </p>
                  <p
                    className={cn(
                      "font-bold mt-1",
                      addedItem ? "text-sage-700" : "text-sage-700",
                    )}
                  >
                    ${Number(item.price).toLocaleString("es-CO")}
                  </p>
                </button>
              );
            })}
          </div>
        )}

        {searchTerm && filteredLooseItems.length === 0 && (
          <p className="text-center text-carbon-500 py-4">
            No se encontraron productos
          </p>
        )}
      </Card>

      {/* Order notes */}
      <Card variant="elevated" className="p-6 rounded-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600 flex items-center justify-center">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </div>
          <div>
            <h4 className="font-bold text-carbon-900">Notas del Pedido</h4>
            <p className="text-xs text-carbon-500">
              Instrucciones especiales (opcional)
            </p>
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
      <Button onClick={onAddToTable} size="lg" className="w-full">
        {currentOrderIndex !== null
          ? "Actualizar Pedido"
          : "Agregar a la Orden"}
      </Button>
    </div>
  );
}
