import { useMemo } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { cn } from "@/utils/cn";
import { type Order, OrderStatus } from "@/types";
import { KitchenOrderCard } from "./KitchenOrderCard";

import { isPreparableCategory as _isPreparableCategory, type KitchenCategoryConfig } from "./kitchenCategories";

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
  categoryConfig?: KitchenCategoryConfig;
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
  categoryConfig,
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
        "flex flex-col h-full rounded-[2rem] bg-sage-50/30 border-2 transition-all duration-300",
        isOver ? "border-carbon-900 bg-sage-100/50 shadow-soft-xl scale-[1.01]" : "border-sage-100",
      )}
    >
      <div className={cn("flex items-center gap-3 p-5 rounded-t-[1.9rem] border-b border-black/5 shadow-sm", color)}>
        <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md shadow-inner">
          {icon}
        </div>
        <h2 className="text-lg font-black uppercase tracking-widest text-carbon-900">{title}</h2>
        <span className="ml-auto bg-carbon-900/10 px-3 py-1 rounded-xl text-base font-black text-carbon-900">
          {orders.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className="flex-1 p-4 overflow-y-auto space-y-4 min-h-[400px] max-h-[calc(100vh-220px)] custom-scrollbar"
      >
        <SortableContext
          items={orderIds}
          strategy={verticalListSortingStrategy}
        >
          {orders.map((order) => (
            <KitchenOrderCard
              key={order.id}
              order={order}
              readyItemIds={readyItemIds}
              onToggleItemReady={onToggleItemReady}
              onStatusChange={onStatusChange}
              isMobile={isMobile}
              categoryConfig={categoryConfig}
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
