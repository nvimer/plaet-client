/**
 * OrderForm Component
 * Left column of order creation with lunch configuration
 */

import { Card, Input, Tooltip } from "@/components";
import {
  ProteinSelector,
  MenuItemSelector,
  LooseItemSelector,
  ReplacementManager,
  type Replacement,
} from "./";
import { CustomerTicketsInfo } from "../../customers/components/CustomerTicketsInfo";
import { SellTicketBookModal } from "../../customers/components/SellTicketBookModal";
import {
  Plus,
  Minus,
  X,
  Phone,
  MapPin,
  Box,
  Soup,
  Utensils,
  Salad,
  CupSoda,
  IceCream,
  PackageCheck,
  User,
  Sparkles,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { OrderType } from "@/types";
import type {
  MenuOption,
  ProteinOption,
  LooseItem,
  ValidationError,
} from "../types/orderBuilder";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface OrderFormProps {
  // Order type context
  selectedOrderType: OrderType | null;

  // Order state
  currentOrderIndex: number | null;
  tableOrdersLength: number;

  // Customer info
  customerName: string;
  setCustomerName: (name: string) => void;
  customerId: string | null;
  customerPhone: string;
  setCustomerPhone: (phone: string) => void;
  customerPhone2: string;
  setCustomerPhone2: (phone: string) => void;
  deliveryAddress: string;
  setDeliveryAddress: (address: string) => void;
  address2: string;
  setAddress2: (address: string) => void;
  hasCustomerData: boolean;
  setHasCustomerData: (hasData: boolean) => void;
  packagingFee: number;
  packagingQuantity: number;
  setPackagingQuantity: (qty: number) => void;

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
    riceOptions: MenuOption[];
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
  setSelectedRice: (rice: MenuOption | null) => void;

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
    price: string | number;
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
  selectedOrderType,
  currentOrderIndex,
  tableOrdersLength,
  customerName,
  setCustomerName,
  customerId,
  customerPhone,
  setCustomerPhone,
  customerPhone2,
  setCustomerPhone2,
  deliveryAddress,
  setDeliveryAddress,
  address2,
  setAddress2,
  hasCustomerData,
  setHasCustomerData,
  packagingFee,
  packagingQuantity,
  setPackagingQuantity,
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
  onCancelEdit,
  isLoading,
}: OrderFormProps) {
  const [showSellModal, setShowSellModal] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-600" />
      </div>
    );
  }

  const isDelivery = selectedOrderType === OrderType.DELIVERY;
  const showCustomerForm = hasCustomerData || isDelivery;

  return (
    <div className="space-y-6 pb-24 sm:pb-0">
      {/* CLIENT DATA SECTION */}
      <Card variant="bordered" padding="md" className="rounded-[2.5rem] border-2 border-sage-100 bg-white shadow-soft-sm">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 shadow-inner">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-carbon-900 uppercase tracking-wider">Datos del Cliente</h3>
                <p className="text-[10px] text-carbon-400 font-medium">
                  {isDelivery ? "Requerido para domicilio" : "Opcional: Asocia esta venta"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-sage-50/50 p-1.5 rounded-2xl border border-sage-100 shadow-inner">
              <span className={cn(
                "text-[10px] font-black uppercase tracking-widest px-2",
                !showCustomerForm ? "text-primary-600" : "text-carbon-300"
              )}>Consumidor Final</span>
              
              <button
                type="button"
                disabled={isDelivery}
                onClick={() => setHasCustomerData(!hasCustomerData)}
                className={cn(
                  "relative w-12 h-6 rounded-full transition-all duration-300",
                  showCustomerForm ? "bg-primary-600 shadow-primary-100" : "bg-carbon-200"
                )}
              >
                <div className={cn(
                  "absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow-sm",
                  showCustomerForm ? "translate-x-6" : "translate-x-0"
                )} />
              </button>

              <span className={cn(
                "text-[10px] font-black uppercase tracking-widest px-2",
                showCustomerForm ? "text-primary-600" : "text-carbon-300"
              )}>Con Datos</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {showCustomerForm && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-sage-50">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-carbon-500 tracking-wide ml-1 uppercase">Teléfono</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-carbon-400 w-4 h-4" />
                      <Input
                        type="tel"
                        placeholder="Ej: 3001234567"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="pl-11 h-12"
                        error={hasError("customerPhone") ? validationErrors.find(e => e.field === "customerPhone")?.message : undefined}
                        fullWidth
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-1 space-y-2">
                    <label className="text-[10px] font-black text-carbon-500 tracking-wide ml-1 uppercase">Nombre</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-carbon-400 w-4 h-4" />
                      <Input
                        type="text"
                        placeholder="Ej: Juan Pérez"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="pl-11 h-12"
                        error={hasError("customerName") ? validationErrors.find(e => e.field === "customerName")?.message : undefined}
                        fullWidth
                      />
                    </div>
                  </div>

                  {isDelivery && (
                    <div className="sm:col-span-2 space-y-2">
                      <label className="text-[10px] font-black text-carbon-500 tracking-wide ml-1 uppercase">Dirección</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-carbon-400 w-4 h-4" />
                        <Input
                          type="text"
                          placeholder="Calle 123 # 45-67"
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          className="pl-11 h-12"
                          error={hasError("deliveryAddress") ? validationErrors.find(e => e.field === "deliveryAddress")?.message : undefined}
                          fullWidth
                        />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {selectedOrderType !== OrderType.DINE_IN && (
            <div className="pt-4 border-t border-sage-50">
              <div className="flex items-center justify-between p-4 bg-sage-50/30 rounded-2xl border-2 border-dashed border-sage-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white text-primary-600 flex items-center justify-center shadow-soft-sm">
                    <Box className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-carbon-900 uppercase">Portacomida</p>
                    <p className="text-[10px] text-carbon-500 font-medium">${packagingFee.toLocaleString()} / unidad</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-white rounded-xl border-2 border-sage-100 p-1 shadow-inner">
                    <button
                      type="button"
                      onClick={() => setPackagingQuantity(Math.max(0, packagingQuantity - 1))}
                      className="w-8 h-8 flex items-center justify-center text-carbon-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all active:scale-90"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-black text-carbon-900 text-sm">
                      {packagingQuantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setPackagingQuantity(packagingQuantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-carbon-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all active:scale-90"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {customerId && showCustomerForm && (
            <div className="mt-2 pt-6 border-t border-sage-50">
              <CustomerTicketsInfo 
                customerId={customerId} 
                onSellClick={() => setShowSellModal(true)} 
              />
            </div>
          )}
        </div>
      </Card>

      {/* Professional Header Banner */}
      <Card
        variant="elevated"
        className={cn(
          "overflow-hidden rounded-2xl border-2 transition-all duration-300",
          currentOrderIndex !== null
            ? "border-warning-200 bg-white shadow-soft-xl"
            : "border-sage-200 bg-white shadow-smooth-md"
        )}
      >
        <div className="px-4 py-4 sm:px-6 sm:py-5 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className={cn(
              "w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-inner transition-colors",
              currentOrderIndex !== null ? "bg-warning-100 text-warning-600" : "bg-sage-100 text-sage-600"
            )}>
              {currentOrderIndex !== null ? (
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
              ) : (
                <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </div>
            <div>
              <h2 className="text-carbon-900 font-bold text-lg sm:text-xl tracking-tight leading-tight uppercase">
                {currentOrderIndex !== null
                  ? `Editando Pedido #${currentOrderIndex + 1}`
                  : `Nuevo Pedido #${tableOrdersLength + 1}`}
              </h2>
              <span className="text-xs font-bold text-primary-600 uppercase tracking-widest">
                {currentOrderIndex !== null ? 'Actualiza tu selección' : 'Configura el almuerzo'}
              </span>
            </div>
          </div>
          {currentOrderIndex !== null && (
            <button onClick={onCancelEdit} className="p-3 bg-error-50 text-error-500 rounded-xl">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </Card>

      <div className="space-y-8">
        <ProteinSelector
          proteins={proteins}
          selectedProteinId={selectedProtein?.id}
          onSelect={setSelectedProtein}
          basePrice={dailyMenuPrices.basePrice}
          className={cn(
            "transition-all duration-300",
            hasError("protein") ? "ring-2 ring-error-500 rounded-[2.5rem]" : ""
          )}
        />

        {showDailyMenu && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <MenuItemSelector
              label="Sopa"
              icon={<Soup />}
              options={dailyMenuDisplay?.soupOptions || []}
              selectedOption={selectedSoup}
              onSelect={setSelectedSoup}
              color="amber"
              required
              error={hasError("soup") ? "Selecciona una sopa" : undefined}
            />

            <MenuItemSelector
              label="Principio"
              icon={<Utensils />}
              options={dailyMenuDisplay?.principleOptions || []}
              selectedOption={selectedPrinciple}
              onSelect={setSelectedPrinciple}
              color="emerald"
              required
              error={hasError("principle") ? "Selecciona un principio" : undefined}
            />

            <MenuItemSelector
              label="Ensalada"
              icon={<Salad />}
              options={dailyMenuDisplay?.saladOptions || []}
              selectedOption={selectedSalad}
              onSelect={setSelectedSalad}
              color="sage"
              required
              error={hasError("salad") ? "Selecciona una ensalada" : undefined}
            />

            <MenuItemSelector
              label="Bebida"
              icon={<CupSoda />}
              options={dailyMenuDisplay?.drinkOptions || []}
              selectedOption={selectedDrink}
              onSelect={setSelectedDrink}
              color="blue"
              required
              error={hasError("drink") ? "Selecciona una bebida" : undefined}
            />

            <MenuItemSelector
              label="Extra / Acompañamiento"
              icon={<IceCream />}
              options={dailyMenuDisplay?.extraOptions || []}
              selectedOption={selectedExtra}
              onSelect={setSelectedExtra}
              color="purple"
            />

            <ReplacementManager
              availableItems={{
                soup: dailyMenuDisplay?.soupOptions || [],
                principle: dailyMenuDisplay?.principleOptions || [],
                salad: dailyMenuDisplay?.saladOptions || [],
                drink: dailyMenuDisplay?.drinkOptions || [],
                extra: dailyMenuDisplay?.extraOptions || [],
                rice: dailyMenuDisplay?.riceOptions || [],
              }}
              replacements={replacements}
              onAddReplacement={(r) => setReplacements([...replacements, r])}
              onRemoveReplacement={(id) => setReplacements(replacements.filter(r => r.id !== id))}
              disabled={!selectedProtein}
            />
          </motion.div>
        )}

        <div className="pt-4 border-t-2 border-sage-100">
          <LooseItemSelector
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filteredItems={filteredLooseItems as never}
            popularProducts={popularProducts}
            onAddItem={handleAddLooseItem}
            onUpdateQuantity={handleUpdateLooseItemQuantity}
            selectedItems={looseItems}
          />
        </div>
      </div>

      <Card variant="bordered" padding="md" className="rounded-[2.5rem] border-2 border-sage-100 bg-white shadow-soft-sm">
        <textarea
          value={orderNotes}
          onChange={(e) => setOrderNotes(e.target.value)}
          placeholder="Notas adicionales (Ej: Sin sal...)"
          className="w-full p-4 rounded-2xl border-2 border-sage-50 bg-sage-50/20 focus:border-carbon-900 focus:bg-white focus:outline-none resize-none transition-all font-medium text-carbon-700"
          rows={3}
        />
      </Card>

      {/* Sell Modal */}
      {customerId && (
        <SellTicketBookModal
          isOpen={showSellModal}
          onClose={() => setShowSellModal(false)}
          customerId={customerId}
          customerName={customerName}
        />
      )}
    </div>
  );
}
