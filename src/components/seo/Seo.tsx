import { Helmet } from "react-helmet-async";
import { APP_NAME } from "@/config/constants";
import { useLocation } from "react-router-dom";

interface SeoProps {
  title: string;
  description?: string;
  image?: string;
  type?: "website" | "article" | "product";
  noIndex?: boolean;
}

const DEFAULT_DESCRIPTION = "Plaet - El sistema POS definitivo para restaurantes. Optimiza tu servicio, gestión de cocina e inventario con una experiencia táctil fluida.";
const DEFAULT_IMAGE = "/og-image.jpg"; // You should ensure this image exists in public/
const SITE_URL = import.meta.env.VITE_APP_URL || "https://plaet.cloud";

export function Seo({
  title,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  type = "website",
  noIndex = false,
}: SeoProps) {
  const { pathname } = useLocation();
  
  // Construct full URLs
  const canonicalUrl = `${SITE_URL}${pathname}`;
  const imageUrl = image.startsWith("http") ? image : `${SITE_URL}${image}`;
  const fullTitle = `${title} | ${APP_NAME}`;

  return (
    <Helmet>
      {/* Basic Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Canonical */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:site_name" content={APP_NAME} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {/* Structured Data (JSON-LD) for SoftwareApplication */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": APP_NAME,
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web Browser, iOS, Android",
          "description": description,
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "url": SITE_URL
        })}
      </script>
    </Helmet>
  );
}
