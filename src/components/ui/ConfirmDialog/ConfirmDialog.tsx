import { useState, cloneElement, isValidElement } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, Info, X, Trash2 } from "lucide-react";
import { Button } from "../Button/Button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";

export interface ConfirmDialogProps {
  /** If provided, the dialog controls its own open/close state when this element is clicked */
  trigger?: React.ReactNode;
  /** Controlled open state (use if no trigger is provided) */
  isOpen?: boolean;
  /** Callback for when the dialog wants to close */
  onClose?: () => void;
  /** Action to perform when confirmed */
  onConfirm: () => void;
  /** Dialog title */
  title: string;
  /** Dialog body text (accepts message or description for retro-compatibility) */
  message?: string;
  description?: string;
  /** Button labels */
  confirmText?: string;
  cancelText?: string;
  /** Visual variant */
  variant?: "danger" | "warning" | "info";
  /** Loading state for confirm button */
  isLoading?: boolean;
}

/**
 * Premium Confirm Dialog
 * Supports both controlled (isOpen/onClose) and uncontrolled (trigger) usage.
 */
export function ConfirmDialog({
  trigger,
  isOpen: controlledIsOpen,
  onClose: controlledOnClose,
  onConfirm,
  title,
  message,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "danger",
  isLoading = false,
}: ConfirmDialogProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isControlled = controlledIsOpen !== undefined;
  
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;
  
  const handleClose = () => {
    if (isControlled && controlledOnClose) {
      controlledOnClose();
    } else {
      setInternalIsOpen(false);
    }
  };

  const handleOpen = () => {
    if (!isControlled) {
      setInternalIsOpen(true);
    }
  };

  const handleConfirm = () => {
    onConfirm();
    // Don't auto-close if loading, wait for the parent to unmount or close it
    if (!isLoading && !isControlled) {
      setInternalIsOpen(false);
    }
  };

  const config = {
    danger: {
      icon: Trash2,
      iconBg: "bg-rose-50 text-rose-600 shadow-inner",
      buttonVariant: "danger" as const,
      buttonClass: "",
    },
    warning: {
      icon: AlertTriangle,
      iconBg: "bg-amber-50 text-amber-600 shadow-inner",
      buttonVariant: "primary" as const,
      buttonClass: "bg-amber-500 hover:bg-amber-600 text-white shadow-soft-lg",
    },
    info: {
      icon: Info,
      iconBg: "bg-blue-50 text-blue-600 shadow-inner",
      buttonVariant: "primary" as const,
      buttonClass: "bg-blue-600 hover:bg-blue-700 text-white shadow-soft-lg",
    },
  }[variant];

  const Icon = config.icon;
  const bodyText = message || description;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-carbon-900/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="relative w-full max-w-[400px] bg-white rounded-3xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()} // Prevent clicking modal from closing it
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="absolute top-4 right-4 p-2 rounded-full text-carbon-400 hover:bg-sage-50 hover:text-carbon-900 transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8">
              <div className="flex flex-col items-center text-center">
                <div className={cn("w-16 h-16 rounded-[1.25rem] flex items-center justify-center mb-6", config.iconBg)}>
                  <Icon className="w-8 h-8 stroke-[2px]" />
                </div>
                
                <h3 className="text-2xl font-black text-carbon-900 tracking-tight mb-3 leading-tight">
                  {title}
                </h3>
                
                {bodyText && (
                  <p className="text-sm font-medium text-carbon-500 leading-relaxed mb-8 px-2">
                    {bodyText}
                  </p>
                )}

                <div className="flex flex-col sm:flex-row w-full gap-3">
                  <Button
                    variant="ghost"
                    size="lg"
                    fullWidth
                    onClick={handleClose}
                    disabled={isLoading}
                    className="h-14 rounded-2xl font-bold text-carbon-500 hover:bg-carbon-50 hover:text-carbon-900 order-2 sm:order-1"
                  >
                    {cancelText}
                  </Button>
                  <Button
                    variant={config.buttonVariant}
                    size="lg"
                    fullWidth
                    onClick={handleConfirm}
                    isLoading={isLoading}
                    disabled={isLoading}
                    className={cn(
                      "h-14 rounded-2xl font-bold shadow-soft-lg order-1 sm:order-2",
                      config.buttonClass
                    )}
                  >
                    {confirmText}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {/* Trigger Render */}
      {trigger && isValidElement(trigger) && 
        cloneElement(trigger as React.ReactElement<any>, { 
          onClick: (e: React.MouseEvent) => {
            e.stopPropagation(); // Prevent parent clicks
            handleOpen();
            if (trigger.props.onClick) trigger.props.onClick(e);
          }
        })
      }

      {/* Modal Render via Portal */}
      {typeof document !== "undefined" ? createPortal(modalContent, document.body) : null}
    </>
  );
}