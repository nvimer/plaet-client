import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';

interface FilterSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  defaultExpanded?: boolean;
  collapsible?: boolean;
  className?: string;
}

/**
 * Reusable filter section with optional collapsible functionality
 * Perfect for organizing different filter controls
 */
export const FilterSection = ({
  title,
  description,
  children,
  defaultExpanded = true,
  collapsible = false,
  className = '',
}: FilterSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const toggleExpanded = () => {
    if (collapsible) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div className={`border-b border-sage-border-subtle last:border-b-0 py-4 ${className}`}>
      {/* Section header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-carbon-700 mb-1">
            {title}
          </h3>
          {description && (
            <p className="text-xs text-carbon-500 font-light leading-relaxed">
              {description}
            </p>
          )}
        </div>
        
        {/* Collapse toggle */}
        {collapsible && (
          <button
            type="button"
            onClick={toggleExpanded}
            className="ml-2 p-1 text-carbon-400 hover:text-carbon-600 transition-colors duration-150"
            aria-expanded={isExpanded}
            aria-label={isExpanded ? 'Contraer sección' : 'Expandir sección'}
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {/* Section content */}
      {isExpanded && (
        <div className="animate-in fade-in duration-200">
          {children}
        </div>
      )}
    </div>
  );
};