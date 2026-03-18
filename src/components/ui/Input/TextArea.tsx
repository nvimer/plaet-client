import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: React.ReactNode;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  required?: boolean;
  optional?: boolean;
  originalValue?: string | number | readonly string[] | undefined;
}

/**
 * TextArea Component
 *
 * Multiline input component following the app design system.
 */
export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
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
      rows = 3,
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

        {/* Textarea field - Normalized */}
        <textarea
          ref={ref}
          id={id}
          value={value}
          defaultValue={defaultValue}
          rows={rows}
          className={cn(
            // Base
            "w-full px-4 py-3 text-base font-medium resize-none",
            // Visible background and border
            "bg-sage-50/30 border-2 border-sage-200",
            // Rounded
            "rounded-xl",
            // Placeholder
            "placeholder:text-carbon-300",
            // Focus state
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
          <p className="mt-2 text-sm text-error-600">{error}</p>
        )}

        {/* Helper text */}
        {!error && helperText && (
          <p className="mt-2 text-sm text-carbon-500">{helperText}</p>
        )}
      </div>
    );
  },
);

TextArea.displayName = "TextArea";
