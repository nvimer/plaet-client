import { SidebarLayout } from "@/layouts/SidebarLayout";
import { Card, Button } from "@/components";
import { DailyMenuForm } from "./DailyMenuForm";
import { useDailyMenuToday } from "@/features/daily-menu";
import { Calendar, RefreshCw, UtensilsCrossed } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton/Skeleton";
import { toast } from "sonner";
import type { DailyMenu } from "@/services/dailyMenuApi";

function LoadingState() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Skeleton variant="card" height={320} />
        </div>
        <div className="space-y-4">
          <Skeleton variant="card" height={200} />
          <Skeleton variant="card" height={120} />
        </div>
      </div>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <Card variant="elevated" padding="lg" className="max-w-md w-full border border-sage-200 shadow-sm rounded-2xl mx-auto">
      <div className="text-center">
        <div className="w-14 h-14 bg-rose-50 rounded-xl flex items-center justify-center mx-auto mb-4 text-rose-500">
          <UtensilsCrossed className="w-7 h-7" />
        </div>
        <h2 className="text-lg font-semibold text-carbon-900 mb-2">Error al cargar el menú</h2>
        <p className="text-carbon-500 text-sm mb-6">No se pudo cargar la información del menú del día.</p>
        <Button variant="primary" size="lg" onClick={onRetry} fullWidth className="min-h-[44px]">
          <RefreshCw className="w-5 h-5 mr-2" />
          Reintentar
        </Button>
      </div>
    </Card>
  );
}

function InfoCard({ menu }: { menu: DailyMenu | null }) {
  const isConfigured = !!menu?.side || !!menu?.soup || !!menu?.drink;

  return (
    <Card variant="elevated" className="p-6 rounded-2xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-sage-50 text-sage-green-600 flex items-center justify-center">
          <Calendar className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-semibold text-carbon-900">Estado Actual</h3>
        </div>
      </div>

      {isConfigured ? (
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-carbon-100">
            <span className="text-carbon-500">Acompañamiento</span>
            <span className="font-medium text-carbon-900 max-w-[50%] truncate">
              {menu?.side || "-"}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-carbon-100">
            <span className="text-carbon-500">Sopa</span>
            <span className="font-medium text-carbon-900 max-w-[50%] truncate">
              {menu?.soup || "-"}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-carbon-100">
            <span className="text-carbon-500">Bebida</span>
            <span className="font-medium text-carbon-900 max-w-[50%] truncate">
              {menu?.drink || "-"}
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-carbon-500">Postre</span>
            <span className="font-medium text-carbon-900 max-w-[50%] truncate">
              {menu?.dessert || "Sin postre"}
            </span>
          </div>
        </div>
      ) : (
        <div className="text-center py-4">
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mx-auto mb-3 text-amber-500">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <p className="text-carbon-500 text-sm">
            No hay menú configurado para hoy.
          </p>
          <p className="text-carbon-400 text-xs mt-1">
            Usa el formulario para agregar uno.
          </p>
        </div>
      )}
    </Card>
  );
}

function HelpCard() {
  return (
    <Card variant="bordered" className="p-6 rounded-2xl">
      <h3 className="font-semibold text-carbon-900 mb-2">Información</h3>
      <p className="text-sm text-carbon-500">
        El menú del día se mostrará en la pantalla de creación de pedidos.
        Asegúrate de actualizarlo cada mañana antes de iniciar operaciones.
      </p>
    </Card>
  );
}

export function DailyMenuPage() {
  const { data: dailyMenu, isLoading, error, refetch } = useDailyMenuToday();

  const formattedDate = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleSuccess = () => {
    toast.success("Menú del día actualizado correctamente");
  };

  if (isLoading) {
    return (
      <SidebarLayout>
        <div className="mb-8">
          <Skeleton variant="text" width={280} height={36} className="mb-2" />
          <Skeleton variant="text" width={400} height={20} />
        </div>
        <LoadingState />
      </SidebarLayout>
    );
  }

  if (error) {
    return (
      <SidebarLayout>
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-carbon-900 tracking-tight">
            Menú del Día
          </h1>
          <p className="text-sm text-carbon-500 mt-1">
            Configura los elementos del menú para punto de venta
          </p>
        </div>
        <div className="flex items-center justify-center min-h-[50vh]">
          <ErrorState onRetry={() => refetch()} />
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-carbon-900 tracking-tight">
            Menú del Día
          </h1>
          <p className="text-sm text-carbon-500 mt-1">
            Configura los elementos del menú para punto de venta
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-carbon-500">
          <Calendar className="w-4 h-4" />
          <span className="capitalize">{formattedDate}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DailyMenuForm initialData={dailyMenu} onSuccess={handleSuccess} />
        </div>

        <div className="space-y-4">
          <InfoCard menu={dailyMenu} />
          <HelpCard />
        </div>
      </div>
    </SidebarLayout>
  );
}
