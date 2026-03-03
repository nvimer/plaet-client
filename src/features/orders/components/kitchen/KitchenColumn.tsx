import { useMemo } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { cn } from "@/utils/cn";
import { OrderItemStatus } from "@/types";
import { KitchenOrderCard } from "./KitchenOrderCard";
import { type KitchenItem } from "./KitchenKanban";
import { type KitchenCategoryConfig } from "./kitchenCategories";

export interface KitchenColumnProps {
  id: OrderItemStatus;
  title: string;
  icon: React.ReactNode;
  color: string;
  items: KitchenItem[];
  onStatusChange: (orderId: string, itemId: number, status: OrderItemStatus) => void;
  isMobile?: boolean;
  categoryConfig?: KitchenCategoryConfig;
}

export function KitchenColumn({
  id,
  title,
  icon,
  color,
  items,
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

  const itemIds = useMemo(() => items.map((i) => i.id), [items]);

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
          {items.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className="flex-1 p-4 overflow-y-auto space-y-4 min-h-[400px] max-h-[calc(100vh-220px)] custom-scrollbar"
      >
        <SortableContext
          items={itemIds}
          strategy={verticalListSortingStrategy}
        >
          {items.map((item) => (
            <KitchenOrderCard
              key={item.id}
              item={item}
              onStatusChange={onStatusChange}
              isMobile={isMobile}
              categoryConfig={categoryConfig}
            />
          ))}
        </SortableContext>

        {items.length === 0 && (
          <div className="flex items-center justify-center h-32 text-carbon-400">
            <p className="text-center font-bold text-sm uppercase tracking-widest opacity-50">Sin platos</p>
          </div>
        )}
      </div>
    </div>
  );
}
