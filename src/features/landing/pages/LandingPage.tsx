import {
  FeaturesSection,
  HeroSection,
  Navbar,
  StatsSection,
  CTASection,
  Footer,
  BenefitsSection,
  PricingSection,
  TestimonialsSection,
} from "../components";
import { Seo } from "@/components";

/**
 * LandingPage Component
 *
 * Main landing page combining all sections
 *
 * Structure /
 * - Navbar (sticky)
 * - Hero Section
 * - Features Section
 * - Stats Section
 * - Benefits Section
 * - Testimonials Section
 * - Pricing Section
 * - CTA Section
 * - Footer
 */
export function LandingPage() {
  return (
    <div className="bg-sage-50 min-h-screen">
      <Seo 
        title="POS para Restaurantes"
        description="Sistema de gestión para restaurantes optimizado para pantallas táctiles. Gestiona pedidos, cocina e inventario sin fricción."
      />
      
      {/* ================= NAVIGATION ================ */}
      <Navbar />

      {/* ============== MAIN CONTENT ================= */}
      <main>
        {/* Hero  */}
        <HeroSection />

        {/* Features */}
        <FeaturesSection />

        {/* Stats */}
        <StatsSection />

        {/* Benefits */}
        <BenefitsSection />

        {/* Testimonials */}
        <TestimonialsSection />

        {/* Pricing */}
        <PricingSection />

        {/* CTA */}
        <CTASection />
      </main>

      {/* =========== FOOTER ===========  */}
      <Footer />
    </div>
  );
}
