import { Card, Button } from "@/components";
import { DailyMenuConfigForm } from "./DailyMenuConfigForm";
import { useDailyMenuToday } from "@/features/menu/hooks/useDailyMenu";
import { type DailyMenu } from "@/services/dailyMenuApi";
import { Calendar, RefreshCw, UtensilsCrossed } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton/Skeleton";
import { toast } from "sonner";

function LoadingState() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Skeleton variant="card" height={500} />
        </div>
        <div className="space-y-4">
          <Skeleton variant="card" height={280} />
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

function InfoCard({ menu }: { menu: DailyMenu | null | undefined }) {
  const hasOptions = 
    (menu?.soupOptions?.length || 0) > 0 ||
    (menu?.principleOptions?.length || 0) > 0 ||
    (menu?.saladOptions?.length || 0) > 0 ||
    (menu?.proteinOptions?.length || 0) > 0 ||
    (menu?.drinkOptions?.length || 0) > 0 ||
    (menu?.extraOptions?.length || 0) > 0 ||
    (menu?.dessertOptions?.length || 0) > 0;

  return (
    <Card variant="elevated" className="p-6 rounded-2xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-sage-50 text-sage-green-600 flex items-center justify-center">
          <Calendar className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-semibold text-carbon-900">Menú Configurado</h3>
        </div>
      </div>

      {hasOptions ? (
        <div className="space-y-4">
          {/* Prices */}
          <div className="p-3 bg-sage-50 rounded-lg">
            <div className="text-xs text-carbon-500 mb-1">Precios del Almuerzo</div>
            <div className="flex justify-between text-sm">
              <span className="text-carbon-600">Margen Base:</span>
              <span className="font-semibold text-carbon-900">${menu?.basePrice?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs text-carbon-400 mt-1">
              <span>+ Precio de proteína (en inventario)</span>
              <span>Variable</span>
            </div>
          </div>

          {/* Options Summary */}
          {menu?.soupOptions && menu.soupOptions.length > 0 && (
            <div>
              <div className="text-xs text-carbon-500 mb-1">Sopas ({menu.soupOptions.length})</div>
              <div className="text-sm text-carbon-800">
                {menu.soupOptions.map((o: { name: string }) => o.name).join(", ")}
              </div>
            </div>
          )}

          {menu?.principleOptions && menu.principleOptions.length > 0 && (
            <div>
              <div className="text-xs text-carbon-500 mb-1">Principios ({menu.principleOptions.length})</div>
              <div className="text-sm text-carbon-800">
                {menu.principleOptions.map((o: { name: string }) => o.name).join(", ")}
              </div>
            </div>
          )}

          {menu?.saladOptions && menu.saladOptions.length > 0 && (
            <div>
              <div className="text-xs text-carbon-500 mb-1">Ensaladas ({menu.saladOptions.length})</div>
              <div className="text-sm text-carbon-800">
                {menu.saladOptions.map((o: { name: string }) => o.name).join(", ")}
              </div>
            </div>
          )}

          {menu?.proteinOptions && menu.proteinOptions.length > 0 && (
            <div>
              <div className="text-xs text-carbon-500 mb-1">Proteínas Disponibles ({menu.proteinOptions.length})</div>
              <div className="text-sm text-carbon-800">
                {menu.proteinOptions.map((o: { name: string }) => o.name).join(", ")}
              </div>
            </div>
          )}

          {menu?.drinkOptions && menu.drinkOptions.length > 0 && (
            <div>
              <div className="text-xs text-carbon-500 mb-1">Bebidas ({menu.drinkOptions.length})</div>
              <div className="text-sm text-carbon-800">
                {menu.drinkOptions.map((o: { name: string }) => o.name).join(", ")}
              </div>
            </div>
          )}

          {menu?.extraOptions && menu.extraOptions.length > 0 && (
            <div>
              <div className="text-xs text-carbon-500 mb-1">Extras ({menu.extraOptions.length})</div>
              <div className="text-sm text-carbon-800">
                {menu.extraOptions.map((o: { name: string }) => o.name).join(", ")}
              </div>
            </div>
          )}

          {menu?.dessertOptions && menu.dessertOptions.length > 0 && (
            <div>
              <div className="text-xs text-carbon-500 mb-1">Postres ({menu.dessertOptions.length})</div>
              <div className="text-sm text-carbon-800">
                {menu.dessertOptions.map((o: { name: string }) => o.name).join(", ")}
              </div>
            </div>
          )}
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
            Usa el formulario para configurarlo.
          </p>
        </div>
      )}
    </Card>
  );
}

function HelpCard() {
  return (
    <Card variant="bordered" className="p-6 rounded-2xl">
      <h3 className="font-semibold text-carbon-900 mb-2">Cómo Configurar</h3>
      <ol className="text-sm text-carbon-500 space-y-2 list-decimal list-inside">
        <li>Las categorías se detectan automáticamente por nombre</li>
        <li>Elige hasta 2 opciones para Sopas, Principios, Ensaladas, Extras, Jugos</li>
        <li>Selecciona todas las proteínas que estarán disponibles hoy</li>
        <li>El postre es opcional - actívalo si deseas incluirlo</li>
        <li>Configura el margen base para todos los almuerzos</li>
        <li>El precio de cada proteína se configura en el inventario</li>
        <li>Guarda los cambios</li>
      </ol>
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
      <>
        <div className="mb-8">
          <Skeleton variant="text" width={280} height={36} className="mb-2" />
          <Skeleton variant="text" width={400} height={20} />
        </div>
        <LoadingState />
      </>
    );
  }

  if (error) {
    return (
      <>
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
      </>
    );
  }

  return (
    <>
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
          <DailyMenuConfigForm initialData={dailyMenu} onSuccess={handleSuccess} />
        </div>

        <div className="space-y-4">
          <InfoCard menu={dailyMenu} />
          <HelpCard />
        </div>
      </div>
    </>
  );
}
