/**
 * OrderCreatePage - Refactored Edition
 *
 * Major refactoring:
 * - Extracted useOrderBuilder hook for state management
 * - Extracted OrderForm component for lunch configuration
 * - Extracted OrdersListPanel component for order list
 * - Extracted OrderSummaryModal component for confirmation
 * - Reduced from ~1,600 lines to ~400 lines
 * - All comments in English
 * - User-facing text remains in Spanish
 */

import { OrderType } from "@/types";
import { SidebarLayout } from "@/layouts/SidebarLayout";
import { Card } from "@/components";
import { TableSelector } from "@/features/tables";
import { useOrderBuilder } from "../hooks";
import {
  OrderForm,
  OrdersListPanel,
  OrderSummaryModal,
  FixedOrderSummaryBar,
} from "../components";
import { ROUTES } from "@/app/routes";
import { toast } from "sonner";
import {
  Users,
  ArrowLeft,
  UtensilsCrossed,
  ShoppingBag,
  Bike,
  Sparkles,
} from "lucide-react";

export function OrderCreatePage() {
  // Use the order builder hook for all state and logic
  const orderBuilder = useOrderBuilder();

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
    setShowSummaryModal,
    setSelectedOrderType,
    setSelectedTable,
    handleBackToOrderType,
    handleShowSummary,
    handleConfirmTableOrders,
    clearCurrentOrder,
    // All the other state and handlers are available through orderBuilder
    ...formProps
  } = orderBuilder;

  // Adapter for table selection
  const handleTableSelect = (table: { id: number }) => {
    setSelectedTable(table.id);
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    clearCurrentOrder();
    toast.info("Edición cancelada");
  };

  // Scroll to order section
  const scrollToOrder = () => {
    const orderSection = document.getElementById("current-order");
    if (orderSection) {
      orderSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <SidebarLayout
        title="Nuevo Pedido"
        subtitle="Cargando..."
        backRoute={ROUTES.ORDERS}
      >
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-600" />
        </div>
      </SidebarLayout>
    );
  }

  // Step 1: Select order type
  if (!selectedOrderType) {
    return (
      <SidebarLayout
        title="Nuevo Pedido"
        subtitle="Selecciona el tipo de pedido"
        backRoute={ROUTES.ORDERS}
        fullWidth
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* DINE_IN */}
            <button
              onClick={() => setSelectedOrderType(OrderType.DINE_IN)}
              className="group flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl border-2 border-sage-200 bg-white hover:border-sage-400 hover:shadow-soft-lg transition-all duration-300 min-h-[160px] sm:min-h-[200px]"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-sage-100 to-sage-200 text-sage-600 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                <UtensilsCrossed className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-carbon-900">
                Para Mesa
              </span>
              <span className="text-xs sm:text-sm text-carbon-500 mt-1 sm:mt-2">
                Comer en el restaurante
              </span>
            </button>

            {/* TAKE_OUT */}
            <button
              onClick={() => setSelectedOrderType(OrderType.TAKE_OUT)}
              className="group flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl border-2 border-sage-200 bg-white hover:border-amber-400 hover:shadow-soft-lg transition-all duration-300 min-h-[160px] sm:min-h-[200px]"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 text-amber-600 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                <ShoppingBag className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-carbon-900">
                Para Llevar
              </span>
              <span className="text-xs sm:text-sm text-carbon-500 mt-1 sm:mt-2">
                Recoger en local
              </span>
            </button>

            {/* DELIVERY */}
            <button
              onClick={() => setSelectedOrderType(OrderType.DELIVERY)}
              className="group flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl border-2 border-sage-200 bg-white hover:border-blue-400 hover:shadow-soft-lg transition-all duration-300 min-h-[160px] sm:min-h-[200px]"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                <Bike className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-carbon-900">
                Domicilio
              </span>
              <span className="text-xs sm:text-sm text-carbon-500 mt-1 sm:mt-2">
                Entrega a domicilio
              </span>
            </button>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  // Step 2: If DINE_IN and no table selected, show table selector
  if (selectedOrderType === OrderType.DINE_IN && !selectedTable) {
    return (
      <SidebarLayout
        title="Nuevo Pedido"
        subtitle="Selecciona la mesa para tomar el pedido"
        backRoute={ROUTES.ORDERS}
        fullWidth
        actions={
          <button
            onClick={handleBackToOrderType}
            className="flex items-center gap-2 px-4 py-2 bg-sage-100 text-sage-700 rounded-xl font-medium hover:bg-sage-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Cambiar Tipo
          </button>
        }
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card variant="elevated" className="overflow-hidden rounded-2xl">
            <div className="bg-gradient-to-r from-sage-600 to-sage-500 px-4 py-6 sm:px-8 sm:py-8">
              <h2 className="text-white font-semibold text-2xl flex items-center gap-3">
                <Users className="w-7 h-7" />
                Seleccionar Mesa
              </h2>
              <p className="text-sage-100 mt-2">
                Elige la mesa donde vas a tomar los pedidos
              </p>
            </div>

            <div className="p-4 sm:p-8">
              {availableTables.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-2xl bg-sage-100 text-sage-400 flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <p className="text-carbon-700 font-medium">
                    No hay mesas disponibles
                  </p>
                  <p className="text-sm text-carbon-500 mt-1">
                    Todas las mesas están ocupadas
                  </p>
                </div>
              ) : (
                <TableSelector
                  tables={tables as never}
                  selectedTableId={selectedTable || undefined}
                  onSelect={handleTableSelect}
                  showOnlyAvailable={true}
                />
              )}
            </div>
          </Card>
        </div>
      </SidebarLayout>
    );
  }

  // Step 3: Main order creation form
  return (
    <>
      <SidebarLayout
        title="Nuevo Pedido"
        subtitle={
          selectedOrderType === OrderType.DINE_IN
            ? `Mesa ${selectedTable} - Configura los pedidos`
            : "Configura los pedidos"
        }
        backRoute={ROUTES.ORDERS}
        fullWidth
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={handleBackToOrderType}
              className="flex items-center gap-2 px-4 py-2 bg-sage-100 text-sage-700 rounded-xl font-medium hover:bg-sage-200 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Cambiar Tipo
            </button>
            {selectedOrderType === OrderType.DINE_IN && (
              <button
                onClick={() => setSelectedTable(null)}
                className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-xl font-medium hover:bg-amber-200 transition-colors"
              >
                <Users className="w-4 h-4" />
                Cambiar Mesa
              </button>
            )}
          </div>
        }
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LEFT: Order Form */}
            <div id="current-order" className="space-y-6">
              <OrderForm
                currentOrderIndex={currentOrderIndex}
                tableOrdersLength={tableOrders.length}
                showDailyMenu={formProps.showDailyMenu}
                setShowDailyMenu={formProps.setShowDailyMenu}
                dailyMenuDisplay={formProps.dailyMenuDisplay}
                dailyMenuPrices={formProps.dailyMenuPrices}
                selectedSoup={formProps.selectedSoup}
                setSelectedSoup={formProps.setSelectedSoup}
                selectedPrinciple={formProps.selectedPrinciple}
                setSelectedPrinciple={formProps.setSelectedPrinciple}
                selectedSalad={formProps.selectedSalad}
                setSelectedSalad={formProps.setSelectedSalad}
                selectedDrink={formProps.selectedDrink}
                setSelectedDrink={formProps.setSelectedDrink}
                selectedExtra={formProps.selectedExtra}
                setSelectedExtra={formProps.setSelectedExtra}
                selectedRice={formProps.selectedRice}
                proteins={formProps.proteins}
                selectedProtein={formProps.selectedProtein}
                setSelectedProtein={formProps.setSelectedProtein}
                replacements={formProps.replacements}
                setReplacements={formProps.setReplacements}
                looseItems={formProps.looseItems}
                searchTerm={formProps.searchTerm}
                setSearchTerm={formProps.setSearchTerm}
                filteredLooseItems={formProps.filteredLooseItems}
                popularProducts={formProps.popularProducts}
                handleAddLooseItem={formProps.handleAddLooseItem}
                handleUpdateLooseItemQuantity={
                  formProps.handleUpdateLooseItemQuantity
                }
                orderNotes={formProps.orderNotes}
                setOrderNotes={formProps.setOrderNotes}
                validationErrors={formProps.validationErrors}
                hasError={formProps.hasError}
                onAddToTable={formProps.handleAddOrderToTable}
                onCancelEdit={handleCancelEdit}
                isLoading={false}
              />
            </div>

            {/* RIGHT: Orders List */}
            <div className="lg:sticky lg:top-6 h-fit">
              <OrdersListPanel
                orders={tableOrders}
                currentOrderIndex={currentOrderIndex}
                tableTotal={formProps.tableTotal}
                isDineIn={selectedOrderType === OrderType.DINE_IN}
                isPending={isPending}
                onEdit={formProps.handleEditOrder}
                onRemove={formProps.handleRemoveOrder}
                onDuplicate={formProps.handleDuplicateOrder}
                onShowSummary={handleShowSummary}
              />
            </div>
          </div>
        </div>
      </SidebarLayout>

      {/* Fixed Order Summary Bar */}
      <FixedOrderSummaryBar
        looseItems={formProps.looseItems}
        total={formProps.currentOrderTotal}
        hasProtein={!!formProps.selectedProtein}
        currentProteinName={formProps.selectedProtein?.name}
        onOrder={() => formProps.handleAddOrderToTable()}
        scrollToOrder={scrollToOrder}
      />

      {/* Summary Modal */}
      <OrderSummaryModal
        isOpen={showSummaryModal}
        orders={tableOrders}
        tableTotal={formProps.tableTotal}
        orderType={selectedOrderType}
        tableId={selectedTable}
        isPending={isPending}
        onClose={() => setShowSummaryModal(false)}
        onConfirm={handleConfirmTableOrders}
      />
    </>
  );
}
