import { forwardRef, useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import type { InputHTMLAttributes } from 'react';

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
  loading?: boolean;
  debounceMs?: number;
  fullWidth?: boolean;
}

/**
 * Enhanced search input with icon, clear button, and debounced search
 */
export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      value = '',
      onChange,
      onClear,
      loading = false,
      debounceMs = 300,
      fullWidth = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const [localValue, setLocalValue] = useState(value as string);

    // Update local value when prop value changes
    useEffect(() => {
      setLocalValue(value as string);
    }, [value]);

    // Debounced onChange handler
    useEffect(() => {
      const timer = setTimeout(() => {
        if (localValue !== value) {
          onChange?.({ target: { value: localValue } } as React.ChangeEvent<HTMLInputElement>);
        }
      }, debounceMs);

      return () => clearTimeout(timer);
    }, [localValue, onChange, debounceMs, value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalValue(e.target.value);
    };

    const handleClear = () => {
      setLocalValue('');
      onClear?.();
      onChange?.({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
    };

    const widthClass = fullWidth ? 'w-full' : '';
    const hasValue = localValue.trim().length > 0;

    return (
      <div className={`relative ${widthClass}`}>
        {/* Search icon */}
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-carbon-400">
          {loading ? (
            <div className="w-4 h-4 border-2 border-sage-500 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </div>

        {/* Input field */}
        <input
          ref={ref}
          type="text"
          value={localValue}
          onChange={handleChange}
          className={`
            w-full pl-10 pr-10 py-2.5 text-sm text-carbon-900
            bg-white border-2 border-sage-border-subtle rounded-xl
            focus:border-sage-300 focus:ring-2 focus:ring-sage-100
            placeholder:text-carbon-400
            transition-all duration-200
            ${hasValue ? 'border-sage-300' : ''}
            ${className}
          `.trim().replace(/\s+/g, ' ')}
          {...props}
        />

        {/* Clear button */}
        {hasValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-carbon-400 hover:text-carbon-600 transition-colors duration-150 p-0.5"
            aria-label="Limpiar búsqueda"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';