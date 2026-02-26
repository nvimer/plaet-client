import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { Button, Card } from "@/components";
import { Badge } from "@/components/ui/Badge/Badge";

export function PricingSection() {
  const plans = [
    {
      name: "Básico",
      price: "15.000",
      originalPrice: "29.000",
      description: "Ideal para pequeños negocios que están empezando.",
      features: [
        "Hasta 10 mesas",
        "Menú digital básico",
        "1 usuario administrador",
        "Soporte por email",
        "Reportes básicos de ventas",
      ],
      cta: "Empezar Gratis",
      popular: false,
    },
    {
      name: "Pro",
      price: "59.000",
      description: "Para restaurantes en crecimiento que necesitan más control.",
      features: [
        "Mesas ilimitadas",
        "Menú digital avanzado",
        "Usuarios ilimitados",
        "Soporte prioritario 24/7",
        "Análisis y reportes avanzados",
        "Gestión de stock",
        "Integración con cocina (Kanban)",
      ],
      cta: "Prueba Pro Gratis",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Personalizado",
      description: "Soluciones a medida para cadenas y grandes grupos.",
      features: [
        "Multi-sucursal",
        "API personalizada",
        "Account manager dedicado",
        "Onboarding presencial",
        "SLA garantizado",
        "Personalización de marca blanca",
      ],
      cta: "Contactar Ventas",
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="section-padding bg-sage-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-sage-100 rounded-full blur-3xl opacity-20"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-7xl font-bold text-carbon-900 mb-6 tracking-tight"
          >
            Planes que <span className="text-gradient-sage">crecen</span> contigo
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-carbon-700 max-w-2xl mx-auto font-light"
          >
            Precios transparentes en COP, sin costos ocultos. Cancela cuando quieras.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative flex"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 w-full flex justify-center">
                  <Badge variant="success" size="lg" className="bg-sage-400 text-white border-none shadow-lg px-6 py-1 whitespace-nowrap">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Recomendado
                  </Badge>
                </div>
              )}

              <Card
                variant={plan.popular ? "elevated" : "bordered"}
                padding="lg"
                className={`flex-1 flex flex-col relative overflow-hidden transition-all duration-500 ${
                  plan.popular ? "ring-4 ring-sage-200 border-none scale-105 z-10" : "bg-white/80 backdrop-blur-sm"
                }`}
              >
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-carbon-900 mb-2">{plan.name}</h3>
                  <p className="text-carbon-500 text-sm font-light min-h-[40px]">{plan.description}</p>
                </div>

                <div className="mb-8">
                  {plan.originalPrice && (
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg text-carbon-400 line-through font-light">${plan.originalPrice}</span>
                      <Badge variant="success" size="sm" className="bg-sage-100 text-sage-700 border-none text-[10px] font-bold">
                        OFERTA
                      </Badge>
                    </div>
                  )}
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl lg:text-5xl font-black text-carbon-900">
                      {plan.price !== "Personalizado" ? `$${plan.price}` : plan.price}
                    </span>
                    {plan.price !== "Personalizado" && <span className="text-carbon-500 font-medium text-sm">/mes</span>}
                  </div>
                </div>

                <div className="flex-1 mb-10">
                  <ul className="space-y-4">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-sage-500 flex-shrink-0 mt-0.5" strokeWidth={3} />
                        <span className="text-carbon-700 text-sm font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  variant={plan.popular ? "primary" : "secondary"}
                  fullWidth
                  size="lg"
                  className={plan.popular ? "shadow-lg shadow-sage-200" : ""}
                >
                  {plan.cta}
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
