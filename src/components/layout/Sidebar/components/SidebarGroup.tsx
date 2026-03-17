import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/utils/cn";
import { ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { NavItem } from "../navigationConfig";

interface SidebarGroupProps {
  item: NavItem;
  isCollapsed: boolean;
  isMobile: boolean;
  onChildClick?: () => void;
}

export function SidebarGroup({
  item,
  isCollapsed,
  isMobile,
  onChildClick,
}: SidebarGroupProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const showFull = !isCollapsed || isMobile;
  
  // Check if any child is active
  const hasActiveChild = item.children?.some(
    child => child.type === 'link' && location.pathname.startsWith(child.path.split('?')[0])
  );

  // Check if the group head itself is active
  const isParentActive = location.pathname === item.path;

  const [isOpen, setIsOpen] = useState(hasActiveChild || false);

  // Sync open state with active child or current path initially
  useEffect(() => {
    if (hasActiveChild || isParentActive) {
      setIsOpen(true);
    }
  }, [hasActiveChild, isParentActive]);

  const handleHeaderClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (showFull) {
      setIsOpen(!isOpen);
    } else {
      // In collapsed mode, click takes you to the main hub page
      navigate(item.path);
      if (isMobile && onChildClick) onChildClick();
    }
  };

  const Icon = item.icon;

  if (!showFull) {
    return (
      <div className="relative group/group mx-2 mb-1">
        <div 
          onClick={handleHeaderClick}
          className={cn(
            "flex items-center justify-center p-3 rounded-xl transition-all duration-300 cursor-pointer",
            hasActiveChild || isParentActive
              ? "bg-sage-600 text-white shadow-soft-lg shadow-sage-200 scale-105" 
              : "text-carbon-400 hover:bg-sage-50 group-hover/group:bg-sage-50 group-hover/group:text-sage-600"
          )}
        >
          <Icon className="w-6 h-6" />
          {(hasActiveChild || isParentActive) && (
            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-success-500 rounded-full border-2 border-white shadow-sm" />
          )}
        </div>

        {/* Floating Tooltip/Hint for Collapsed state - Now only shows name on hover */}
        <div className={cn(
          "absolute left-full top-1/2 -translate-y-1/2 ml-4 px-2 py-1 bg-carbon-900 text-white text-[10px] font-bold rounded",
          "opacity-0 invisible group-hover/group:opacity-100 group-hover/group:visible transition-all duration-200 z-50 whitespace-nowrap"
        )}>
          {item.name}
          <div className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 border-4 border-transparent border-r-carbon-900" />
        </div>
      </div>
    );
  }

  return (
    <div className="mb-1">
      <div className="px-3">
        <button
          onClick={handleHeaderClick}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group",
            isOpen ? "text-carbon-900 bg-sage-50/50" : "text-carbon-500 hover:bg-sage-50/50 hover:text-carbon-800",
            (hasActiveChild || isParentActive) && !isOpen && "bg-sage-50 text-sage-700"
          )}
        >
          <div className={cn(
            "p-1.5 rounded-lg transition-colors",
            isOpen || hasActiveChild || isParentActive ? "bg-white shadow-sm text-sage-600" : "bg-carbon-50 text-carbon-400 group-hover:text-sage-500"
          )}>
            <Icon className="w-5 h-5" />
          </div>
          <span className="flex-1 text-left text-sm font-bold tracking-tight">{item.name}</span>
          <ChevronRight className={cn(
            "w-4 h-4 transition-transform duration-300 text-carbon-300 group-hover:text-carbon-500",
            isOpen && "rotate-90"
          )} />
        </button>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="ml-9 pl-4 border-l-2 border-sage-100 mt-1 space-y-1 pr-3">
              {/* Added: Hub/Main page link as the first item in the sub-menu */}
              <Link
                to={item.path}
                onClick={onChildClick}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group/item",
                  isParentActive 
                    ? "text-sage-700 font-bold bg-white shadow-soft-sm" 
                    : "text-carbon-500 hover:text-carbon-800 hover:bg-white/50"
                )}
              >
                <div className={cn("w-1.5 h-1.5 rounded-full", isParentActive ? "bg-sage-600" : "bg-carbon-200")} />
                <span className="truncate">Panel Principal</span>
              </Link>

              {item.children?.map((child, idx) => {
                if (child.type === 'divider') return <div key={idx} className="h-px bg-sage-100/50 my-2" />;
                
                const ChildIcon = child.icon;
                const isChildActive = location.pathname.startsWith(child.path);

                return (
                  <Link
                    key={idx}
                    to={child.path}
                    onClick={onChildClick}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group/item",
                      isChildActive 
                        ? "text-sage-700 font-bold bg-white shadow-soft-sm" 
                        : "text-carbon-500 hover:text-carbon-800 hover:bg-white/50"
                    )}
                  >
                    <ChildIcon className={cn(
                      "w-4 h-4 transition-colors",
                      isChildActive ? "text-sage-600" : "text-carbon-300 group-hover/item:text-sage-400"
                    )} />
                    <span className="truncate">{child.name}</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
