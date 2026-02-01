import { MapPin, Users, Clock } from 'lucide-react';
import { Badge } from '@/components';
import { TableStatus } from '@/types';
import { cn } from '@/utils/cn';

interface TablePreviewProps {
  tableData: {
    number: string;
    location?: string;
    status: TableStatus;
  };
  className?: string;
}

/**
 * TablePreview component for real-time preview of table creation
 * Shows how the table will look once created
 */
export function TablePreview({ tableData, className }: TablePreviewProps) {
  const getStatusInfo = (status: TableStatus) => {
    switch (status) {
      case TableStatus.AVAILABLE:
        return {
          label: 'Disponible',
          color: 'bg-sage-green-100 text-sage-green-700 border-sage-green-300',
          icon: '✅'
        };
      case TableStatus.OCCUPIED:
        return {
          label: 'Ocupada',
          color: 'bg-red-100 text-red-700 border-red-300',
          icon: '🍽️'
        };
      case TableStatus.NEEDS_CLEANING:
        return {
          label: 'Limpieza',
          color: 'bg-yellow-100 text-yellow-700 border-yellow-300',
          icon: '🧹'
        };
    }
  };

  const statusInfo = getStatusInfo(tableData.status);
  const hasValidData = tableData.number.trim() !== '';

  if (!hasValidData) {
    return (
      <div className={cn(
        "bg-gradient-to-br from-carbon-50 to-carbon-100 border-2 border-dashed border-carbon-300 rounded-xl p-8 text-center",
        className
      )}>
        <div className="text-carbon-400">
          <div className="text-6xl mb-4">🪑</div>
          <h3 className="text-lg font-semibold mb-2">Vista Previa</h3>
          <p className="text-sm">
            Completa los datos para ver cómo se verá tu mesa
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("transition-all duration-300", className)}>
      {/* Preview Header */}
      <div className="bg-gradient-to-r from-sage-green-500 to-sage-green-600 text-white p-4 rounded-t-xl">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Vista Previa de Mesa</h3>
          <span className="text-sm bg-white/20 px-2 py-1 rounded-full">
            Vista en tiempo real
          </span>
        </div>
      </div>

      {/* Table Card Preview */}
      <div className="bg-white border border-sage-border-subtle rounded-b-xl shadow-lg overflow-hidden">
        {/* Table Header */}
        <div className="bg-gradient-to-r from-carbon-50 to-white p-6 border-b border-sage-border-subtle">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-2xl font-bold text-carbon-900 mb-2">
                Mesa #{tableData.number}
              </h4>
              {tableData.location && (
                <div className="flex items-center gap-2 text-carbon-600">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{tableData.location}</span>
                </div>
              )}
            </div>
            <Badge 
              variant={
                tableData.status === TableStatus.AVAILABLE ? 'success' :
                tableData.status === TableStatus.OCCUPIED ? 'error' : 'warning'
              }
              className="text-sm"
            >
              {statusInfo.label}
            </Badge>
          </div>
        </div>

        {/* Table Visualization */}
        <div className="p-6 bg-gradient-to-b from-sage-green-50/30 to-white">
          <div className="flex justify-center mb-4">
            {/* Table icon based on status */}
            <div className={cn(
              "text-6xl transition-all duration-300 transform hover:scale-105",
              tableData.status === TableStatus.AVAILABLE && "animate-pulse"
            )}>
              {statusInfo.icon}
            </div>
          </div>

          {/* Status description */}
          <div className="text-center">
            <p className="text-lg font-medium text-carbon-700 mb-2">
              {statusInfo.label}
            </p>
            <p className="text-sm text-carbon-500">
              {tableData.status === TableStatus.AVAILABLE && "Lista para recibir clientes"}
              {tableData.status === TableStatus.OCCUPIED && "Actualmente en uso"}
              {tableData.status === TableStatus.NEEDS_CLEANING && "Requiere limpieza antes del uso"}
            </p>
          </div>
        </div>

        {/* Quick Actions Preview */}
        <div className="bg-carbon-50 p-4 border-t border-sage-border-subtle">
          <div className="flex items-center gap-4 text-xs text-carbon-600">
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>Capacidad hasta 4 personas</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Disponibilidad inmediata</span>
            </div>
          </div>
        </div>
      </div>

      {/* Creation Note */}
      <div className="mt-4 text-center">
        <p className="text-xs text-carbon-500">
          🎉 Esta es una vista previa en tiempo real. 
          La mesa se verá exactamente así cuando la crees.
        </p>
      </div>
    </div>
  );
}