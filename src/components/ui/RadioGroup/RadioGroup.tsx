import { forwardRef } from 'react';

interface RadioOption {
  label: string;
  value: string;
  count?: number;
  disabled?: boolean;
}

interface RadioGroupProps {
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  description?: string;
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  name?: string;
}

/**
 * RadioGroup component for selecting one option from a list
 * Perfect for filter controls with counts and descriptions
 */
export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      options,
      value,
      onChange,
      label,
      description,
      orientation = 'horizontal',
      size = 'md',
      className = '',
      ...props
    },
    ref
  ) => {
    const handleChange = (optionValue: string) => {
      onChange?.(optionValue);
    };

    const sizeClasses = {
      sm: 'text-xs py-1.5 px-3',
      md: 'text-sm py-2 px-4',
      lg: 'text-base py-2.5 px-5',
    };

    const orientationClasses = {
      horizontal: 'flex flex-wrap gap-2',
      vertical: 'flex flex-col gap-2',
    };

    return (
      <div ref={ref} className={`w-full ${className}`}>
        {/* Label and description */}
        {(label || description) && (
          <div className="mb-3">
            {label && (
              <div className="text-sm font-medium text-carbon-700 mb-1">
                {label}
              </div>
            )}
            {description && (
              <div className="text-xs text-carbon-500 font-light">
                {description}
              </div>
            )}
          </div>
        )}

        {/* Radio options */}
        <div className={orientationClasses[orientation]}>
          {options.map((option) => {
            const isSelected = value === option.value;
            const isDisabled = option.disabled;

            return (
              <label
                key={option.value}
                className={`
                  relative flex items-center gap-2
                  ${sizeClasses[size]}
                  rounded-lg border-2 cursor-pointer transition-all duration-200
                  ${isSelected 
                    ? 'bg-sage-green-50 border-sage-green-500 text-sage-green-700' 
                    : 'bg-white border-sage-border-subtle hover:border-sage-green-300 text-carbon-700'
                  }
                  ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `.trim().replace(/\s+/g, ' ')}
              >
                {/* Radio input (hidden) */}
                <input
                  type="radio"
                  name={props.name || 'radio-group'}
                  value={option.value}
                  checked={isSelected}
                  disabled={isDisabled}
                  onChange={() => handleChange(option.value)}
                  className="sr-only"
                />

                {/* Custom radio indicator */}
                <div className={`
                  w-4 h-4 rounded-full border-2 flex items-center justify-center
                  ${isSelected 
                    ? 'border-sage-green-500 bg-sage-green-500' 
                    : 'border-carbon-300 bg-white'
                  }
                `}>
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>

                {/* Option label and count */}
                <span className="flex-1 font-medium">{option.label}</span>
                
                {/* Count badge */}
                {option.count !== undefined && (
                  <span className={`
                    px-2 py-0.5 rounded-full text-xs font-semibold
                    ${isSelected 
                      ? 'bg-sage-green-600 text-white' 
                      : 'bg-carbon-100 text-carbon-600'
                    }
                  `}>
                    {option.count}
                  </span>
                )}

                {/* Disabled overlay */}
                {isDisabled && (
                  <div className="absolute inset-0 bg-white bg-opacity-50 rounded-lg" />
                )}
              </label>
            );
          })}
        </div>
      </div>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';