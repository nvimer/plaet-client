import { Button } from "@/components";
import { Badge } from "@/components/ui/Badge/Badge";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * CTASection Component
 *
 * Final call-to-action section
 */
export function CTASection() {
  const features = [
    "Sin tarjeta de credito",
    "30 días gratis",
    "Soporte incluído",
    "Cancela cuando quieras",
  ];

  return (
    <section className="section-padding bg-sage-50 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-1/4 -left-48 w-96 h-96 bg-sage-green-200 rounded-full blur-3xl opacity-30"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-1/4 -right-48 w-[32rem] h-[32rem] bg-sage-green-300 rounded-full blur-3xl opacity-20"
        />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 lg:px-8">
        {/* Main CTA Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-light rounded-[3rem] p-12 lg:p-16 shadow-soft-xl text-center"
        >
          {/* Badge using component */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex mb-8"
          >
            <Badge variant="success" size="md" className="glass-sage-light">
              <CheckCircle className="w-4 h-4 mr-2" />
              Más de 500 restaurantes ya lo usan
            </Badge>
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-carbon-900 mb-6 tracking-tight"
          >
            Comienza {""}
            <span className="text-gradient-sage">hoy mismo</span>
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-carbon-700 mb-10 max-w-2xl mx-auto font-light"
          >
            Únete a cientos de restaurantes que ya transformaron su operación.
            Empieza gratis, sin compromiso.
          </motion.p>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
          >
            {features.map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-2 justify-center lg:justify-start"
              >
                <div className="w-2 h-2 rounded-full bg-sage-green-400"></div>
                <span className="text-carbon-700 font-medium">{feature}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/login">
              <Button
                variant="primary"
                size="lg"
                className="group shadow-soft-lg hover:shadow-soft-xl hover:-translate-y-0.5"
              >
                <span>Crear Cuenta Gratis</span>
                <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <Button
              variant="secondary"
              size="lg"
              className="glass-sage-light hover:-translate-y-0.5"
            >
              Hablar con Ventas
            </Button>
          </motion.div>

          {/* Trust Badge */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8 text-sm text-carbon-500 font-light"
          >
            🔒 Tus datos están seguros. Encriptación de nivel bancario.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
