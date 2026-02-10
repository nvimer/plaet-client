import {
  FeaturesSection,
  HeroSection,
  Navbar,
  StatsSection,
  CTASection,
  Footer,
  BenefitsSection,
} from "../components";

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
 * - CTA Section
 * - Footer
 */
export function LandingPage() {
  return (
    <div>
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

        {/* CTA */}
        <CTASection />
      </main>

      {/* =========== FOOTER ===========  */}
      <Footer />
    </div>
  );
}
