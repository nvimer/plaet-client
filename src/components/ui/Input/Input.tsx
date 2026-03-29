import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/utils/cn";
import { AlertCircle } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  required?: boolean;
  optional?: boolean;
  originalValue?: string | number | readonly string[] | undefined;
}

/**
 * Input Component
 *
 * Modern, visible input with clear boundaries.
 * Designed for easy recognition of editable fields.
 * Supports dirty tracking with originalValue prop.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth = false,
      required = false,
      optional = false,
      className = "",
      id,
      value,
      defaultValue,
      originalValue,
      ...props
    },
    ref,
  ) => {
    const isModified = originalValue !== undefined && String(value) !== String(originalValue);

    return (
      <div className={fullWidth ? "w-full" : ""}>
        {/* Label */}
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-semibold text-carbon-800 mb-2 ml-1"
          >
            {label}
            {required && (
              <span className="text-error-500 ml-1">*</span>
            )}
            {optional && (
              <span className="text-carbon-400 font-normal ml-2 text-[10px] uppercase tracking-wider">
                (opcional)
              </span>
            )}
          </label>
        )}

        {/* Input field - Normalized */}
        <input
          ref={ref}
          id={id}
          value={value}
          defaultValue={defaultValue}
          className={cn(
            // Base
            "w-full px-4 py-3 text-base font-medium",
            // Visible background and border
            "bg-sage-50/30 border-2 border-sage-200",
            // Rounded
            "rounded-xl",
            // Placeholder
            "placeholder:text-carbon-300",
            // Focus state - very visible
            "focus:outline-none focus:bg-white focus:border-sage-500 focus:ring-4 focus:ring-sage-500/10",
            // Transition
            "transition-all duration-200",
            // Disabled
            "disabled:bg-sage-100 disabled:text-carbon-400 disabled:cursor-not-allowed",
            // Error state
            error && "border-error-300 bg-error-50/30 focus:border-error-500 focus:ring-error-500/10",
            // Modified state (dirty tracking)
            isModified && "border-sage-500 bg-sage-100/50",
            className
          )}
          {...props}
        />

        {/* Error message */}
        {error && (
          <p className="mt-2 text-sm text-error-600 flex items-center gap-1.5 font-bold animate-fade-in">
            <AlertCircle className="w-3.5 h-3.5" />
            {error}
          </p>
        )}

        {/* Helper text */}
        {!error && helperText && (
          <p className="mt-2 text-sm text-carbon-500">{helperText}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
