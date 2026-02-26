import { SearchInput } from "@/components/ui/SearchInput";
import { cn } from "@/utils/cn";

interface FilterSearchProps {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  "aria-label"?: string;
  className?: string;
}

/**
 * Búsqueda dentro de filtros. Mismo estilo que FilterSelect (44px, bordes).
 * Usa SearchInput con clases unificadas.
 */
export function FilterSearch({
  value,
  onChange,
  onClear,
  placeholder = "Buscar...",
  "aria-label": ariaLabel,
  className,
}: FilterSearchProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <SearchInput
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onClear={onClear}
        placeholder={placeholder}
        aria-label={ariaLabel ?? "Buscar"}
        fullWidth
        className={cn(
          "min-h-[44px] py-2.5 border-2 border-sage-300 bg-sage-50/80 rounded-xl",
          "focus:border-sage-400 focus:ring-2 focus:ring-sage-400/20",
          "touch-manipulation"
        )}
      />
    </div>
  );
}
