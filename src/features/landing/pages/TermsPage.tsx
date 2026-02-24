import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { BrandName } from "@/components";
import { Footer } from "../components/Footer";

export function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header Simple */}
      <header className="py-6 px-6 lg:px-8 border-b border-sage-border-subtle sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-carbon-600 hover:text-sage-green-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Volver al inicio</span>
          </Link>
          <BrandName className="text-xl font-bold text-carbon-900" accentClassName="text-sage-green-600" />
        </div>
      </header>

      {/* Contenido Legal */}
      <main className="flex-1 py-20 px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto prose prose-sage lg:prose-lg"
        >
          <h1 className="text-4xl font-black text-carbon-900 mb-8">Términos y Condiciones</h1>
          <p className="text-carbon-500 font-medium mb-12">Última actualización: {new Date().toLocaleDateString()}</p>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-carbon-800 mb-4">1. Aceptación de los Términos</h2>
            <p className="text-carbon-700 leading-relaxed">
              Al acceder y utilizar el servicio Plaet POS, usted acepta estar sujeto a estos Términos y Condiciones. Si no está de acuerdo con alguna parte de estos términos, no podrá acceder al servicio.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-carbon-800 mb-4">2. Uso de la Licencia</h2>
            <p className="text-carbon-700 leading-relaxed">
              Se le concede una licencia limitada, no exclusiva e intransferible para utilizar el software Plaet POS estrictamente de acuerdo con estos términos para las operaciones internas de su restaurante.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-carbon-800 mb-4">3. Responsabilidades del Usuario</h2>
            <p className="text-carbon-700 leading-relaxed">
              Usted es responsable de salvaguardar la contraseña que utiliza para acceder al servicio y de cualquier actividad o acción bajo su contraseña. Usted acepta no revelar su contraseña a terceros.
            </p>
          </section>

          {/* Añade más secciones según sea necesario */}

          <div className="mt-16 p-6 bg-sage-50 rounded-2xl border border-sage-100">
            <p className="text-carbon-700">
              Si tiene alguna duda sobre nuestros Términos y Condiciones, escríbanos a <a href="mailto:legal@plaet.app" className="text-sage-green-600 font-medium hover:underline">legal@plaet.app</a>.
            </p>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
