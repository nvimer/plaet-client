import { useMemo } from "react";
import { Check } from "lucide-react";
import { cn } from "@/utils/cn";
import { isProteinCategory, isExtraCategory } from "./kitchenCategories";

export interface KitchenItemRowProps {
  itemId: number;
  name: string;
  quantity: number;
  notes?: string;
  categoryId?: number;
  isReady: boolean;
  onToggleReady: (itemId: number, ready: boolean) => void;
}

export function KitchenItemRow({
  itemId,
  name,
  quantity,
  notes,
  categoryId,
  isReady,
  onToggleReady,
}: KitchenItemRowProps) {
  const isProtein = isProteinCategory(categoryId);
  const isExtra = isExtraCategory(categoryId);
  const isPreparable = isProtein || isExtra;

  const itemColor = useMemo(() => {
    if (isProtein) return "bg-orange-50 border-orange-200";
    if (isExtra) return "bg-purple-50 border-purple-200";
    return "bg-sage-50 border-sage-200";
  }, [isProtein, isExtra]);

  const handleClick = () => {
    if (isPreparable) {
      onToggleReady(itemId, !isReady);
    }
  };

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-xl border-2 transition-all",
        itemColor,
        isPreparable && "cursor-pointer hover:scale-[1.02] active:scale-[0.98]",
        isReady && "opacity-60"
      )}
      onClick={handleClick}
      role={isPreparable ? "checkbox" : undefined}
      aria-checked={isPreparable ? isReady : undefined}
    >
      {isPreparable ? (
        <div
          className={cn(
            "w-7 h-7 rounded-lg flex items-center justify-center transition-all",
            "border-2",
            isReady
              ? "bg-emerald-500 border-emerald-500 text-white"
              : "border-carbon-300 bg-white"
          )}
        >
          {isReady && <Check className="w-4 h-4" />}
        </div>
      ) : (
        <div className="w-7 h-7 flex items-center justify-center">
          <span className="text-lg">✓</span>
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "font-semibold text-carbon-900",
              isReady && "line-through"
            )}
          >
            {quantity}x {name}
          </span>
          {isProtein && (
            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">
              Proteína
            </span>
          )}
          {isExtra && !isProtein && (
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
              Extra
            </span>
          )}
        </div>

        {notes && (
          <p className="text-xs text-carbon-500 mt-0.5 italic">
            📝 {notes}
          </p>
        )}
      </div>
    </div>
  );
}
