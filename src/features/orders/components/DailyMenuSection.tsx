import {
  Soup,
  GlassWater,
  Leaf,
  CircleDot,
  Sparkles,
  Check,
} from "lucide-react";
import { Card } from "@/components";
import { cn } from "@/utils/cn";

interface MenuOption {
  id: number;
  name: string;
}

interface DailyMenuCategoryProps {
  icon: React.ReactNode;
  label: string;
  options: MenuOption[];
  color?: "sage" | "amber" | "emerald" | "blue" | "purple";
  delay?: number;
  isRequired?: boolean;
}

function DailyMenuCategory({
  icon,
  label,
  options,
  color = "sage",
  delay = 0,
  isRequired = false,
}: DailyMenuCategoryProps) {
  const colorClasses = {
    sage: "bg-sage-50 border-sage-200 text-sage-700",
    amber: "bg-amber-50 border-amber-200 text-amber-700",
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-700",
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    purple: "bg-purple-50 border-purple-200 text-purple-700",
  };

  const hasOptions = options.length > 0;

  return (
    <div
      className={cn(
        "p-4 rounded-xl border-2 transition-all duration-300",
        hasOptions
          ? colorClasses[color]
          : "bg-carbon-100 border-carbon-200 text-carbon-500",
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className={cn(
            "flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center shadow-sm",
            hasOptions ? "bg-white/80" : "bg-carbon-200",
          )}
        >
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider">
              {label}
            </p>
            {isRequired && hasOptions && (
              <span className="text-[10px] bg-sage-200 text-sage-700 px-1.5 py-0.5 rounded-full">
                Requerido
              </span>
            )}
          </div>
        </div>
      </div>

      {hasOptions ? (
        <div className="space-y-2">
          {options.length === 1 ? (
            // Single option - highlighted display
            <div className="p-3 bg-white rounded-lg border-2 border-current shadow-sm">
              <span className="text-base font-bold block">
                {options[0].name}
              </span>
            </div>
          ) : (
            // Multiple options - with numbering
            options.map((option, index) => (
              <div
                key={option.id}
                className="flex items-center gap-2 p-2 bg-white/60 rounded-lg"
              >
                <div className="w-5 h-5 rounded-full bg-white border-2 border-current flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold">{index + 1}</span>
                </div>
                <span className="text-sm font-bold truncate">
                  {option.name}
                </span>
              </div>
            ))
          )}
        </div>
      ) : (
        <p className="text-sm text-carbon-500 italic">No configurado</p>
      )}
    </div>
  );
}

export interface DailyMenuSectionProps {
  soupOptions: MenuOption[];
  principleOptions: MenuOption[];
  saladOptions: MenuOption[];
  extraOptions: MenuOption[];
  drinkOptions: MenuOption[];
  dessertOptions?: MenuOption[];
  basePrice?: number;
  className?: string;
}

/**
 * DailyMenuSection Component
 *
 * Displays the complete daily menu configuration for corrientazo/lunch service.
 * Shows ALL configured options for each category.
 *
 * Features:
 * - Shows all menu options (not just first one)
 * - Animated entrance with stagger effect
 * - Color-coded menu categories
 * - Price information
 * - Responsive design
 */
export function DailyMenuSection({
  soupOptions,
  principleOptions,
  saladOptions,
  extraOptions,
  drinkOptions,
  dessertOptions,
  basePrice,
  className,
}: DailyMenuSectionProps) {
  const hasPrices = !!basePrice;

  return (
    <Card className={cn("overflow-hidden shadow-lg", className)}>
      {/* Header with gradient background */}
      <div className="relative bg-gradient-to-r from-sage-600 via-sage-500 to-sage-600 px-4 py-4 sm:px-6 sm:py-5">
        <div className="absolute top-3 right-4 opacity-20">
          <Sparkles className="w-8 h-8 text-white" />
        </div>

        <h3 className="relative text-white font-bold text-lg sm:text-xl flex items-center gap-2">
          <CircleDot className="w-5 h-5 sm:w-6 sm:h-6" />
          Menú del Día Configurado
        </h3>
        <p className="relative text-sage-100 text-xs sm:text-sm mt-1.5 font-medium">
          Todas las opciones disponibles para hoy
        </p>

        {hasPrices && (
          <div className="flex gap-3 mt-3">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 text-white text-sm font-semibold">
              <Check className="w-3 h-3" />
              Margen Base: ${basePrice?.toLocaleString()}
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-400/30 text-white text-xs font-medium">
              + Precio de proteína
            </span>
          </div>
        )}
      </div>

      {/* Menu categories with all options */}
      <div className="p-3 sm:p-5 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <DailyMenuCategory
            icon={<Soup className="w-5 h-5 text-amber-600" />}
            label="Sopas"
            options={soupOptions}
            color="amber"
            delay={0}
            isRequired
          />

          <DailyMenuCategory
            icon={<Leaf className="w-5 h-5 text-emerald-600" />}
            label="Principios"
            options={principleOptions}
            color="emerald"
            delay={50}
            isRequired
          />

          <DailyMenuCategory
            icon={<Leaf className="w-5 h-5 text-green-600" />}
            label="Ensaladas"
            options={saladOptions}
            color="sage"
            delay={100}
            isRequired
          />

          <DailyMenuCategory
            icon={<CircleDot className="w-5 h-5 text-purple-600" />}
            label="Extras"
            options={extraOptions}
            color="purple"
            delay={150}
          />

          <DailyMenuCategory
            icon={<GlassWater className="w-5 h-5 text-blue-600" />}
            label="Bebidas"
            options={drinkOptions}
            color="blue"
            delay={200}
            isRequired
          />

          {dessertOptions && dessertOptions.length > 0 && (
            <DailyMenuCategory
              icon={<CircleDot className="w-5 h-5 text-sage-600" />}
              label="Postres (Opcional)"
              options={dessertOptions}
              color="sage"
              delay={250}
            />
          )}
        </div>
      </div>

      {/* Footer note */}
      <div className="px-4 py-3 bg-sage-50 border-t border-sage-100">
        <p className="text-xs text-carbon-500 text-center">
          El cliente puede elegir una opción de cada categoría marcada como
          &quot;Requerido&quot;
        </p>
      </div>
    </Card>
  );
}
