# CLIENT.AGENTS.md - Frontend Guidelines for Plaet POS

## 🏗️ Architecture & State

- **SaaS Context:** The app is multi-tenant. The current user's `restaurantId` is stored in the Auth context and travels in the JWT.
- **Complexity Requirement:** Prioritize **O(1)** operations. Use `Map` for lookup-heavy logic (e.g., matching order items to categories). Avoid nested `.map()` or `.find()` calls on large arrays.

## 🎨 Tactile-First UX

- **Minimum Touch Target:** 44px.
- **Grids:** Use responsive grids (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`) for item selection.
- **Avoid Dropdowns:** Prefer `TouchableCard` or custom selectors for a kiosk-like experience.

## 🛠️ Data Handling (React Query)

- All server communication must use **TanStack Query**.
- **Mutations:** Invalidate affected queries on success to keep the UI in sync.
- **AIsolation:** Trust that the backend handles data isolation. Do not try to filter by `restaurantId` on the frontend unless explicitly requested for system admin views.

## 🔐 Date Integrity

- **Timezone Safety:** When sending or displaying dates from YYYY-MM-DD strings, always append `T12:00:00.000Z` before parsing to `new Date()` to prevent local offset bugs.

## 🤖 Code Quality

- **Zero Tolerance:** No `any`. No `unknown`.
- **Linting:** Must pass `npm run lint` and `npm run type-check` before any merge.
- **Naming:** Prefix unused variables with `_`.