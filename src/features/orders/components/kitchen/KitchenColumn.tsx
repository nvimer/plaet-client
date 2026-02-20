import { useMemo } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { cn } from "@/utils/cn";
import { type Order, OrderStatus } from "@/types";
import { KitchenOrderCard } from "./KitchenOrderCard";

export interface KitchenColumnProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  orders: Order[];
  readyItemIds: number[];
  onToggleItemReady: (orderId: string, itemId: number, ready: boolean) => void;
  onStatusChange: (orderId: string, status: OrderStatus) => void;
  isMobile?: boolean;
}

export function KitchenColumn({
  id,
  title,
  icon,
  color,
  orders,
  readyItemIds,
  onToggleItemReady,
  onStatusChange,
  isMobile = false,
}: KitchenColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      type: "column",
      status: id,
    },
  });

  const orderIds = useMemo(() => orders.map((o) => o.id), [orders]);

  return (
    <div
      className={cn(
        "flex flex-col h-full rounded-2xl bg-slate-50 border-2 transition-colors",
        isOver ? "border-sage-400 bg-sage-50" : "border-transparent"
      )}
    >
      <div className={cn("flex items-center gap-3 p-4 rounded-t-2xl", color)}>
        {icon}
        <h2 className="text-xl font-bold text-carbon-900">{title}</h2>
        <span className="ml-auto bg-white/30 px-3 py-1 rounded-full text-lg font-bold">
          {orders.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className="flex-1 p-4 overflow-y-auto space-y-4 min-h-[300px] max-h-[calc(100vh-280px)]"
      >
        <SortableContext items={orderIds} strategy={verticalListSortingStrategy}>
          {orders.map((order) => (
            <KitchenOrderCard
              key={order.id}
              order={order}
              readyItemIds={readyItemIds}
              onToggleItemReady={onToggleItemReady}
              onStatusChange={onStatusChange}
              isMobile={isMobile}
            />
          ))}
        </SortableContext>

        {orders.length === 0 && (
          <div className="flex items-center justify-center h-32 text-carbon-400">
            <p className="text-center">No hay pedidos</p>
          </div>
        )}
      </div>
    </div>
  );
}
