# GEMINI.md - Project Context & Guidelines

## 🍽 Project Overview: Plaet POS (Plaet App)

**Plaet** is a specialized Restaurant Management Point of Sale (POS) application. It is designed with a **tactile/kiosk-first UX**, optimized for use on tablets and touchscreens by Cashiers, Waiters, and Kitchen Staff.

- **Primary Stack:** React 19, TypeScript 5.8, Vite 6
- **Styling:** Tailwind CSS 3.4 (with custom color palette and touch-optimized components)
- **State Management:** TanStack Query 5 (Server State)
- **Routing:** React Router 7
- **Forms:** React Hook Form + Zod validation
- **Backend Communication:** Axios (JWT-based auth with httpOnly cookies)

## 🏗 Architecture & Project Structure

The project follows a **feature-based architecture**. Each module in `src/features/` is self-contained.

**Core Architectural Paradigms:**
1.  **Master-Detail Orders:** A single "Order" represents a table session or a customer account (Master). Individual dishes/products are "OrderItems" (Detail) within that order.
2.  **Table-Centric Workflow:** Operations in the POS (like billing and kitchen boards) group and move items based on their parent Table/Group. An entire table's order moves to "Ready" only when ALL its items are prepared.
3.  **Pay First Rule:** Orders do not appear on the Kitchen Kanban until their status is `PAID`. Cashiers handle billing; Kitchen handles preparation.

```
src/
├── app/                # Global config (Routes, Breadcrumbs)
├── components/         # Shared UI components
│   ├── layout/         # Sidebar, TopBar, Breadcrumbs
│   └── ui/             # Atomic components (Button, Input, etc.)
├── contexts/           # React Contexts (Auth, Sidebar)
├── features/           # Feature-based modules
│   ├── auth/           # Login, Password recovery, Email verification
│   ├── daily-menu/     # The "Corrientazo" configuration & Packaging Fees
│   ├── dashboard/      # Admin/Overview stats
│   ├── menu/           # Products, Categories, Stock Management
│   ├── orders/         # Order creation (Table-centric), Detail, Kitchen view
│   ├── tables/         # Visual table management
│   └── users/          # RBAC (Admin-only), Profile
├── hooks/              # Global custom hooks
├── layouts/            # Layout wrappers (Dashboard, FullScreen, Sidebar)
├── lib/                # Configured library instances (Axios client, Query client)
├── services/           # Global API services
├── types/              # TypeScript definitions (synced with Prisma backend)
└── utils/              # Helper functions (cn utility, error handling, logger, motion)
```

## 🍛 Core Domain: The "Corrientazo"

A central feature of this POS is the **Corrientazo** (Daily Menu).
- **Fixed Categories:** Categories like Sopas, Principios, Proteínas, Arroz, etc., are backend-seeded and cannot be modified via the UI.
- **Pricing Logic:** Total price = `basePrice` + `selected protein(s) price`.
- **Packaging Fees:** Portacomidas (Take-out containers) are manually quantity-adjusted in the UI but their price is centrally controlled via the Daily Menu settings.
- **UX Requirement:** Minimal labels, large touch targets, and visual grids for selection instead of dropdowns. Flexible interchanges (e.g., removing Soup for extra Rice) are supported via `ReplacementManager`.

## 🛠 Building and Running

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run dev` | Start development server (Vite) |
| `npm run build` | Generate production build |
| `npm run type-check` | Run TypeScript compiler check |
| `npm run lint` | Run ESLint check |
| `npm run preview` | Preview production build locally |

## 🤖 Critical Development Guidelines (For AI Agents)

1.  **Strict TypeScript:** NO `any` or `unknown`. Everything must be explicitly typed.
2.  **Tactile UX:** Maintain 44px minimum touch targets. Prefer `TouchableCard` and grids over traditional desktop inputs.
3.  **Layouts in Routes:** Layouts (e.g., `<DashboardLayout>`) are applied in `src/App.tsx`. Do NOT wrap pages in layouts internally unless creating a sub-layout.
4.  **React Query:** All data fetching and mutations MUST use TanStack Query hooks.
5.  **Forms:** Use `react-hook-form` integrated with `zod` for validation.
6.  **Styling & Motion:** Use the `cn()` utility for merging Tailwind classes. Respect the custom color palette (`sage-green`, `carbon`, `primary`). All animations MUST use the "Soft & Minimal" configurations from `src/utils/motion.ts` (e.g., `variants.fadeInUp`, `transitions.soft`). DO NOT use raw `framer-motion` springs or bounce effects.
7.  **Logging:** Use the professional `logger` from `src/utils/logger.ts` instead of raw `console.log`. Debug/Info logs are silenced in production.
8.  **Customer Data:** Take-out and Delivery orders must auto-capture customer data (Name/Phone) to be processed by the backend's auto-storage logic.
9.  **Timezones:** Always use the `dateUtils` helpers (`getLocalDateString`, `parseLocalDate`) to ensure Colombian UTC-5 time consistency, especially for history and filtering.

## 🚀 Ongoing / Pending Tasks

- **Stock Resets:** UI integration for daily stock reset hooks.
- **Testing:** Integration of `Vitest` and `React Testing Library` is planned but not yet implemented.
