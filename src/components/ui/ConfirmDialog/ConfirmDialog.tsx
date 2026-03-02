import { useState, cloneElement, isValidElement, useEffect } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, Info, X, Trash2 } from "lucide-react";
import { Button } from "../Button/Button";
...
  const bodyText = message || description;

  const content = (
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

      {/* Modal Render */}
      {typeof document !== "undefined" ? createPortal(content, document.body) : null}
    </>
  );
}