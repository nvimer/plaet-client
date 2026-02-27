import { Button } from "@/components/ui/Button/Button";
import { Drawer } from "@/components/ui/Drawer/Drawer";
import { Filter, RotateCcw } from "lucide-react";

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
  onClear: () => void;
  children: React.ReactNode;
  title?: string;
  isDirty?: boolean;
}

/**
 * Premium Filter Drawer
 * Specific implementation of Drawer for advanced filtering.
 */
export function FilterDrawer({
  isOpen,
  onClose,
  onApply,
  onClear,
  children,
  title = "Filtros Avanzados",
  isDirty = false,
}: FilterDrawerProps) {
  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subtitle="Refina los resultados con criterios específicos."
      footer={
        <div className="flex gap-3">
          <Button
            variant="ghost"
            onClick={onClear}
            className="flex-1 rounded-2xl h-12 font-bold text-carbon-400"
            disabled={!isDirty}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Limpiar
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              onApply();
              onClose();
            }}
            className="flex-1 rounded-2xl h-12 font-bold bg-carbon-900 hover:bg-carbon-800 shadow-soft-lg"
          >
            <Filter className="w-4 h-4 mr-2" />
            Aplicar
          </Button>
        </div>
      }
    >
      <div className="space-y-8">
        {children}
      </div>
    </Drawer>
  );
}
