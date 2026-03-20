import React from "react";
import { Ticket, AlertCircle, Sparkles } from "lucide-react";
import { cn } from "@/utils/cn";
import { useTicketBooks } from "../hooks/useTicketBooks";

interface CustomerTicketsInfoProps {
  customerId: string;
  onSellClick: () => void;
}

export const CustomerTicketsInfo: React.FC<CustomerTicketsInfoProps> = ({
  customerId,
  onSellClick,
}) => {
  const { tickets, isLoading } = useTicketBooks(customerId);

  if (isLoading) return <div className="h-12 bg-sage-50 animate-pulse rounded-xl" />;

  const activeTicket = tickets.find((t) => t.status === "active" && t.consumedPortions < t.totalPortions);
  const remaining = activeTicket ? activeTicket.totalPortions - activeTicket.consumedPortions : 0;

  return (
    <div className={cn(
      "p-4 rounded-2xl border-2 transition-all",
      activeTicket 
        ? remaining <= 3 
          ? "bg-warning-50 border-warning-200" 
          : "bg-success-50 border-success-200"
        : "bg-sage-50 border-sage-100"
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center shadow-sm",
            activeTicket 
              ? remaining <= 3 
                ? "bg-warning-500 text-white" 
                : "bg-success-500 text-white"
              : "bg-white text-sage-400"
          )}>
            <Ticket className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-black text-carbon-400 uppercase tracking-widest">Saldo Tiquetera</p>
            <p className={cn(
              "text-lg font-black leading-tight",
              activeTicket ? "text-carbon-900" : "text-carbon-300"
            )}>
              {activeTicket ? `${remaining} almuerzos` : "Sin tiquetera activa"}
            </p>
          </div>
        </div>

        <button
          onClick={onSellClick}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-black transition-all active:scale-95 flex items-center gap-2",
            activeTicket 
              ? "bg-white/50 text-carbon-600 hover:bg-white" 
              : "bg-carbon-900 text-white hover:bg-carbon-800 shadow-md"
          )}
        >
          {!activeTicket && <Sparkles className="w-3.5 h-3.5" />}
          {activeTicket ? "RENOVAR" : "VENDER TIQUETERA"}
        </button>
      </div>

      {activeTicket && remaining <= 3 && (
        <div className="mt-3 flex items-center gap-2 text-warning-700 bg-white/50 p-2 rounded-lg border border-warning-100 animate-pulse">
          <AlertCircle className="w-3.5 h-3.5" />
          <p className="text-[10px] font-bold uppercase tracking-wide">¡Saldo Bajo! Ofrecer renovación</p>
        </div>
      )}
    </div>
  );
};
