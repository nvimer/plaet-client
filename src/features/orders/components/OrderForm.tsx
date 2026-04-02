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
  User,
  Sparkles,
  Search,
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
  // Customer search
  searchResults?: Array<{ id: string; firstName: string; lastName?: string; phone?: string; address1?: string }>;
  showDropdown?: boolean;
  onSearchCustomers?: (query: string) => void;
  onSelectCustomer?: (customer: { id: string; firstName: string; lastName?: string; phone?: string; phone2?: string; address1?: string; address2?: string }) => void;
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
  touchedFields: Set<string>;

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
  searchResults,
  showDropdown,
  onSearchCustomers,
  onSelectCustomer,
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
  touchedFields,
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
    <div className="space-y-6 pb-24 sm:pb-0 font-sans">
      
      {/* 1. CLIENT DATA & PACKAGING (TOP PRIORITY) */}
      <Card variant="bordered" padding="md" className="rounded-[2rem] border-2 border-sage-100 bg-white shadow-soft-sm overflow-visible">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
                <User className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-carbon-900 uppercase tracking-widest">Cliente y Empaque</h3>
            </div>

            <button
              type="button"
              onClick={() => setHasCustomerData(!hasCustomerData)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all",
                showCustomerForm ? "bg-primary-600 text-white shadow-soft-md" : "bg-sage-50 text-carbon-400 border border-sage-100"
              )}
            >
              {showCustomerForm ? "Con Datos" : "Consumidor Final"}
            </button>
          </div>

          <AnimatePresence>
            {showCustomerForm && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-sage-50 overflow-visible"
              >
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-carbon-400 uppercase tracking-widest ml-1">Teléfono</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-carbon-300 w-3.5 h-3.5" />
                    <Input
                      type="tel"
                      placeholder="300..."
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="pl-10 h-11 text-sm rounded-xl border-sage-100 font-bold"
                      fullWidth
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-carbon-400 uppercase tracking-widest ml-1">Teléfono 2 (Opcional)</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-carbon-300 w-3.5 h-3.5 opacity-50" />
                    <Input
                      type="tel"
                      placeholder="Otro..."
                      value={customerPhone2}
                      onChange={(e) => setCustomerPhone2(e.target.value)}
                      className="pl-10 h-11 text-sm rounded-xl border-sage-100 font-bold"
                      fullWidth
                    />
                  </div>
                </div>

                <div className="space-y-1.5 overflow-visible">
                  <label className="text-[10px] font-bold text-carbon-400 uppercase tracking-widest ml-1">Nombre</label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-carbon-300 w-3.5 h-3.5" />
                    <Input
                      type="text"
                      placeholder="Buscar cliente..."
                      value={customerName}
                      onChange={(e) => {
                        setCustomerName(e.target.value);
                        if (onSearchCustomers) {
                          onSearchCustomers(e.target.value);
                        }
                      }}
                      className="pl-10 h-11 text-sm rounded-xl border-sage-100 font-bold"
                      fullWidth
                    />
                    {showDropdown && searchResults && searchResults.length > 0 && (
                      <div className="absolute z-[100] w-full mt-1 bg-white border-2 border-sage-100 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                        {searchResults.map((customer) => (
                          <button
                            key={customer.id}
                            type="button"
                            onClick={() => onSelectCustomer && onSelectCustomer(customer as any)}
                            className="w-full px-4 py-3 text-left hover:bg-sage-50 border-b border-sage-50 last:border-b-0"
                          >
                            <p className="font-bold text-carbon-900 text-sm">
                              {customer.firstName} {customer.lastName}
                            </p>
                            <p className="text-xs text-carbon-500">
                              {customer.phone} {customer.address1 && ` - ${customer.address1}`}
                            </p>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {isDelivery && (
                  <>
                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="text-[10px] font-bold text-carbon-400 uppercase tracking-widest ml-1">Dirección</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-carbon-300 w-3.5 h-3.5" />
                        <Input
                          type="text"
                          placeholder="Calle..."
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          className="pl-10 h-11 text-sm rounded-xl border-sage-100 font-bold"
                          fullWidth
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="text-[10px] font-bold text-carbon-400 uppercase tracking-widest ml-1">Dirección 2 (Opcional)</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-carbon-300 w-3.5 h-3.5 opacity-50" />
                        <Input
                          type="text"
                          placeholder="Apartamento, oficina..."
                          value={address2}
                          onChange={(e) => setAddress2(e.target.value)}
                          className="pl-10 h-11 text-sm rounded-xl border-sage-100 font-bold"
                          fullWidth
                        />
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {selectedOrderType !== OrderType.DINE_IN && (
            <div className="pt-4 border-t border-sage-50">
              <div className="flex items-center justify-between p-3 bg-sage-50/30 rounded-xl border border-sage-100">
                <div className="flex items-center gap-3">
                  <Box className="w-4 h-4 text-primary-500" />
                  <span className="text-[11px] font-bold text-carbon-700 uppercase tracking-wide">Portacomidas</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setPackagingQuantity(Math.max(0, packagingQuantity - 1))}
                    className="w-7 h-7 flex items-center justify-center bg-white border border-sage-200 rounded-lg text-carbon-400 active:scale-90 transition-all"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-black text-sm text-carbon-900">{packagingQuantity}</span>
                  <button
                    onClick={() => setPackagingQuantity(packagingQuantity + 1)}
                    className="w-7 h-7 flex items-center justify-center bg-white border border-sage-200 rounded-lg text-carbon-400 active:scale-90 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* 2. LUNCH OPTIONS (PROACTIVE & COMPACT) */}
      {showDailyMenu && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 bg-sage-50/10 p-4 rounded-[2rem] border border-sage-100"
        >
          <div className="flex items-center gap-2 px-1">
            <Sparkles className="w-3.5 h-3.5 text-primary-500" />
            <h3 className="text-[10px] font-bold text-carbon-400 uppercase tracking-[0.15em]">Menú del Día</h3>
          </div>

          <div className="space-y-4">
            <MenuItemSelector
              label="Sopa"
              icon={<Soup className="w-3.5 h-3.5" />}
              options={dailyMenuDisplay?.soupOptions || []}
              selectedOption={selectedSoup}
              onSelect={setSelectedSoup}
              color="amber"
              required
              compact
              touched={touchedFields.has("soup")}
              error={hasError("soup") ? "Requerido" : undefined}
            />

            <MenuItemSelector
              label="Principio"
              icon={<Utensils className="w-3.5 h-3.5" />}
              options={dailyMenuDisplay?.principleOptions || []}
              selectedOption={selectedPrinciple}
              onSelect={setSelectedPrinciple}
              color="emerald"
              required
              compact
              touched={touchedFields.has("principle")}
              error={hasError("principle") ? "Requerido" : undefined}
            />

            <MenuItemSelector
              label="Ensalada"
              icon={<Salad className="w-3.5 h-3.5" />}
              options={dailyMenuDisplay?.saladOptions || []}
              selectedOption={selectedSalad}
              onSelect={setSelectedSalad}
              color="sage"
              required
              compact
              touched={touchedFields.has("salad")}
              error={hasError("salad") ? "Requerido" : undefined}
            />

            <MenuItemSelector
              label="Bebida"
              icon={<CupSoda className="w-3.5 h-3.5" />}
              options={dailyMenuDisplay?.drinkOptions || []}
              selectedOption={selectedDrink}
              onSelect={setSelectedDrink}
              color="blue"
              required
              compact
              touched={touchedFields.has("drink")}
              error={hasError("drink") ? "Requerido" : undefined}
            />

            {dailyMenuDisplay?.extraOptions && dailyMenuDisplay.extraOptions.length > 0 && (
              <MenuItemSelector
                label="Extra"
                icon={<IceCream className="w-3.5 h-3.5" />}
                options={dailyMenuDisplay.extraOptions}
                selectedOption={selectedExtra}
                onSelect={setSelectedExtra}
                color="purple"
                compact
              />
            )}
          </div>
        </motion.div>
      )}

      {/* 3. PROTEIN SELECTOR */}
      <div className="space-y-6">
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
        )}
      </div>

      {/* 4. ADDITIONALS & DRINKS (LOOSE ITEMS) */}
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

      {/* 5. ADDITIONAL NOTES */}
      <Card variant="bordered" padding="md" className="rounded-[2rem] border-2 border-sage-100 bg-white shadow-soft-sm">
        <textarea
          value={orderNotes}
          onChange={(e) => setOrderNotes(e.target.value)}
          placeholder="Notas adicionales..."
          className="w-full p-4 rounded-2xl border-2 border-sage-50 bg-sage-50/20 focus:border-carbon-900 focus:bg-white focus:outline-none resize-none transition-all font-bold text-sm text-carbon-700"
          rows={2}
        />
      </Card>

      {/* Ticket Book Info */}
      {customerId && showCustomerForm && (
        <CustomerTicketsInfo 
          customerId={customerId} 
          onSellClick={() => setShowSellModal(true)} 
        />
      )}

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
