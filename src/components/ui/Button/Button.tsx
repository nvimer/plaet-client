import { forwardRef, type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  isLoading?: boolean;
}

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
      "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

    const variantStyles = {
      primary:
        "bg-sage-300 text-carbon-900 hover:bg-sage-400 active:bg-sage-500 focus:ring-sage-300 shadow-soft-sm hover:shadow-soft-md",
      secondary:
        "bg-sage-50 text-carbon-900 hover:bg-sage-100 active:bg-sage-200 focus:ring-sage-200 border border-sage-border-subtle",
      outline:
        "bg-transparent text-sage-600 border-2 border-sage-300 hover:bg-sage-50 active:bg-sage-100 focus:ring-sage-300",
      ghost:
        "bg-transparent text-carbon-700 hover:bg-sage-50 active:bg-sage-100 focus:ring-sage-200",
    };

    const sizeStyles = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-2.5 text-base",
      lg: "px-8 py-3 text-lg",
    };

    const widthStyles = fullWidth ? "w-full" : "";

    const disabledStyles =
      disabled || isLoading
        ? "opacity-50 cursor-not-allowed"
        : "cursor-pointer";

    const buttonStyles = `
${baseStyles}
${variantStyles[variant]}
${sizeStyles[size]}
${widthStyles}
${disabledStyles}
${className}
`
      .trim()
      .replace(/\s+g/, " ");

    return (
      <button
        ref={ref}
        className={buttonStyles}
        disabled={disabled || isLoading}
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
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
