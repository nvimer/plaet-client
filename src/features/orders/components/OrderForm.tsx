/**
 * OrderForm Component
 * Left column of order creation with lunch configuration
 */

import { Card, Input, Tooltip } from "@/components";
import {
  ProteinSelector,
  MenuItemSelector,
  ReplacementManager,
  type Replacement,
} from "./";
import { CustomerTicketsInfo } from "../../customers/components/CustomerTicketsInfo";
import { SellTicketBookModal } from "../../customers/components/SellTicketBookModal";
import {
  Plus,
  Minus,
  UtensilsCrossed,
  Sparkles,
  Search,
  User,
  X,
  Phone,
  MapPin,
  Box,
  Soup,
  Utensils,
  Salad,
  CupSoda,
  IceCream,
  CircleCheck,
  PackageCheck,
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
                <h3 className="text-sm font-black text-carbon-900 uppercase tracking-wider italic">Datos del Cliente</h3>
                <p className="text-[10px] text-carbon-400 font-medium italic">
                  {isDelivery ? "Requerido para el servicio de domicilio" : "Opcional: Asocia esta venta a un cliente"}
                </p>
              </div>
            </div>

            {/* Toggle: Mandatory for Delivery, Optional for others */}
            <div className="flex items-center gap-3 bg-sage-50/50 p-1.5 rounded-2xl border border-sage-100 shadow-inner">
              <span className={cn(
                "text-[10px] font-black uppercase tracking-widest px-2 transition-colors",
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
                "text-[10px] font-black uppercase tracking-widest px-2 transition-colors",
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
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-sage-50">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-carbon-500 tracking-wide ml-1 uppercase italic italic">Teléfono Principal</label>
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

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-carbon-500 tracking-wide ml-1 uppercase italic">Teléfono Secundario (Opcional)</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-carbon-400 w-4 h-4 opacity-50" />
                      <Input
                        type="tel"
                        placeholder="Otro número..."
                        value={customerPhone2}
                        onChange={(e) => setCustomerPhone2(e.target.value)}
                        className="pl-11 h-12"
                        fullWidth
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-carbon-500 tracking-wide ml-1 uppercase italic">Nombre del Cliente</label>
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
                    <>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-carbon-500 tracking-wide ml-1 uppercase italic">Dirección Principal</label>
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

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-carbon-500 tracking-wide ml-1 uppercase italic">Dirección Secundaria (Opcional)</label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-carbon-400 w-4 h-4 opacity-50" />
                          <Input
                            type="text"
                            placeholder="Apartamento, local, etc..."
                            value={address2}
                            onChange={(e) => setAddress2(e.target.value)}
                            className="pl-11 h-12"
                            fullWidth
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Packaging Section - Always visible if not Dine-in */}
          {selectedOrderType !== OrderType.DINE_IN && (
            <div className="pt-4 border-t border-sage-50">
              <div className="flex items-center justify-between p-4 bg-sage-50/30 rounded-2xl border-2 border-dashed border-sage-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white text-primary-600 flex items-center justify-center shadow-soft-sm">
                    <Box className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-carbon-900 uppercase italic">Portacomida</p>
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
                  <div className="hidden sm:block text-right min-w-[70px]">
                    <p className="text-[9px] font-black text-carbon-400 uppercase tracking-widest">Cargo</p>
                    <p className="text-xs font-black text-primary-700">${(packagingFee * packagingQuantity).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Ticket Book Info - Only when customer is identified */}
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

      {/* Sell Modal */}
      {customerId && (
        <SellTicketBookModal
          isOpen={showSellModal}
          onClose={() => setShowSellModal(false)}
          customerId={customerId}
          customerName={customerName}
        />
      )}

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
              <h2 className="text-carbon-900 font-semibold text-lg sm:text-xl tracking-tight leading-tight">
                {currentOrderIndex !== null
                  ? `Editando Pedido #${currentOrderIndex + 1}`
                  : `Nuevo Pedido #${tableOrdersLength + 1}`}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-medium text-carbon-400">
                  {selectedOrderType === OrderType.DINE_IN ? 'Servicio en Mesa' : 
                   selectedOrderType === OrderType.TAKE_OUT ? 'Para Recoger' : 'Servicio a Domicilio'}
                </span>
                <div className="w-1 h-1 rounded-full bg-carbon-200" />
                <span className="text-xs font-bold text-primary-600">
                  {currentOrderIndex !== null ? 'Actualiza tu selección' : 'Configura el almuerzo'}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {currentOrderIndex !== null && (
              <Tooltip content="Cancelar edición">
                <button
                  onClick={onCancelEdit}
                  className="p-2.5 sm:p-3 bg-error-50 border-2 border-error-100 rounded-xl text-error-500 hover:bg-error-100 transition-all shadow-sm active:scale-90"
                >
                  <X className="w-5 h-5" />
                </button>
              </Tooltip>
            )}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <ProteinSelector
          proteins={proteins}
          selectedProtein={selectedProtein}
          onSelectProtein={setSelectedProtein}
          isLoading={isLoading}
          error={hasError("protein")}
        />

        {showDailyMenu && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Sopa */}
              <Card variant="bordered" padding="md" className={cn("rounded-[2rem] border-2 transition-all", hasError("soup") ? "border-error-200 bg-error-50/10 shadow-error-100" : "border-sage-100 bg-white")}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                    <Soup className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-black text-carbon-900 uppercase italic">Selecciona la Sopa</h3>
                </div>
                <div className="space-y-2">
                  {dailyMenuDisplay.soupOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setSelectedSoup(opt)}
                      className={cn(
                        "w-full p-4 rounded-2xl border-2 text-left transition-all relative overflow-hidden group",
                        selectedSoup?.id === opt.id
                          ? "border-carbon-900 bg-carbon-900 text-white shadow-soft-xl"
                          : "border-sage-50 bg-sage-50/30 text-carbon-600 hover:border-sage-200"
                      )}
                    >
                      <div className="flex items-center justify-between relative z-10">
                        <span className="font-bold text-sm">{opt.name}</span>
                        {selectedSoup?.id === opt.id && <CircleCheck className="w-5 h-5 text-primary-400" />}
                      </div>
                    </button>
                  ))}
                </div>
              </Card>

              {/* Principio */}
              <Card variant="bordered" padding="md" className={cn("rounded-[2rem] border-2 transition-all", hasError("principle") ? "border-error-200 bg-error-50/10 shadow-error-100" : "border-sage-100 bg-white")}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                    <Utensils className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-black text-carbon-900 uppercase italic">Principio</h3>
                </div>
                <div className="space-y-2">
                  {dailyMenuDisplay.principleOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setSelectedPrinciple(opt)}
                      className={cn(
                        "w-full p-4 rounded-2xl border-2 text-left transition-all",
                        selectedPrinciple?.id === opt.id
                          ? "border-carbon-900 bg-carbon-900 text-white shadow-soft-xl"
                          : "border-sage-50 bg-sage-50/30 text-carbon-600 hover:border-sage-200"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm">{opt.name}</span>
                        {selectedPrinciple?.id === opt.id && <CircleCheck className="w-5 h-5 text-primary-400" />}
                      </div>
                    </button>
                  ))}
                </div>
              </Card>

              {/* Ensalada */}
              <Card variant="bordered" padding="md" className={cn("rounded-[2rem] border-2 transition-all", hasError("salad") ? "border-error-200 bg-error-50/10 shadow-error-100" : "border-sage-100 bg-white")}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                    <Salad className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-black text-carbon-900 uppercase italic">Ensalada</h3>
                </div>
                <div className="space-y-2">
                  {dailyMenuDisplay.saladOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setSelectedSalad(opt)}
                      className={cn(
                        "w-full p-4 rounded-2xl border-2 text-left transition-all",
                        selectedSalad?.id === opt.id
                          ? "border-carbon-900 bg-carbon-900 text-white shadow-soft-xl"
                          : "border-sage-50 bg-sage-50/30 text-carbon-600 hover:border-sage-200"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm">{opt.name}</span>
                        {selectedSalad?.id === opt.id && <CircleCheck className="w-5 h-5 text-primary-400" />}
                      </div>
                    </button>
                  ))}
                </div>
              </Card>

              {/* Bebida */}
              <Card variant="bordered" padding="md" className={cn("rounded-[2rem] border-2 transition-all", hasError("drink") ? "border-error-200 bg-error-50/10 shadow-error-100" : "border-sage-100 bg-white")}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                    <CupSoda className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-black text-carbon-900 uppercase italic">Bebida</h3>
                </div>
                <div className="space-y-2">
                  {dailyMenuDisplay.drinkOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setSelectedDrink(opt)}
                      className={cn(
                        "w-full p-4 rounded-2xl border-2 text-left transition-all",
                        selectedDrink?.id === opt.id
                          ? "border-carbon-900 bg-carbon-900 text-white shadow-soft-xl"
                          : "border-sage-50 bg-sage-50/30 text-carbon-600 hover:border-sage-200"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm">{opt.name}</span>
                        {selectedDrink?.id === opt.id && <CircleCheck className="w-5 h-5 text-primary-400" />}
                      </div>
                    </button>
                  ))}
                </div>
              </Card>
            </div>

            {/* Acompañamiento Opcional */}
            {dailyMenuDisplay.extraOptions.length > 0 && (
              <Card variant="bordered" padding="md" className={cn("rounded-[2rem] border-2 transition-all", hasError("extra") ? "border-error-200 bg-error-50/10 shadow-error-100" : "border-sage-100 bg-white")}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                    <IceCream className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-black text-carbon-900 uppercase italic">Acompañamiento Extra</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {dailyMenuDisplay.extraOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setSelectedExtra(opt)}
                      className={cn(
                        "w-full p-4 rounded-2xl border-2 text-left transition-all",
                        selectedExtra?.id === opt.id
                          ? "border-carbon-900 bg-carbon-900 text-white shadow-soft-xl"
                          : "border-sage-50 bg-sage-50/30 text-carbon-600 hover:border-sage-200"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm">{opt.name}</span>
                        {selectedExtra?.id === opt.id && <CircleCheck className="w-5 h-5 text-primary-400" />}
                      </div>
                    </button>
                  ))}
                </div>
              </Card>
            )}
          </motion.div>
        )}

        <ReplacementManager
          replacements={replacements}
          setReplacements={setReplacements}
        />

        <MenuItemSelector
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filteredItems={filteredLooseItems}
          popularProducts={popularProducts}
          onAddItem={handleAddLooseItem}
          onUpdateQuantity={handleUpdateLooseItemQuantity}
          selectedItems={looseItems}
        />
      </div>

      <Card variant="bordered" padding="md" className="rounded-[2rem] border-2 border-sage-100 bg-white shadow-soft-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-sage-50 text-sage-600 flex items-center justify-center">
            <PackageCheck className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-black text-carbon-900 uppercase italic tracking-widest">Notas Adicionales</h3>
        </div>
        <textarea
          value={orderNotes}
          onChange={(e) => setOrderNotes(e.target.value)}
          placeholder="Ej: Sin sal, bien cocido, alérgenos..."
          className="w-full p-4 rounded-2xl border-2 border-sage-50 bg-sage-50/20 focus:border-carbon-900 focus:bg-white focus:outline-none resize-none transition-all font-medium text-carbon-700"
          rows={3}
        />
      </Card>
    </div>
  );
}
