# AGENTS.md - Coding Guidelines & Context for AI Agents (Client)

## 🏢 Architecture: Multi-Tenant SaaS
- **Tenant Context:** User's `restaurantId` is stored in Auth Context.
- **AIsolation:** Trust backend for data isolation; do not filter by `restaurantId` manually on frontend.

## 🎨 Tactile-First UX (Kiosko Style)
- **High-Density Design:** Cards must be compact to avoid excessive scroll. Use aspect ratios (like 16:9) or fixed heights for images to prioritize text and actions.
- **Touch Targets:** Minimum 44px for buttons.
- **Grids:** Responsive grids (usually 3 or 4 columns) for product selection.

## 🔐 Permissions & Access Control
- **Granular Checks:** Use `usePermissions().hasPermission("module:action")` for O(1) checks.
- **UI Guard:** Use the `<Guard permission="name" />` component to show/hide UI elements declaratively.
- **SuperAdmin:** Displays Global Dashboards and Tenant Management modules.

## 🚀 Performance
- **React Query:** Mandatory for all server state. Use `queryKeys` properly for invalidation.
- **Lookups:** Use `Map` for matching data (e.g., categories by ID).

## 🛠️ Quality Standards
- **Zero Tolerance:** NO `any` or `unknown`. Use `import type` for interfaces.
- **Functional Comments:** Code comments must be strictly functional. No change logs, no conversational filler, no descriptions of *what* the code does if it's self-explanatory. Focus on *why* or complex logic.
- **Form Patterns:** Always `react-hook-form` + `zod`.

## 🏗️ Structure
```text
src/features/{feature}/
├── components/          # Tactical & layout components
├── hooks/               # Specific TanStack Query hooks
├── pages/               # Routed pages
├── schemas/             # Zod validation
├── services/            # API functions
└── index.ts             # Barrel export
```
