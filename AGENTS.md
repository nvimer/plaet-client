# AGENTS.md - Coding Guidelines & Context for AI Agents (Client)

React + TypeScript + Vite restaurant management POS application with tactile/kiosk UX.

## 🍽 Project Domain: Plaet POS (Restaurant Management)

This is the frontend client for Plaet API. It handles restaurant operations from the perspective of Cashiers, Waiters, and Kitchen Staff.

### Core Domain: The "Corrientazo" (Daily Menu)
A critical feature of this system is the **Corrientazo** (Colombian daily lunch menu).
- **Categories are fixed/default:** Categories (Sopas, Principios, Proteínas, Arroces, Ensaladas, Bebidas, Postres, Extras) are seeded directly in the backend and cannot be created, edited, or deleted through the UI. The Category management UI is intentionally removed/hidden.
- **Pricing:** The total price of a Corrientazo is calculated as `basePrice` + `price of the selected protein(s)`.
- **Proteins:** `proteinIds` is an array of IDs representing all the available meat/protein options for the day.
- **Menu Form:** The configuration form avoids redundant labels (e.g., using "Sopas" instead of "Sopas del Día") to maintain a clean, POS-style UI.

## 🏗️ Project Architecture & Structure

```
src/features/{feature}/
├── components/          # Feature-specific components
├── hooks/               # React Query hooks
├── pages/               # Page components (use DashboardLayout from route)
├── schemas/             # Zod validation schemas
├── services/            # API layer (axiosClient, featureApi.ts)
├── interfaces/          # TypeScript interfaces
└── index.ts             # Barrel exports
```

Shared code:
- `src/components/ui/` - UI primitives (Button, Input, Card, TouchableCard)
- `src/services/` - Global API configuration (`axiosClient`)
- `src/types/` - TypeScript types (synced with Prisma backend)
- `src/utils/` - Utilities (`cn.ts` for Tailwind merge, error handling)

## 🛠️ Build/Lint Commands

```bash
# Development
npm run dev              # Start dev server (Vite)
npm run build            # Production build
npm run preview          # Preview production build

# Code Quality
npm run type-check       # TypeScript check (tsc --noEmit)
npm run lint             # ESLint check
npm run lint -- --fix    # Auto-fix ESLint errors
```

## 🤖 AI Agent Guidelines (Crucial)

When acting on this codebase, adhere strictly to these rules:

### 1. Code Style & Layout
- **Tactile UX:** Large touch targets (min 44px), visual selection, immediate feedback.
- **Visual grids** instead of dropdowns where possible (ProductGrid, TableGrid).
- **Layouts are provided in Routes:** Pages should NOT include layout components internally (e.g., do not wrap a page in `<DashboardLayout>`). The Router does this.
- **Imports:**
  1. React/External libraries
  2. Internal absolute imports (`@/components`, `@/hooks`, `@/types`)
  3. Relative imports (same feature only)

### 2. TypeScript & React Patterns
- **Strict mode enabled:** ALL variables, parameters, and return types must be explicitly typed.
- **NO `any` or `unknown` allowed.**
- **Functional components** with hooks only.
- Data fetching uses **React Query** (`useQuery`, `useMutation`).
- Forms use **`react-hook-form` + Zod** validation.
- Unused variables must be prefixed with `_` (e.g., `_event`).

### 3. Styling (Tailwind CSS)
- Use `cn()` utility from `@/utils/cn` for class merging.
- **Colors:** Custom palette `sage-green-*`, `carbon-*`, `primary-*`.
- **Semantic colors:** `success-*`, `warning-*`, `error-*`, `info-*`.
- **Touch targets:** Minimum 44x44px for interactive elements.

### 4. Authentication & Error Handling
- The app uses JWT tokens with `httpOnly` cookies (no tokens in LocalStorage).
- `axiosClient` handles automatic token refresh, intercepting 401s, and managing 423 Account Lockout states.
- Service layer handles API errors. Use `sonner` (`toast.success`, `toast.error`) for notifications.

### 5. Git Workflow
- **IMPORTANT: All branches must be created from `develop`**
- `main` - Production-ready code only
- `develop` - Integration branch for all features
- Feature branches: `feat/[module]-[feature]`
- Fix branches: `fix/[module]-[issue]`

## 🚀 Ongoing / Missing Features (For Future Agents)

If you are asked to implement new features, check this list of pending items:

1. **Kanban Kitchen View Completion:** The `KitchenKanban` component in `src/features/orders/components/kitchen/` needs to be fully integrated, styled, and wired up with `react-beautiful-dnd` or `@hello-pangea/dnd`.
2. **Stock Management:** The `useResetStock()` hook in `src/features/menu/items/hooks/useStockManagement.ts` exists but lacks full UI integration for daily stock resets.
3. **Advanced Order Actions:** Hooks exist for batch updating order statuses, duplicating orders, and cancelling orders (`useBatchOrderStatusUpdate`, `useDuplicateOrder`, `useCancelOrder`), but the UI in `OrdersPage` or `OrderCard` might need buttons/modals to expose these features.
4. **Testing:** Currently, there is NO test framework configured. Future tasks should integrate `Vitest` + `React Testing Library` and begin writing unit tests for critical UI components and hooks.
