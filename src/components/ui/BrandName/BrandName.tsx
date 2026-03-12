import { cn } from "@/utils/cn";

interface BrandNameProps {
  className?: string;
  accentClassName?: string;
  showManagement?: boolean;
}

/**
 * BrandName Component
 *
 * Renders the normalized brand name 'Plaet' with a trailing dot
 * and an optional 'Management' subtitle.
 */
export function BrandName({ className, accentClassName, showManagement = false }: BrandNameProps) {
  const brand = (
    <span className={cn("inline-flex items-center gap-0.5", className)}>
      <span>Plaet</span>
      <span className={cn("w-1.5 h-1.5 rounded-full mt-1", accentClassName || "bg-primary-500")} />
    </span>
  );

  if (showManagement) {
    return (
      <div className="flex flex-col">
        {brand}
        <span className="text-[10px] font-bold text-carbon-400 uppercase tracking-[0.3em] mt-0.5 leading-none">
          Management
        </span>
      </div>
    );
  }

  return brand;
}
