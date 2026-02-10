import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components";
import { Badge } from "@/components/ui/Badge/Badge";

/**
 * HeroSection Component
 *
 * Main hero section with headline, description, and CTA
 */
export function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center bg-sage-green-50 overflow-hidden pt-20"
    >
      {/* ============== BACKGROUND DECORATION ============= */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradients Orbs  */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 left-10 w-96 h-96 bg-sage-green-200 rounded-full blur-3xl opacity-30"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-20 right-10 w-[32rem] h-[32rem] bg-sage-green-100 rounded-full blur-3xl opacity-20"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column: Content */}
          <div className="text-center lg:text-left">
            {/* Badge using Badge Component */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 20 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 mb-8"
            >
              <Badge variant="success" size="md" className="glass-sage-light">
                <Sparkles className="w-4 h-4 mr-1" />
                Sistema #1 en Gestión de Restaurantes
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-8"
            >
              {/* Line 1: Large */}
              <span className="block text-6xl md:text-7xl lg:text-8xl font-extrabold text-carbon-900 leading-tight-custom tracking-tighter mb-2">
                Gestiona
              </span>

              {/* Line 2: Extra Large */}
              <span className="block text-7xl md:text-8xl lg:text-display-md font-black text-carbon-900 leading-tight-custom tracking-tighter mb-2">
                tu
              </span>

              {/* Line 3: Gradient Highlight */}
              <span className="block text-7xl md:text-8xl lg:text-display-md font-black text-gradient-sage leading-tight-custom tracking-tighter">
                Restaurante
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-carbon-700 font-light leading-relaxed mb-10 max-w-2xl mx-auto lg:mx-0"
            >
              La plataforma todo-en-uno que {""}
              <span className="font-semibold text-sage-green-600">
                simplifica
              </span>{" "}
              la gestión de pedidos, mesas y menú de tu restaurante.
            </motion.p>

            {/* Feature Bullets */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-12 justify-center lg:justify-start"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-sage-green-400"></div>
                <span className="text-carbon-700 font-medium">
                  Sin instalación
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-sage-green-400"></div>
                <span className="text-carbon-700 font-medium">
                  Gratis 30 días
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-sage-green-400"></div>
                <span className="text-carbon-700 font-medium">
                  Soporte 24/7
                </span>
              </div>
            </motion.div>

            {/* CTA Buttons using Button component */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link to="/login">
                <Button
                  variant="primary"
                  size="lg"
                  className="group shadow-soft-log hover:shadow-soft-xl hover:-translate-y-0.5"
                >
                  <span>Comenzar Ahora</span>
                  <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              <Button
                variant="secondary"
                size="lg"
                className="glass-sage-light hover:-translate-y-0.5"
              >
                Ver Demo
              </Button>
            </motion.div>
          </div>

          {/* Right Column: Glass Cards */}
          <div className="relative">
            {/* Main Dashboard Mockup Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative glass-light rounded-[2rem] p-8 lg:p-12 shadow-soft-xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-sm font-medium text-carbon-500 mb-1">
                    Dashboard
                  </p>
                  <h3 className="text-2xl font-bold text-carbon-900">
                    Vista General
                  </h3>
                </div>

                <div className="w-12 h-12 bg-gradient-sage rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-sage-green-600" />
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {/* Stat Card 1 */}
                <div className="glass-sage-light rounded-xl p-4">
                  <p className="text-sm text-carbon-500 mb-1">Pedidos Hoy</p>
                  <p className="text-3xl font-bold text-carbon-900">142</p>
                  <p className="text-xs text-sage-green-600 font-medium mt-1">
                    +18% vs ayer
                  </p>
                </div>

                {/* Stat Card 2 */}
                <div className="glass-sage-light rounded-xl p-4">
                  <p className="text-sm text-carbon-500 mb-1">Mesas Activas</p>
                  <p className="text-3xl font-bold text-carbon-900">12</p>
                  <p className="text-xs text-sage-green-600 font-medium mt-1">
                    75% ocupación
                  </p>
                </div>

                {/* Stat Card 3 */}
                <div className="glass-sage-light rounded-xl p-4">
                  <p className="text-sm text-carbon-500 mb-1">Ingresos</p>
                  <p className="text-3xl font-bold text-carbon-900">$3.2K</p>
                  <p className="text-xs text-sage-green-600 font-medium mt-1">
                    +12% vs ayer
                  </p>
                </div>

                {/* Stat Card 4 */}
                <div className="glass-sage-light rounded-xl p-4">
                  <p className="text-sm text-carbon-500 mb-1">Productos</p>
                  <p className="text-3xl font-bold text-carbon-900">48</p>
                  <p className="text-xs text-sage-green-600 font-medium mt-1">
                    En menú
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-carbon-700 font-medium">
                    Meta del Día
                  </span>
                  <span className=" text-sage-green-600 font-semibold">
                    82%
                  </span>
                </div>

                <div className="h-2 bg-sage-green-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "82%" }}
                    transition={{ duration: 1.5, delay: 0.8 }}
                    className="h-full bg-gradient-to-ra from-sage-green-300 to-sage-green-400 rounded-full"
                  />
                </div>
              </div>
            </motion.div>

            {/* Floating Badge using component */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="absolute -right-4 -bottom-12 glass-sage-medium rounded-2xl p-4 shadow-soft-lg animate-float"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-sage-green-300 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-sage-green-700" />
                </div>
                <div>
                  <p className="text-xs text-carbon-500 font-medium">
                    Clientes Felices
                  </p>
                  <p className="text-xl font-bold text-carbon-900">1.200+</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
