import { useNavigate } from "react-router-dom";
import { ShoppingCart, Plus, History, ChefHat, Bike, ReceiptText } from "lucide-react";
import { Button, Card } from "@/components";
import { ROUTES } from "@/app/routes";
import { SidebarLayout } from "@/layouts/SidebarLayout";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

/**
 * OrdersHubPage Component
 * 
 * Central entry point for all Sales and Orders management.
 */
export function OrdersHubPage() {
  const navigate = useNavigate();

  const options = [
    {
      title: "Nuevo Pedido",
      description: "Terminal de venta rápida para tomar órdenes.",
      icon: Plus,
      path: ROUTES.ORDER_CREATE,
      color: "text-primary-600",
      bgColor: "bg-primary-50",
    },
    {
      title: "Monitor de Cocina",
      description: "Estado de platos y preparación en tiempo real.",
      icon: ChefHat,
      path: ROUTES.KITCHEN,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      title: "Historial de Ventas",
      description: "Consulta pedidos anteriores y facturación.",
      icon: History,
      path: ROUTES.ORDERS_LIST,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Domicilios",
      description: "Pedidos para llevar y entrega a casa.",
      icon: Bike,
      path: ROUTES.ORDERS_LIST, // Filtered in real app
      color: "text-rose-600",
      bgColor: "bg-rose-50",
    },
  ];

  return (
    <SidebarLayout hideTitle fullWidth>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Header */}
        <header className="space-y-2">
          <div className="flex items-center gap-2 text-primary-600">
            <ShoppingCart className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Terminal de Ventas</span>
          </div>
          <h1 className="text-4xl font-bold text-carbon-900 tracking-tight">Pedidos y Facturación</h1>
          <p className="text-lg text-carbon-500 font-medium">Gestiona el flujo completo desde la toma hasta la entrega.</p>
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
                  "group h-full cursor-pointer transition-all duration-300 hover:shadow-soft-xl hover:-translate-y-1 rounded-3xl border-2 border-transparent hover:border-primary-100"
                )}
                onClick={() => navigate(option.path)}
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
                    className="w-full justify-between rounded-xl group-hover:bg-primary-50 group-hover:text-primary-700"
                  >
                    <span>Acceder</span>
                    <Plus className="w-4 h-4" />
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
