import { AnimatePresence } from "framer-motion";
import type React from "react";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

// =============== TYPES ================
interface BaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    subtitle?: string;
    size?: "sm" | "md" | "lg" | "xl" | "full";
    children: React.ReactNode;
    showCloseButton?: boolean;
}

/**
 * BaseModal Component
 *
 * Reusable modal wrapper with animations and accessibility
 */
export function BaseModal({
    isOpen,
    onClose,
    title,
    subtitle,
    size = "md",
    children,
    showCloseButton = true,
}: BaseModalProps) {
    // ================ SIZE CONFIG ==================
    const sizeClasses = {
        sm: "max-w-sm",
        md: "max-w-lg",
        lg: "max-w-2xl",
        xl: "max-w-3xl",
        full: "max-w-[95vw] max-h-[95vh]",
    };

    // ================= KEYBOARD HANDLERS =================
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            // Prevent body scroll
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    // =============== RENDER ==============
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 bg-carbon-900/60 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className={`relative w-full ${sizeClasses[size]} bg-white rounded-2xl shadow-soft-xl overflow-hidden`}
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between p-6 border-b border-sage-border-subtle">
                            <div>
                                <h2 className="text-xl font-bold text-carbon-900">{title}</h2>
                                {subtitle && (
                                    <p className="text-sm text-carbon-600 font-light mt-1">
                                        {subtitle}
                                    </p>
                                )}
                            </div>

                            {showCloseButton && (
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-xl text-carbon-500 hover:text-carbon-700 hover:bg-sage-50 transition-colors"
                                    aria-label="Cerrar"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>

                        {/* Body */}
                        <div className="p-6 max-h-[70vh] overflow-y-auto">{children}</div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
