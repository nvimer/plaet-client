import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Card } from "@/components";

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Andrés Rodríguez",
      role: "Dueño de 'El Gran Sabor'",
      image: "https://i.pravatar.cc/150?u=andres",
      content:
        "Plaet transformó totalmente nuestra operación. Antes perdíamos pedidos en la comunicación entre salón y cocina, ahora todo fluye sin errores.",
      stars: 5,
    },
    {
      name: "Claudia Méndez",
      role: "Administradora en 'Terraza Verde'",
      image: "https://i.pravatar.cc/150?u=claudia",
      content:
        "La facilidad de uso es increíble. Mis meseros aprendieron a usarlo en menos de 10 minutos. Los reportes de ventas son mi herramienta favorita.",
      stars: 5,
    },
    {
      name: "Mateo Restrepo",
      role: "Chef Ejecutivo de 'Gusto Gourmet'",
      image: "https://i.pravatar.cc/150?u=mateo",
      content:
        "El sistema de cocina (Kanban) es una maravilla. Tenemos mucho más orden y los tiempos de entrega han bajado considerablemente.",
      stars: 5,
    },
  ];

  return (
    <section id="testimonials" className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-7xl font-bold text-carbon-900 mb-6 tracking-tight"
          >
            Historias de <span className="text-gradient-sage">éxito</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-carbon-700 max-w-2xl mx-auto font-light"
          >
            Lo que dicen los líderes del sector sobre nuestra plataforma.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card
                variant="bordered"
                padding="lg"
                className="h-full flex flex-col hover:border-sage-green-300 transition-colors"
              >
                <div className="flex gap-1 mb-6">
                  {[...Array(t.stars)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-warning-400 text-warning-400" />
                  ))}
                </div>

                <p className="text-carbon-700 italic font-light leading-relaxed mb-8 flex-1">
                  "{t.content}"
                </p>

                <div className="flex items-center gap-4">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-carbon-900">{t.name}</h4>
                    <p className="text-sm text-carbon-500">{t.role}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
