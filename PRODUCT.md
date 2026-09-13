# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Personal operativo de restaurante — meseros y cajeros — que opera el sistema en un punto de venta táctil (tablet/kiosk) durante el servicio. Roles confirmados en el modelo de datos: `ADMIN`, `CASHIER`, `WAITER`, `SUPERADMIN` (`plaet-server/prisma/schema.prisma`). Un segundo perfil, admin/dueño, gestiona uno o varios restaurantes desde el back-office (menú, inventario, mesas, gastos, cierres de caja, analítica).

## Product Purpose

Plaet es un sistema POS (punto de venta) y de administración para restaurantes: gestión de pedidos, mesas, menú (incluyendo menú del día), inventario, clientes, gastos, cierre de caja y analítica, con una experiencia táctil pensada para el piso de un restaurante.

## Positioning

Diferenciadores confirmados por el usuario:
1. UX táctil/kiosk fluida y rápida para operación en piso (vs. interfaces de escritorio genéricas).
2. Diseñado específicamente para el mercado colombiano (moneda COP, locale es-CO, flujo operativo local) en lugar de una solución genérica traducida.

## Operating Context

- Operación en tiempo real durante el servicio de un restaurante: toma de pedidos por mesero, selección de proteínas/variantes, pagos, cierre de caja al final del turno.
- Soporte multi-restaurante: un mismo admin/organización puede gestionar uno o varios restaurantes (`src/features/restaurants`).
- Formato de moneda y locale fijados a COP / es-CO en toda la app (`src/utils/formatUtils.ts` y componentes de precios/pagos).
- Frontend (`plaet-client`) se despliega en Vercel; backend (`plaet-server`, Node/Express + Prisma) en Railway, con Supabase como base de datos/almacenamiento.

## Capabilities and Constraints

Features confirmadas (`plaet-client/src/features/`): `auth`, `dashboard`, `orders` (ciclo de vida de pedidos y pagos), `menu`, `daily-menu` (menú del día con precio base), `tables` (gestión de mesas/piso), `inventory`, `customers` (incluye venta de "ticket books"), `expenses`, `cash-closure` (cierre de caja), `analytics`, `users`, `permissions`, `restaurants` (multi-restaurante).

No se encontró lógica de facturación electrónica DIAN ni impuestos específicos en el código revisado — tratar como no implementado, no como hecho a preservar.

## Brand Commitments

Nombre confirmado: **Plaet** (con subtítulo opcional "Management" vía el componente `BrandName`). Logo/favicon en `plaet-client/public/plaet.png`. Sistema de color documentado como tokens semánticos (sage/carbon/primary/success/warning/error/info) en `tailwind.config.js`, con reglas de uso en `SKILL.md`/`AGENTS.md` (siempre tokens semánticos, nunca colores literales; `rounded-2xl` para cards, `rounded-3xl` para "launchpads"; `transitions.soft` + framer-motion para motion).

## Evidence on Hand

- Copy SEO existente (`plaet-client/src/components/seo/Seo.tsx`): "Plaet - El sistema POS definitivo para restaurantes. Optimiza tu servicio, gestión de cocina e inventario con una experiencia táctil fluida."
- README del cliente describe el producto como "Restaurant Management POS" con enfoque en UX táctil/kiosk.
- No hay testimonios, casos de estudio ni cifras de negocio documentados en el repo — no inventar métricas ni clientes de referencia en trabajo futuro.

## Product Principles

1. La operación en piso (mesero/cajero) es la ruta crítica: prioriza velocidad táctil y bajo error sobre densidad de información.
2. El back-office de administración (menú, inventario, analítica) prioriza claridad y control sobre expresividad visual.
3. Toda decisión de color/tipo/forma respeta los tokens semánticos ya definidos — no introducir valores literales nuevos.
4. El producto asume operación en español (es-CO) y moneda COP como contexto por defecto.
5. Soporte multi-restaurante es un requisito estructural, no un caso secundario.

## Accessibility & Inclusion

Requisito documentado: contraste WCAG AA (mínimo 4.5:1), según `plaet-client/src/styles/color-system.md`, que etiqueta la paleta como "WCAG AA Compliant". No hay otros requisitos de accesibilidad formalizados más allá de este.
