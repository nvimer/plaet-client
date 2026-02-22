import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components";
import { Badge } from "@/components/ui/Badge/Badge";
import { useEffect } from "react";

/**
 * HeroSection Component
 *
 * Main hero section with high-impact animations and interactive elements
 */
export function HeroSection() {
  // Parallax Scroll Effect
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  // Mouse Tracking for Background
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const boostX = useSpring(mouseX, springConfig);
  const boostY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const moveX = (clientX - window.innerWidth / 2) / 40;
      const moveY = (clientY - window.innerHeight / 2) / 40;
      mouseX.set(moveX);
      mouseY.set(moveY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center bg-sage-50 overflow-hidden pt-20"
    >
      {/* ============== BACKGROUND DECORATION ============= */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Abstract Background Image */}
        <motion.div 
          style={{ 
            y: y1,
            backgroundImage: 'url("https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=2070")'
          }}
          className="absolute inset-0 opacity-[0.04] grayscale bg-cover bg-center scale-110"
        />

        {/* Interactive Gradients Orbs */}
        <motion.div
          style={{ x: boostX, y: boostY }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.4, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-0 left-1/4 w-[40rem] h-[40rem] bg-sage-green-200 rounded-full blur-[100px] opacity-30"
        />
        <motion.div
          style={{ 
            x: useTransform(boostX, (val) => -val * 1.5), 
            y: useTransform(boostY, (val) => -val * 1.5) 
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute -bottom-20 right-1/4 w-[45rem] h-[45rem] bg-sage-green-100 rounded-full blur-[120px] opacity-20"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column: Content */}
          <motion.div 
            style={{ opacity }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 260,
                damping: 20 
              }}
              className="inline-flex items-center gap-2 mb-8"
            >
              <Badge variant="success" size="md" className="bg-white/80 backdrop-blur-md text-sage-green-700 border-sage-green-200 shadow-soft-sm px-4 py-1.5">
                <Sparkles className="w-4 h-4 mr-1 text-sage-green-500 animate-pulse" />
                Sistema #1 en Gestión de Restaurantes
              </Badge>
            </motion.div>

            <div className="mb-8">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-5xl md:text-7xl lg:text-display-sm font-extrabold text-carbon-900 leading-tight tracking-tight"
              >
                Gestiona tu
              </motion.h1>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="text-6xl md:text-8xl lg:text-display-md font-black text-gradient-sage leading-tight tracking-tighter"
              >
                Restaurante
              </motion.h1>
            </div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="flex flex-wrap items-center gap-x-8 gap-y-4 mb-12 justify-center lg:justify-start"
            >
              {[
                "Sin instalación",
                "Gratis 30 días",
                "Soporte 24/7",
              ].map((text, i) => (
                <motion.div 
                  key={text} 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-sage-green-400"></div>
                  <span className="text-carbon-600 font-medium text-sm md:text-base">
                    {text}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link to="/login">
                <Button
                  variant="primary"
                  size="lg"
                  className="group relative overflow-hidden shadow-xl shadow-sage-green-200/50 hover:shadow-2xl hover:shadow-sage-green-300/50 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <span className="relative z-10 flex items-center">
                    Comenzar Ahora
                    <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                  {/* Shimmer Effect */}
                  <motion.div
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 z-0"
                  />
                </Button>
              </Link>

              <Button
                variant="secondary"
                size="lg"
                className="bg-white/50 backdrop-blur-md border-sage-green-100 hover:bg-white transition-all transform hover:-translate-y-1"
              >
                Ver Demo
              </Button>
            </motion.div>
            
            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
              className="mt-12 flex items-center justify-center lg:justify-start gap-4"
            >
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <motion.div 
                    key={i} 
                    whileHover={{ y: -5, scale: 1.1, zIndex: 10 }}
                    className="w-10 h-10 rounded-full border-2 border-white bg-sage-green-200 shadow-md overflow-hidden cursor-pointer transition-transform"
                  >
                    <img 
                      src={`https://i.pravatar.cc/100?u=${i + 10}`} 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                ))}
              </div>
              <p className="text-sm text-carbon-500 font-medium">
                Más de <span className="font-bold text-carbon-900">500+</span> restaurantes ya están creciendo
              </p>
            </motion.div>
          </motion.div>

          {/* Right Column: Layered Mockup */}
          <motion.div 
            style={{ y: y2 }}
            className="relative lg:h-[600px] flex items-center justify-center"
          >
            {/* Floating Glow Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-sage-green-300/20 blur-[100px] rounded-full"></div>

            {/* Main App Window */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotateY: -10 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full aspect-[4/3] max-w-[500px] bg-white/70 backdrop-blur-2xl rounded-4xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden border border-white/80 z-10"
            >
              {/* App Toolbar */}
              <div className="flex items-center gap-2 mb-8">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-error-400"></div>
                  <div className="w-3 h-3 rounded-full bg-warning-400"></div>
                  <div className="w-3 h-3 rounded-full bg-success-400"></div>
                </div>
                <div className="ml-6 h-7 w-40 bg-sage-green-100/50 rounded-xl border border-sage-green-200/30"></div>
              </div>

              {/* Order Grid (Mockup) */}
              <div className="grid grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <motion.div 
                    key={i} 
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.9)" }}
                    className="bg-white/60 rounded-[1.5rem] p-5 border border-sage-green-100 shadow-sm transition-colors"
                  >
                    <div className="flex justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sage-green-100 to-sage-green-200"></div>
                      <div className="w-14 h-6 bg-sage-green-300/30 rounded-lg"></div>
                    </div>
                    <div className="w-full h-2.5 bg-carbon-100/50 rounded-full mb-3"></div>
                    <div className="w-2/3 h-2.5 bg-carbon-50/50 rounded-full"></div>
                  </motion.div>
                ))}
              </div>
              
              {/* Bottom Chart Area */}
              <div className="mt-8 p-6 bg-gradient-to-br from-sage-green-50 to-sage-green-100/50 rounded-3xl h-36 flex items-end justify-between gap-2.5 px-8 border border-sage-green-200/30">
                {[40, 75, 45, 95, 65, 85, 55].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 1.5, delay: 1 + i * 0.1, ease: "easeOut" }}
                    className="w-full bg-gradient-to-t from-primary-300 to-primary-400 rounded-t-xl shadow-lg shadow-primary-200/20"
                  />
                ))}
              </div>
            </motion.div>

            {/* Floating Element 1: Active Order */}
            <motion.div
              animate={{ 
                y: [0, -8, 0],
                x: [0, 4, 0],
                rotate: [1, 0, 1]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 -right-6 lg:-right-16 bg-white/90 backdrop-blur-xl rounded-3xl p-5 shadow-2xl border border-white z-20 max-w-[220px]"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-400 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-200/50">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-carbon-400 font-bold mb-0.5">Nuevo Pedido</p>
                  <p className="text-base font-black text-carbon-900">Mesa 14 • $45.00</p>
                </div>
              </div>
            </motion.div>

            {/* Floating Element 2: Performance */}
            <motion.div
              animate={{ 
                y: [0, 8, 0],
                x: [0, -4, 0],
                rotate: [-1, 0, -1]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute -bottom-10 -left-6 lg:-left-16 bg-carbon-900/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-carbon-800 z-20 min-w-[200px]"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-bold text-carbon-400 uppercase tracking-widest">Rendimiento</p>
                <div className="w-2.5 h-2.5 rounded-full bg-success-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]"></div>
              </div>
              <p className="text-3xl font-black text-white tracking-tight mb-1">+24.5%</p>
              <p className="text-[11px] text-success-400 font-bold tracking-wide">CRECIMIENTO MENSUAL</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
