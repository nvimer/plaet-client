import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "xl";
  fullWidth?: boolean;
  isLoading?: boolean;
}

/**
 * Premium Button Component
 * Enhanced with high-contrast variants and tactile feedback.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      fullWidth = false,
      isLoading = false,
      className = "",
      disabled,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.97] tracking-tight";

    const variantStyles = {
      // High contrast primary - Dark background, crisp white text
      primary:
        "bg-carbon-900 text-white hover:bg-carbon-800 focus:ring-carbon-500 shadow-soft-md hover:shadow-soft-lg",
      // Clean secondary - Sage accent with dark text
      secondary:
        "bg-sage-100 text-carbon-900 hover:bg-sage-200 active:bg-sage-300 focus:ring-sage-400 border border-sage-200",
      // Modern outline
      outline:
        "bg-white text-carbon-700 border-2 border-sage-100 hover:border-carbon-200 hover:bg-sage-50 active:bg-sage-100 focus:ring-sage-300",
      // Minimal ghost
      ghost:
        "bg-transparent text-carbon-600 hover:bg-sage-50 active:bg-sage-100 focus:ring-sage-200",
      // Urgent danger
      danger:
        "bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500 shadow-soft-sm",
    };

    const sizeStyles = {
      sm: "px-4 py-2 text-xs h-10 rounded-xl",
      md: "px-6 py-2.5 text-sm h-12 rounded-2xl",
      lg: "px-8 py-3 text-base h-14 rounded-2xl",
      xl: "px-10 py-4 text-lg h-16 rounded-[1.25rem]",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && "w-full",
          (disabled || isLoading) && "opacity-50 cursor-not-allowed active:scale-100",
          className
        )}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        <span className="relative flex items-center justify-center">
          {children}
        </span>
      </button>
    );
  },
);

Button.displayName = "Button";