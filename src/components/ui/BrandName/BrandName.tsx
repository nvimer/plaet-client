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
    "inline-block transform scale-x-[-1] origin-center -ml-[0.05em]",
    accentClassName || "text-sage-green-600",
  );

  return (
    <span className={cn("inline-flex whitespace-nowrap", className)}>
      <span>Pla</span>
      <span className={accentClass}>e</span>
      <span className={accentClass}>t</span>
    </span>
  );
}
