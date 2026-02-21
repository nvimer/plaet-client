import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";

export function BenefitsSection() {
  const steps = [
    {
      number: "01",
      title: "Regístrate en 2 minutos",
      description:
        "Sin tarjeta de crédito, sin instalación. Solo crea tu cuenta y comienza a explorar todas las funcionalidades.",
      benefits: [
        "Configuración guiada",
        "Importa tu menú existente",
        "Define mesas y zonas",
      ],
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2070",
    },
    {
      number: "02",
      title: "Configura tu restaurante",
      description:
        "Personaliza el sistema a tu medida. Agrega tu menú, mesas, categorías y usuarios del equipo.",
      benefits: [
        "Interfaz intuitiva",
        "Organización por zonas",
        "Control de permisos",
      ],
      image: "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=2070",
    },
    {
      number: "03",
      title: "Empieza a gestionar",
      description:
        "Tu equipo puede empezar a tomar pedidos inmediatamente. Todo sincronizado en tiempo real.",
      benefits: [
        "Sincronización instantánea",
        "Sin curva de aprendizaje",
        "Soporte 24/7",
      ],
      image: "https://images.unsplash.com/photo-1556745753-b2904692b3cd?auto=format&fit=crop&q=80&w=2070",
    },
  ];

  return (
    <section id="benefits" className="section-padding bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-7xl font-bold text-carbon-900 mb-6 tracking-tight"
          >
            Así de {""}
            <span className="text-gradient-sage">simple</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-carbon-700 max-w-2xl mx-auto font-light"
          >
            Tres pasos para transformar la gestión de tu restaurante
          </motion.p>
        </div>

        {/* Steps */}
        <div className="space-y-32">
          {steps.map((step, index) => (
            <div 
              key={step.number} 
              className={`flex flex-col ${index % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"} items-center gap-16 lg:gap-24`}
            >
              {/* Content */}
              <motion.div
                initial={{ opacity: 0, x: index % 2 === 1 ? 40 : -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="flex-1"
              >
                {/* Step Number */}
                <div className="inline-flex items-center gap-4 mb-8">
                  <span className="text-7xl md:text-8xl font-black text-sage-green-100 leading-none">
                    {step.number}
                  </span>
                  <div className="w-20 h-1.5 bg-gradient-to-r from-sage-green-300 to-sage-green-500 rounded-full"></div>
                </div>

                {/* Title */}
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-carbon-900 mb-6">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-lg md:text-xl text-carbon-700 mb-10 font-light leading-relaxed">
                  {step.description}
                </p>

                {/* Benefits List */}
                <ul className="space-y-5">
                  {step.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-sage-green-100 flex items-center justify-center">
                        <Check
                          className="w-4 h-4 text-sage-green-600"
                          strokeWidth={3}
                        />
                      </div>
                      <span className="text-lg text-carbon-800 font-medium">
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Visual */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, x: index % 2 === 1 ? -40 : 40 }}
                whileInView={{ opacity: 1, scale: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="flex-1 w-full"
              >
                <div className="relative group">
                  {/* Image Container with decorative elements */}
                  <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/50 aspect-video lg:aspect-square">
                    <img 
                      src={step.image} 
                      alt={step.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-carbon-900/40 to-transparent"></div>
                  </div>

                  {/* Decorative Background Card */}
                  <div className="absolute -top-6 -bottom-6 -left-6 -right-6 bg-sage-green-50 rounded-[3rem] -z-10 border border-sage-green-100"></div>

                  {/* Floating element */}
                  <motion.div
                    animate={{ y: [0, -12, 0] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute -bottom-10 -right-6 lg:-right-10 glass-light rounded-2xl p-6 shadow-xl border border-white/60 z-20"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-sage-green-100 rounded-xl flex items-center justify-center">
                        <ArrowRight className="w-6 h-6 text-sage-green-600" />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-widest text-carbon-500 font-bold">Paso Siguiente</p>
                        <span className="text-sm font-black text-carbon-900">
                          {index === 2 ? "¡Empieza ya!" : `Paso ${index + 2}`}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
