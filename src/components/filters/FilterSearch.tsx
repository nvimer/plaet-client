import { SearchInput } from "@/components/ui/SearchInput";
import { cn } from "@/utils/cn";

interface FilterSearchProps {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  "aria-label"?: string;
  className?: string;
  label?: string;
}

/**
 * Premium Filter Search
 * Clean, high-contrast search input for filter sections.
 */
export function FilterSearch({
  value,
  onChange,
  onClear,
  placeholder = "Buscar...",
  "aria-label": ariaLabel,
  className,
  label,
}: FilterSearchProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <span className="text-[10px] font-black text-carbon-400 uppercase tracking-[0.2em] ml-1">
          {label}
        </span>
      )}
      <SearchInput
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onClear={onClear}
        placeholder={placeholder}
        aria-label={ariaLabel ?? "Buscar"}
        fullWidth
        className={cn(
          "min-h-[48px] py-3 px-4 border-2 border-sage-100 bg-white rounded-2xl transition-all duration-300",
          "focus:border-sage-400 focus:shadow-soft-lg focus:scale-[1.01]",
          "placeholder:text-carbon-300 placeholder:font-medium",
          "touch-manipulation"
        )}
      />
    </div>
  );
}