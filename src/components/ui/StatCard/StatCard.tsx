import type { ReactNode } from "react";
import { Card } from "../Card/Card";
import { cn } from "@/utils";

interface StatCardProps {
    title: string;
    value: string | number;
    icon?: ReactNode;
    iconBgColor?: string;
    iconColor?: string;
    change?: {
        value: string;
        type: "increase" | "decrease";
    };
    description?: string;
    size?: "sm" | "md" | "lg";
    variant?: "default" | "tactile";
    interactive?: boolean;
    onClick?: () => void;
    className?: string;
}

export function StatCard({
    title,
    value,
    change,
    icon,
    iconBgColor,
    iconColor,
    description,
    size = "md",
    variant = "default",
    interactive = false,
    onClick,
    className,
}: StatCardProps) {
    // Size configurations
    const sizeConfig = {
        sm: {
            padding: "p-4",
            iconSize: "w-10 h-10",
            iconInner: "w-5 h-5",
            title: "text-xs",
            value: "text-xl",
            change: "text-xs",
        },
        md: {
            padding: "p-6",
            iconSize: "w-12 h-12",
            iconInner: "w-6 h-6",
            title: "text-sm",
            value: "text-2xl",
            change: "text-sm",
        },
        lg: {
            padding: "p-8",
            iconSize: "w-16 h-16",
            iconInner: "w-8 h-8",
            title: "text-base",
            value: "text-4xl",
            change: "text-base",
        },
    };

    const config = sizeConfig[size];
    const isTactile = variant === "tactile";
    const isClickable = interactive || !!onClick;

    return (
        <Card
            variant="elevated"
            padding="none"
            hover={isClickable || isTactile}
            className={cn(
                config.padding,
                isClickable && "cursor-pointer transition-transform hover:scale-105",
                isTactile && "border-2 border-sage-200",
                className
            )}
            onClick={onClick}
        >
            <div className="flex items-center gap-4">
                {/* Icon */}
                {icon && (
                    <div
                        className={cn(
                            "flex-shrink-0 rounded-xl flex items-center justify-center",
                            config.iconSize,
                            iconBgColor || "bg-sage-50",
                            iconColor || "text-sage-600"
                        )}
                    >
                        <div className={config.iconInner}>{icon}</div>
                    </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {/* Title */}
                    <p
                        className={cn(
                            "font-medium text-carbon-500 mb-1",
                            config.title
                        )}
                    >
                        {title}
                    </p>

                    {/* Value */}
                    <h3
                        className={cn(
                            "font-bold text-carbon-900 mb-1",
                            config.value
                        )}
                    >
                        {value}
                    </h3>

                    {/* Change indicator */}
                    {change && (
                        <div className="flex items-center gap-1">
                            <span
                                className={cn(
                                    "font-medium",
                                    config.change,
                                    change.type === "increase"
                                        ? "text-sage-600"
                                        : "text-red-600"
                                )}
                            >
                                {change.type === "increase" ? "↑" : "↓"}
                                {change.value}
                            </span>
                            {description && (
                                <span
                                    className={cn(
                                        "text-carbon-500",
                                        config.change
                                    )}
                                >
                                    {description}
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}
