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
      className="relative min-h-screen flex items-center justify-center bg-sage-50 overflow-hidden pt-20"
    >
      {/* ============== BACKGROUND DECORATION ============= */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Abstract Background Image (Subtle) */}
        <div 
          className="absolute inset-0 opacity-[0.03] grayscale bg-cover bg-center"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=2070")' }}
        />

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
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 mb-8"
            >
              <Badge variant="success" size="md" className="bg-sage-green-100 text-sage-green-700 border-sage-green-200">
                <Sparkles className="w-4 h-4 mr-1 text-sage-green-500" />
                Sistema #1 en Gestión de Restaurantes
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-8"
            >
              <span className="block text-5xl md:text-6xl lg:text-display-sm font-extrabold text-carbon-900 leading-tight tracking-tight mb-2">
                Gestiona tu
              </span>
              <span className="block text-6xl md:text-7xl lg:text-display-md font-black text-gradient-sage leading-tight tracking-tighter">
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
              cada aspecto de tu negocio, desde el menú hasta la caja.
            </motion.p>

            {/* Feature Bullets */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-wrap items-center gap-x-8 gap-y-4 mb-12 justify-center lg:justify-start"
            >
              {[
                "Sin instalación",
                "Gratis 30 días",
                "Soporte 24/7",
              ].map((text) => (
                <div key={text} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-sage-green-400"></div>
                  <span className="text-carbon-600 font-medium text-sm md:text-base">
                    {text}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
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
                  className="group shadow-lg hover:shadow-xl transition-all"
                >
                  <span>Comenzar Ahora</span>
                  <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              <Button
                variant="secondary"
                size="lg"
                className="hover:bg-white transition-all"
              >
                Ver Demo
              </Button>
            </motion.div>
            
            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className="mt-12 flex items-center justify-center lg:justify-start gap-4"
            >
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-sage-green-200 overflow-hidden">
                    <img 
                      src={`https://i.pravatar.cc/100?u=${i}`} 
                      alt="Avatar" 
                      className="w-full h-full object-cover grayscale"
                    />
                  </div>
                ))}
              </div>
              <p className="text-sm text-carbon-500">
                Más de <span className="font-bold text-carbon-900">500+</span> restaurantes confían en nosotros
              </p>
            </motion.div>
          </div>

          {/* Right Column: Layered Mockup */}
          <div className="relative lg:h-[600px] flex items-center justify-center">
            {/* Main App Window */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative w-full aspect-[4/3] max-w-[500px] glass-light rounded-[2.5rem] p-6 shadow-2xl overflow-hidden border border-white/50"
            >
              {/* App Toolbar */}
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-error-400"></div>
                <div className="w-3 h-3 rounded-full bg-warning-400"></div>
                <div className="w-3 h-3 rounded-full bg-success-400"></div>
                <div className="ml-4 h-6 w-32 bg-sage-green-100 rounded-lg"></div>
              </div>

              {/* Order Grid (Mockup) */}
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white/50 rounded-2xl p-4 border border-sage-green-100">
                    <div className="flex justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-sage-green-100"></div>
                      <div className="w-12 h-5 bg-sage-green-200/50 rounded-md"></div>
                    </div>
                    <div className="w-full h-3 bg-carbon-100 rounded-full mb-2"></div>
                    <div className="w-2/3 h-3 bg-carbon-50 rounded-full"></div>
                  </div>
                ))}
              </div>
              
              {/* Bottom Chart Area */}
              <div className="mt-6 p-4 bg-gradient-sage rounded-2xl h-32 flex items-end justify-between gap-2 px-6">
                {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 1, delay: 1 + i * 0.1 }}
                    className="w-full bg-white/40 rounded-t-lg"
                  />
                ))}
              </div>
            </motion.div>

            {/* Floating Element 1: Active Order */}
            <motion.div
              animate={{ 
                y: [0, -15, 0],
                rotate: [0, 1, 0]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-4 lg:-right-12 glass-light rounded-2xl p-4 shadow-xl border border-white/60 max-w-[200px]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-300 rounded-xl flex items-center justify-center shadow-lg shadow-primary-200/50">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-carbon-500 font-bold">Nuevo Pedido</p>
                  <p className="text-sm font-bold text-carbon-900">Mesa 14 • $45.00</p>
                </div>
              </div>
            </motion.div>

            {/* Floating Element 2: Performance */}
            <motion.div
              animate={{ 
                y: [0, 15, 0],
                rotate: [0, -1, 0]
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute -bottom-6 -left-4 lg:-left-12 glass-light rounded-2xl p-5 shadow-xl border border-white/60 min-w-[180px]"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold text-carbon-500">Rendimiento</p>
                <div className="w-2 h-2 rounded-full bg-success-500"></div>
              </div>
              <p className="text-2xl font-black text-carbon-900 tracking-tight">+24.5%</p>
              <p className="text-[10px] text-success-600 font-bold">vs el mes anterior</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
