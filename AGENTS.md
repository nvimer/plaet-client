# AGENTS.md - Coding Guidelines & Context for AI Agents (Client)

## 🏢 Architecture: Multi-Tenant SaaS
- **Tenant Context:** User's `restaurantId` is stored in Auth Context.
- **Isolation:** Trust backend for data isolation; do not filter by `restaurantId` manually on frontend.
- **Hierarchical Routing:** Follow the `Inicio > Hub > Page` structure. Main modules (Tables, Orders, Inventory, Daily Menu) have a central "Hub" before reaching specific management pages.

## 🎨 Premium & Tactile UX Standards
- **Color Palette:** Strictly use semantic colors from `tailwind.config.js`:
  - `sage`: Backgrounds and soft accents (`sage-50` to `sage-600`).
  - `carbon`: Primary text and dark elements (`carbon-900` for titles).
  - `success`, `warning`, `error`, `info`: Standardized semantic feedback.
- **Typography:** Premium feel using `font-bold` for titles and `tracking-tight`. Use uppercase only for labels with `tracking-[0.2em]`.
- **Touch Targets:** Minimum 44px for buttons and interactive cards.
- **Component Geometry:** Prefer `rounded-2xl` for standard cards and `rounded-3xl` for main module hubs or launchpad cards.
- **Shadows:** Use custom shadow utilities like `shadow-smooth-md` or `shadow-soft-xl`.
- **Motion & Animations:** Use the "Soft & Minimal" engine (`src/utils/motion.ts`). **NEVER use spring physics** (bouncing/jumping) unless explicitly requested. Use `variants.fadeInUp` and `transitions.soft` (Cubic Bezier: `[0.22, 1, 0.36, 1]`) for elegant, premium feel.

## 🍽️ Order & Kitchen Workflow
- **Table-Centric:** All operational filtering (Billing, Kitchen, Ready) must be grouped by the `Table` (or individual customer for Take-out). The entire table moves from "In Kitchen" to "Ready" ONLY when all its items are finished.
- **Pay First:** Orders must be `PAID` to appear in the Kitchen Kanban.
- **Data Capture:** Take-out and Delivery modes must collect numeric phone numbers to support auto-saving customers in the database.
- **Packaging:** Portacomida fees are fixed via the Daily Menu configuration, but their quantity is manually adjusted in the order form.

## 🛰️ Navigation System (Sidebar 2.0)
- **Hover & Click:** Sidebar groups (accordions) must support both **Hover to Expand** (desktop) and **Click to Navigate** (to the module Hub).
- **Active States:** Use the `sidebar-active-pill` (sage-600 vertical bar) for direct links.
- **Transitions:** All sidebar animations must use `framer-motion` with `ease-[0.4,0,0.2,1]` and a duration of `700ms` for a "liquid" feel.
- **TopBar:** Must be visible on all pages (no `hideHeader`). Use `hideTitle={true}` when the page has its own premium header to avoid redundancy.

## 🚀 Dashboard & Launchpad
- **The Launchpad:** The main dashboard is a central command center with large action cards.
- **Role-Based:** Content and available launchpad cards must adapt to the user's role (SuperAdmin vs Admin vs Staff).
- **KPI Grid:** Maintain a top row of summary statistics (StatCards) for immediate business oversight.

## 🔐 Permissions & Access Control
- **Granular Checks:** Use `usePermissions().hasPermission("module:action")` for O(1) checks.
- **UI Guard:** Use the `<Guard permission="name" />` component to show/hide UI elements declaratively.

## 🛠️ Quality Standards
- **Zero Tolerance:** NO `any` or `unknown`. Use `import type` for interfaces.
- **Logging:** Use `logger.ts` for all frontend logs. Raw `console.log` is strictly forbidden to maintain production cleanliness.
- **Functional Comments:** Code comments must be strictly functional. Focus on *why* or complex logic.
- **Form Patterns:** Always `react-hook-form` + `zod`.
- **Timezones:** Use `dateUtils` to evaluate dates against local Colombia time (UTC-5), preventing midnight-shift bugs.
- **Modular Pages:** Extract complex logic into hooks or sub-components. Keep page components clean and focused on layout.

## 🏗️ Structure
```text
src/features/{feature}/
├── components/          # Tactical & layout components
├── hooks/               # Specific TanStack Query hooks
├── pages/               # Routed pages (including Hub pages)
├── schemas/             # Zod validation
├── services/            # API functions
└── index.ts             # Barrel export
```