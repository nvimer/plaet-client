/**
 * OrderCreatePage - Premium Edition
 */

import { Button, Card } from "@/components";
import { useOrderBuilder } from "../hooks";
import { useAuth } from "@/hooks";
import { RoleName, OrderType } from "@/types";
import { useCashClosure } from "@/features/cash-closure/hooks/useCashClosure";
import {
  OrderForm,
  OrdersListPanel,
  OrderSummaryModal,
  FixedOrderSummaryBar,
} from "../components";
import { ROUTES } from "@/app/routes";
import { toast } from "sonner";
import {
  ArrowLeft,
  UtensilsCrossed,
  ShoppingBag,
  Bike,
  Sparkles,
  Calendar,
  LayoutGrid,
  AlertTriangle,
  Box,
} from "lucide-react";
import { SidebarLayout } from "@/layouts/SidebarLayout";
import { TableSelector } from "@/features/tables/components/TableSelector";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import { useMemo } from "react";
import { variants, transitions } from "@/utils/motion";
import { getLocalDateString } from "@/utils/dateUtils";
import { useUIStore } from "@/stores/useUIStore";

export function OrderCreatePage() {
  const { user } = useAuth();
  const isCollapsed = useUIStore((state) => state.isCollapsed);
  const isMobile = useUIStore((state) => state.isMobile);
  const isAdmin = user?.roles?.some(r => 
    (typeof r === 'object' && 'name' in r ? r.name : r) === RoleName.ADMIN
  );

  const { currentShift, isOpen: isCashOpen, isLoading: isCashLoading } = useCashClosure();
  
  // Verify if there's an open shift from a previous day
  const isShiftFromPreviousDay = useMemo(() => {
    if (!isCashOpen || !currentShift) return false;
    const shiftDate = new Date(currentShift.openingDate).toDateString();
    const today = new Date().toDateString();
    return shiftDate !== today;
  }, [isCashOpen, currentShift]);

  const orderBuilderRaw = useOrderBuilder();

  // 100% Safe normalization of the hook return to prevent production crashes
  const orderBuilder = useMemo(() => {
    if (!orderBuilderRaw) {
      return {
        isLoading: true,
        isPending: false,
        tables: [],
        availableTables: [],
        selectedOrderType: null,
        selectedTable: null,
        tableOrders: [],
        currentOrderIndex: null,
        showSummaryModal: false,
        showDailyMenu: false,
        backdatedDate: null,
        isHistoricalMode: false,
        setBackdatedDate: () => {},
        setIsHistoricalMode: () => {},
        setShowSummaryModal: () => {},
        setShowDailyMenu: () => {},
        handleSelectOrderType: () => {},
        setSelectedTable: () => {},
        handleBackToOrderType: () => {},
        handleShowSummary: () => {},
        handleConfirmTableOrders: async () => {},
        clearCurrentOrder: () => {},
        customerName: "",
        setCustomerName: () => {},
        customerId: null,
        customerPhone: "",
        setCustomerPhone: () => {},
        customerPhone2: "",
        setCustomerPhone2: () => {},
        deliveryAddress: "",
        setDeliveryAddress: () => {},
        address2: "",
        setAddress2: () => {},
        hasCustomerData: false,
        setHasCustomerData: () => {},
        packagingFee: 1000,
        packagingQuantity: 0,
        setPackagingQuantity: () => {},
        dailyMenuDisplay: {
          soupOptions: [],
          principleOptions: [],
          saladOptions: [],
          extraOptions: [],
          drinkOptions: [],
          dessertOptions: [],
          riceOptions: [],
          riceOption: null,
          basePrice: 0,
          isConfigured: false,
        },
        dailyMenuPrices: { basePrice: 0, isConfigured: false },
        selectedSoup: null,
        setSelectedSoup: () => {},
        selectedPrinciple: null,
        setSelectedPrinciple: () => {},
        selectedSalad: null,
        setSelectedSalad: () => {},
        selectedDrink: null,
        setSelectedDrink: () => {},
        selectedExtra: null,
        setSelectedExtra: () => {},
        selectedRice: null,
        setSelectedRice: () => {},
        proteins: [],
        selectedProtein: null,
        setSelectedProtein: () => {},
        replacements: [],
        setReplacements: () => {},
        looseItems: [],
        setLooseItems: () => {},
        searchTerm: "",
        setSearchTerm: () => {},
        filteredLooseItems: [],
        popularProducts: [],
        handleAddLooseItem: () => {},
        handleUpdateLooseItemQuantity: () => {},
        orderNotes: "",
        setOrderNotes: () => {},
        validationErrors: [],
        hasError: () => false,
        handleAddOrderToTable: () => {},
        handleEditOrder: () => {},
        handleRemoveOrder: () => {},
        handleDuplicateOrder: () => {},
        currentOrderTotal: 0,
        tableTotal: 0,
        touchedFields: new Set<string>(),
      };
    }

    return {
      ...orderBuilderRaw,
      dailyMenuDisplay: orderBuilderRaw.dailyMenuDisplay || {
        soupOptions: [],
        principleOptions: [],
        saladOptions: [],
        extraOptions: [],
        drinkOptions: [],
        dessertOptions: [],
        riceOptions: [],
        riceOption: null,
        basePrice: 0,
        isConfigured: false,
      },
      dailyMenuPrices: orderBuilderRaw.dailyMenuPrices || { basePrice: 0, isConfigured: false },
      validationErrors: orderBuilderRaw.validationErrors || [],
      tableOrders: orderBuilderRaw.tableOrders || [],
      availableTables: orderBuilderRaw.availableTables || [],
      proteins: orderBuilderRaw.proteins || [],
      looseItems: orderBuilderRaw.looseItems || [],
      filteredLooseItems: orderBuilderRaw.filteredLooseItems || [],
      popularProducts: orderBuilderRaw.popularProducts || [],
      replacements: orderBuilderRaw.replacements || [],
      selectedSoup: orderBuilderRaw.selectedSoup ?? null,
      selectedPrinciple: orderBuilderRaw.selectedPrinciple ?? null,
      selectedSalad: orderBuilderRaw.selectedSalad ?? null,
      selectedDrink: orderBuilderRaw.selectedDrink ?? null,
      selectedExtra: orderBuilderRaw.selectedExtra ?? null,
      selectedRice: orderBuilderRaw.selectedRice ?? null,
      selectedProtein: orderBuilderRaw.selectedProtein ?? null,
      touchedFields: orderBuilderRaw.touchedFields || new Set<string>(),
    };
  }, [orderBuilderRaw]);

  // Explicit destructuring for high-visibility debugging and compiler safety
  const {
    isLoading,
    isPending,
    tables,
    availableTables,
    selectedOrderType,
    selectedTable,
    tableOrders,
    currentOrderIndex,
    showSummaryModal,
    showDailyMenu,
    backdatedDate,
    isHistoricalMode,
    setBackdatedDate,
    setIsHistoricalMode,
    setShowSummaryModal,
    setShowDailyMenu,
    handleSelectOrderType,
    setSelectedTable,
    handleBackToOrderType,
    handleShowSummary,
    handleConfirmTableOrders,
    clearCurrentOrder,
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
    touchedFields,
    handleAddOrderToTable,
    handleEditOrder,
    handleRemoveOrder,
    handleDuplicateOrder,
    currentOrderTotal,
    tableTotal,
  } = orderBuilder;

  const handleTableSelect = (table: { id: number }) => {
    setSelectedTable(table.id);
  };

  const handleCancelEdit = () => {
    clearCurrentOrder();
    toast.info("Edición cancelada");
  };

  const scrollToOrder = () => {
    const orderSection = document.getElementById("current-order");
    if (orderSection) {
      orderSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleQuickPackaging = () => {
    handleSelectOrderType(OrderType.TAKE_OUT);
    clearCurrentOrder();
    setCustomerName("Venta Rápida");
    setCustomerPhone("0000000");
    
    const packagingItem = {
      id: -1,
      name: "Portacomida",
      price: packagingFee,
      quantity: 1
    };
    
    const quickOrder = {
      id: Date.now().toString(),
      protein: null,
      lunch: null,
      looseItems: [packagingItem],
      total: packagingFee,
      notes: "Venta Rápida: Portacomida",
      createdAt: Date.now(),
    };
    
    setTableOrders([quickOrder]);
    setShowSummaryModal(true);
    toast.success("Venta rápida de empaque preparada");
  };

  if (isLoading || isCashLoading) {
    return (
      <SidebarLayout title="Nuevo Pedido" backRoute={ROUTES.ORDERS}>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-sage-100 border-t-sage-600" />
          <p className="text-carbon-400 font-bold text-sm tracking-wide">Preparando terminal...</p>
        </div>
      </SidebarLayout>
    );
  }

  if (isShiftFromPreviousDay && !backdatedDate) {
    return (
      <SidebarLayout title="Bloqueo de Caja" backRoute={ROUTES.ORDERS}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center min-h-[70vh]">
          <motion.div variants={variants.fadeInUp} initial="initial" animate="animate" exit="exit">
            <Card variant="elevated" className="p-8 sm:p-12 flex flex-col items-center text-center rounded-[3rem] border-2 border-error-200 bg-error-50/30">
              <div className="w-24 h-24 bg-error-100 rounded-3xl flex items-center justify-center text-error-600 mb-8 shadow-inner rotate-3">
                <AlertTriangle className="w-12 h-12 stroke-[2.5px]" />
              </div>
              <h2 className="text-3xl font-black text-carbon-900 tracking-tight mb-4">
                Cierre de Caja Pendiente
              </h2>
              <p className="text-lg text-carbon-600 font-medium max-w-lg leading-relaxed mb-10">
                El sistema detectó que el turno de caja del día anterior <strong>no fue cerrado</strong>. 
                Por seguridad operativa y contable, debes cerrar el turno anterior y abrir uno nuevo para el día de hoy antes de poder tomar nuevos pedidos.
              </p>
              <div className="flex gap-4">
                <Button 
                  variant="outline"
                  size="lg" 
                  onClick={() => window.location.href = ROUTES.DASHBOARD}
                  className="h-14 px-8 rounded-2xl font-bold border-error-200 text-carbon-600 hover:bg-error-50"
                >
                  Volver al Inicio
                </Button>
                <Button 
                  variant="primary"
                  size="lg" 
                  onClick={() => window.location.href = ROUTES.CASH_CLOSURE}
                  className="h-14 px-8 rounded-2xl font-bold bg-carbon-900 text-white hover:bg-carbon-800 shadow-xl"
                >
                  Ir a Control de Caja
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </SidebarLayout>
    );
  }

  if (!selectedOrderType) {
    return (
      <SidebarLayout title="Tipo de Pedido" backRoute={ROUTES.ORDERS}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center min-h-[70vh]">
          <motion.div 
            variants={variants.fadeInUp} initial="initial" animate="animate" exit="exit"
            className="text-center mb-16 space-y-3"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-sage-100 rounded-full text-sage-700 text-[10px] font-semibold tracking-[0.2em] mb-2">
              <Sparkles className="w-3 h-3" />
              Iniciando Pedido
            </div>
            <h1 className="text-5xl font-black text-carbon-900 tracking-tighter">¿Cómo desea ordenar?</h1>
            <p className="text-xl text-carbon-500 font-medium">Seleccione el modo de servicio para continuar.</p>
          </motion.div>

          <motion.div 
            variants={transitions.stagger(0.05)}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-4xl"
          >
            {[
              { type: OrderType.DINE_IN, label: "Para Mesa", desc: "Comer en el local", icon: UtensilsCrossed, color: "text-sage-600", bg: "bg-sage-50" },
              { type: OrderType.TAKE_OUT, label: "Recoger", desc: "Recoger pedido", icon: ShoppingBag, color: "text-warning-600", bg: "bg-warning-50" },
              { type: OrderType.DELIVERY, label: "Domicilio", desc: "Entrega a casa", icon: Bike, color: "text-blue-600", bg: "bg-blue-50" },
            ].map((opt) => (
              <motion.button
                key={opt.type}
                variants={variants.scaleIn}
                onClick={() => handleSelectOrderType(opt.type)}
                className="group relative flex flex-col items-center p-10 rounded-[2.5rem] bg-white border-2 border-sage-100 hover:border-carbon-900 hover:shadow-soft-2xl transition-all duration-500 active:scale-[0.98] overflow-hidden"
              >
                <div className={cn(
                  "w-24 h-24 rounded-3xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-105 shadow-inner-lg",
                  opt.bg, opt.color
                )}>
                  <opt.icon className="w-12 h-12 stroke-[1.5px]" />
                </div>
                <span className="text-2xl font-black text-carbon-900 tracking-tight">{opt.label}</span>
                <span className="text-sm text-carbon-400 font-medium tracking-wide mt-2">{opt.desc}</span>
              </motion.button>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-16 w-full max-w-2xl"
          >
            <div className="flex items-center gap-3 mb-6 px-2">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-sage-200" />
              <span className="text-[10px] font-black text-carbon-400 uppercase tracking-[0.3em]">Ventas Rápidas / Extras</span>
              <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-sage-200" />
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleQuickPackaging}
                className="group flex items-center gap-4 px-8 py-4 bg-white border-2 border-warning-100 rounded-2xl hover:border-warning-500 hover:bg-warning-50 transition-all duration-300 shadow-soft-sm active:scale-95"
              >
                <div className="w-10 h-10 rounded-xl bg-warning-100 text-warning-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Box className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-black text-carbon-900 uppercase tracking-tight">Portacomida</p>
                  <p className="text-[10px] font-bold text-warning-600">${packagingFee.toLocaleString()} (Solo empaque)</p>
                </div>
              </button>
            </div>
          </motion.div>
        </div>
      </SidebarLayout>
    );
  }

  if (selectedOrderType === OrderType.DINE_IN && !selectedTable) {
    return (
      <SidebarLayout
        title="Seleccionar Mesa"
        backRoute={ROUTES.ORDERS}
        actions={
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToOrderType}
            className="rounded-xl text-carbon-400 font-bold hover:text-carbon-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Cambiar Tipo
          </Button>
        }
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div 
            variants={variants.fadeInUp} initial="initial" animate="animate" exit="exit"
            className="mb-10 space-y-2"
          >
            <div className="flex items-center gap-2 text-sage-600">
              <LayoutGrid className="w-5 h-5" />
              <span className="text-[10px] font-semibold tracking-[0.2em]">Mapa de Sala</span>
            </div>
            <h1 className="text-4xl font-bold text-carbon-900 tracking-tight">Elija una mesa disponible</h1>
            <p className="text-lg text-carbon-500 font-medium">Toque el número de la mesa para iniciar la orden.</p>
          </motion.div>

          <AnimatePresence mode="wait">
            {availableTables.length === 0 ? (
              <motion.div key="empty" variants={variants.fadeInUp} initial="initial" animate="animate" exit="exit">
                <Card variant="elevated" className="py-20 flex flex-col items-center justify-center rounded-[3rem] border-dashed border-2 border-sage-200 bg-sage-50/20">
                  <div className="w-20 h-20 bg-white rounded-full shadow-soft-md flex items-center justify-center mb-6">
                    <Sparkles className="w-10 h-10 text-sage-300" />
                  </div>
                  <h2 className="text-2xl font-bold text-carbon-900 mb-2">Restaurante Lleno</h2>
                  <p className="text-carbon-500 max-w-xs text-center font-medium">Todas las mesas están ocupadas actualmente.</p>
                  <Button 
                    variant="outline" 
                    onClick={handleBackToOrderType}
                    className="mt-8 rounded-2xl border-sage-200"
                  >
                    Volver
                  </Button>
                </Card>
              </motion.div>
            ) : (
              <motion.div key="selector" variants={variants.fadeInUp} initial="initial" animate="animate" exit="exit">
                <div className="bg-white p-10 rounded-[3rem] border border-sage-100 shadow-smooth-xl">
                  <TableSelector
                    tables={tables as never}
                    selectedTableId={selectedTable || undefined}
                    onSelect={handleTableSelect}
                    showOnlyAvailable={true}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <>
      <SidebarLayout
        title={selectedOrderType === OrderType.DINE_IN ? `Orden · Mesa ${selectedTable}` : "Nuevo Pedido"}
        backRoute={ROUTES.ORDERS}
        actions={
          <div className="flex items-center gap-2">
            {isAdmin && (
              <div className="flex items-center gap-3 mr-4">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={isHistoricalMode}
                      onChange={(e) => {
                        const val = e.target.checked;
                        setIsHistoricalMode(val);
                        if (!val) setBackdatedDate(null);
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-6 bg-carbon-200 rounded-full peer peer-checked:bg-warning-500 transition-colors" />
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4" />
                  </div>
                  <span className="text-[10px] font-bold text-carbon-400 uppercase tracking-widest group-hover:text-carbon-600 transition-colors">
                    Modo Histórico
                  </span>
                </label>

                {isHistoricalMode && (
                  <motion.div 
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="hidden sm:flex items-center gap-2 px-3 py-2 bg-white border-2 border-warning-200 rounded-xl shadow-soft-sm"
                  >
                    <Calendar className="w-4 h-4 text-warning-500" />
                    <input
                      type="date"
                      value={backdatedDate || getLocalDateString(new Date())}
                      onChange={(e) => setBackdatedDate(e.target.value)}
                      className="bg-transparent border-none text-[11px] font-black text-carbon-900 focus:ring-0 cursor-pointer p-0 w-28 uppercase"
                    />
                  </motion.div>
                )}
              </div>
            )}
            <Button
              variant="secondary"
              size="sm"
              onClick={handleBackToOrderType}
              className="rounded-xl h-10 px-3 sm:px-4"
            >
              <ArrowLeft className="w-3.5 h-3.5 sm:mr-2" />
              <span className="hidden sm:inline">Tipo</span>
            </Button>
          </div>
        }
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <motion.div 
              id="current-order"
              variants={variants.fadeInUp}
              initial="initial"
              animate="animate"
              className="space-y-6"
            >
              <OrderForm
                selectedOrderType={selectedOrderType}
                currentOrderIndex={currentOrderIndex}
                tableOrdersLength={tableOrders.length}
                customerName={customerName}
                setCustomerName={setCustomerName}
                customerId={customerId}
                customerPhone={customerPhone}
                setCustomerPhone={setCustomerPhone}
                customerPhone2={customerPhone2}
                setCustomerPhone2={setCustomerPhone2}
                deliveryAddress={deliveryAddress}
                setDeliveryAddress={setDeliveryAddress}
                address2={address2}
                setAddress2={setAddress2}
                packagingFee={packagingFee}
                packagingQuantity={packagingQuantity}
                setPackagingQuantity={setPackagingQuantity}
                showDailyMenu={showDailyMenu}
                setShowDailyMenu={setShowDailyMenu}
                dailyMenuDisplay={dailyMenuDisplay}
                dailyMenuPrices={dailyMenuPrices}
                selectedSoup={selectedSoup}
                setSelectedSoup={setSelectedSoup}
                selectedPrinciple={selectedPrinciple}
                setSelectedPrinciple={setSelectedPrinciple}
                selectedSalad={selectedSalad}
                setSelectedSalad={setSelectedSalad}
                selectedDrink={selectedDrink}
                setSelectedDrink={setSelectedDrink}
                selectedExtra={selectedExtra}
                setSelectedExtra={setSelectedExtra}
                selectedRice={selectedRice}
                setSelectedRice={setSelectedRice}
                proteins={proteins}
                filteredLooseItems={filteredLooseItems}
                popularProducts={popularProducts}
                selectedProtein={selectedProtein}
                setSelectedProtein={setSelectedProtein}
                replacements={replacements}
                setReplacements={setReplacements}
                looseItems={looseItems}
                setLooseItems={setLooseItems}
                hasCustomerData={hasCustomerData}
                setHasCustomerData={setHasCustomerData}
                searchResults={searchResults}
                showDropdown={showDropdown}
                onSearchCustomers={searchCustomersByName}
                onSelectCustomer={selectSearchedCustomer}
                availableTables={availableTables}
                selectedTable={selectedTable}
                setSelectedTable={setSelectedTable}
                showDailyMenu={showDailyMenu}
                setShowDailyMenu={setShowDailyMenu}
                orderNotes={orderNotes}
                setOrderNotes={setOrderNotes}
                validationErrors={validationErrors}
                hasError={hasError}
                touchedFields={touchedFields}
                setTouchedFields={setTouchedFields}
                dailyMenuData={dailyMenuData}
              />
            </motion.div>

            <motion.div 
              variants={variants.fadeInRight}
              initial="initial"
              animate="animate"
              className="lg:sticky lg:top-6 h-fit"
            >
              <OrdersListPanel
                orders={tableOrders}
                currentOrderIndex={currentOrderIndex}
                tableTotal={tableTotal}
                isDineIn={selectedOrderType === OrderType.DINE_IN}
                isPending={isPending}
                onEdit={handleEditOrder}
                onRemove={handleRemoveOrder}
                onDuplicate={handleDuplicateOrder}
                onShowSummary={handleShowSummary}
              />
            </motion.div>
          </div>
        </div>

        <div className={cn(
          "fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t border-sage-100 shadow-soft-2xl transition-all duration-500",
          !isMobile && (isCollapsed ? "ml-20" : "ml-72")
        )}>
          <FixedOrderSummaryBar
            looseItems={looseItems}
            currentOrderTotal={currentOrderTotal}
            tableTotal={tableTotal}
            hasProtein={!!selectedProtein}
            currentProteinName={selectedProtein?.name}
            onAddOrder={() => handleAddOrderToTable()}
            onShowSummary={handleShowSummary}
            scrollToOrder={scrollToOrder}
            ordersCount={tableOrders.length}
            onAddManualItem={handleAddLooseItem}
            packagingFee={packagingFee}
            isHistorical={isHistoricalMode}
          />
        </div>
      </SidebarLayout>

      <OrderSummaryModal
        isOpen={showSummaryModal}
        orders={tableOrders}
        tableTotal={tableTotal}
        orderType={selectedOrderType}
        tableId={selectedTable}
        isPending={isPending}
        isHistorical={isHistoricalMode}
        customerName={customerName}
        customerPhone={customerPhone}
        deliveryAddress={deliveryAddress}
        onClose={() => setShowSummaryModal(false)}
        onConfirm={handleConfirmTableOrders}
      />
    </>
  );
}
