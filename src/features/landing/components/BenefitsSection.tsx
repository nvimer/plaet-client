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
    },
  ];

  return (
    <section id="benefits" className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-carbon-900 mb-6 tracking-tight"
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
        <div className="space-y-16 lg:space-y-24">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              {/* Content */}
              <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                {/* Step Number */}
                <div className="inline-flex items-center gap-3 mb-6">
                  <span className="text-8xl  md:text-9xl font-black text-sage-green-200 leading-none">
                    {step.number}
                  </span>
                  <div className="w-16 h-1 bg-gradient-to-r from-sage-green-300 to-sage-green-500 rounded-full"></div>
                </div>

                {/* Title */}
                <h3 className="text-3xl md:text-4xl font-bold text-carbon-900 mb-4">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-lg text-carbon-700 mb-8 font-light leading-relaxed">
                  {step.description}
                </p>

                {/* Benefits List */}
                <ul className="space-y-4">
                  {step.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-sage-green-100 flex items-center justify-center">
                        <Check
                          className="w-4 h-4 text-sage-green-600"
                          strokeWidth={3}
                        />
                      </div>
                      <span className="text-carbon-700 font-medium">
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Visual */}
              <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                <div className="relative">
                  {/* Glass Card Mockup */}
                  <div className="glass-light rounded-3xl p-8 lg:p-12 shadow-soft-xl">
                    {/* Placeholder for screenshot/illustration */}
                    <div className="aspect-[4/3] bg-gradient-sage rounded-2xl flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-20 h-20 mx-auto mb-4 bg-sage-green-300 rounded-2xl flex items-center justify-center">
                          <span className="text-4xl font-bold text-white">
                            {step.number}
                          </span>
                        </div>
                        <p className="text-sm text-carbon-500 font-medium">
                          Imagen/Screenshot aquí
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Floating element using Badge */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute -bottom-6 -right-6 glass-sage-medium rounded-2xl p-6 shadow-soft-lg"
                  >
                    <div className="flex items-center gap-3">
                      <ArrowRight className="w-5 h-5 text-sage-green-600" />
                      <span className="text-sm font-semibold text-carbon-900">
                        Paso {index + 1} de 3
                      </span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
