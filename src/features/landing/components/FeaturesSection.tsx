import { motion } from "framer-motion";
import { LayoutGrid, Shield, Zap, Utensils, ClipboardList, Package } from "lucide-react";
import { Badge } from "@/components/ui/Badge/Badge";
import { Button, Card } from "@/components";

/**
 * FeaturesSection Component
 *
 * Showcase main features of the system
 */
export function FeaturesSection() {
  // ================= FEATURES DATA ===================
  const features = [
    {
      icon: Utensils,
      title: "Gestión del Menú del Día",
      description:
        "Configuración especializada para el menú diario. Maneja proteínas, categorías fijas y precios dinámicos fácilmente.",
      color: "from-sage-green-200 to-sage-green-300",
      delay: 0.1,
    },
    {
      icon: Zap,
      title: "Punto de Venta Táctil",
      description:
        "Interfaz optimizada para tablets y kioscos con botones grandes. Rápida y sin complicaciones para cajeros y meseros.",
      color: "from-sage-green-300 to-sage-green-400",
      delay: 0.2,
    },
    {
      icon: LayoutGrid,
      title: "Gestión de Mesas Visual",
      description:
        "Mapa interactivo en tiempo real. Visualiza el estado de cada mesa, asigna pedidos y controla la ocupación al instante.",
      color: "from-sage-green-200 to-sage-green-400",
      delay: 0.3,
    },
    {
      icon: ClipboardList,
      title: "Kanban de Cocina",
      description:
        "Tablero interactivo para la cocina. Recibe pedidos en tiempo real y gestiona su estado con un simple arrastrar y soltar.",
      color: "from-sage-green-300 to-sage-green-500",
      delay: 0.4,
    },
    {
      icon: Package,
      title: "Control de Stock Diario",
      description:
        "Reseteo y manejo de inventario limitado para el día. Control exacto para que nunca vendas platos que ya se han agotado.",
      color: "from-sage-green-200 to-sage-green-300",
      delay: 0.5,
    },
    {
      icon: Shield,
      title: "Roles y Permisos",
      description:
        "Seguridad basada en roles (RBAC). Accesos personalizados y seguros para administradores, meseros y personal de cocina.",
      color: "from-sage-green-300 to-sage-green-400",
      delay: 0.6,
    },
  ];

  // ============== RENDER ===============
  return (
    <section id="features" className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex mb-6"
          >
            <Badge variant="success" size="md" className="glass-sage-light">
              <span className=" w-2 h-2 bg-sage-green-400 rounded-full animate-pulse mr-2"></span>
              Características Poderosas
            </Badge>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-carbon-900 mb-6 tracking-tight leading-tight"
          >
            Todo lo que {""}
            <span className="text-gradient-sage">necesitas</span>
          </motion.h2>
        </div>

        {/* Features Grid using Card component */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ 
                  duration: 0.8, 
                  delay: (index % 3) * 0.1,
                  ease: [0.16, 1, 0.3, 1] 
                }}
                whileHover={{ y: -12, scale: 1.02 }}
              >
                <Card
                  variant="bordered"
                  padding="lg"
                  hover
                  className="h-full group relative overflow-hidden bg-white/50 backdrop-blur-sm border-sage-green-100 hover:border-sage-green-300 transition-all duration-500 shadow-soft-sm hover:shadow-xl"
                >
                  {/* Icon Container */}
                  <div className="relative mb-8">
                    <div
                      className={`inline-flex p-5 rounded-[1.5rem] bg-gradient-to-br ${feature.color} group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-sage-green-100`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Decorative Element */}
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-sage-green-100 rounded-full blur-3xl opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-black text-carbon-900 mb-4 group-hover:text-sage-green-600 transition-colors duration-300">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-carbon-600 leading-relaxed font-light text-lg">
                    {feature.description}
                  </p>

                  {/* Hover Accent Line */}
                  <div className="absolute bottom-0 left-0 w-0 h-1.5 bg-gradient-to-r from-sage-green-300 to-sage-green-500 group-hover:w-full transition-all duration-700 rounded-b-3xl"></div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA using Button component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-14 text-center"
        >
          <p className="text-lg text-carbon-700 mb-6 font-light">
            ¿Quieres ver cómo funciona en tu restaurante?
          </p>
          <Button
            variant="primary"
            size="lg"
            className="glass-sage-light hover:-translate-y-1"
          >
            Solicitar Demo Personalizada
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
