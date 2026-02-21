import {
  FeaturesSection,
  HeroSection,
  Navbar,
  StatsSection,
  CTASection,
  Footer,
  BenefitsSection,
  TrustedBySection,
  PricingSection,
  TestimonialsSection,
} from "../components";

/**
 * LandingPage Component
 *
 * Main landing page combining all sections
 *
 * Structure /
 * - Navbar (sticky)
 * - Hero Section
 * - Trusted By Section
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
      {/* ================= NAVIGATION ================ */}
      <Navbar />

      {/* ============== MAIN CONTENT ================= */}
      <main>
        {/* Hero  */}
        <HeroSection />

        {/* Trusted By Brands */}
        <TrustedBySection />

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
