import { Soup, GlassWater, Leaf, CircleDot, Sparkles } from "lucide-react";
import { Card } from "@/components";
import { cn } from "@/utils/cn";

interface DailyMenuItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color?: "sage" | "amber" | "emerald" | "blue";
  delay?: number;
}

function DailyMenuItem({ icon, label, value, color = "sage", delay = 0 }: DailyMenuItemProps) {
  const colorClasses = {
    sage: "bg-sage-50 border-sage-200 text-sage-700 hover:border-sage-300",
    amber: "bg-amber-50 border-amber-200 text-amber-700 hover:border-amber-300",
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-700 hover:border-emerald-300",
    blue: "bg-blue-50 border-blue-200 text-blue-700 hover:border-blue-300",
  };

  return (
    <div 
      className={cn(
        "flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-300",
        "hover:shadow-md hover:scale-[1.02] cursor-default",
        colorClasses[color]
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/80 flex items-center justify-center shadow-sm">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-carbon-500 uppercase tracking-wider">{label}</p>
        <p className="text-sm font-bold text-carbon-900 truncate">{value}</p>
      </div>
    </div>
  );
}

export interface DailyMenuSectionProps {
  side: string;
  soup: string;
  drink: string;
  dessert?: string;
  className?: string;
}

/**
 * DailyMenuSection Component
 * 
 * Displays the daily menu for corrientazo/lunch service.
 * Shows all components included in the complete lunch combo.
 * 
 * Features:
 * - Animated entrance with stagger effect
 * - Color-coded menu items
 * - Hover interactions
 * - Responsive design
 * 
 * @example
 * ```tsx
 * <DailyMenuSection
 *   side="Frijoles con plátano maduro"
 *   soup="Sopa de verduras"
 *   drink="Limonada natural"
 *   dessert="Gelatina"
 * />
 * ```
 */
export function DailyMenuSection({
  side,
  soup,
  drink,
  dessert,
  className,
}: DailyMenuSectionProps) {
  return (
    <Card className={cn("overflow-hidden shadow-lg", className)}>
      {/* Header with gradient background */}
      <div className="relative bg-gradient-to-r from-sage-600 via-sage-500 to-sage-600 px-4 py-4 sm:px-6 sm:py-5">
        {/* Decorative sparkle icon */}
        <div className="absolute top-3 right-4 opacity-20">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        
        <h3 className="relative text-white font-bold text-lg sm:text-xl flex items-center gap-2">
          <CircleDot className="w-5 h-5 sm:w-6 sm:h-6" />
          Daily Menu
        </h3>
        <p className="relative text-sage-100 text-xs sm:text-sm mt-1.5 font-medium">
          Complete lunch includes: Side + Protein + Salad + Extra + Soup + Drink
        </p>
      </div>
      
      {/* Menu items with stagger animation */}
      <div className="p-3 sm:p-5 space-y-2 sm:space-y-3">
        <DailyMenuItem
          icon={<Leaf className="w-5 h-5 text-emerald-600" />}
          label="Side Dish"
          value={side}
          color="emerald"
          delay={0}
        />
        
        <DailyMenuItem
          icon={<Soup className="w-5 h-5 text-amber-600" />}
          label="Soup of the Day"
          value={soup}
          color="amber"
          delay={100}
        />
        
        <DailyMenuItem
          icon={<GlassWater className="w-5 h-5 text-blue-600" />}
          label="Drink of the Day"
          value={drink}
          color="blue"
          delay={200}
        />
        
        {dessert && (
          <DailyMenuItem
            icon={<CircleDot className="w-5 h-5 text-sage-600" />}
            label="Dessert"
            value={dessert}
            color="sage"
            delay={300}
          />
        )}
      </div>
      
      {/* Footer note */}
      <div className="px-4 py-2 bg-sage-50 border-t border-sage-100">
        <p className="text-xs text-carbon-500 text-center">
          All items are included in the complete lunch combo
        </p>
      </div>
    </Card>
  );
}
