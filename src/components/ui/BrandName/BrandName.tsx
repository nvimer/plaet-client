import { cn } from "@/utils/cn";

interface BrandNameProps {
  className?: string;
  accentClassName?: string;
}

/**
 * BrandName Component
 *
 * Renders the brand name 'Plaet' with the letters 'e' and 't'
 * mirrored horizontally (right-to-left visual effect per letter).
 */
export function BrandName({ className, accentClassName }: BrandNameProps) {
  const accentClass = cn(
    "inline-block transform scale-x-[-1] origin-center",
    accentClassName || "text-sage-600",
  );

  return (
    <span className={cn("inline-flex whitespace-nowrap", className)}>
      <span>P</span>
      <span className="ml-[0.015em]">l</span>
      <span className="ml-[0.015em]">a</span>
      <span className={cn(accentClass, "ml-[0.015em]")}>e</span>
      <span className={cn(accentClass, "ml-[0.015em]")}>t</span>
    </span>
  );
}
