import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  required?: boolean;
  optional?: boolean;
}

/**
 * Input Component
 *
 * Modern, visible input with clear boundaries.
 * Designed for easy recognition of editable fields.
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
      ...props
    },
    ref,
  ) => {
    return (
      <div className={fullWidth ? "w-full" : ""}>
        {/* Label */}
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-semibold text-carbon-800 mb-2"
          >
            {label}
            {required && (
              <span className="text-carbon-400 font-normal ml-1">*</span>
            )}
            {optional && (
              <span className="text-carbon-400 font-normal ml-2 text-xs">
                (opcional)
              </span>
            )}
          </label>
        )}

        {/* Input field - More visible */}
        <input
          ref={ref}
          id={id}
          className={cn(
            // Base
            "w-full px-4 py-3 text-base",
            // Visible background and border
            "bg-sage-50/80 border-2 border-sage-300",
            // Rounded
            "rounded-xl",
            // Placeholder
            "placeholder:text-carbon-400",
            // Focus state - very visible
            "focus:outline-none focus:bg-white focus:border-sage-500 focus:ring-4 focus:ring-sage-500/10",
            // Transition
            "transition-all duration-200",
            // Disabled
            "disabled:bg-sage-100 disabled:text-carbon-400 disabled:cursor-not-allowed",
            // Error state
            error && "border-red-400 bg-red-50/50 focus:border-red-500 focus:ring-red-500/10",
            className
          )}
          {...props}
        />

        {/* Error message */}
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
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
