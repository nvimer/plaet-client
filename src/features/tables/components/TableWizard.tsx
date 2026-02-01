import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { TableStatus } from '@/types';
import { Button, Input } from '@/components';
import { TableWizardSteps } from './TableWizardSteps';
import { TablePreview } from './TablePreview';
import { createTableSchema, type CreateTableInput } from '../schemas/tableSchemas';
import { useCreateTable } from '../hooks';
import { ROUTES } from '@/app/routes';
import { toast } from 'sonner';
import { cn } from '@/utils/cn';
import type { AxiosErrorWithResponse } from '@/types/common';

interface WizardStep {
  id: string;
  title: string;
  description: string;
  icon: string;
}

/**
 * TableWizard Component
 * 
 * Multi-step wizard for creating tables with real-time preview
 * and sidebar collapsed for better focus
 */
export function TableWizard() {
  const navigate = useNavigate();
  const { mutate: createTable, isPending } = useCreateTable();
  
  // Form and step state
  const [currentStep, setCurrentStep] = useState(0);
  
  // Wizard steps configuration
  const steps: WizardStep[] = [
    {
      id: 'basic',
      title: 'Información Básica',
      description: 'Número y ubicación',
      icon: '📋',
    },
    {
      id: 'status',
      title: 'Estado de Mesa',
      description: 'Disponibilidad',
      icon: '🪑',
    },
    {
      id: 'review',
      title: 'Revisión',
      description: 'Confirmar detalles',
      icon: '✅',
    },
  ];

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
    mode: 'onChange',
  });

  // Watch form values for real-time preview
  const formValues = watch();

  // Step validation functions
  const validateCurrentStep = async () => {
    switch (currentStep) {
      case 0:
        // Validate basic info (number, location)
        return await trigger(['number', 'location']);
      case 1:
        // Validate status
        return await trigger(['status']);
      case 2:
        // Validate all fields
        return await trigger();
      default:
        return true;
    }
  };

  // Navigation functions
  const nextStep = async () => {
    const isStepValid = await validateCurrentStep();
    if (isStepValid && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = async (stepIndex: number) => {
    if (stepIndex <= currentStep) {
      setCurrentStep(stepIndex);
    }
  };

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

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-carbon-900 mb-4">
                Información Básica de la Mesa
              </h3>
              <p className="text-carbon-600 mb-6">
                Ingresa el número principal de la mesa y su ubicación opcional.
              </p>
            </div>

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
                placeholder="Ej: Entrada, Sala, Ventana, Terraza..."
                {...register('location')}
                error={errors.location?.message}
                fullWidth
              />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-carbon-900 mb-4">
                Estado de la Mesa
              </h3>
              <p className="text-carbon-600 mb-6">
                Selecciona el estado actual de la mesa. Por defecto, las nuevas mesas están disponibles.
              </p>
            </div>

            {/* Status Options */}
            <div className="space-y-3">
              {[
                {
                  value: TableStatus.AVAILABLE,
                  label: 'Disponible',
                  description: 'Lista para recibir clientes',
                  color: 'bg-sage-green-50 border-sage-green-200 text-sage-green-700',
                  icon: '✅'
                },
                {
                  value: TableStatus.OCCUPIED,
                  label: 'Ocupada',
                  description: 'Actualmente en uso por clientes',
                  color: 'bg-red-50 border-red-200 text-red-700',
                  icon: '🍽️'
                },
                {
                  value: TableStatus.NEEDS_CLEANING,
                  label: 'Necesita Limpieza',
                  description: 'Requiere limpieza antes de uso',
                  color: 'bg-yellow-50 border-yellow-200 text-yellow-700',
                  icon: '🧹'
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
                  <div className="text-2xl">{option.icon}</div>
                  <div>
                    <div className="font-semibold">{option.label}</div>
                    <div className="text-sm opacity-75">{option.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-carbon-900 mb-4">
                Revisión Final
              </h3>
              <p className="text-carbon-600 mb-6">
                Revisa la información de la mesa antes de crearla. Puedes volver a los pasos anteriores si necesitas hacer cambios.
              </p>
            </div>

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
              💡 La mesa se verá exactamente como se muestra en la vista previa
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Wizard Steps Navigation */}
        <TableWizardSteps
          currentStep={currentStep}
          steps={steps}
          onStepClick={goToStep}
        />

        {/* Main Content - Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Content */}
          <div className="order-2 lg:order-1">
            <div className="bg-white rounded-xl border border-sage-border-subtle p-8 shadow-sm">
              {renderStepContent()}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-sage-border-subtle">
                <Button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className={cn(currentStep === 0 && "invisible")}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Anterior
                </Button>

                {currentStep < steps.length - 1 ? (
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
          </div>

          {/* Preview */}
          <div className="order-1 lg:order-2">
            <TablePreview tableData={formValues} />
          </div>
        </div>
      </form>
    </div>
  );
}