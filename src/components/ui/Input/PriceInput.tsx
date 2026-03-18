import React, { forwardRef, useState, useEffect } from "react";
import { cn } from "@/utils/cn";
import { DollarSign, Plus, Minus, RotateCcw } from "lucide-react";

interface PriceInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "type"> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  required?: boolean;
  optional?: boolean;
  currency?: string;
  value?: string | number;
  onChange?: (value: string) => void;
  onValueChange?: (value: string) => void;
}

/**
 * PriceInput Component - Refined Version
 * 
 * Elegant specialized input for monetary values.
 * Features:
 * - Real-time thousands formatting (e.g. 15.000)
 * - Subtle quick action buttons
 * - Compact and professional design
 */
export const PriceInput = forwardRef<HTMLInputElement, PriceInputProps>(
  ({ label, error, helperText, fullWidth, required, optional, currency = "COP", className, id, value, onChange, onValueChange, ...props }, ref) => {
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
        // Create a synthetic event for RHF compatibility
        const originalValue = e.target.value;
        e.target.value = rawValue;
        // @ts-ignore
        onChange(e);
        // Restore for local display if needed (though we use state)
        e.target.value = originalValue;
      }
      if (onValueChange) onValueChange(rawValue);
    };

    const adjustPrice = (amount: number) => {
      const currentVal = parseInt(String(value || "0").replace(/\D/g, "")) || 0;
      const newVal = Math.max(0, currentVal + amount);
      const strVal = String(newVal);
      
      if (onValueChange) onValueChange(strVal);
      
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
      <div className={cn("space-y-2", fullWidth ? "w-full" : "")}>
        {label && (
          <label htmlFor={id} className="block text-sm font-semibold text-carbon-800 ml-1">
            {label}
            {required && <span className="text-error-500 ml-1">*</span>}
            {optional && (
              <span className="text-carbon-400 font-normal ml-2 text-[10px] uppercase tracking-wider">
                (opcional)
              </span>
            )}
          </label>
        )}
        
        <div className="relative group">
          {/* Prefix - More compact */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none z-10 transition-colors group-focus-within:text-sage-600 text-carbon-400">
            <DollarSign className="w-4 h-4" />
            <span className="text-[10px] font-bold tracking-wider border-r border-carbon-200 pr-2 mr-0.5">{currency}</span>
          </div>
          
          <input
            ref={ref}
            id={id}
            type="text"
            inputMode="numeric"
            value={displayValue}
            onChange={handleInputChange}
            className={cn(
              "w-full pl-20 pr-10 py-3 text-lg font-semibold tracking-tight",
              "bg-sage-50/30 border-2 border-sage-200 rounded-xl transition-all duration-200",
              "placeholder:text-carbon-300 text-carbon-900",
              "focus:outline-none focus:bg-white focus:border-sage-500 focus:ring-4 focus:ring-sage-500/10",
              error ? "border-error-300 bg-error-50/10" : "hover:border-sage-300",
              className
            )}
            {...props}
          />

          {/* Reset Button */}
          {displayValue && (
            <button
              type="button"
              onClick={() => adjustPrice(-Infinity)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-carbon-300 hover:text-error-500 hover:bg-error-50 transition-all"
              title="Limpiar"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Presets - More refined and compact */}
        <div className="flex items-center gap-1.5">
          {presets.map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => adjustPrice(amount)}
              className="px-2.5 py-1.5 rounded-lg bg-white border border-sage-200 text-sage-700 text-[10px] font-bold hover:bg-sage-600 hover:text-white hover:border-sage-600 transition-all active:scale-95"
            >
              +{amount.toLocaleString()}
            </button>
          ))}
          <div className="w-px h-4 bg-carbon-200 mx-0.5" />
          <button
            type="button"
            onClick={() => adjustPrice(-1000)}
            className="p-1.5 rounded-lg bg-white border border-carbon-200 text-carbon-500 hover:bg-carbon-900 hover:text-white transition-all active:scale-95"
            title="Restar 1.000"
          >
            <Minus className="w-3 h-3" />
          </button>
        </div>

        {error && (
          <p className="text-xs font-semibold text-error-600 px-1 animate-fade-in">
            {error}
          </p>
        )}

        {helperText && !error && (
          <p className="text-[11px] text-carbon-400 px-1 italic">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

PriceInput.displayName = "PriceInput";
