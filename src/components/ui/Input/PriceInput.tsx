import React, { forwardRef, useState, useEffect } from "react";
import { cn } from "@/utils/cn";
import { DollarSign, Plus, Minus, RotateCcw, AlertCircle } from "lucide-react";

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
}

/**
 * PriceInput Component - Refined Version
 * 
 * Elegant specialized input for monetary values.
 * Optimized for COP (Colombian Pesos) - Integer based.
 */
export const PriceInput = forwardRef<HTMLInputElement, PriceInputProps>(
  ({ label, error, helperText, fullWidth, required, optional, currency = "COP", className, id, value, onChange, ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState("");

    // Helper to format as currency (15.000)
    const format = (val: string | number) => {
      const s = String(val || "").replace(/\D/g, "");
      if (!s) return "";
      return new Intl.NumberFormat("es-CO").format(parseInt(s));
    };

    // Update display when external value changes
    useEffect(() => {
      setDisplayValue(format(value ?? ""));
    }, [value]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/\D/g, "");
      if (onChange) onChange(raw);
    };

    const adjust = (amount: number) => {
      if (amount === -Infinity) {
        if (onChange) onChange("");
        return;
      }
      const current = parseInt(String(value || "0").replace(/\D/g, "")) || 0;
      const next = Math.max(0, current + amount);
      if (onChange) onChange(String(next));
    };

    const presets = [1000, 5000, 10000];

    return (
      <div className={cn("space-y-1.5", fullWidth ? "w-full" : "")}>
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
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10 text-carbon-400 group-focus-within:text-sage-600 transition-colors">
            <DollarSign className="w-5 h-5" />
          </div>
          
          <input
            ref={ref}
            id={id}
            type="text"
            inputMode="numeric"
            value={displayValue}
            onChange={handleInputChange}
            className={cn(
              "w-full pl-12 pr-10 py-3 text-base font-medium",
              "bg-sage-50/30 border-2 border-sage-200 rounded-xl transition-all duration-200",
              "placeholder:text-carbon-300 text-carbon-900",
              "focus:outline-none focus:bg-white focus:border-sage-500 focus:ring-4 focus:ring-sage-500/10",
              error ? "border-error-300 bg-error-50/30 focus:border-error-500" : "hover:border-sage-300",
              className
            )}
            {...props}
          />

          {displayValue && (
            <button
              type="button"
              onClick={() => adjust(-Infinity)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-carbon-300 hover:text-error-500 hover:bg-error-50 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 ml-1">
          {presets.map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => adjust(amt)}
              className="px-2 py-1 rounded-lg bg-white border border-sage-200 text-sage-700 text-[10px] font-bold hover:bg-sage-600 hover:text-white hover:border-sage-600 transition-all"
            >
              +{amt.toLocaleString()}
            </button>
          ))}
          <div className="w-px h-3 bg-carbon-200 mx-0.5" />
          <button
            type="button"
            onClick={() => adjust(-1000)}
            className="p-1 rounded-lg bg-white border border-carbon-200 text-carbon-500 hover:bg-carbon-900 hover:text-white transition-all"
          >
            <Minus className="w-3 h-3" />
          </button>
        </div>

        {error && (
          <p className="text-xs font-bold text-error-600 px-1 animate-fade-in flex items-center gap-1.5 mt-1">
            <AlertCircle className="w-3 h-3" />
            {error}
          </p>
        )}
      </div>
    );
  }
);

PriceInput.displayName = "PriceInput";
