import React, { forwardRef, useState, useEffect } from "react";
import { cn } from "@/utils/cn";
import { DollarSign, Plus, Minus, RotateCcw } from "lucide-react";

interface PriceInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "type"> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  required?: boolean;
  currency?: string;
  value?: string | number;
  onChange?: (value: string) => void;
  onValueChange?: (value: string) => void;
}

/**
 * PriceInput Component - Premium Tactile Version
 * 
 * High-end specialized input for monetary values.
 * Features:
 * - Real-time thousands formatting (e.g. 15.000)
 * - Quick action buttons for common increments
 * - Tactile design for POS/Kiosk environments
 * - Clear numeric focus
 */
export const PriceInput = forwardRef<HTMLInputElement, PriceInputProps>(
  ({ label, error, helperText, fullWidth, required, currency = "COP", className, id, value, onChange, onValueChange, ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState("");

    // Sync internal display value with external value
    useEffect(() => {
      const val = value !== undefined ? String(value) : "";
      setDisplayValue(formatNumber(val));
    }, [value]);

    const formatNumber = (val: string) => {
      if (!val) return "";
      const num = val.replace(/\D/g, "");
      return new Intl.NumberFormat("es-CO").format(parseInt(num || "0"));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value.replace(/\D/g, "");
      setDisplayValue(formatNumber(rawValue));
      if (onChange) {
        // Create a synthetic event or just call with the string if using custom controller
        // For react-hook-form, we usually need the event
        e.target.value = rawValue;
        // @ts-ignore
        onChange(e);
      }
      if (onValueChange) onValueChange(rawValue);
    };

    const adjustPrice = (amount: number) => {
      const currentVal = parseInt(String(value || "0").replace(/\D/g, "")) || 0;
      const newVal = Math.max(0, currentVal + amount);
      const strVal = String(newVal);
      
      if (onValueChange) onValueChange(strVal);
      
      // For RHF compatibility
      if (onChange) {
        const event = {
          target: { value: strVal, name: props.name },
          type: 'change'
        } as React.ChangeEvent<HTMLInputElement>;
        // @ts-ignore
        onChange(event);
      }
    };

    const presets = [1000, 5000, 10000];

    return (
      <div className={cn("space-y-3", fullWidth ? "w-full" : "")}>
        {label && (
          <label htmlFor={id} className="block text-sm font-bold text-carbon-800 ml-1">
            {label}
            {required && <span className="text-error-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative group">
          {/* Prefix */}
          <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none z-10 transition-colors group-focus-within:text-sage-600 text-carbon-400">
            <DollarSign className="w-5 h-5 stroke-[2.5px]" />
            <span className="text-xs font-black tracking-widest border-r border-carbon-200 pr-3 mr-1">{currency}</span>
          </div>
          
          <input
            ref={ref}
            id={id}
            type="text"
            inputMode="numeric"
            value={displayValue}
            onChange={handleInputChange}
            className={cn(
              "w-full pl-24 pr-12 py-5 text-2xl font-black tracking-tight",
              "bg-white border-3 border-sage-100 rounded-3xl transition-all duration-300 shadow-soft-sm",
              "placeholder:text-carbon-200 text-carbon-900",
              "focus:outline-none focus:border-sage-500 focus:ring-8 focus:ring-sage-500/5 focus:shadow-soft-lg",
              error ? "border-error-300 bg-error-50/10" : "hover:border-sage-300 hover:shadow-soft-md",
              className
            )}
            {...props}
          />

          {/* Reset Button */}
          {displayValue && (
            <button
              type="button"
              onClick={() => adjustPrice(-Infinity)}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-xl text-carbon-300 hover:text-error-500 hover:bg-error-50 transition-all"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Quick Presets - Tactile UI */}
        <div className="flex flex-wrap gap-2 pt-1">
          {presets.map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => adjustPrice(amount)}
              className="flex-1 min-w-[80px] flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl bg-sage-50 border border-sage-200 text-sage-700 text-xs font-black hover:bg-sage-600 hover:text-white hover:border-sage-600 hover:shadow-soft-md active:scale-95 transition-all"
            >
              <Plus className="w-3 h-3" />
              {amount.toLocaleString()}
            </button>
          ))}
          <button
            type="button"
            onClick={() => adjustPrice(-1000)}
            className="px-4 flex items-center justify-center rounded-2xl bg-carbon-50 border border-carbon-200 text-carbon-600 hover:bg-carbon-900 hover:text-white transition-all active:scale-95"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <p className="text-xs font-bold text-error-600 px-2 animate-fade-in flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-error-600" />
            {error}
          </p>
        )}

        {helperText && !error && (
          <p className="text-xs text-carbon-400 px-2 flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-carbon-300" />
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

PriceInput.displayName = "PriceInput";
