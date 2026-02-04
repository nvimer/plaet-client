import { Soup, GlassWater, Leaf, CircleDot } from "lucide-react";
import { Card } from "@/components";
import { cn } from "@/utils/cn";

/**
 * DailyMenuItem
 */
interface DailyMenuItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color?: string;
}

function DailyMenuItem({ icon, label, value, color = "sage" }: DailyMenuItemProps) {
  const colorClasses = {
    sage: "bg-sage-50 border-sage-200 text-sage-700",
    amber: "bg-amber-50 border-amber-200 text-amber-700",
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-700",
    blue: "bg-blue-50 border-blue-200 text-blue-700",
  };

  return (
    <div className={cn("flex items-center gap-3 p-3 rounded-xl border-2", colorClasses[color as keyof typeof colorClasses])}>
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/80 flex items-center justify-center">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-carbon-500 uppercase tracking-wide">{label}</p>
        <p className="text-sm font-semibold text-carbon-900 truncate">{value}</p>
      </div>
    </div>
  );
}

/**
 * DailyMenuSection Props
 */
export interface DailyMenuSectionProps {
  principio: string;
  sopa: string;
  jugo: string;
  postre?: string;
  className?: string;
}

/**
 * DailyMenuSection Component
 * 
 * Muestra el menú del día para el corrientazo.
 * Visible inmediatamente al crear un pedido.
 * 
 * @example
 * ```tsx
 * <DailyMenuSection
 *   principio="Frijoles con plátano maduro"
 *   sopa="Sopa de verduras"
 *   jugo="Limonada"
 *   postre="Gelatina"
 * />
 * ```
 */
export function DailyMenuSection({
  principio,
  sopa,
  jugo,
  postre,
  className,
}: DailyMenuSectionProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className="bg-gradient-to-r from-sage-600 to-sage-500 px-4 py-3 sm:px-6 sm:py-4">
        <h3 className="text-white font-semibold text-base sm:text-lg flex items-center gap-2">
          <CircleDot className="w-5 h-5" />
          Menú del Día
        </h3>
        <p className="text-sage-100 text-xs sm:text-sm mt-1">
          Almuerzo completo incluye: Principio + Proteína + Ensalada + Adicional + Sopa + Jugo
        </p>
      </div>
      
      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
        <DailyMenuItem
          icon={<Leaf className="w-5 h-5 text-emerald-600" />}
          label="Principio"
          value={principio}
          color="emerald"
        />
        
        <DailyMenuItem
          icon={<Soup className="w-5 h-5 text-amber-600" />}
          label="Sopa del día"
          value={sopa}
          color="amber"
        />
        
        <DailyMenuItem
          icon={<GlassWater className="w-5 h-5 text-blue-600" />}
          label="Jugo del día"
          value={jugo}
          color="blue"
        />
        
        {postre && (
          <DailyMenuItem
            icon={<CircleDot className="w-5 h-5 text-sage-600" />}
            label="Postre"
            value={postre}
            color="sage"
          />
        )}
      </div>
    </Card>
  );
}
