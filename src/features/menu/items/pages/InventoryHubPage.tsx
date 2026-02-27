import { useNavigate } from "react-router-dom";
import { Package, RotateCcw, History, Settings, Plus, LayoutGrid } from "lucide-react";
import { Button, Card } from "@/components";
import { ROUTES } from "@/app/routes";
import { SidebarLayout } from "@/layouts/SidebarLayout";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

/**
 * InventoryHubPage Component
 * 
 * Central entry point for all Inventory-related management.
 */
export function InventoryHubPage() {
  const navigate = useNavigate();

  const options = [
    {
      title: "Stock Actual",
      description: "Monitorea existencias y ajusta cantidades en tiempo real.",
      icon: LayoutGrid,
      path: ROUTES.STOCK_MANAGEMENT,
      color: "text-sage-600",
      bgColor: "bg-sage-50",
    },
    {
      title: "Reinicio Diario",
      description: "Restablece el stock de insumos al inicio de la jornada.",
      icon: RotateCcw,
      path: ROUTES.STOCK_MANAGEMENT, // Would open modal in real app or specific page
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      title: "Historial",
      description: "Revisa todos los movimientos y ajustes realizados.",
      icon: History,
      path: ROUTES.INVENTORY_HISTORY,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Proveedores",
      description: "Gestión de compras y facturas de insumos.",
      icon: Package,
      path: ROUTES.INVENTORY, // Placeholder
      color: "text-carbon-400",
      bgColor: "bg-carbon-50",
      disabled: true,
    },
  ];

  return (
    <SidebarLayout hideTitle fullWidth>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Header */}
        <header className="space-y-2">
          <div className="flex items-center gap-2 text-sage-600">
            <Package className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Operaciones de Stock</span>
          </div>
          <h1 className="text-4xl font-bold text-carbon-900 tracking-tight">Centro de Inventarios</h1>
          <p className="text-lg text-carbon-500 font-medium">Control total sobre tus insumos, materias primas y productos.</p>
        </header>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {options.map((option, idx) => (
            <motion.div
              key={option.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card
                variant="elevated"
                padding="none"
                className={cn(
                  "group h-full cursor-pointer transition-all duration-300 hover:shadow-soft-xl hover:-translate-y-1 rounded-3xl border-2 border-transparent hover:border-sage-100",
                  option.disabled && "opacity-60 cursor-not-allowed hover:translate-y-0 hover:shadow-none"
                )}
                onClick={() => !option.disabled && navigate(option.path)}
              >
                <div className="p-8 flex flex-col h-full">
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110", option.bgColor, option.color)}>
                    <option.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-carbon-900 mb-2">{option.title}</h3>
                  <p className="text-sm text-carbon-500 font-medium leading-relaxed mb-8 flex-1">
                    {option.description}
                  </p>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-between rounded-xl group-hover:bg-sage-50 group-hover:text-sage-700"
                    disabled={option.disabled}
                  >
                    <span>{option.disabled ? "Próximamente" : "Acceder"}</span>
                    {!option.disabled && <Plus className="w-4 h-4" />}
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </SidebarLayout>
  );
}
