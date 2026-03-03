import { useMemo, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useGesture } from "@use-gesture/react";
import { Clock, CheckCircle, ArrowRight, ArrowLeft, GripVertical } from "lucide-react";
import { cn } from "@/utils/cn";
import { OrderItemStatus } from "@/types";
import { type KitchenItem } from "./KitchenKanban";
import { type KitchenCategoryConfig } from "./kitchenCategories";
import { motion, AnimatePresence } from "framer-motion";

export interface KitchenOrderCardProps {
  item: KitchenItem;
  onStatusChange: (orderId: string, itemId: number, status: OrderItemStatus) => void;
  isMobile?: boolean;
  categoryConfig?: KitchenCategoryConfig;
}

const SWIPE_THRESHOLD = 80;

export function KitchenOrderCard({
  item,
  onStatusChange,
  isMobile = false,
  _categoryConfig,
}: KitchenOrderCardProps) {
  const [translateX, setTranslateX] = useState(0);
  const [_isSwiping, setIsSwiping] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
    data: {
      type: "item",
      item,
    },
    disabled: isMobile,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Swipe gesture for mobile
  const bind = useGesture(
    {
      onDrag: ({ movement: [mx], memo = translateX }) => {
        if (!isMobile) return memo;
        const clampedX = Math.max(-150, Math.min(150, mx));
        setTranslateX(clampedX);
        return memo;
      },
      onDragEnd: ({ movement: [mx], direction: [dir], canceled }) => {
        if (!isMobile || canceled) {
          setTranslateX(0);
          return;
        }
        const swipeDirection = dir > 0 ? "right" : "left";
        if (Math.abs(mx) > SWIPE_THRESHOLD) {
          let newStatus: OrderItemStatus | null = null;
          if (swipeDirection === "right") {
            if (item.status === OrderItemStatus.PENDING) newStatus = OrderItemStatus.IN_KITCHEN;
            else if (item.status === OrderItemStatus.IN_KITCHEN) newStatus = OrderItemStatus.READY;
          } else {
            if (item.status === OrderItemStatus.READY) newStatus = OrderItemStatus.IN_KITCHEN;
            else if (item.status === OrderItemStatus.IN_KITCHEN) newStatus = OrderItemStatus.PENDING;
          }
          if (newStatus) {
            if (navigator.vibrate) navigator.vibrate(50);
            onStatusChange(item.orderId, item.id, newStatus);
          }
        }
        setTranslateX(0);
        setIsSwiping(false);
      },
      onDragStart: () => { if (isMobile) setIsSwiping(true); },
    },
    { drag: { filterTaps: true, threshold: SWIPE_THRESHOLD } }
  );

  const timeInfo = useMemo(() => {
    const now = new Date().getTime();
    const created = new Date(item.createdAt).getTime();
    const diffMinutes = Math.floor((now - created) / (1000 * 60));
    let text = diffMinutes < 1 ? "< 1 min" : `${diffMinutes} min`;
    const isWarning = diffMinutes > 15;
    const isUrgent = diffMinutes > 25;
    return { text, isWarning, isUrgent, diffMinutes };
  }, [item.createdAt]);

  const tableNumber = item.order.table?.number || "S/M";

  return (
    <div
      ref={setNodeRef}
      style={isMobile ? { transform: `translateX(${translateX}px)` } : style}
      {...(isMobile ? bind() : {})}
      className={cn(
        "group relative rounded-3xl bg-white border-2 transition-all duration-300 overflow-hidden",
        isDragging ? "z-50 shadow-soft-2xl scale-105 border-carbon-900 ring-8 ring-carbon-900/5" : "shadow-soft-lg border-sage-100",
      )}
    >
      {/* Header Info */}
      <div className={cn(
        "p-3 flex items-center justify-between border-b transition-colors",
        timeInfo.isUrgent ? "bg-rose-50 border-rose-100" : 
        timeInfo.isWarning ? "bg-amber-50 border-amber-100" : "bg-sage-50/50 border-sage-100"
      )}>
        <div className="flex items-center gap-2">
          {!isMobile && (
            <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1 hover:bg-carbon-900/5 rounded-lg transition-colors">
              <GripVertical className="w-4 h-4 text-carbon-300" />
            </div>
          )}
          <div className="w-8 h-8 rounded-lg bg-carbon-900 flex items-center justify-center text-white shadow-sm">
            <span className="text-sm font-black">{tableNumber}</span>
          </div>
          <span className="text-[10px] font-black text-carbon-400 uppercase tracking-widest">#{item.order.id.slice(-4)}</span>
        </div>

        <div className={cn(
          "flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black transition-all",
          timeInfo.isUrgent ? "bg-rose-500 text-white animate-pulse" : 
          timeInfo.isWarning ? "bg-amber-500 text-white" : "bg-white text-sage-600 border border-sage-200"
        )}>
          <Clock className="w-3 h-3" />
          {timeInfo.text}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h4 className="text-sm font-black text-carbon-900 leading-tight">
              {item.quantity}x {item.menuItem?.name || "Producto"}
            </h4>
            {item.notes && (
              <p className="text-[10px] font-bold text-amber-700 mt-1 italic">
                📝 {item.notes}
              </p>
            )}
          </div>
        </div>

        {/* Action Button (Desktop only, for quick move) */}
        {!isMobile && item.status !== OrderItemStatus.READY && (
          <button
            onClick={() => {
              const next = item.status === OrderItemStatus.PENDING 
                ? OrderItemStatus.IN_KITCHEN 
                : OrderItemStatus.READY;
              onStatusChange(item.orderId, item.id, next);
            }}
            className="w-full py-2 bg-sage-50 hover:bg-carbon-900 hover:text-white text-carbon-600 font-black uppercase tracking-widest text-[9px] rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 border border-sage-100"
          >
            {item.status === OrderItemStatus.PENDING ? "Empezar" : "Listo"}
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
      
      {/* Selection / Status indicator */}
      <div className={cn(
        "absolute bottom-0 left-0 right-0 h-1 transition-all",
        item.status === OrderItemStatus.PENDING ? "bg-blue-400" :
        item.status === OrderItemStatus.IN_KITCHEN ? "bg-orange-400" : "bg-emerald-400"
      )} />
    </div>
  );
}