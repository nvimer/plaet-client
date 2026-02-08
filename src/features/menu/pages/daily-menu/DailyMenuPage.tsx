import { SidebarLayout } from "@/layouts/SidebarLayout";
import { Card } from "@/components";
import { DailyMenuForm } from "./DailyMenuForm";
import { useDailyMenuToday } from "@/features/daily-menu";
import { Calendar, Clock } from "lucide-react";

export function DailyMenuPage() {
  const { data: dailyMenu } = useDailyMenuToday();

  return (
    <SidebarLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-carbon-900">
              Configurar Menú del Día
            </h1>
            <p className="text-carbon-500 mt-1">
              Administra los elementos del menú que se mostrarán en punto de venta
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm text-carbon-500">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date().toLocaleDateString("es-ES", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <DailyMenuForm initialData={dailyMenu} />
          </div>

          <div className="space-y-4">
            <Card variant="elevated" className="p-6 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-sage-50 text-sage-green-600 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-carbon-900">
                    Estado Actual
                  </h3>
                </div>
              </div>

              {dailyMenu ? (
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-carbon-100">
                    <span className="text-carbon-500">Acompañamiento</span>
                    <span className="font-medium text-carbon-900">
                      {dailyMenu.side}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-carbon-100">
                    <span className="text-carbon-500">Sopa</span>
                    <span className="font-medium text-carbon-900">
                      {dailyMenu.soup}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-carbon-100">
                    <span className="text-carbon-500">Bebida</span>
                    <span className="font-medium text-carbon-900">
                      {dailyMenu.drink}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-carbon-500">Postre</span>
                    <span className="font-medium text-carbon-900">
                      {dailyMenu.dessert || "Sin postre"}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-carbon-500 text-sm">
                  No hay menú configurado para hoy.
                  Usa el formulario para agregar uno.
                </p>
              )}
            </Card>

            <Card variant="bordered" className="p-6 rounded-2xl">
              <h3 className="font-semibold text-carbon-900 mb-2">
                Información
              </h3>
              <p className="text-sm text-carbon-500">
                El menú del día se mostrará en la pantalla de creación de
                pedidos. Asegúrate de actualizarlo cada mañana.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
