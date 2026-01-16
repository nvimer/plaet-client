/**
 * Skeleton Component
 *
 * Loading placeholder with shimmer animation
 * Optimized for different use cases with pre-defined variants
 */
interface SkeletonProps {
    className?: string;
    variant?: "text" | "card" | "stat" | "avatar" | "button" | "custom";
    width?: number | string;
    height?: number | string;
    rounded?: "sm" | "md" | "lg" | "xl" | "full";
}

export function Skeleton({
    className = "",
    variant = "custom",
    width,
    height,
    rounded = "xl",
}: SkeletonProps) {
    // Base styles
    const baseStyles =
        "animate-pulse bg-gradient-to-r from-neutral-100 via-neutral-200 to-neutral-100 bg-[length:200%_100%]";

    // Variant-specific styles
    const variantStyles = {
        text: "h-4",
        card: "h-48",
        stat: "h-24",
        avatar: "w-12 h-12 rounded-full",
        button: "h-10",
        custom: "",
    };

    // Rounded styles
    const roundedStyles = {
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
        full: "rounded-full",
    };

    // Width and height styles
    const sizeStyles: React.CSSProperties = {};
    if (width) {
        sizeStyles.width =
            typeof width === "number" ? `${width}px` : width;
    }
    if (height) {
        sizeStyles.height =
            typeof height === "number" ? `${height}px` : height;
    }

    const skeletonStyles = `
        ${baseStyles}
        ${variantStyles[variant]}
        ${roundedStyles[rounded]}
        ${className}
    `
        .trim()
        .replace(/\s+/g, " ");

    return (
        <div
            className={skeletonStyles}
            style={{
                ...sizeStyles,
                animation: "shimmer 2s infinite",
            }}
        />
    );
}
