# Agentic Coding Guidelines (Plaet App)

Welcome! You are an AI agent operating in Plaet, a SaaS application for restaurant management. This repository is the client: React 19 + Vite + Tailwind, deployed on Vercel.

**The backend is Supabase Edge Functions** (repo `plaet-server`, `supabase/functions/`). The Express + Prisma server described in older notes is the previous backend and is no longer deployed.

Please read and adhere strictly to these guidelines when analyzing, modifying, or creating code in this repository.

---

## 1. Build, Lint, and Test Commands

Always run commands from their respective directories (/client or /server), NOT the root.

### Client Commands (/client directory)
*   Install: npm install
*   Dev Server: npm run dev
*   Build: npm run build
*   Lint: npm run lint
*   Type-Check: npm run type-check (Run this after major changes to catch TS errors)
*   Test: npm run test (Vitest)
*   Standardize UI: npm run fix:ui (Must be run after creating/modifying UI components)

### Backend
The backend lives in the `plaet-server` repo. Its commands are `supabase db push` and `supabase functions deploy`; see its AGENTS.md. Deploy order is always migrations, then functions, then this client.

### Running Tests
*   Vitest for business logic and hooks: npm run test.
*   npm run type-check currently reports ~300 pre-existing errors. Judge a change by whether it ADDS errors, not by the total: capture the list before and after and diff it.

---

## 2. Architectural Conventions

### Multi-Tenant Architecture (Crucial)
*   The Edge Functions scope every query by the restaurantId carried in the JWT. Trust the backend for isolation; never filter by restaurantId in the UI.

### Talking to the backend
*   `src/services/functionsClient.ts` is the single helper: it carries the anon key and the user's access token and returns `{ success, message, data, meta? }`. Use `callFunction(path, options)` and `query({...})` for query strings.
*   One function per endpoint, named `<domain>-<action>`: `orders-create`, `menu-items-list`, `daily-menu-upsert`. Ids travel as `?id=`, not as path segments.
*   `src/services/axiosClient.ts` still points at the old Express API. Anything still using it is NOT migrated: menu engineering, predictions and heatmap in `analyticsApi`.
*   Some hooks call service functions that do not exist yet (`useStockManagement`, `customerApi.deleteCustomer`, `tablesApi.deleteTable`, auth refresh and password reset). Those endpoints are missing on both sides; check before assuming a bug is in the UI.

### Lunch pricing (Crucial)
*   A lunch is sent as ONE item, the protein, priced base margin + protein (`pricingLogic.ts`). Soup, principio, rice and drink are included and are not sent.
*   Substitutions are free and never apply to the protein. The backend now stores them as data (`isSubstitution`, `replacesCategoryType`, `isExtra`); `noteLogic.ts` still encodes them inside `notes` as a string with emojis and should move over to the fields.
*   The daily menu resolves its categories by name (`findCategoryIdByName`). The backend now exposes `type` on each category (SOUP, PROTEIN, DRINK…); use it and drop the name matching.

### Directory Structure
*   Client: Uses a Feature-Based structure (src/features/{name}/).
    *   logic/: Pure TypeScript logic (no React dependencies).
    *   hooks/: Specialized micro-hooks.
    *   stores/: Zustand stores for global/persistent state.
    *   components/: Following Atomic Design (atoms, molecules, organisms).
*   Server: Uses a Layered Modular pattern (src/api/{module}/).
    *   Route -> Controller -> Service -> Repository.
    *   Large services MUST be split into sub-services (e.g., OrderCreationService, OrderStatusService).

---

## 3. Code Style & Guidelines

### State Management (Client)
*   Zustand FIRST: Use Zustand for all global or persistent state. React Context is deprecated for state sharing due to performance issues.
*   Persistence: Use Zustand persist middleware for operational state (drafts, UI preferences).

### Language Policy (Client)
*   Strict English: All code comments, technical documentation, commit messages, and internal communication must be strictly in English.
*   Spanish for UI ONLY: Only content explicitly displayed to the end-user (UI strings, error messages for users, labels) must be in Spanish.
*   No Emojis: Do not use emojis in commit messages, pull requests, or code comments. Keep the workflow professional and clean.

### Forms & Validation (Client)
*   Zod Schema Policy: Always use .optional().nullable() for fields that can be null in the database to prevent zodResolver from failing when processing initial values from the API.
*   Dynamic Forms: Ensure schemas are flexible enough for both Creation and Editing (making fields optional if they are not rendered in all states).

### Efficiency & Algorithms
*   O(N) Priority: Avoid nested loops (O(N^2)) when processing lists (grouping, filtering). Use Map or Set for single-pass processing.
*   Memoization: Use useMemo and useCallback for expensive transformations or stable references.

### Types & TypeScript
*   STRICT ZERO TOLERANCE for any or unknown. Always define explicit types or interfaces.
*   Use import type for interfaces and type definitions.

### Error Handling & Validation
*   Validation: Use Zod everywhere.
*   Server Errors: Use CustomError class for expected failures.

### Logging
*   NO RAW console.log().
*   Client: Use @/utils/logger.ts.
*   Server: Use centralized Winston logger.

### Access Control (RBAC)
*   Client: Use usePermissions() hook. Use declarative UI: <Guard permission="name">...</Guard>.
*   Server: Use permissionMiddleware("module:action").

### Frontend UI & Styling (Client)
*   Atomic Design: 
    *   atoms/: Primitives (Button, Input).
    *   molecules/: Composite functional components (StatCard, Modals).
    *   organisms/: Complex UI blocks (OrderForm).
*   Standardized Imports: Always import components from the central @/components alias.

### Cash Closure & Historical Data (Critical)
*   Date-Aware Validation: When creating orders or payments, check if the date is historical.
*   Today: Requires an OPEN cash closure.
*   Past: Try to find a closure on that date; allow creation (associating or with null) if it's a historical entry. Never block historical data entry due to current closure status.

---

## 4. General Working Process for Agents
1. Analyze Context: Read package.json and AGENTS.md.
2. Modularize: Split large files into atomic pieces. Extract pure logic from React components.
3. Optimize: Ensure algorithms are efficient (O(N)).
4. Build & Verify: Always run type-check and lint.

---

## 5. Troubleshooting Vault
Document significant errors in /client/troubleshooting/ or /server/troubleshooting/.
Naming: [timestamp]-[short-description].md.

---

## 6. Git Workflow
Isolated branches: feature/, bugfix/, refactor/, perf/. Small, atomic commits. Conventional Commits standard.
