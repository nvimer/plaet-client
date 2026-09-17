import type { HTMLAttributes, ReactNode } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    children: ReactNode;
    variant?: "neutral" | "success" | "warning" | "error" | "info";
    size?: "sm" | "md" | "lg";
    className?: string;
}

export function Badge({
    children,
    variant = "neutral",
    size = "md",
    className = "",
    ...props
}: BadgeProps) {
    // Base Badge style
    const baseStyles =
        "inline-flex items-center font-normal tracking-wide rounded-full border";

    // Variant styles
    const varianStyles = {
        neutral: "bg-sage-50 text-carbon-700 border border-sage-border-subtle",
        success:
            "bg-success-50 text-success-700 border border-success-200",
        warning: "bg-warning-50 text-warning-700 border border-warning-200",
        error: "bg-error-50 text-error-700 border border-error-200",
        info: "bg-info-50 text-info-700 border-info-200",
    };

    const sizeStyles = {
        sm: "px-2 py-0.5 text-xs",
        md: "px-3 py-1 text-sm",
        lg: "px-4 py-1.5 text-base",
    };

    // Combine all styles
    const badgeStyles =
        `${baseStyles} ${varianStyles[variant]} ${sizeStyles[size]} ${className}`
            .trim()
            .replace(/\s+/g, " ");

    return (
        <span className={badgeStyles} {...props}>
            {children}
        </span>
    );
}
