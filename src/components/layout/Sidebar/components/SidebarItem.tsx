import { Link } from "react-router-dom";
import { cn } from "@/utils/cn";
import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface SidebarItemProps {
  icon: LucideIcon;
  name: string;
  path: string;
  isActive: boolean;
  isCollapsed: boolean;
  isMobile: boolean;
  badge?: string;
  onClick?: () => void;
  description?: string;
}

export function SidebarItem({
  icon: Icon,
  name,
  path,
  isActive,
  isCollapsed,
  isMobile,
  badge,
  onClick,
  description,
}: SidebarItemProps) {
  const showFull = !isCollapsed || isMobile;

  return (
    <Link
      to={path}
      onClick={onClick}
      className={cn(
        "relative flex items-center group transition-all duration-300 rounded-xl mb-1",
        showFull ? "px-3 py-2.5 gap-3" : "justify-center p-3 mx-2",
        isActive 
          ? "bg-sage-100 text-sage-700 shadow-sm" 
          : "text-carbon-500 hover:bg-sage-50/50 hover:text-carbon-800"
      )}
    >
      {/* Active Indicator Bar */}
      {isActive && showFull && (
        <motion.div
          layoutId="sidebar-active-pill"
          className="absolute left-0 w-1 h-6 bg-sage-600 rounded-r-full"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}

      <div className="relative flex items-center justify-center flex-shrink-0">
        <Icon 
          className={cn(
            "transition-all duration-300",
            isActive ? "text-sage-600 scale-110" : "text-carbon-400 group-hover:text-sage-500",
            "w-5 h-5" // Constant size to avoid flickering during sidebar resizing
          )} 
        />
        {!showFull && badge && (
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-sage-500 rounded-full border-2 border-white" />
        )}
      </div>

      {showFull && (
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex items-center justify-between">
            <span className={cn(
              "text-sm font-bold truncate tracking-tight",
              isActive ? "text-sage-700" : "text-carbon-600"
            )}>
              {name}
            </span>
            {badge && (
              <span className="ml-2 px-1.5 py-0.5 bg-sage-200 text-sage-700 text-[10px] font-black rounded-md uppercase tracking-wider">
                {badge}
              </span>
            )}
          </div>
          {description && !isActive && (
            <span className="text-[10px] text-carbon-400 font-medium truncate mt-0.5 group-hover:text-sage-400 transition-colors">
              {description}
            </span>
          )}
        </div>
      )}

      {/* Tooltip for Collapsed State */}
      {!showFull && (
        <div className="absolute left-full ml-4 px-2 py-1 bg-carbon-900 text-white text-[10px] font-bold rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap shadow-xl">
          {name}
          <div className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 border-4 border-transparent border-r-carbon-900" />
        </div>
      )}
    </Link>
  );
}
