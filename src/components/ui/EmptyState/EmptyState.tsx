import type { ReactNode } from "react";
import { Button } from "../Button";
import { cn } from "@/utils";

// ============ TYPES ===========
interface EmptyStateProps {
    icon: ReactNode;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
    size?: "sm" | "md" | "lg";
    variant?: "default" | "fullscreen";
    iconSize?: "sm" | "md" | "lg";
    className?: string;
}

/**
 * EmptyState Component
 *
 * Empty State with icon and CTA
 * Optimized for touch interactions and different screen sizes
 */
export function EmptyState({
    icon,
    title,
    description,
    actionLabel,
    onAction,
    size = "md",
    variant = "default",
    iconSize,
    className,
}: EmptyStateProps) {
    // Size configurations
    const sizeConfig = {
        sm: {
            padding: "py-12 px-4",
            iconContainer: "w-12 h-12",
            icon: "w-6 h-6",
            title: "text-lg",
            description: "text-sm",
        },
        md: {
            padding: "py-16 px-4",
            iconContainer: "w-16 h-16",
            icon: "w-8 h-8",
            title: "text-xl",
            description: "text-base",
        },
        lg: {
            padding: "py-24 px-6",
            iconContainer: "w-24 h-24",
            icon: "w-12 h-12",
            title: "text-2xl",
            description: "text-lg",
        },
    };

    // Variant configurations
    const variantConfig = {
        default: "",
        fullscreen: "min-h-[60vh]",
    };

    // Icon size override
    const effectiveIconSize = iconSize || size;
    const config = sizeConfig[size];
    const iconConfig = sizeConfig[effectiveIconSize];

    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center text-center",
                config.padding,
                variantConfig[variant],
                className
            )}
        >
            {/* Icon Container  */}
            {icon && (
                <div
                    className={cn(
                        "bg-sage-50 rounded-2xl flex items-center justify-center text-carbon-500 mb-4",
                        iconConfig.iconContainer
                    )}
                >
                    <div className={iconConfig.icon}>{icon}</div>
                </div>
            )}

            {/* Title */}
            <h3
                className={cn(
                    "font-semibold text-carbon-900 mb-2",
                    config.title
                )}
            >
                {title}
            </h3>

            {/* Description */}
            <p
                className={cn(
                    "text-carbon-700 max-w-md mb-6",
                    config.description
                )}
            >
                {description}
            </p>

            {/* Action Button  */}
            {actionLabel && onAction && (
                <Button
                    variant="primary"
                    size={size === "lg" ? "lg" : "md"}
                    onClick={onAction}
                >
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}
