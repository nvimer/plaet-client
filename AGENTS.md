# Agent Guidelines for SazonArte Client

React + TypeScript + Vite restaurant management POS application with tactile/kiosk UX.

## Build/Lint Commands

```bash
# Development
npm run dev              # Start dev server (Vite)
npm run build            # Production build
npm run preview          # Preview production build

# Code Quality
npm run type-check       # TypeScript check (tsc --noEmit)
npm run lint             # ESLint check
```

**No test framework configured.** Use Vitest + React Testing Library when adding tests.

## Project Architecture

### Feature-Based Structure

```
src/features/{feature}/
├── components/          # Feature-specific components
├── hooks/              # React Query hooks
├── pages/              # Page components (use DashboardLayout from route)
├── schemas/            # Zod validation schemas
├── services/           # Service layer (optional)
├── interfaces/         # TypeScript interfaces
└── index.ts            # Barrel exports
```

Shared code:

- `src/components/ui/` - UI primitives (Button, Input, Card, TouchableCard)
- `src/services/` - API layer (axiosClient, featureApi.ts)
- `src/types/` - TypeScript types (synced with Prisma)
- `src/utils/` - Utilities (cn.ts for Tailwind merge)

### Layout Usage

**IMPORTANT:** Pages should NOT include layout components internally.

- Use `DashboardLayout` in routes for list views (MenuPage, TablesPage, UsersPage)
- Use `SidebarLayout` in routes for forms with custom headers (TableCreatePage, CategoryCreatePage)
- Use `FullScreenLayout` for focused views (Kitchen view, Stock Management)

```tsx
// CORRECT: Route provides layout
<Route path="/menu/daily" element={
  <DashboardLayout>
    <DailyMenuPage />
  </DashboardLayout>
} />

// WRONG: Page includes its own layout
export function DailyMenuPage() {
  return (
    <SidebarLayout>  {/* ❌ Duplicate layout! */}
      {/* content */}
    </SidebarLayout>
  );
}
```

### Design Philosophy (POS/Kiosk Style)

- **Tactile UX**: Large touch targets (min 44px), visual selection, immediate feedback
- **Two layouts**: DashboardLayout (with sidebar) for lists, FullScreenLayout for actions
- **Visual grids** instead of dropdowns (ProductGrid, TableGrid)

## Code Style Guidelines

### Import Order

1. React/External libraries
2. Internal absolute imports (`@/components`, `@/hooks`, `@/types`)
3. Relative imports (same feature only)

```typescript
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui";
import { useAuth } from "@/hooks";
import type { Order } from "@/types";
import { OrderCard } from "./components/OrderCard"; // same feature only
```

### Naming Conventions

- **Components**: PascalCase (`OrderCard.tsx`, `Button.tsx`)
- **Hooks**: camelCase with `use` prefix (`useOrders.ts`, `useCreateOrder.ts`)
- **Services**: camelCase with suffix (`orderApi.ts`, `orderService.ts`)
- **Schemas**: camelCase with suffix (`orderSchemas.ts`)
- **Types**: PascalCase (`Order`, `CreateOrderInput`)
- **Interfaces**: `{Feature}{Layer}Interface` (`OrderServiceInterface`)

### TypeScript

- **Strict mode enabled** - all code fully typed
- **NO `any` or `unknown` types allowed** - all variables, parameters, and return types must be explicitly typed
- Use `type` for type aliases, `interface` for object shapes
- Props interfaces named `{ComponentName}Props`
- Export types from `src/types/index.ts` barrel file

**❌ INCORRECT:**
```typescript
// Using any - NOT ALLOWED
function processData(data: any): any {
  return data.items;
}

// Using unknown - NOT ALLOWED  
function handleError(error: unknown): void {
  console.log(error.message);
}

// Implicit any - NOT ALLOWED
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

**✅ CORRECT:**
```typescript
// Explicit types required
interface ProcessedData {
  items: MenuItem[];
  total: number;
}

function processData(data: ProcessedData): MenuItem[] {
  return data.items;
}

// Use proper error handling
function handleError(error: Error): void {
  console.log(error.message);
}

// All parameters typed
function calculateTotal(items: MenuItem[]): number {
  return items.reduce((sum: number, item: MenuItem) => sum + item.price, 0);
}
```

### JSDoc Documentation

All public methods must have JSDoc:

```typescript
/**
 * Creates a new order in the system.
 *
 * @param data - Order creation data including items and table
 * @returns Created order with generated ID
 * @throws {ValidationError} When input data is invalid
 *
 * @example
 * ```typescript
 * const order = await orderService.create({ type: OrderType.DINE_IN, items: [] });
 * ```
 */
async create(data: CreateOrderInput): Promise<Order>
```

### React Patterns

- **Functional components** with hooks only
- Use `forwardRef` for ref forwarding, always set `displayName`
- Data fetching uses React Query with service layer
- Forms use `react-hook-form` + Zod validation with `mode: 'onChange'`

### Styling (Tailwind CSS)

- Use `cn()` utility from `@/utils/cn` for class merging
- **Colors**: Custom palette `sage-green-*`, `carbon-*`, `primary-*`
- **Semantic colors**: `success-*`, `warning-*`, `error-*`, `info-*`
- **Spacing**: Custom scale (0.5, 1.5, 2.5... 35.5)
- **Border radius**: Extended scale (xs to 12xl)
- **Touch targets**: Minimum 44x44px for interactive elements

Example:

```tsx
<button
  className={cn(
    "inline-flex items-center justify-center font-semibold rounded-xl",
    "bg-sage-green-300 text-carbon-900 hover:bg-sage-green-400",
    "min-h-[44px] px-6", // Touch target
    variantStyles[variant],
    className,
  )}
/>
```

### Error Handling

- Service layer handles API errors via Axios interceptors
- Use `sonner` for toast notifications
- Custom error types: `ValidationError`, `NotFoundError`, `ApiError`
- Centralized error handler: `src/utils/errorHandler.ts`

### Git Workflow

**Branch naming:**

- `feat/[module]-[feature]` - New features
- `fix/[module]-[issue]` - Bug fixes
- `refactor/[module]-[change]` - Refactoring

**Commits (Conventional):**

```
feat(orders): add kitchen orders view
fix(tables): resolve status update bug
refactor(ui): replace native buttons with Button component
docs: update component documentation
```

## Pre-Commit Checklist

- [ ] `npm run type-check` passes
- [ ] `npm run lint` passes
- [ ] JSDoc on all public methods
- [ ] No `console.log` or debug code
- [ ] All imports use `@/` paths except same-feature relatives
- [ ] Touch targets minimum 44x44px
- [ ] Loading states for async operations
- [ ] Types exported from `src/types/index.ts`

## Key Dependencies

- React 19, React Router 7, TypeScript 5.8
- TanStack Query 5 (server state management)
- Axios (HTTP client with interceptors)
- React Hook Form + Zod (forms with real-time validation)
- Tailwind CSS 3.4 + Framer Motion (animations)
- Lucide React (icons), Sonner (toasts)
- clsx + tailwind-merge (class utilities)

## Accessibility (WCAG 2.2)

- Color contrast minimum 4.5:1
- Visible focus states
- Touch targets minimum 44x44px
- Labels on all inputs
- Semantic HTML and ARIA

## Notes Directory

Project documentation in `/notes/`:

- `decisions.md` - Architecture decisions log
- `common-errors.md` - Recurring mistakes
- `ARCHITECTURE.md` - Detailed architecture guide
- `COMMIT_GUIDE.md` - Commit guidelines
- `[date]-[task].md` - Task-specific notes

## Daily Menu Module

Located at `/menu/daily` - Configure today's menu for POS display.

**API Endpoints:**
- `GET /daily-menu/current` - Get today's menu
- `PUT /daily-menu` - Update today's menu

**Page:** `src/features/menu/pages/daily-menu/DailyMenuPage.tsx`
**Service:** `src/services/dailyMenuApi.ts`
**Hooks:** `src/features/daily-menu/hooks/useDailyMenu.ts`
