import { useMemo, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useGesture } from "@use-gesture/react";
import { Clock, UtensilsCrossed, ArrowRight, ArrowLeft } from "lucide-react";
import { cn } from "@/utils/cn";
import { Card } from "@/components";
import { OrderStatus, type Order } from "@/types";
import { KitchenItemRow } from "./KitchenItemRow";
import { isPreparableCategory } from "./kitchenCategories";

export interface KitchenOrderCardProps {
  order: Order;
  readyItemIds: number[];
  onToggleItemReady: (orderId: string, itemId: number, ready: boolean) => void;
  onStatusChange: (orderId: string, status: OrderStatus) => void;
  isMobile?: boolean;
}

const SWIPE_THRESHOLD = 80;

export function KitchenOrderCard({
  order,
  readyItemIds,
  onToggleItemReady,
  onStatusChange,
  isMobile = false,
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
    disabled: isMobile, // Disable dnd on mobile, use swipe instead
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

        // Only allow horizontal drag
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
          // Get next/previous status
          let newStatus: OrderStatus | null = null;

          if (swipeDirection === "right") {
            // Swipe right = advance status
            if (order.status === OrderStatus.PENDING) {
              newStatus = OrderStatus.IN_KITCHEN;
            } else if (order.status === OrderStatus.IN_KITCHEN) {
              newStatus = OrderStatus.READY;
            }
          } else {
            // Swipe left = go back status
            if (order.status === OrderStatus.READY) {
              newStatus = OrderStatus.IN_KITCHEN;
            } else if (order.status === OrderStatus.IN_KITCHEN) {
              newStatus = OrderStatus.PENDING;
            }
          }

          if (newStatus) {
            // Vibrate for feedback
            if (navigator.vibrate) {
              navigator.vibrate(50);
            }
            // Trigger status change
            onStatusChange(order.id, newStatus);
          }
        }

        // Reset position
        setTranslateX(0);
        setIsSwiping(false);
      },
      onDragStart: () => {
        if (isMobile) {
          setIsSwiping(true);
        }
      },
    },
    {
      drag: {
        filterTaps: true,
        threshold: SWIPE_THRESHOLD,
      },
    },
  );

  const getSwipeBackground = () => {
    if (translateX > 30) {
      // Swiping right - show advance indicator
      if (order.status === OrderStatus.PENDING) {
        return "bg-orange-100";
      } else if (order.status === OrderStatus.IN_KITCHEN) {
        return "bg-emerald-100";
      }
    } else if (translateX < -30) {
      // Swiping left - show back indicator
      if (order.status === OrderStatus.READY) {
        return "bg-orange-100";
      } else if (order.status === OrderStatus.IN_KITCHEN) {
        return "bg-amber-100";
      }
    }
    return "bg-sage-50";
  };

  const getSwipeIcon = () => {
    if (translateX > 30) {
      // Swipe right - advance
      return (
        <div className="flex items-center gap-2 text-orange-600">
          {order.status === OrderStatus.PENDING && (
            <ArrowRight className="w-6 h-6" />
          )}
          {order.status === OrderStatus.IN_KITCHEN && (
            <ArrowRight className="w-6 h-6" />
          )}
        </div>
      );
    } else if (translateX < -30) {
      // Swipe left - go back
      return (
        <div className="flex items-center gap-2 text-orange-600">
          {order.status === OrderStatus.READY && (
            <ArrowLeft className="w-6 h-6" />
          )}
          {order.status === OrderStatus.IN_KITCHEN && (
            <ArrowLeft className="w-6 h-6" />
          )}
        </div>
      );
    }
    return null;
  };

  const timeInfo = useMemo(() => {
    const now = new Date().getTime();
    const created = new Date(order.createdAt).getTime();
    const diffMinutes = Math.floor((now - created) / (1000 * 60));

    let text: string;
    let isWarning = false;
    let isUrgent = false;

    if (diffMinutes < 1) {
      text = "< 1 min";
    } else if (diffMinutes === 1) {
      text = "1 min";
    } else if (diffMinutes < 60) {
      text = `${diffMinutes} min`;
      isWarning = diffMinutes > 15;
      isUrgent = diffMinutes > 25;
    } else {
      const hours = Math.floor(diffMinutes / 60);
      text = `${hours}h ${diffMinutes % 60}m`;
      isWarning = true;
      isUrgent = true;
    }

    return { text, isWarning, isUrgent, diffMinutes };
  }, [order.createdAt]);

  const preparableItems = useMemo(() => {
    return (
      order.items?.filter((item) =>
        isPreparableCategory(item.menuItem?.categoryId),
      ) || []
    );
  }, [order.items]);

  const readyItems = useMemo(() => {
    return preparableItems.filter((item) => readyItemIds.includes(item.id));
  }, [preparableItems, readyItemIds]);

  const allProteinsReady =
    preparableItems.length > 0 && readyItems.length === preparableItems.length;

  const handleToggleItemReady = (itemId: number, ready: boolean) => {
    onToggleItemReady(order.id, itemId, ready);
  };

  const getColumnColor = () => {
    switch (order.status) {
      case OrderStatus.PENDING:
        return "border-amber-400";
      case OrderStatus.IN_KITCHEN:
        return "border-orange-400";
      case OrderStatus.READY:
        return "border-emerald-400";
      default:
        return "border-sage-200";
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={isMobile ? { transform: `translateX(${translateX}px)` } : style}
      className={cn(
        "relative border-l-4 rounded-2xl bg-white shadow-smooth-lg overflow-hidden",
        getColumnColor(),
        (isDragging || isSwiping) && "opacity-90 z-50",
      )}
      {...(isMobile ? {} : { ...attributes, ...listeners })}
      {...(isMobile ? bind() : {})}
    >
      {/* Swipe background indicator */}
      {isMobile && translateX !== 0 && (
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center pointer-events-none",
            getSwipeBackground(),
          )}
        >
          {getSwipeIcon()}
        </div>
      )}

      <Card
        variant="elevated"
        padding="md"
        className="bg-transparent shadow-none"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {order.table && (
              <div className="bg-sage-600 text-white rounded-xl px-4 py-2 flex items-center gap-2">
                <UtensilsCrossed className="w-5 h-5" />
                <span className="text-xl font-bold">
                  Mesa {order.table.number}
                </span>
              </div>
            )}
          </div>

          <div
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full text-lg font-bold",
              timeInfo.isUrgent
                ? "bg-rose-100 text-rose-700 animate-pulse"
                : timeInfo.isWarning
                  ? "bg-amber-100 text-amber-700"
                  : "bg-sage-100 text-sage-700",
            )}
          >
            <Clock className="w-5 h-5" />
            {timeInfo.text}
          </div>
        </div>

        {order.notes && (
          <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">📝 {order.notes}</p>
          </div>
        )}

        <div className="space-y-2">
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
            />
          ))}
        </div>

        {preparableItems.length > 0 &&
          allProteinsReady &&
          order.status !== OrderStatus.READY && (
            <button
              onClick={() => onStatusChange(order.id, OrderStatus.READY)}
              className="mt-3 w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              ✓ Todas las proteínas listas - Marcar como Listo
            </button>
          )}
      </Card>
    </div>
  );
}
