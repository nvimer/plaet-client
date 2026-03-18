import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import { DollarSign } from "lucide-react";

interface PriceInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  required?: boolean;
  currency?: string;
}

/**
 * PriceInput Component
 * 
 * Specialized input for monetary values.
 * Features a currency symbol and optimized styling for prices.
 */
export const PriceInput = forwardRef<HTMLInputElement, PriceInputProps>(
  ({ label, error, helperText, fullWidth, required, currency = "COP", className, id, ...props }, ref) => {
    return (
      <div className={cn("space-y-2", fullWidth ? "w-full" : "")}>
        {label && (
          <label htmlFor={id} className="block text-sm font-semibold text-carbon-800">
            {label}
            {required && <span className="text-error-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none transition-colors group-focus-within:text-sage-600 text-carbon-400">
            <DollarSign className="w-4 h-4" />
            <span className="text-xs font-black tracking-wider border-r border-carbon-200 pr-2 mr-0.5">{currency}</span>
          </div>
          
          <input
            ref={ref}
            id={id}
            type="text"
            inputMode="decimal"
            className={cn(
              "w-full pl-20 pr-4 py-3.5 text-lg font-bold tracking-tight",
              "bg-sage-50/50 border-2 border-sage-200 rounded-2xl transition-all duration-300",
              "placeholder:text-carbon-300 text-carbon-900",
              "focus:outline-none focus:bg-white focus:border-sage-500 focus:ring-4 focus:ring-sage-500/10",
              error ? "border-error-300 bg-error-50/30" : "hover:border-sage-300 hover:bg-sage-50/80",
              className
            )}
            {...props}
          />
        </div>

        {error && (
          <p className="text-xs font-bold text-error-600 px-1 animate-fade-in">
            {error}
          </p>
        )}

        {helperText && !error && (
          <p className="text-xs text-carbon-400 px-1">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

PriceInput.displayName = "PriceInput";
