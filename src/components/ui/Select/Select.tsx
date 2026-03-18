import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

export interface SelectOption {
  label: string;
  value: string | number;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  fullWidth?: boolean;
  required?: boolean;
  optional?: boolean;
}

/**
 * Premium Select Component
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, fullWidth = true, required = false, optional = false, className, ...props }, ref) => {
    return (
      <div className={cn("flex flex-col gap-1.5", fullWidth && "w-full")}>
        {label && (
          <label className="text-sm font-semibold text-carbon-800 mb-0.5 ml-1">
            {label}
            {required && <span className="text-error-500 ml-1">*</span>}
            {optional && (
              <span className="text-carbon-400 font-normal ml-2 text-[10px] uppercase tracking-wider">
                (opcional)
              </span>
            )}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              "appearance-none",
              "w-full h-12 px-4 rounded-xl border-2 transition-all duration-200 outline-none",
              "bg-sage-50/30 font-medium text-carbon-900",
              "border-sage-200 hover:border-sage-300 focus:bg-white focus:border-sage-500 focus:ring-4 focus:ring-sage-500/10",
              error && "border-error-300 bg-error-50/30 focus:border-error-500 focus:ring-error-500/10",
              "disabled:bg-carbon-50 disabled:cursor-not-allowed",
              className
            )}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-carbon-400">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
        {error && (
          <span className="text-xs font-bold text-error-600 px-1 animate-fade-in">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
