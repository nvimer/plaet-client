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
        <div className="space-y-48">
          {steps.map((step, index) => (
            <div 
              key={step.number} 
              className={`flex flex-col ${index % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"} items-center gap-20 lg:gap-32`}
            >
              {/* Content */}
              <motion.div
                initial={{ opacity: 0, x: index % 2 === 1 ? 60 : -60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="flex-1"
              >
                {/* Step Number */}
                <div className="inline-flex items-center gap-6 mb-10 group">
                  <span className="text-8xl md:text-9xl font-black text-sage-green-100/60 leading-none group-hover:text-sage-green-200 transition-colors duration-500">
                    {step.number}
                  </span>
                  <div className="w-24 h-2 bg-gradient-to-r from-sage-green-300 to-sage-green-500 rounded-full group-hover:w-32 transition-all duration-700"></div>
                </div>

                {/* Title */}
                <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-carbon-900 mb-8 leading-tight tracking-tight">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-xl md:text-2xl text-carbon-700 mb-12 font-light leading-relaxed max-w-xl">
                  {step.description}
                </p>

                {/* Benefits List */}
                <ul className="space-y-6">
                  {step.benefits.map((benefit, bIndex) => (
                    <motion.li 
                      key={benefit} 
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + bIndex * 0.1 }}
                      className="flex items-center gap-5 group/item"
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-2xl bg-sage-green-100 flex items-center justify-center group-hover/item:bg-sage-green-200 transition-colors">
                        <Check
                          className="w-5 h-5 text-sage-green-600"
                          strokeWidth={3}
                        />
                      </div>
                      <span className="text-xl text-carbon-800 font-medium group-hover/item:text-sage-green-700 transition-colors">
                        {benefit}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Visual */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: index % 2 === 1 ? -60 : 60 }}
                whileInView={{ opacity: 1, scale: 1, x: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="flex-1 w-full"
              >
                <div className="relative group/img">
                  {/* Image Container with decorative elements */}
                  <div className="relative z-10 rounded-4xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.15)] border-[6px] border-white aspect-video lg:aspect-[4/5] xl:aspect-square">
                    <img 
                      src={step.image} 
                      alt={step.title}
                      className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-[2s] ease-out"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-carbon-900/60 via-transparent to-transparent opacity-60 group-hover/img:opacity-40 transition-opacity"></div>
                  </div>

                  {/* Decorative Background Card */}
                  <motion.div 
                    animate={{ rotate: index % 2 === 1 ? [-2, 2, -2] : [2, -2, 2] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-10 -bottom-10 -left-10 -right-10 bg-sage-green-100/50 rounded-5xl -z-10 border border-sage-green-200/50"
                  />

                  {/* Floating element */}
                  <motion.div
                    animate={{ y: [0, -8, 0], x: [0, 4, 0] }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute -bottom-12 -right-8 lg:-right-16 bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/80 z-20"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-gradient-to-br from-sage-green-400 to-sage-green-500 rounded-2xl flex items-center justify-center shadow-lg shadow-sage-green-200/50">
                        <ArrowRight className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-carbon-400 font-black mb-1">Paso Siguiente</p>
                        <span className="text-lg font-black text-carbon-900">
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
