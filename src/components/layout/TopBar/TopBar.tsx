import { useState, useEffect } from "react";
import { useAuth } from "@/hooks";
import { 
  LogOut, 
  User, 
  Search, 
  Settings, 
  Bell,
  Menu,
  X,
  ChevronDown,
  HelpCircle
} from "lucide-react";
import { cn } from "@/utils/cn";

export function TopBar() {
    const { user, logout } = useAuth();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    // Monitor sidebar state
    useEffect(() => {
      const checkSidebarState = () => {
        const sidebar = document.querySelector('[data-sidebar]');
        if (sidebar) {
          // More precise check for collapsed state
          const isCollapsed = sidebar.classList.contains('w-16') || 
                              sidebar.classList.contains('lg:w-16') ||
                              sidebar.classList.contains('w-16') && sidebar.classList.contains('lg:w-16');
          setIsSidebarCollapsed(isCollapsed);
          
          // Also adjust main content margin dynamically
          const mainContent = document.getElementById('main-content');
          if (mainContent) {
            if (isCollapsed) {
              mainContent.classList.remove('lg:ml-72');
              mainContent.classList.add('lg:ml-16');
            } else {
              mainContent.classList.remove('lg:ml-16');
              mainContent.classList.add('lg:ml-72');
            }
          }
        }
      };

      // Initial check
      setTimeout(checkSidebarState, 200); // Slightly longer delay

      // Watch for changes
      const observer = new MutationObserver(() => {
        setTimeout(checkSidebarState, 200);
      });

      const sidebar = document.querySelector('[data-sidebar]');
      if (sidebar) {
        observer.observe(sidebar, {
          attributes: true,
          attributeFilter: ['class']
        });
      }

      return () => observer.disconnect();
    }, []);
    // Toggle functions
    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);

    return (
        <>
            {/* Main TopBar */}
            <header 
                className={cn(
                    "sticky top-0 z-40 w-full",
                    "bg-white/80 backdrop-blur-xl",
                    "border-b border-sage-100/50", 
                    "shadow-sm",
                    "transition-all duration-300 ease-out",
                    // Dynamic margin based on sidebar state - occupy full available width
                    isSidebarCollapsed ? "lg:left-16 lg:right-0" : "lg:left-72 lg:right-0",
                    "left-0 right-0"
                )}
                style={{
                    transition: 'left 0.3s ease-out, background-color 0.3s ease-out'
                }}
            >
                <div className="h-16 px-4 lg:px-8 flex items-center justify-between">
                    
                    {/* Left Section - Logo & Mobile Menu */}
                    <div className="flex items-center gap-4">
                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={toggleMobileMenu}
                            className="lg:hidden p-2 rounded-lg hover:bg-sage-50 transition-colors duration-200"
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-5 h-5 text-sage-600" />
                            ) : (
                                <Menu className="w-5 h-5 text-sage-600" />
                            )}
                        </button>

                        {/* Logo/Brand */}
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-sage-500 to-sage-600 rounded-lg flex items-center justify-center">
                                <div className="w-4 h-4 bg-white rounded-sm"></div>
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-sage-600 to-sage-700 bg-clip-text text-transparent">
                                Plaet
                            </span>
                        </div>

                        {/* Desktop Search */}
                        <div className="hidden md:flex items-center">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    onFocus={() => setIsSearchOpen(true)}
                                    onBlur={() => setIsSearchOpen(false)}
                                    className="
                                        w-64 lg:w-80 px-10 py-2 
                                        bg-sage-50/50 
                                        border border-sage-200/50 
                                        rounded-xl
                                        text-sm text-sage-700
                                        placeholder-sage-400
                                        focus:outline-none 
                                        focus:ring-2 focus:ring-sage-300/50
                                        focus:bg-white
                                        transition-all duration-200
                                    "
                                />
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sage-400" />
                                
                                {/* Search Dropdown - Glassmorphism */}
                                {isSearchOpen && (
                                    <div className="
                                        absolute top-full mt-2 left-0 right-0
                                        bg-white/90 backdrop-blur-xl 
                                        border border-sage-200/50 
                                        rounded-xl
                                        shadow-lg
                                        p-2
                                        transition-all duration-200
                                    ">
                                        <div className="text-xs text-sage-500 px-2 py-3">
                                            Press ⌘K to search globally
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Center Section - Breadcrumb (Desktop) */}
                    <div className="hidden lg:flex items-center">
                        <nav className="text-sm text-sage-600">
                            <span className="hover:text-sage-800 cursor-pointer transition-colors">Home</span>
                            <span className="mx-2 text-sage-300">/</span>
                            <span className="text-sage-900 font-medium">Dashboard</span>
                        </nav>
                    </div>

                    {/* Right Section - User Actions */}
                    <div className="flex items-center gap-2">
                        
                        {/* Quick Actions */}
                        <div className="hidden sm:flex items-center gap-1">
                            <button
                                className="
                                    p-2 rounded-lg 
                                    hover:bg-sage-50 
                                    transition-colors duration-200
                                    group relative
                                "
                                aria-label="Help"
                            >
                                <HelpCircle className="w-4 h-4 text-sage-600 group-hover:text-sage-800" />
                                <span className="absolute -bottom-8 right-0 text-xs bg-sage-900 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    Help
                                </span>
                            </button>

                            <button
                                className="
                                    p-2 rounded-lg 
                                    hover:bg-sage-50 
                                    transition-colors duration-200
                                    group relative
                                "
                                aria-label="Notifications"
                            >
                                <Bell className="w-4 h-4 text-sage-600 group-hover:text-sage-800" />
                                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full"></span>
                                <span className="absolute -bottom-8 right-0 text-xs bg-sage-900 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    Notifications
                                </span>
                            </button>


                        </div>

                        {/* User Menu */}
                        <div className="relative">
                            <button
                                onClick={toggleUserMenu}
                                className="
                                    flex items-center gap-3 px-3 py-2 
                                    bg-sage-50/30 
                                    hover:bg-sage-50/70
                                    border border-sage-200/30 
                                    rounded-xl
                                    transition-all duration-200
                                    group
                                "
                                aria-label="User menu"
                                aria-expanded={isUserMenuOpen}
                            >
                                <div className="w-8 h-8 bg-gradient-to-br from-sage-400 to-sage-500 rounded-full flex items-center justify-center">
                                    <User className="w-4 h-4 text-white" />
                                </div>

                                <div className="hidden sm:block text-left">
                                    <p className="text-sm font-medium text-sage-900">
                                        {user?.firstName && user?.lastName 
                                            ? `${user.firstName} ${user.lastName}` 
                                            : "User"
                                        }
                                    </p>
                                    <p className="text-xs text-sage-500 truncate max-w-[120px]">
                                        {user?.email || "user@plaet.com"}
                                    </p>
                                </div>

                                <ChevronDown className={cn(
                                    "w-4 h-4 text-sage-600 transition-transform duration-200",
                                    isUserMenuOpen && "rotate-180"
                                )} />
                            </button>

                            {/* User Dropdown Menu - Glassmorphism */}
                            {isUserMenuOpen && (
                                <div className="
                                    absolute top-full right-0 mt-2 w-64
                                    bg-white/95 backdrop-blur-xl 
                                    border border-sage-200/50 
                                    rounded-xl
                                    shadow-lg
                                    py-2
                                    transition-all duration-200
                                    z-50
                                ">
                                    <div className="px-4 py-3 border-b border-sage-100/50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-sage-400 to-sage-500 rounded-full flex items-center justify-center">
                                                <User className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-sage-900">
                                                    {user?.firstName && user?.lastName 
                                                        ? `${user.firstName} ${user.lastName}` 
                                                        : "User"
                                                    }
                                                </p>
                                                <p className="text-xs text-sage-500">
                                                    {user?.email || "user@plaet.com"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="py-1">
                                        <button className="
                                            w-full px-4 py-2 text-left text-sm
                                            hover:bg-sage-50 
                                            transition-colors duration-200
                                            flex items-center gap-3
                                        ">
                                            <Settings className="w-4 h-4 text-sage-600" />
                                            Settings
                                        </button>
                                        
                                        <button 
                                            onClick={logout}
                                            className="
                                                w-full px-4 py-2 text-left text-sm
                                                hover:bg-red-50 
                                                text-red-600 hover:text-red-700
                                                transition-colors duration-200
                                                flex items-center gap-3
                                            ">
                                            <LogOut className="w-4 h-4" />
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile Search Bar (shown when mobile menu is open) */}
                {isMobileMenuOpen && (
                    <div className="border-t border-sage-100/50 px-4 py-3">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="
                                    w-full px-10 py-2 
                                    bg-sage-50/50 
                                    border border-sage-200/50 
                                    rounded-xl
                                "
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sage-400" />
                        </div>
                    </div>
                )}
            </header>

            {/* Overlay for dropdown menus */}
            {(isUserMenuOpen || isMobileMenuOpen) && (
                <div 
                    className="fixed inset-0 z-30 bg-sage-900/10 lg:hidden"
                    onClick={() => {
                        setIsUserMenuOpen(false);
                        setIsMobileMenuOpen(false);
                    }}
                    aria-hidden="true"
                />
            )}
        </>
    );
}
