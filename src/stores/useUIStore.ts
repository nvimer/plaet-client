import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * UI State Interface
 */
interface UIState {
  // Sidebar State
  isCollapsed: boolean;
  isMobileOpen: boolean;
  expandedItems: string[]; // Zustand persist prefers serializable types
  isMobile: boolean;
  
  // Computed
  sidebarWidth: number;
  
  // Actions
  toggleCollapsed: () => void;
  toggleMobile: () => void;
  closeMobile: () => void;
  toggleExpanded: (itemPath: string) => void;
  setIsMobile: (isMobile: boolean) => void;
}

// Sidebar widths (matching Tailwind classes)
const SIDEBAR_WIDTHS = {
  expanded: 288, // w-72
  collapsed: 64, // w-16
  mobile: 0, // Hidden on mobile
} as const;

/**
 * useUIStore
 * 
 * Centralized store for UI-related state (Sidebar, Modals, etc.)
 * Replaces SidebarContext and provides automatic persistence.
 */
export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      // Initial State
      isCollapsed: false,
      isMobileOpen: false,
      expandedItems: [],
      isMobile: false,
      
      // Computed value calculated on every access
      get sidebarWidth() {
        const state = get();
        if (state.isMobile) return SIDEBAR_WIDTHS.mobile;
        return state.isCollapsed ? SIDEBAR_WIDTHS.collapsed : SIDEBAR_WIDTHS.expanded;
      },

      // Actions
      toggleCollapsed: () => {
        const state = get();
        if (!state.isMobile) {
          set({ isCollapsed: !state.isCollapsed });
        }
      },

      toggleMobile: () => set((state) => ({ isMobileOpen: !state.isMobileOpen })),
      
      closeMobile: () => set({ isMobileOpen: false }),

      toggleExpanded: (itemPath: string) => {
        set((state) => {
          const expandedItems = [...state.expandedItems];
          const index = expandedItems.indexOf(itemPath);
          
          if (index > -1) {
            expandedItems.splice(index, 1);
          } else {
            expandedItems.push(itemPath);
          }
          
          return { expandedItems };
        });
      },

      setIsMobile: (isMobile: boolean) => {
        set((state) => {
          // If switching to mobile, ensure mobile menu is closed initially
          if (isMobile && !state.isMobile) {
            return { isMobile, isMobileOpen: false };
          }
          return { isMobile };
        });
      },
    }),
    {
      name: "plaet-ui-storage",
      storage: createJSONStorage(() => localStorage),
      // Only persist specific fields
      partialize: (state) => ({ 
        isCollapsed: state.isCollapsed, 
        expandedItems: state.expandedItems 
      }),
    }
  )
);

// Helper hook for sidebar width since getters aren't reactive in some Zustand versions 
// when used directly without selection
export const useSidebarWidth = () => {
  return useUIStore((state) => {
    if (state.isMobile) return SIDEBAR_WIDTHS.mobile;
    return state.isCollapsed ? SIDEBAR_WIDTHS.collapsed : SIDEBAR_WIDTHS.expanded;
  });
};
