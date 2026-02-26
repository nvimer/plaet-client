import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { BrandName } from "@/components";
import { Footer } from "../components/Footer";

export function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header Simple */}
      <header className="py-6 px-6 lg:px-8 border-b border-sage-border-subtle sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-carbon-600 hover:text-sage-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Volver al inicio</span>
          </Link>
          <BrandName className="text-xl font-bold text-carbon-900" accentClassName="text-sage-600" />
        </div>
      </header>

      {/* Contenido Legal */}
      <main className="flex-1 py-20 px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto prose prose-sage lg:prose-lg"
        >
          <h1 className="text-4xl font-black text-carbon-900 mb-8">Política de Privacidad</h1>
          <p className="text-carbon-500 font-medium mb-12">Última actualización: {new Date().toLocaleDateString()}</p>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-carbon-800 mb-4">1. Información que recopilamos</h2>
            <p className="text-carbon-700 leading-relaxed">
              En Plaet POS, recopilamos información para brindar un mejor servicio a todos nuestros usuarios. Esto incluye información básica como su nombre, correo electrónico y detalles del restaurante, así como datos de uso del sistema para mejorar la experiencia.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-carbon-800 mb-4">2. Cómo usamos su información</h2>
            <p className="text-carbon-700 leading-relaxed">
              Utilizamos la información recopilada para proporcionar, mantener, proteger y mejorar nuestros servicios, así como para desarrollar nuevos. También utilizamos esta información para ofrecerle contenido personalizado.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-carbon-800 mb-4">3. Seguridad de los datos</h2>
            <p className="text-carbon-700 leading-relaxed">
              Trabajamos arduamente para proteger a Plaet POS y a nuestros usuarios contra el acceso no autorizado, la alteración, divulgación o destrucción de la información que poseemos. En particular, ciframos muchos de nuestros servicios utilizando SSL.
            </p>
          </section>
          
          {/* Añade más secciones según sea necesario */}
          
          <div className="mt-16 p-6 bg-sage-50 rounded-2xl border border-sage-100">
            <p className="text-carbon-700">
              Si tiene alguna pregunta sobre esta Política de Privacidad, por favor contáctenos en <a href="mailto:privacidad@plaet.app" className="text-sage-600 font-medium hover:underline">privacidad@plaet.app</a>.
            </p>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
