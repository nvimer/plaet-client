import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '@/components';
import { TableStatus } from '@/types';
import { useCreateTable } from '../hooks';
import { createTableSchema, type CreateTableInput } from '../schemas/tableSchemas';
import { ROUTES } from '@/app/routes';
import { toast } from 'sonner';
import { Check, ArrowRight, X, Menu } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { AxiosErrorWithResponse } from '@/types/common';

/**
 * EnhancedTableCreatePage Component
 * 
 * Enhanced table creation page with sidebar optimization and real-time preview
 * Multi-step wizard interface for better UX
 */
export function EnhancedTableCreatePage() {
  const navigate = useNavigate();
  const { mutate: createTable, isPending } = useCreateTable();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    trigger,
  } = useForm<CreateTableInput>({
    resolver: zodResolver(createTableSchema),
    defaultValues: {
      number: '',
      location: '',
      status: TableStatus.AVAILABLE,
    },
  });

  // Watch form values
  const formValues = watch();

  // Form submission
  const onSubmit = (data: CreateTableInput) => {
    createTable(data, {
      onSuccess: () => {
        toast.success("¡Mesa creada con éxito!", {
          description: `La mesa #${data.number} está disponible para uso`,
          icon: "🎉",
          duration: 4000,
        });
        navigate(ROUTES.TABLES);
      },
      onError: (error: AxiosErrorWithResponse) => {
        toast.error("Error al crear mesa", {
          description: error.response?.data?.message || error.message,
          icon: "❌",
          duration: 5000,
        });
      },
    });
  };

  // Step state
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 3;

  // Navigation functions
  const nextStep = async () => {
    let canProceed = false;
    
    switch (currentStep) {
      case 0:
        const numberValid = !errors.number && formValues.number.trim() !== '';
        canProceed = numberValid;
        break;
      case 1:
        canProceed = true; // Status always has a value
        break;
      case 2:
        canProceed = isValid;
        break;
      default:
        canProceed = true;
    }
    
    if (canProceed && currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepIndex: number) => {
    if (stepIndex <= currentStep) {
      setCurrentStep(stepIndex);
    }
  };

  const handleBack = () => {
    navigate(ROUTES.TABLES);
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative w-64 bg-white h-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="w-10 h-10 bg-sage-green-500 rounded-lg flex items-center justify-center text-white font-bold">
                  🍽️
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-carbon-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <nav className="space-y-2">
                <div className="flex items-center gap-3 p-3 bg-sage-green-50 text-sage-green-700 rounded-lg">
                  <span className="font-medium">Crear Mesa</span>
                </div>
                <div className="flex items-center gap-3 p-3 text-carbon-600 hover:bg-carbon-50 rounded-lg">
                  <span>Mesas</span>
                </div>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-16">
        {/* Header */}
        <header className="bg-white border-b border-sage-border-subtle px-6 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 hover:bg-carbon-100 rounded-lg"
                aria-label="Abrir menú"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              <Button
                variant="ghost"
                onClick={handleBack}
                className="p-3 -ml-3"
                aria-label="Volver"
              >
                <X className="w-5 h-5" />
              </Button>
              
              <div>
                <h1 className="text-2xl font-semibold text-carbon-900">
                  Nueva Mesa
                </h1>
                <p className="text-sm text-carbon-600 font-light mt-1">
                  Completa los datos para crear una nueva mesa
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Step Indicators */}
            <div className="flex items-center justify-center mb-8">
              {[1, 2, 3].map((step) => {
                const isCurrent = step === currentStep;
                const isCompleted = step < currentStep;
                
                return (
                  <div key={step} className="flex items-center gap-2">
                    {/* Step circle */}
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                      isCurrent 
                        ? "bg-sage-green-500 text-white ring-2 ring-sage-green-200" 
                        : isCompleted 
                          ? "bg-sage-green-600 text-white" 
                          : "bg-carbon-200 text-carbon-500"
                    )}>
                      {isCompleted && <Check className="w-5 h-5" />}
                      {!isCompleted && !isCurrent && <span className="text-sm font-semibold">{step}</span>}
                      {isCurrent && <div className="w-3 h-3 rounded-full bg-white" />}
                    </div>

                    {/* Step label */}
                    <div className="text-sm">
                      <div className={cn(
                        "font-medium",
                        isCurrent ? "text-sage-green-700" : "text-carbon-500"
                      )}>
                        {step === 1 && "Información"}
                        {step === 2 && "Estado"}
                        {step === 3 && "Confirmación"}
                      </div>
                    </div>

                    {/* Connector line */}
                    {step < 3 && (
                      <div className={cn(
                        "w-8 h-0.5",
                        step < currentStep ? "bg-sage-green-500" : "bg-carbon-200"
                      )}></div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Step Content */}
            <div className="bg-white rounded-xl border border-sage-border-subtle p-8 shadow-sm">
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-carbon-900 mb-4">
                    Información Básica
                  </h3>
                  <p className="text-carbon-600 mb-6">
                    Ingresa el número de la mesa y su ubicación.
                  </p>
                  
                  <div className="space-y-6">
                    <Input
                      label="Número de Mesa *"
                      type="text"
                      placeholder="Ej: 1, 2, 3..."
                      {...register('number')}
                      error={errors.number?.message}
                      fullWidth
                      autoFocus
                    />

                    <Input
                      label="Ubicación (Opcional)"
                      type="text"
                      placeholder="Ej: Entrada, Sala, Ventana..."
                      {...register('location')}
                      error={errors.location?.message}
                      fullWidth
                    />
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-carbon-900 mb-4">
                    Estado de la Mesa
                  </h3>
                  <p className="text-carbon-600 mb-6">
                    Selecciona el estado actual de la mesa.
                  </p>
                  
                  {/* Status Options */}
                  <div className="space-y-3">
                    {[
                      {
                        value: TableStatus.AVAILABLE,
                        label: 'Disponible',
                        description: 'Lista para recibir clientes',
                        color: 'bg-sage-green-50 border-sage-green-200 text-sage-green-700',
                      },
                      {
                        value: TableStatus.OCCUPIED,
                        label: 'Ocupada',
                        description: 'Actualmente en uso',
                        color: 'bg-red-50 border-red-200 text-red-700',
                      },
                      {
                        value: TableStatus.NEEDS_CLEANING,
                        label: 'Necesita Limpieza',
                        description: 'Requiere limpieza',
                        color: 'bg-yellow-50 border-yellow-200 text-yellow-700',
                      },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className={cn(
                          "flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all duration-200",
                          formValues.status === option.value
                            ? option.color
                            : "bg-white border-carbon-200 hover:border-sage-green-300"
                        )}
                      >
                        <input
                          type="radio"
                          value={option.value}
                          {...register('status')}
                          className="sr-only"
                        />
                        <div className="text-2xl">{option.color.includes('green') ? '✅' : option.color.includes('red') ? '🔴' : '🟡'}</div>
                        <div>
                          <div className="font-semibold">{option.label}</div>
                          <div className="text-sm opacity-75">{option.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-carbon-900 mb-4">
                    Revisión y Confirmación
                  </h3>
                  <p className="text-carbon-600 mb-6">
                    Revisa la información antes de crear la mesa.
                  </p>
                  
                  {/* Summary Card */}
                  <div className="bg-sage-green-50 border border-sage-green-200 rounded-xl p-6">
                    <h4 className="font-semibold text-sage-green-800 mb-4">
                      📋 Resumen de la Mesa
                    </h4>
                    <dl className="space-y-3">
                      <div className="flex justify-between">
                        <dt className="text-carbon-600">Número:</dt>
                        <dd className="font-semibold">#{formValues.number || 'No especificado'}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-carbon-600">Ubicación:</dt>
                        <dd className="font-semibold">{formValues.location || 'Sin ubicación'}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-carbon-600">Estado:</dt>
                        <dd className="font-semibold">
                          {formValues.status === TableStatus.AVAILABLE && '🟢 Disponible'}
                          {formValues.status === TableStatus.OCCUPIED && '🔴 Ocupada'}
                          {formValues.status === TableStatus.NEEDS_CLEANING && '🟡 Necesita Limpieza'}
                        </dd>
                      </div>
                    </dl>
                  </div>
                  
                  <div className="text-center text-sm text-carbon-500">
                    💡 La mesa se creará con la información mostrada
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-sage-border-subtle">
              <Button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 0}
                className={cn(currentStep === 0 && "invisible")}
              >
                Anterior
              </Button>

              {currentStep < totalSteps - 1 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={isPending}
                >
                  Siguiente
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="primary"
                  disabled={!isValid || isPending}
                  isLoading={isPending}
                >
                  {!isPending && <Check className="w-4 h-4 mr-2" />}
                  Crear Mesa
                </Button>
              )}
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}