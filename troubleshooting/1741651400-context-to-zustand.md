# Performance issues with React Context for global state

*   **ID:** 1741651400
*   **Date:** 2026-03-10
*   **Description:** The application suffered from frequent, unnecessary global re-renders. Every small state update (like opening the sidebar) triggered updates in unrelated components across the entire tree.
*   **Root Cause:** Heavy reliance on React Context (`EnhancedAuthContext`, `SidebarContext`) for state that was updated frequently or used globally. React Context lack fine-grained subscription, causing all consumers to re-render.
*   **Solution:** Migrated global and operational state to **Zustand**. Created specialized stores (`useAuthStore`, `useUIStore`, `useOrderBuilderStore`). Components now use selective subscribers (selectors) to only re-render when the specific data they need changes.
