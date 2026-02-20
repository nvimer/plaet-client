import React from "react";
import { useCashClosure } from "@/features/cash-closure/hooks/useCashClosure";
import { Card } from "@/components/ui/Card/Card";
import { Wallet, ArrowRight, Lock, Unlock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/app/routes";
import { cn } from "@/utils/cn";

/**
 * ACTIVE SHIFT WIDGET
 * Professional widget to show cash shift status at a glance.
 */
export const ActiveShiftWidget: React.FC = () => {
  const { currentShift, isOpen, isLoading } = useCashClosure();
  const navigate = useNavigate();

  if (isLoading) return <div className="h-32 bg-sage-50 animate-pulse rounded-3xl" />;

  return (
    <Card 
      variant="elevated" 
      className={cn(
        "relative overflow-hidden border-none shadow-smooth-lg transition-all active:scale-[0.98] cursor-pointer group",
        isOpen ? "bg-white" : "bg-carbon-900"
      )}
      onClick={() => navigate(ROUTES.CASH_CLOSURE)}
    >
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300",
            isOpen ? "bg-success-50 text-success-600" : "bg-carbon-800 text-carbon-400"
          )}>
            {isOpen ? <Unlock className="w-7 h-7" /> : <Lock className="w-7 h-7" />}
          </div>
          <div>
            <h4 className={cn(
              "text-sm font-bold uppercase tracking-wider mb-1",
              isOpen ? "text-carbon-500" : "text-carbon-400"
            )}>
              Turno de Caja
            </h4>
            <p className={cn(
              "text-xl font-black",
              isOpen ? "text-carbon-900" : "text-white"
            )}>
              {isOpen ? "Activo" : "Cerrado"}
            </p>
          </div>
        </div>

        <div className="text-right">
          {isOpen ? (
            <>
              <p className="text-xs text-carbon-400 font-medium">Base de apertura</p>
              <p className="text-lg font-bold text-success-600">${currentShift?.openingBalance.toLocaleString()}</p>
            </>
          ) : (
            <div className="flex items-center gap-2 text-carbon-400 font-bold group-hover:text-white transition-colors">
              Abrir <ArrowRight className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>
      
      {/* Decorative background element */}
      <Wallet className={cn(
        "absolute -right-4 -bottom-4 w-24 h-24 opacity-5 transform rotate-12",
        isOpen ? "text-success-900" : "text-white"
      )} />
    </Card>
  );
};
