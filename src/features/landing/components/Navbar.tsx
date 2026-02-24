import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { Button, BrandName } from "@/components";
import { Menu, X } from "lucide-react";

/**
 * Navbar Component
 *
 * Sticky navigation bar with scroll animation
 */
export function Navbar() {
  // ============= STATE ===============
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // ====== SCROLL HOOK FOR PARALLAX ========
  const { scrollY } = useScroll();
  const navbarBg = useTransform(
    scrollY,
    [0, 100],
    ["rgba(250, 250, 248, 0)", "rgba(250, 250, 248, 0.95)"],
  );

  // ================== SCROLL DETECTION ==================
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // =============== NAVIDATION ITEMS ===================
  const navItems = [
    { label: "Inicio", href: "#home" },
    { label: "Características", href: "#features" },
    { label: "Beneficios", href: "#benefits" },
    { label: "Historias", href: "#testimonials" },
    { label: "Precios", href: "#pricing" },
  ];

  // =============== RENDER ===============
  return (
    <motion.nav
      style={{ backgroundColor: navbarBg }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "glass-light shadow-soft-md" : "bg-transparent"}`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* ============ LOGO ============ */}
          <Link to="/" className="flex items-center gap-3 group">
            {/* Logo Icon  */}
            <div className="w-10 h-10 flex items-center justify-center group-hover:animate-glow-pulse transition-all">
              <img src="/plaet.png" alt="Plaet Logo" className="w-full h-full object-contain mix-blend-multiply" />
            </div>

            {/* Brand Name */}
            <BrandName
              className="text-2xl font-bold text-carbon-900 tracking-tight"
              accentClassName="text-sage-green-600"
            />
          </Link>

          {/* ======== DESKTOP MENU ========== */}
          <div className="hidden md:flex items-center gap-8">
            {/* Navigation Links */}
            {navItems.map((link, index) => (
              <motion.a
                key={link.href}
                href={link.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-carbon-700 hover:text-sage-green-600 font-medium transition-colors duration-200 relative group"
              >
                {link.label}
                {/* Underline effect  */}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-sage-green-300 group-hover:w-full transition-all duration-300"></span>
              </motion.a>
            ))}
          </div>

          {/* CTA Buttons  */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/login">
              <Button>Iniciar Sesión</Button>
            </Link>

            <Link to="/login">
              <Button>Comenzar Gratis</Button>
            </Link>
          </div>

          {/* ============== MOBILE MENU BUTTON =============== */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-sage-green-50 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-carbon-900" />
            ) : (
              <Menu className="w-6 h-6 text-carbon-900" />
            )}
          </button>
        </div>
      </div>

      {/* =========== MOBILE MENU ============ */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden glass-light border-t border-sage-border-subtle"
        >
          <div className="px-6 py-4 space-y-4">
            {/* Mobile Nav Links */}
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className=" block py-2 text-carbon-700 hover:text-sage-green-600 font-medium transition-colors"
              >
                {item.label}
              </a>
            ))}

            {/* Mobile CTA Buttons */}
            <div className="pt-4 border-t border-sage-border-subtle space-y-3">
              <Link to="/login" className="block">
                <Button variant="ghost" fullWidth>
                  Iniciar Sesión
                </Button>
              </Link>

              <Link to="/login" className="block">
                <Button
                  variant="primary"
                  fullWidth
                  className="glass-sage-light"
                >
                  Comenzar Gratis
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
