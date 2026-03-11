# Rules of Hooks violation in DashboardPage

*   **ID:** 1741651200
*   **Date:** 2026-03-10
*   **Description:** `react-hooks/rules-of-hooks` error in `DashboardPage.tsx`. Hooks like `useTables` and `useOrders` were being called after an early return for SuperAdmin, causing inconsistent hook call order.
*   **Root Cause:** Early return pattern used for conditional rendering of different dashboard types (SuperAdmin vs User) before executing all hooks.
*   **Solution:** Refactored the dashboard into two separate components: `SuperAdminDashboard` and `UserDashboard`. The main `DashboardPage` now only performs the role check and renders the appropriate sub-component, ensuring that each component calls its hooks consistently on every render.
