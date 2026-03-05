# AGENTS.md - Coding Guidelines for AI & Developers

This document defines the strict technical rules and structural conventions for the Plaet client application.

## 🏢 SaaS & Multi-Tenant Architecture
- **Tenant Isolation:** The `restaurantId` is managed in the Auth Context. Trust the backend for data isolation; do not filter by `restaurantId` manually on the frontend unless required for specific UI logic.
- **Hierarchical Routing:** Follow the `Home > Hub > Page` structure. Main modules must have a central "Hub" page before reaching management pages.

## 🎨 Design System & UX
- **Semantic Tokens:** Never use literal colors (e.g., `red-500`, `green-200`). Use the semantic tokens from `tailwind.config.js`:
  - `sage`: Backgrounds and soft accents.
  - `carbon`: Primary text and dark elements.
  - `success`, `warning`, `error`, `info`: Semantic feedback.
- **Auto-Standardization:** The script `npm run fix:ui` (found in `scripts/standardize-ui.ts`) must be executed after creating new UI components to enforce color and typography consistency.
- **Geometry:** 
  - `rounded-2xl` for standard cards.
  - `rounded-3xl` for Launchpad cards and Module Hubs.
- **Motion:** Use `transitions.soft` (Cubic Bezier: `[0.22, 1, 0.36, 1]`) and `variants.fadeInUp` for all page transitions.

## 🏗️ Structural Conventions

### Feature Structure (`src/features/{name}/`)
Each feature must be self-contained:
1. `components/`: Module-specific tactical components.
2. `hooks/`: TanStack Query hooks.
3. `pages/`: Routed components (including the Hub).
4. `schemas/`: Zod validation schemas.
5. `services/`: API call functions (Axios).
6. `index.ts`: Module barrel export.

### Shared Components (`src/components/`)
Organized by domain:
- `guards/`: `ProtectedRoute`, `RoleProtectedRoute`, `Guard`, `SessionTimeout`.
- `network/`: `OfflineIndicator`, `NetworkStatusManager`.
- `feedback/`: `ErrorBoundary`, `GlobalErrorBoundary`.
- `ui/`: Atomic design components (Buttons, Inputs, etc.).

## 🔐 Access Control (RBAC)
- **Permissions:** Use `usePermissions().hasPermission("module:action")` for O(1) checks.
- **Declarative UI:** Prefer the `<Guard permission="name" />` component to show/hide UI elements.

## 🛠️ Quality Standards
- **Zero Tolerance Policy:** NO `any` or `unknown`. Use `import type` for interfaces.
- **Logging:** Use the professional `logger.ts`. Raw `console.log` is strictly forbidden in the codebase.
- **Forms:** Always use `react-hook-form` + `zod`.
- **Timezones:** Use `dateUtils` for all date calculations to ensure consistency with Colombia time (UTC-5).
- **Barrel Files:** Keep `index.ts` files updated to allow clean imports via `@/features/...` or `@/components`.
