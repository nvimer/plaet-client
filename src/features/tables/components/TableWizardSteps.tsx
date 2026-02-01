import { useState } from 'react';
import { Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { cn } from '@/utils/cn';

interface WizardStep {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface TableWizardStepsProps {
  currentStep: number;
  steps: WizardStep[];
  onStepClick?: (stepIndex: number) => void;
}

/**
 * TableWizardSteps component for showing wizard progress
 * Visual indicator of current step and completion status
 */
export function TableWizardSteps({ 
  currentStep, 
  steps, 
  onStepClick 
}: TableWizardStepsProps) {
  return (
    <div className="flex items-center justify-between mb-8 p-4 bg-white rounded-lg border border-sage-border-subtle">
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;
        const isClickable = onStepClick && index <= currentStep;

        return (
          <div key={step.id} className="flex items-center flex-1">
            {/* Step indicator */}
            <button
              onClick={() => isClickable && onStepClick(index)}
              disabled={!isClickable}
              className={cn(
                "flex items-center gap-3 transition-all duration-200",
                isClickable ? "cursor-pointer" : "cursor-not-allowed"
              )}
            >
              {/* Icon/Number circle */}
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200",
                isActive 
                  ? "bg-sage-green-500 text-white ring-2 ring-sage-green-200" 
                  : isCompleted 
                    ? "bg-sage-green-600 text-white" 
                    : "bg-carbon-100 text-carbon-500 border-2 border-carbon-200"
              )}>
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-semibold">{index + 1}</span>
                )}
              </div>

              {/* Step text */}
              <div className="text-left">
                <h3 className={cn(
                  "font-semibold text-sm",
                  isActive ? "text-sage-green-700" : isCompleted ? "text-carbon-900" : "text-carbon-500"
                )}>
                  {step.title}
                </h3>
                <p className="text-xs text-carbon-500 mt-0.5 max-w-[120px] truncate">
                  {step.description}
                </p>
              </div>
            </button>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <ArrowRight 
                className={cn(
                  "w-4 h-4 ml-4 transition-colors duration-200",
                  isCompleted ? "text-sage-green-500" : "text-carbon-300"
                )} 
              />
            )}
          </div>
        );
      })}
    </div>
  );
}