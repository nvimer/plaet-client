# AGENTS.md - Coding Guidelines & Context for AI Agents

Plaet POS: A SaaS-ready Multi-tenant Restaurant Management System.
Stack: React 19 + TypeScript + Vite (Frontend) | Node.js + Express + Prisma + PostgreSQL (Backend).

## 🏢 Architecture: Multi-Tenant SaaS

The project has been evolved into a **Multi-tenant SaaS** architecture using a shared database with column-based isolation.

### 1. Data Isolation (Backend)
- **Prisma Extension:** A global extension in `src/database/prisma.ts` intercepts all database operations.
- **Automatic Filtering:** It automatically injects `where: { restaurantId: currentId }` into all READ, UPDATE, and DELETE operations for tenant-specific models.
- **Automatic Assignment:** It automatically injects `restaurantId` into CREATE operations.
- **Tenant Context:** Uses `AsyncLocalStorage` (`src/utils/tenant-context.ts`) to store the `restaurantId` during the request lifecycle, populated by `tenantMiddleware`.

### 2. Authentication
- **JWT Payload:** Tokens now include `restaurantId`.
- **Identity:** `req.user.restaurantId` is available in the backend after authentication.
- **Roles:** Added `SUPERADMIN` role for global system management (bypasses tenant isolation).

## 🚀 Performance & Complexity (Crucial)

All code contributions MUST prioritize algorithmic efficiency.
- **Goal:** Target **O(1)** or **O(log N)** for lookups and logic.
- **Avoid:** Strictly avoid **O(N^2)** (nested loops) or **Exponential** complexities in both frontend and backend.
- **Database:** Ensure queries leverage existing indices (especially the composite indices including `restaurantId`).
- **Data Structures:** Prefer Maps and Sets over Array lookups for O(1) performance when matching IDs or unique values.

## 🍽 Project Domain: The "Corrientazo" (Daily Menu)

- **Fixed Categories:** Sopas, Principios, Proteínas, Bebidas, Extras, Ensaladas, Postres.
- **Historical Support:** The system allows creating and editing menus for past dates.
- **Pricing Logic:** Total = `basePrice` + `selected protein price`.
- **Tactile UX:** Min 44px touch targets. Large buttons and grids instead of dropdowns.

## 🏗️ Project Structure (Client)

```
src/features/{feature}/
├── components/          # Feature-specific components
├── hooks/               # React Query hooks
├── pages/               # Page components
├── schemas/             # Zod validation schemas
├── services/            # API layer
└── index.ts             # Barrel exports
```

## 🛠️ Quality Standards

### 1. Strict Typing
- **NO `any` or `unknown`** types allowed.
- Everything must be explicitly typed using TypeScript interfaces or types.
- Use `eslint-disable-next-line` only as a last resort for Prisma's complex internal types, and always document why.

### 2. React Patterns
- Data fetching: **TanStack Query (React Query)** only.
- Forms: **`react-hook-form` + Zod**.
- Layouts: Applied at the route level in `src/App.tsx`. Do NOT wrap pages manually.

### 3. Date Handling
- **Robust Parsing:** Use `new Date(dateString + 'T12:00:00.000Z')` when converting YYYY-MM-DD strings to avoid off-by-one day bugs caused by local timezone shifts.

## 🛠️ Build/Lint Commands

```bash
# Backend (server/)
npm run dev              # Nodemon + ts-node
npm run build            # tsc compilation
npm run eslint-check-only # Lint check

# Frontend (client/)
npm run dev              # Vite
npm run build            # Production build
npm run type-check       # tsc --noEmit
npm run lint             # ESLint
```

## 🤖 AI Agent Workflow

1. **Check Indices:** When adding models, ensure composite indices like `@@index([restaurantId, createdAt])` exist.
2. **Context Awareness:** Always assume `restaurantId` is handled automatically by the Prisma extension; do not manually add it to queries unless you are a `SUPERADMIN`.
3. **No Conversational Filler:** Be concise. Focus on the code and the Big O impact.