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
- [ ] `npm run lint` passes (run `npm run lint -- --fix` to auto-fix)
- [ ] JSDoc on all public methods
- [ ] No `console.log` or debug code
- [ ] All imports use `@/` paths except same-feature relatives
- [ ] Touch targets minimum 44x44px
- [ ] Loading states for async operations
- [ ] Types exported from `src/types/index.ts`
- [ ] **NO `any` or `unknown` types** - use explicit types
- [ ] Unused variables prefixed with `_` (e.g., `_unused`)

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

## Authentication & Token Handling

The app uses JWT tokens with httpOnly cookies:

**Login Flow:**
1. POST `/auth/login` with email/password
2. Server sets httpOnly cookies (`accessToken`, `refreshToken`)
3. Frontend stores user data in AuthContext (NOT tokens)
4. Axios interceptors automatically include cookies in requests

**Token Blacklist:**
- Tokens are checked against a blacklist on each request
- Auth routes (`/auth/*`) skip blacklist check to allow login with old tokens
- Logout adds token to blacklist

**AuthContext Pattern:**
```typescript
// Export context (with eslint-disable for Fast Refresh)
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType>(...);

// Export hook separately
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
```

## Prepared Hooks (Future Use)

The following hooks are exported and ready for use but currently have no UI consuming them. They represent the complete API surface:

### Orders Module
**Location:** `src/features/orders/hooks/useCreateOrder.ts`

Available but not yet used in UI:
- `useUpdateOrderItem()` - Update individual order items
- `useBatchOrderStatusUpdate()` - Batch update order statuses  
- `useDuplicateOrder()` - Duplicate existing orders
- `useValidateOrder()` - Validate order before creation
- `useCancelOrder()` - Cancel orders with validation

**Backend Status:** ✅ Endpoints exist and are functional
**Planned Use:** Order management page, batch operations

### Daily Menu Module
**Location:** `src/features/daily-menu/hooks/useDailyMenu.ts`

Available but not yet used:
- `useDailyMenuByDate(date)` - Get menu for specific date
- `useUpdateDailyMenuByDate()` - Update menu for specific date
- `useDailyMenuItems(menu)` - Fetch all items for a menu configuration

**Backend Status:** ✅ Endpoints exist and are functional
**Planned Use:** Menu history, advance scheduling, item filtering

### Stock Management
**Location:** `src/features/menu/items/hooks/useStockManagement.ts`

Partially implemented:
- `useResetStock()` - TODO: Complete API integration

**Note:** Keep these hooks exported. They provide API completeness and will be used as features are built.

## Common Patterns

### Component with Loading State
```typescript
export function MyPage() {
  const { data, isLoading, error } = useData();
  
  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;
  
  return <Content data={data} />;
}
```

### API Error Handling
```typescript
try {
  await mutation.mutateAsync(data);
  toast.success("Success!");
} catch (error) {
  // Error already handled by axios interceptors
  console.error("Operation failed:", error);
}
```

### Form with React Hook Form + Zod
```typescript
const schema = z.object({
  name: z.string().min(1, "Required"),
  email: z.string().email("Invalid email"),
});

const { control, handleSubmit } = useForm({
  resolver: zodResolver(schema),
  mode: 'onChange',
});
```

## Notes Directory

Project documentation in `/notes/`:

- `decisions.md` - Architecture decisions log
- `common-errors.md` - Recurring mistakes
- `ARCHITECTURE.md` - Detailed architecture guide
- `COMMIT_GUIDE.md` - Commit guidelines
- `[date]-[task].md` - Task-specific notes

## ESLint Configuration

The project uses TypeScript ESLint with custom rules:

```javascript
// eslint.config.js
rules: {
  '@typescript-eslint/no-unused-vars': ['error', { 
    argsIgnorePattern: '^_',
    varsIgnorePattern: '^_',
    caughtErrorsIgnorePattern: '^_'
  }],
}
```

**Unused Variables:** Prefix with underscore (e.g., `_unused`, `_id`)
```typescript
// ✅ CORRECT - underscore prefix ignores the variable
const handleClick = (_event: MouseEvent) => { ... }

// ❌ INCORRECT - will cause ESLint error
const handleClick = (event: MouseEvent) => { ... } // event not used
```

**Fast Refresh Warnings:** For React Context files that export both context and hook, add:
```typescript
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType>(...);
```

## Daily Menu Module

Located at `/menu/daily` - Category-based daily menu configuration for POS.

### Architecture

**Simplified Database Relations:**
- MenuItem and MenuCategory have NO relations to DailyMenu
- DailyMenu stores only IDs (foreign keys without `@relation`)
- Relations queried manually in repository layer
- This keeps MenuItem/MenuCategory clean and decoupled

**Price Configuration:**
- `basePrice`: $10,000 (chicken, pork)
- `premiumProteinPrice`: $11,000 (beef, fish)

**Categories:**
- Sopas (Soups) - 2 options
- Principios (Principles) - 2 options  
- Proteínas (Proteins) - 2-3 options
- Jugos (Drinks) - 2 options
- Extras - 2 options
- Arroz (Rice) - Always included
- Ensaladas (Salads) - Always included

**API Endpoints:**
- `GET /daily-menu/current` - Get today's menu with full item details
- `PUT /daily-menu` - Update menu configuration
- `GET /menu/items/by-category/:id` - Get items by category

**Key Files:**
- Page: `src/features/menu/pages/daily-menu/DailyMenuPage.tsx`
- Form: `src/features/menu/pages/daily-menu/DailyMenuConfigForm.tsx`
- Service: `src/services/dailyMenuApi.ts`
- Hooks: `src/features/daily-menu/hooks/useDailyMenu.ts`

### Usage

```typescript
// Get today's menu
const { data: dailyMenu } = useDailyMenuToday();

// Get items by category
const { data: soupItems } = useItemsByCategory(categoryId);

// Update menu
const updateMenu = useUpdateDailyMenu();
await updateMenu.mutateAsync({
  basePrice: 10000,
  premiumProteinPrice: 11000,
  soupCategoryId: 1,
  soupOptions: { option1Id: 101, option2Id: 102 },
  // ... other options
});
```
