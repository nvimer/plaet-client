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
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Check if any child is active
  const hasActiveChild = item.children?.some(
    child => child.type === 'link' && location.pathname.startsWith(child.path.split('?')[0])
  );

  // Check if the group head itself is active
  const isParentActive = location.pathname === item.path;

  const [isOpen, setIsOpen] = useState(hasActiveChild || false);

  // Sync open state with active child or current path
  useEffect(() => {
    if (hasActiveChild || isParentActive) {
      setIsOpen(true);
    }
  }, [hasActiveChild, isParentActive, location.pathname]);

  const handleMouseEnter = () => {
    if (isMobile) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    if (isMobile || hasActiveChild || isParentActive) return;
    
    // Small delay before closing to allow moving mouse to children
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  const handleHeaderClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(item.path);
    if (isMobile && onChildClick) onChildClick();
  };

  const Icon = item.icon;

  if (!showFull) {
    return (
      <div 
        className="relative group/group mx-2 mb-1"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Invisible Bridge */}
        <div className="absolute left-full top-0 w-4 h-full z-10 pointer-events-auto" />

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

        {/* Floating Panel for Collapsed state */}
        <div className={cn(
          "absolute left-full top-[-8px] ml-2 w-60 py-3 bg-white rounded-3xl shadow-2xl border border-sage-100/50",
          "opacity-0 invisible group-hover/group:opacity-100 group-hover/group:visible group-hover/group:translate-x-0",
          "transition-all duration-300 ease-[0.23,1,0.32,1] z-[100] overflow-hidden translate-x-[-10px]"
        )}>
          <div className="px-5 py-3 border-b border-sage-50 mb-2 bg-sage-50/20">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 bg-sage-500 rounded-full" />
              <span className="text-[11px] font-black text-carbon-900 uppercase tracking-[0.2em]">{item.name}</span>
            </div>
          </div>
          <div className="max-h-[60vh] overflow-y-auto custom-scrollbar px-2 space-y-0.5">
            {item.children?.map((child, idx) => {
              if (child.type === 'divider') return <div key={idx} className="h-px bg-sage-100 my-2 mx-3" />;
              
              const ChildIcon = child.icon;
              const isChildActive = location.pathname.startsWith(child.path);

              return (
                <Link
                  key={idx}
                  to={child.path}
                  onClick={onChildClick}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 text-sm rounded-xl transition-all duration-200",
                    isChildActive 
                      ? "bg-sage-50 text-sage-700 font-bold border border-sage-100 shadow-soft-xs" 
                      : "text-carbon-500 hover:bg-sage-50/80 hover:text-carbon-900"
                  )}
                >
                  <ChildIcon className={cn("w-4 h-4", isChildActive ? "text-sage-600" : "text-carbon-400")} />
                  <span className="truncate">{child.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="mb-1"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
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
