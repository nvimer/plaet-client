import { useMemo, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useGesture } from "@use-gesture/react";
import { Clock, UtensilsCrossed, ArrowRight, ArrowLeft, GripVertical, CheckCircle } from "lucide-react";
import { cn } from "@/utils/cn";
import { OrderStatus, type Order } from "@/types";
import { KitchenItemRow } from "./KitchenItemRow";
import { isPreparableCategory, type KitchenCategoryConfig } from "./kitchenCategories";
import { motion, AnimatePresence } from "framer-motion";

export interface KitchenOrderCardProps {
  order: Order;
  readyItemIds: number[];
  onToggleItemReady: (orderId: string, itemId: number, ready: boolean) => void;
  onStatusChange: (orderId: string, status: OrderStatus) => void;
  isMobile?: boolean;
  categoryConfig?: KitchenCategoryConfig;
}

const SWIPE_THRESHOLD = 80;

export function KitchenOrderCard({
  order,
  readyItemIds,
  onToggleItemReady,
  onStatusChange,
  isMobile = false,
  categoryConfig,
}: KitchenOrderCardProps) {
  const [translateX, setTranslateX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: order.id,
    data: {
      type: "order",
      order,
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
          let newStatus: OrderStatus | null = null;
          if (swipeDirection === "right") {
            if (order.status === OrderStatus.PENDING) newStatus = OrderStatus.IN_KITCHEN;
            else if (order.status === OrderStatus.IN_KITCHEN) newStatus = OrderStatus.READY;
          } else {
            if (order.status === OrderStatus.READY) newStatus = OrderStatus.IN_KITCHEN;
            else if (order.status === OrderStatus.IN_KITCHEN) newStatus = OrderStatus.PENDING;
          }
          if (newStatus) {
            if (navigator.vibrate) navigator.vibrate(50);
            onStatusChange(order.id, newStatus);
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
    const created = new Date(order.createdAt).getTime();
    const diffMinutes = Math.floor((now - created) / (1000 * 60));
    let text = diffMinutes < 1 ? "< 1 min" : `${diffMinutes} min`;
    const isWarning = diffMinutes > 15;
    const isUrgent = diffMinutes > 25;
    return { text, isWarning, isUrgent, diffMinutes };
  }, [order.createdAt]);

  const preparableItems = useMemo(() => {
    return order.items?.filter((item) => isPreparableCategory(item.menuItem?.categoryId, categoryConfig)) || [];
  }, [order.items, categoryConfig]);

  const readyItems = useMemo(() => {
    return preparableItems.filter((item) => readyItemIds.includes(item.id));
  }, [preparableItems, readyItemIds]);

  const allProteinsReady = preparableItems.length > 0 && readyItems.length === preparableItems.length;

  const handleToggleItemReady = (itemId: number, ready: boolean) => {
    onToggleItemReady(order.id, itemId, ready);
  };

  return (
    <div
      ref={setNodeRef}
      style={isMobile ? { transform: `translateX(${translateX}px)` } : style}
      className={cn(
        "group relative rounded-[2rem] bg-white border-2 transition-all duration-300 overflow-hidden",
        isDragging ? "z-50 shadow-soft-2xl scale-105 border-carbon-900 ring-8 ring-carbon-900/5" : "shadow-soft-lg border-sage-100",
        allProteinsReady && order.status !== OrderStatus.READY && "ring-2 ring-emerald-500 ring-offset-2"
      )}
    >
      {/* Header Info */}
      <div className={cn(
        "p-4 flex items-center justify-between border-b transition-colors",
        timeInfo.isUrgent ? "bg-rose-50 border-rose-100" : 
        timeInfo.isWarning ? "bg-amber-50 border-amber-100" : "bg-sage-50/50 border-sage-100"
      )}>
        <div className="flex items-center gap-3">
          {/* Drag Handle (Desktop) */}
          {!isMobile && (
            <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1 hover:bg-carbon-900/5 rounded-lg transition-colors">
              <GripVertical className="w-5 h-5 text-carbon-300" />
            </div>
          )}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-carbon-900 flex items-center justify-center text-white shadow-sm">
              <span className="text-lg font-black">{order.table?.number || "S/M"}</span>
            </div>
            <div>
              <p className="text-[10px] font-black text-carbon-400 uppercase tracking-[0.15em]">Pedido</p>
              <p className="text-xs font-bold text-carbon-900">#{order.id.slice(-4).toUpperCase()}</p>
            </div>
          </div>
        </div>

        <div className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-black transition-all",
          timeInfo.isUrgent ? "bg-rose-500 text-white animate-pulse" : 
          timeInfo.isWarning ? "bg-amber-500 text-white" : "bg-white text-sage-600 border border-sage-200"
        )}>
          <Clock className="w-3.5 h-3.5" />
          {timeInfo.text}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {order.notes && (
          <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-2xl flex gap-2">
            <span className="text-base">📝</span>
            <p className="text-xs font-bold text-amber-800 leading-relaxed italic">
              {order.notes}
            </p>
          </div>
        )}

        <div className="space-y-1">
          {order.items?.map((item) => (
            <KitchenItemRow
              key={item.id}
              itemId={item.id}
              name={item.menuItem?.name || `Item #${item.menuItemId}`}
              quantity={item.quantity}
              notes={item.notes}
              categoryId={item.menuItem?.categoryId}
              isReady={readyItemIds.includes(item.id)}
              onToggleReady={handleToggleItemReady}
              categoryConfig={categoryConfig}
            />
          ))}
        </div>

        {/* Action / Ready Button */}
        <AnimatePresence>
          {allProteinsReady && order.status !== OrderStatus.READY && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => { e.stopPropagation(); onStatusChange(order.id, OrderStatus.READY); }}
              className="w-full mt-4 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest text-[10px] rounded-[1.5rem] flex items-center justify-center gap-2 shadow-xl shadow-emerald-100 active:scale-95 transition-all"
            >
              <CheckCircle className="w-4 h-4" />
              Marcar como Listo
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      
      {/* Selection / Status indicator for non-dragging cards */}
      <div className={cn(
        "absolute bottom-0 left-0 right-0 h-1 transition-all",
        order.status === OrderStatus.PENDING ? "bg-amber-400" :
        order.status === OrderStatus.IN_KITCHEN ? "bg-orange-400" : "bg-emerald-400"
      )} />
    </div>
  );
}