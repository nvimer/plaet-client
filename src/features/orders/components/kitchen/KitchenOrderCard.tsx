import { useMemo, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useGesture } from "@use-gesture/react";
import { Clock, ArrowRight, GripVertical, ChefHat, CheckCircle, ArrowLeft } from "lucide-react";
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

const SWIPE_THRESHOLD = 60; // Reduced for better sensitivity
const MAX_SWIPE = 120;

export function KitchenOrderCard({
  item,
  onStatusChange,
  isMobile = false,
  _categoryConfig,
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

  // Determine target status based on current status and swipe direction
  const getTargetStatus = (dir: "left" | "right") => {
    if (dir === "right") {
      if (item.status === OrderItemStatus.PENDING) return OrderItemStatus.IN_KITCHEN;
      if (item.status === OrderItemStatus.IN_KITCHEN) return OrderItemStatus.READY;
    } else {
      if (item.status === OrderItemStatus.READY) return OrderItemStatus.IN_KITCHEN;
      if (item.status === OrderItemStatus.IN_KITCHEN) return OrderItemStatus.PENDING;
    }
    return null;
  };

  const currentTarget = translateX > 0 ? getTargetStatus("right") : getTargetStatus("left");
  const isThresholdMet = Math.abs(translateX) > SWIPE_THRESHOLD;

  // Swipe gesture for mobile
  const bind = useGesture(
    {
      onDrag: ({ movement: [mx], active }) => {
        if (!isMobile) return;
        setIsSwiping(active);
        // Resistance after threshold
        let x = mx;
        if (Math.abs(mx) > MAX_SWIPE) {
          const overflow = Math.abs(mx) - MAX_SWIPE;
          x = (MAX_SWIPE + overflow * 0.2) * (mx > 0 ? 1 : -1);
        }
        setTranslateX(x);
      },
      onDragEnd: ({ movement: [mx] }) => {
        if (!isMobile) return;

        const swipeDirection = mx > 0 ? "right" : "left";
        const target = getTargetStatus(swipeDirection);

        if (Math.abs(mx) > SWIPE_THRESHOLD && target) {
          if (navigator.vibrate) navigator.vibrate([40]);
          onStatusChange(item.orderId, item.id, target);
        }

        setTranslateX(0);
        setIsSwiping(false);
      },
    },
    { 
      drag: { 
        filterTaps: true, 
        bounds: { left: -MAX_SWIPE - 20, right: MAX_SWIPE + 20 },
        rubberband: true
      } 
    }
  );

  const timeInfo = useMemo(() => {
    const now = new Date().getTime();
    const created = new Date(item.createdAt).getTime();
    const diffMinutes = Math.floor((now - created) / (1000 * 60));
    const text = diffMinutes < 1 ? "< 1 min" : `${diffMinutes} min`;
    const isWarning = diffMinutes > 15;
    const isUrgent = diffMinutes > 25;
    return { text, isWarning, isUrgent, diffMinutes };
  }, [item.createdAt]);

  const tableNumber = item.order.table?.number || "S/M";

  // Visual helper for target status
  const TargetIndicator = () => {
    if (!currentTarget) return null;

    const isRight = translateX > 0;
    const Icon = currentTarget === OrderItemStatus.IN_KITCHEN ? ChefHat : 
                 currentTarget === OrderItemStatus.READY ? CheckCircle : ArrowLeft;
    const color = currentTarget === OrderItemStatus.IN_KITCHEN ? "bg-orange-500" :
                  currentTarget === OrderItemStatus.READY ? "bg-success-500" : "bg-blue-500";
    const label = currentTarget === OrderItemStatus.IN_KITCHEN ? "Cocinar" :
                  currentTarget === OrderItemStatus.READY ? "Listo" : "Pendiente";

    return (
      <div className={cn(
        "absolute inset-0 flex items-center px-6 transition-all duration-200 z-0",
        isRight ? "justify-start" : "justify-end",
        isThresholdMet ? color : "bg-sage-200"
      )}>
        <div className={cn(
          "flex flex-col items-center gap-1 text-white transition-transform duration-200",
          isThresholdMet ? "scale-110" : "scale-90 opacity-50"
        )}>
          <Icon className="w-8 h-8" />
          <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="relative group overflow-hidden rounded-3xl touch-none">
      {/* Background Indicators (visible during swipe) */}
      {isMobile && <TargetIndicator />}

      <motion.div
        ref={setNodeRef}
        style={isMobile ? { x: translateX } : style}
        animate={!isSwiping ? { x: 0 } : undefined}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        {...(isMobile ? bind() : {})}
        className={cn(
          "relative z-10 rounded-3xl bg-white border-2 transition-shadow duration-300",
          isDragging ? "z-50 shadow-soft-2xl scale-105 border-carbon-900 ring-8 ring-carbon-900/5" : "shadow-soft-lg border-sage-100",
          isSwiping && "shadow-soft-2xl"
        )}
      >
        {/* Header Info */}
        <div className={cn(
          "p-3 flex items-center justify-between border-b transition-colors",
          timeInfo.isUrgent ? "bg-error-50 border-error-100" : 
          timeInfo.isWarning ? "bg-warning-50 border-warning-100" : "bg-sage-50/50 border-sage-100"
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
            <span className="text-[10px] font-black text-carbon-400 tracking-wide">#{item.order.id.slice(-4)}</span>
          </div>

          <div className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black transition-all",
            timeInfo.isUrgent ? "bg-error-500 text-white animate-pulse" : 
            timeInfo.isWarning ? "bg-warning-500 text-white" : "bg-white text-sage-600 border border-sage-200"
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
                <p className="text-[10px] font-bold text-warning-700 mt-1 italic">
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
              className="w-full py-2 bg-sage-50 hover:bg-carbon-900 hover:text-white text-carbon-600 font-semibold tracking-wide text-[9px] rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 border border-sage-100"
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
          item.status === OrderItemStatus.IN_KITCHEN ? "bg-orange-400" : "bg-success-400"
        )} />
      </motion.div>
    </div>
  );
}