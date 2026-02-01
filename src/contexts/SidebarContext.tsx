import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

/**
 * Sidebar State Interface
 */
interface SidebarState {
  /** Desktop: sidebar is collapsed (icon-only mode) */
  isCollapsed: boolean;
  /** Mobile: sidebar drawer is open */
  isMobileOpen: boolean;
  /** Expanded navigation items (with children) */
  expandedItems: Set<string>;
  /** Is current viewport mobile? */
  isMobile: boolean;
}

/**
 * Sidebar Context Interface
 */
interface SidebarContextType extends SidebarState {
  /** Toggle desktop collapsed state */
  toggleCollapsed: () => void;
  /** Toggle mobile drawer */
  toggleMobile: () => void;
  /** Close mobile drawer */
  closeMobile: () => void;
  /** Toggle expanded state for nav items with children */
  toggleExpanded: (itemPath: string) => void;
  /** Get current sidebar width for layout calculations */
  sidebarWidth: number;
}

const SidebarContext = createContext<SidebarContextType | null>(null);

// Storage keys
const STORAGE_KEYS = {
  collapsed: "sidebar-collapsed",
  expandedItems: "sidebar-expanded-items",
} as const;

// Sidebar widths (matching Tailwind classes)
const SIDEBAR_WIDTHS = {
  expanded: 288, // w-72
  collapsed: 64, // w-16
  mobile: 0, // Hidden on mobile
} as const;

/**
 * SidebarProvider Component
 *
 * Provides global sidebar state management.
 * Persists user preferences to localStorage.
 */
export function SidebarProvider({ children }: { children: ReactNode }) {
  // Initialize state from localStorage
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEYS.collapsed);
      return saved !== null ? JSON.parse(saved) : false;
    }
    return false;
  });

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const [expandedItems, setExpandedItems] = useState<Set<string>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEYS.expandedItems);
      return saved !== null ? new Set(JSON.parse(saved)) : new Set();
    }
    return new Set();
  });

  const [isMobile, setIsMobile] = useState(false);

  // Responsive detection
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024; // lg breakpoint
      setIsMobile(mobile);
      if (mobile) {
        setIsMobileOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  // Toggle functions
  const toggleCollapsed = useCallback(() => {
    if (!isMobile) {
      setIsCollapsed((prev) => {
        const newValue = !prev;
        localStorage.setItem(STORAGE_KEYS.collapsed, JSON.stringify(newValue));
        return newValue;
      });
    }
  }, [isMobile]);

  const toggleMobile = useCallback(() => {
    setIsMobileOpen((prev) => !prev);
  }, []);

  const closeMobile = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  const toggleExpanded = useCallback((itemPath: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemPath)) {
        newSet.delete(itemPath);
      } else {
        newSet.add(itemPath);
      }
      localStorage.setItem(
        STORAGE_KEYS.expandedItems,
        JSON.stringify([...newSet])
      );
      return newSet;
    });
  }, []);

  // Calculate current sidebar width
  const sidebarWidth = isMobile
    ? SIDEBAR_WIDTHS.mobile
    : isCollapsed
      ? SIDEBAR_WIDTHS.collapsed
      : SIDEBAR_WIDTHS.expanded;

  const value: SidebarContextType = {
    isCollapsed,
    isMobileOpen,
    expandedItems,
    isMobile,
    toggleCollapsed,
    toggleMobile,
    closeMobile,
    toggleExpanded,
    sidebarWidth,
  };

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}

/**
 * useSidebar Hook
 *
 * Access sidebar state and actions from any component.
 *
 * @example
 * const { isCollapsed, toggleCollapsed, sidebarWidth } = useSidebar();
 */
export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
