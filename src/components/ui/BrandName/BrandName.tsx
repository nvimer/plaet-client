import { cn } from "@/utils/cn";

interface BrandNameProps {
  className?: string;
  showManagement?: boolean;
}

/**
 * BrandName Component
 *
 * Renders the normalized brand name 'Plaet' 
 * and an optional 'Management' subtitle.
 */
export function BrandName({ className, showManagement = false }: BrandNameProps) {
  const brand = (
    <span className={cn("inline-flex items-center", className)}>
      <span>Plaet</span>
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
