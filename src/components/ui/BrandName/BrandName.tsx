import { cn } from "@/utils/cn";

interface BrandNameProps {
  className?: string;
  accentClassName?: string;
}

/**
 * BrandName Component
 *
 * Renders the normalized brand name 'Plaet' with a trailing dot
 * matching the dashboard's professional style.
 */
export function BrandName({ className, accentClassName }: BrandNameProps) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)}>
      <span>Plaet</span>
      <span className={cn("w-1.5 h-1.5 rounded-full mt-1", accentClassName || "bg-primary-500")} />
    </span>
  );
}
