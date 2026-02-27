import { AnimatePresence, motion } from "framer-motion";
import type React from "react";
import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/utils/cn";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

/**
 * Premium Side Drawer Component
 * Slides from the right, used for advanced filters and quick details.
 */
export function Drawer({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
}: DrawerProps) {
  
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-carbon-900/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer Content */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-sage-100">
              <div>
                <h2 className="text-xl font-black text-carbon-900 tracking-tight">{title}</h2>
                {subtitle && (
                  <p className="text-sm text-carbon-500 font-medium mt-1">
                    {subtitle}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-carbon-400 hover:text-carbon-900 hover:bg-sage-50 transition-all active:scale-95"
                aria-label="Cerrar"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="p-6 border-t border-sage-100 bg-sage-50/30">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
