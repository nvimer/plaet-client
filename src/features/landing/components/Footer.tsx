import { Button, Input, BrandName } from "@/components";
import { Facebook, Instagram, Linkedin, Mail, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  const footerLinks = {
    product: {
      title: "Producto",
      links: [
        { label: "Características", href: "#features" },
        { label: "Beneficios", href: "#benefits" },
        { label: "Testimonios", href: "#testimonials" },
        { label: "Precios", href: "#pricing" },
      ],
    },
    support: {
      title: "Soporte",
      links: [
        { label: "Contacto", href: "mailto:hola@plaet.app" },
        { label: "Centro de Ayuda", href: "mailto:soporte@plaet.app" },
      ],
    },
    legal: {
      title: "Legal",
      links: [
        { label: "Privacidad", href: "/privacy" },
        { label: "Términos y Condiciones", href: "/terms" },
      ],
    },
  };

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
    { icon: Twitter, href: "https://x.com", label: "X" },
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  ];

  return (
    <footer className="bg-white border-t border-sage-border-subtle">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        {/* Top Section  */}
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 flex items-center justify-center">
                <img src="/plaet.png" alt="Plaet Logo" className="w-full h-full object-contain mix-blend-multiply" />
              </div>
              <BrandName
                className="text-2xl font-bold text-carbon-900 tracking-tight"
                accentClassName="text-sage-green-600"
              />
            </Link>

            {/* Description */}
            <p className="text-carbon-700 font-light mb-6 leading-relaxed">
              La plataforma completa para gestionar tu restaurante de manera
              profesional y eficiente.
            </p>

            {/* Newletter  */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-carbon-900 block">
                Suscríbete a nuestro boletín
              </label>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="tu@email.com"
                  fullWidth
                  className="flex-1"
                />
                <Button variant="primary" size="md">
                  <Mail className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key}>
              <h3 className="text-sm font-bold text-carbon-900 uppercase tracking-wider mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-carbon-700 hover:text-sage-green-600 transition-colors font-light"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-sage-border-subtle mb-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Copyright */}
          <p className="text-sm text-carbon-500 font-light">
            © {new Date().getFullYear()} <BrandName className="inline-flex" />. Todos los derechos reservados.
          </p>

          <div className="flex items-center gap-4">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  href={social.href}
                  target="_blank"
                  rel="noonpener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-xl bg-sage-50 flex items-center justify-center hover:bg-sage-green-100 transition-colors group"
                >
                  <Icon className="w-5 h-5 text-carbon-700 group-hover:text-sage-green-600 transition-colors" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
