import { motion } from "framer-motion";

export function TrustedBySection() {
  const logos = [
    { name: "Sazón & Leña", logo: "https://placehold.co/200x80/f1f7f4/4a5c54?text=SAZON+LEÑA&font=montserrat" },
    { name: "La Brasa Roja", logo: "https://placehold.co/200x80/f1f7f4/4a5c54?text=BRASA+ROJA&font=montserrat" },
    { name: "Frisby", logo: "https://placehold.co/200x80/f1f7f4/4a5c54?text=FRISBY&font=montserrat" },
    { name: "Crepes & Waffles", logo: "https://placehold.co/200x80/f1f7f4/4a5c54?text=CREPES&font=montserrat" },
    { name: "El Corral", logo: "https://placehold.co/200x80/f1f7f4/4a5c54?text=EL+CORRAL&font=montserrat" },
  ];

  return (
    <section className="py-12 bg-white border-y border-sage-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <p className="text-center text-sm font-bold text-carbon-400 uppercase tracking-widest mb-8">
          Confiado por los mejores establecimientos
        </p>
        
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          {logos.map((logo, index) => (
            <motion.div
              key={logo.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <img 
                src={logo.logo} 
                alt={logo.name} 
                className="h-8 md:h-10 w-auto object-contain"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
