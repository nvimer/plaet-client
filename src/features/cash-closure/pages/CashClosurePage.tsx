import React, { useState, useMemo } from "react";
import { useCashClosure } from "../hooks/useCashClosure";
import { useOrders } from "@/features/orders/hooks";
import { OrderStatus } from "@/types";
import { OpenShiftModal } from "../components/OpenShiftModal";
import { CloseShiftModal } from "../components/CloseShiftModal";
import { Skeleton } from "@/components/ui/Skeleton/Skeleton";
import { LogIn, LogOut, AlertCircle, CheckCircle2, ShoppingBag } from "lucide-react";
import { cn } from "@/utils/cn";
import { ROUTES } from "@/app/routes";

import { SidebarLayout } from "@/layouts/SidebarLayout";

/**
 * PAGE: CashClosurePage
 */
export const CashClosurePage: React.FC = () => {
  const { currentShift, isLoading, isOpen } = useCashClosure();
  const { data: orders } = useOrders();
  const [isOpenModalOpen, setIsOpenModalOpen] = useState(false);
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);

  // Check for active orders (anything not PAID, DELIVERED or CANCELLED)
  const activeOrders = useMemo(() => {
    if (!orders) return [];
    return orders.filter(
      (order) => 
        order.status !== OrderStatus.PAID && 
        order.status !== OrderStatus.DELIVERED && 
        order.status !== OrderStatus.CANCELLED
    );
  }, [orders]);

  const hasActiveOrders = activeOrders.length > 0;

  if (isLoading) {
    return (
      <div className="p-4 space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <SidebarLayout hideTitle fullWidth>
      <div className="space-y-10 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto pb-24">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-sage-600">
            <LogIn className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Tesorería</span>
          </div>
          <h1 className="text-3xl font-bold text-carbon-900 tracking-tight">Control de Caja</h1>
          <p className="text-sm text-carbon-500 font-medium">Gestiona la apertura y cierre de turnos para asegurar tus ingresos.</p>
        </div>
      </header>

      {!isOpen ? (
        /* CLOSED STATE */
        <div className="bg-white rounded-3xl shadow-sm border border-sage-100 p-12 flex flex-col items-center text-center space-y-6">
          <div className="w-20 h-20 bg-sage-50 rounded-full flex items-center justify-center text-sage-500">
            <LogOut className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-carbon-800">Caja Cerrada</h2>
            <p className="text-carbon-500 max-w-sm">
              No hay un turno activo en este momento. Inicia el turno para comenzar a registrar ventas.
            </p>
          </div>
          <button
            onClick={() => setIsOpenModalOpen(true)}
            className="flex items-center gap-2 px-8 py-4 bg-sage-600 text-white rounded-2xl font-bold text-lg hover:bg-sage-700 transition-all active:scale-95 shadow-lg shadow-sage-200"
          >
            <LogIn className="w-5 h-5" />
            Abrir Turno
          </button>
        </div>
      ) : (
        /* OPEN STATE */
        <div className="space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-sage-100 overflow-hidden">
            <div className="bg-success-50 p-6 flex items-center justify-between border-b border-success-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-success-500 rounded-xl flex items-center justify-center text-white">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-success-900">Turno Activo</h3>
                  <p className="text-xs text-success-700">Abierto el {new Date(currentShift!.openingDate).toLocaleString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-success-700 tracking-wide font-bold">Base de Apertura</p>
                <p className="text-xl font-black text-success-900">${currentShift!.openingBalance.toLocaleString()}</p>
              </div>
            </div>

            <div className="p-8 space-y-8">
              {hasActiveOrders && (
                <div className="bg-rose-50 border-2 border-rose-100 rounded-2xl p-5 flex items-start gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="w-10 h-10 rounded-xl bg-rose-500 flex items-center justify-center text-white flex-shrink-0 shadow-lg animate-pulse">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-rose-900 text-sm uppercase tracking-wider">No se puede cerrar caja</h4>
                    <p className="text-sm text-rose-700 mt-1 leading-relaxed">
                      Hay <strong>{activeOrders.length} pedido(s) activos</strong> en el sistema. 
                      Todos los pedidos deben estar Pagados, Entregados o Cancelados antes de realizar el cierre.
                    </p>
                    <button 
                      onClick={() => window.location.href = ROUTES.ORDERS}
                      className="mt-3 text-xs font-black text-rose-600 uppercase tracking-widest hover:underline flex items-center gap-1"
                    >
                      Resolver pedidos ahora &rarr;
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-carbon-500">Ventas Registradas</p>
                  <p className="text-4xl font-black text-carbon-900">
                    ${(currentShift!.expectedBalance - currentShift!.openingBalance).toLocaleString()}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-carbon-500 text-right">Efectivo Esperado en Caja</p>
                  <p className="text-4xl font-black text-primary-600 text-right">
                    ${currentShift!.expectedBalance.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="pt-8 border-t border-sage-100">
                <button
                  onClick={() => setIsCloseModalOpen(true)}
                  disabled={hasActiveOrders}
                  className={cn(
                    "w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-lg transition-all active:scale-95",
                    hasActiveOrders 
                      ? "bg-carbon-100 text-carbon-400 cursor-not-allowed border-2 border-dashed border-carbon-200" 
                      : "bg-carbon-900 text-white hover:bg-carbon-800 shadow-xl shadow-carbon-100"
                  )}
                >
                  <LogOut className="w-5 h-5" />
                  {hasActiveOrders ? "Finalice los pedidos para cerrar" : "Cerrar Turno de Caja"}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 rounded-2xl p-4 flex gap-4 border border-amber-100">
            <AlertCircle className="w-6 h-6 text-amber-500 flex-shrink-0" />
            <p className="text-sm text-amber-800 leading-relaxed">
              <strong>Nota Importante:</strong> El cierre de caja calculará automáticamente las diferencias. 
              Asegúrate de contar físicamente todo el efectivo antes de confirmar.
            </p>
          </div>
        </div>
      )}

      {/* Modals */}
      <OpenShiftModal 
        isOpen={isOpenModalOpen} 
        onClose={() => setIsOpenModalOpen(false)} 
      />
      {currentShift && (
        <CloseShiftModal 
          isOpen={isCloseModalOpen} 
          onClose={() => setIsCloseModalOpen(false)} 
          currentShift={currentShift}
        />
              )}
            </div>
          </SidebarLayout>
        );
      };
      
