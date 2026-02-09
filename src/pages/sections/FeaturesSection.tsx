import { motion } from "framer-motion";
import { BarChart3, Clock, LayoutGrid, Shield, Users, Zap } from "lucide-react";
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
      icon: LayoutGrid,
      title: "Gestión de Mesas",
      description:
        "Visualiza y administra todas tus mesas en tiempo real. Asigna pedidos, controla ocupación y optimiza tiempos.",
      color: "from-sage-green-200 to-sage-green-300",
      delay: 0.1,
    },
    {
      icon: Clock,
      title: "Menú Digital",
      description:
        "Sistema sincronizado entre cocina, meseros y caja. Nunca pierdas un pedido, reduce errores y acelera el servicio.",
      color: "from-sage-green-300 to-sage-green-400",
      delay: 0.2,
    },
    {
      icon: BarChart3,
      title: "Reportes Inteligentes",
      description:
        "Analiza ventas, productos populares y tendencias. Toma decisiones basadas en datos reales y claros.",
      color: "from-sage-green-200 to-sage-green-400",
      delay: 0.3,
    },
    {
      icon: Shield,
      title: "Seguridad Total",
      description:
        "Tus datos protegidos con encriptación a nivel bancario. Control de accesos por roles y respaldos automáticos.",
      color: "from-sage-green-300 to-sage-green-500",
      delay: 0.4,
    },
    {
      icon: Zap,
      title: "Rápido y Ligero",
      description:
        "Diseñado para funcionar incluso con interet lento. Sin lag, sin esperas, sin complicaciones.",
      color: "from-sage-green-200 to-sage-green-300",
      delay: 0.5,
    },
    {
      icon: Users,
      title: "Multi-Usuario",
      description:
        "Acceso simultáneo para todo tu equipo. Meseros, cocina y administración trabajando en perfecta sintonía.",
      color: "from-sage-green-300 to-sage-green-400",
      delay: 0.5,
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
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: feature.delay }}
                whileHover={{ y: -8 }}
              >
                <Card
                  variant="bordered"
                  padding="lg"
                  hover
                  className="h-full group relative overflow-hidden"
                >
                  {/* Icon Container */}
                  <div className="relative mb-6">
                    <div
                      className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color} group-hover:animate-glow-pulse transition-all duration-300`}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </div>

                    {/* Decorative Element */}
                    <div className="absolute -top-2 -right-2 w-20 h-20 bg-sage-green-100 rounded-full blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-carbon-900 mb-4 group-hover:text-sage-green-600 transition-colors duration-300">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-carbon-700 leading-relaxed font-light">
                    {feature.description}
                  </p>

                  {/* Hover Accent Line */}
                  <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-sage-green-300 to-sage-green-500 group-hover:w-full transition-all duration-500 rounded-b-3xl"></div>
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
