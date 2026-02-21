import { Card } from "@/components";
import { motion, useInView } from "framer-motion";
import { Star, Store, TrendingUp, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Counter animation hook
function useCountUp(
  end: number,
  duration: number = 2000,
  enabled: boolean = false,
) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    let startTime: number | null = null;
    const startCount = 0;

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      setCount(Math.floor(progress * (end - startCount) + startCount));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration, enabled]);

  return count;
}

/**
 * StatCard Component
 *
 * Individual stat card with animated counter.
 */
interface StatCardProps {
  stat: {
    icon: React.ComponentType<{ className?: string }>;
    value: number;
    suffix: string;
    label: string;
    color: string;
  };
  index: number;
  isInView: boolean;
}

function StatCard({ stat, index, isInView }: StatCardProps) {
  const Icon = stat.icon;
  const count = useCountUp(stat.value, 2000, isInView);

  return (
    <motion.div
      key={stat.label}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
    >
      <Card
        variant="elevated"
        padding="lg"
        hover
        className="h-full group text-center"
      >
        {/* Icon */}
        <div
          className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${stat.color} mb-6 group-hover:animate-glow-pulse transition-all shadow-lg shadow-sage-green-100`}
        >
          <Icon className="w-8 h-8 text-white" />
        </div>

        {/* Number */}
        <div className="text-4xl md:text-5xl font-black text-carbon-900 mb-2">
          {count}
          {stat.suffix}
        </div>

        {/* Label */}
        <div className="text-carbon-500 font-bold uppercase tracking-wider text-xs mb-1">{stat.label}</div>
        <div className="text-sage-green-600 font-medium text-sm">{stat.description}</div>
      </Card>
    </motion.div>
  );
}

/**
 * StatsSection Component
 *
 * Display impressive statistics with animated numbers.
 */
export function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  // =============== STATS DATA ==================
  const stats = [
    {
      icon: Store,
      value: 500,
      suffix: "+",
      label: "Restaurante Activos",
      description: "Confían en Plaet",
      color: "from-sage-green-200 to-sage-green-300",
    },
    {
      icon: Users,
      value: 12000,
      suffix: "+",
      label: "Usuarios Diarios",
      description: "Gestionando pedidos",
      color: "from-sage-green-300 to-sage-green-400",
    },
    {
      icon: TrendingUp,
      value: 98,
      suffix: "%",
      label: "Satisfacción",
      description: "Rating promedio",
      color: "from-sage-green-200 to-sage-green-300",
    },
    {
      icon: Star,
      value: 35,
      suffix: "%",
      label: "Más Eficiencia",
      description: "En promedio",
      color: "from-sage-green-200 to-sage-green-300",
    },
  ];

  // ============= RENDER ===============
  return (
    <section
      ref={ref}
      className="section-padding bg-sage-50 relative overflow-hidden"
    >
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -w-[800px] h-[800px] bg-sage-green-100 rounded-full blur-3xl opacity-30"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-7xl font-bold text-carbon-900 mb-6 tracking-tight"
          >
            Resultados que <span className="text-gradient-sage">hablan</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-carbon-700 max-w-2xl mx-auto font-light"
          >
            Nuestra plataforma escala con tu negocio, proporcionando las herramientas necesarias para el éxito.
          </motion.p>
        </div>

        {/* Stat Grid using Card component */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <StatCard key={stat.label} stat={stat} index={index} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
}
