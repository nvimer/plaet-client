import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: "default" | "elevated" | "bordered";
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
}

export function Card({
  children,
  variant = "default",
  padding = "lg",
  hover = false,
  className = "",
  ...props
}: CardProps) {
  // Base styles
  const baseStyles = "rounded-2xl transition-all duration-400";

  // Variant styles
  const variantStyles = {
    default: "bg-white border border-neutral-100 shadow-smooth",
    elevated: "bg-white shadow-smooth-lg",
    bordered: "bg-white border-2 border-neutral-200",
  };

  // Padding styles
  const paddingStyles = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const hoverStyles = hover
    ? "hover:-translate-y-1 hover:shadow-soft-lg cursor-pointer"
    : "";

  // Combine all styles
  const cardStyles = `
${baseStyles}
${variantStyles[variant]}
${paddingStyles[padding]}
${hoverStyles}
${className}
`
    .trim()
    .replace(/\s+/g, "");

  return (
    <div className={cardStyles} {...props}>
      {children}
    </div>
  );
}
